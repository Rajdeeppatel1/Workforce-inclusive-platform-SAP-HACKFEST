"""
SkillNav Onboarding & Analysis Pipeline Router (Chunks 4, 6, 7, 8, 9, 10, 11, 12)
════════════════════════════════════════════════════════════════════════════════
Endpoints:
- POST   /api/resume/upload
- DELETE /api/resume/{id}
- POST   /api/voice/intro
- POST   /api/onboarding/extract
- GET    /api/onboarding/candidates
- PATCH  /api/onboarding/candidates/{id}
- POST   /api/onboarding/confirm
- POST   /api/analysis/run
- POST   /api/analysis/explain
- GET    /api/resume/generate/{run_id}
- DELETE /api/user/data
"""

import io
import json
import os
import shutil
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Literal, Optional

from fastapi import APIRouter, Depends, File, Header, HTTPException, UploadFile
from fastapi.responses import Response
from pydantic import BaseModel, ConfigDict, Field

from db.database import db_session
from db.migrate import run_migration
from redact import redact_text
from extract import extract_skills_from_text
from engines.match import MatchInput, compute_role_match
from engines.explain import generate_analysis_explanation

router = APIRouter(tags=["onboarding-pipeline"])

UPLOADS_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "uploads")
)
MAX_RESUME_BYTES = 5 * 1024 * 1024  # 5 MB
MAX_VOICE_CHARS = 3000

ALLOWED_MIME_TO_EXT = {
    "application/pdf": ".pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
}
ALLOWED_EXTENSIONS = {".pdf", ".docx"}


def _now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def get_current_user(
    x_user_id: Optional[str] = Header(default=None, alias="X-User-Id"),
    authorization: Optional[str] = Header(default=None, alias="Authorization"),
) -> Dict[str, Any]:
    """
    Requires authentication via X-User-Id header or Bearer token.
    Returns user row from `users` table, or raises 401 Unauthorized.
    """
    uid = (x_user_id or "").strip()
    if not uid and authorization and authorization.lower().startswith("bearer "):
        uid = authorization[7:].strip()

    if not uid:
        raise HTTPException(
            status_code=401,
            detail="Authentication required. Provide X-User-Id header.",
        )

    run_migration()
    with db_session() as conn:
        row = conn.execute("SELECT * FROM users WHERE id = ?", (uid,)).fetchone()
        if row is None:
            raise HTTPException(
                status_code=401,
                detail=f"Authenticated user '{uid}' not found.",
            )
        return dict(row)


# ═════════════════════════════════════════════════════════════
# Chunk 4: Resume Upload & Delete
# ═════════════════════════════════════════════════════════════

def _extract_pdf_text(data: bytes) -> str:
    from pypdf import PdfReader
    reader = PdfReader(io.BytesIO(data))
    parts = []
    for page in reader.pages:
        parts.append(page.extract_text() or "")
    return "\n".join(parts).strip()


def _extract_docx_text(data: bytes) -> str:
    from docx import Document
    doc = Document(io.BytesIO(data))
    parts = [p.text for p in doc.paragraphs if p.text]
    for table in doc.tables:
        for row in table.rows:
            row_text = " ".join(cell.text.strip() for cell in row.cells if cell.text.strip())
            if row_text:
                parts.append(row_text)
    return "\n".join(parts).strip()


@router.post("/api/resume/upload")
async def upload_resume(
    file: UploadFile = File(...),
    user: Dict[str, Any] = Depends(get_current_user),
):
    filename = file.filename or ""
    ext = os.path.splitext(filename)[1].lower()
    mime = (file.content_type or "").lower().strip()

    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file extension '{ext}'. Only .pdf and .docx are allowed.",
        )

    expected_ext = ALLOWED_MIME_TO_EXT.get(mime)
    if expected_ext != ext:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid MIME type '{mime}' for extension '{ext}'.",
        )

    raw_bytes = await file.read()
    if len(raw_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    if len(raw_bytes) > MAX_RESUME_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"File exceeds maximum allowed size of 5 MB ({len(raw_bytes)} bytes).",
        )

    # Magic bytes verification
    if ext == ".pdf" and not raw_bytes.startswith(b"%PDF"):
        raise HTTPException(status_code=400, detail="Invalid PDF file header.")
    if ext == ".docx" and not raw_bytes.startswith(b"PK"):
        raise HTTPException(status_code=400, detail="Invalid DOCX file archive header.")

    try:
        raw_text = _extract_pdf_text(raw_bytes) if ext == ".pdf" else _extract_docx_text(raw_bytes)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Failed to parse document: {exc}")

    # Save physical file with random UUID filename inside backend/uploads/{user_id}/
    user_dir = os.path.join(UPLOADS_ROOT, user["id"])
    os.makedirs(user_dir, exist_ok=True)
    upload_id = f"res_{uuid.uuid4().hex[:12]}"
    random_filename = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(user_dir, random_filename)
    with open(file_path, "wb") as out_f:
        out_f.write(raw_bytes)

    # Redact PII before storing in DB (raw text is NEVER stored in DB)
    redacted = redact_text(raw_text, user_name=user.get("name"))
    now = _now_iso()

    with db_session() as conn:
        conn.execute(
            """
            INSERT INTO resume_uploads
              (id, user_id, file_path, original_filename, mime_type, file_size, redacted_text, redaction_count, redaction_categories, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                upload_id,
                user["id"],
                file_path,
                filename,
                mime,
                len(raw_bytes),
                redacted["text"],
                redacted["count"],
                json.dumps(redacted["categories"]),
                now,
            ),
        )

    return {
        "id": upload_id,
        "filename": filename,
        "file_size": len(raw_bytes),
        "redacted_text": redacted["text"],
        "redaction_count": redacted["count"],
        "categories": redacted["categories"],
        "created_at": now,
    }


@router.delete("/api/resume/{resume_id}")
async def delete_resume(
    resume_id: str,
    user: Dict[str, Any] = Depends(get_current_user),
):
    with db_session() as conn:
        row = conn.execute(
            "SELECT * FROM resume_uploads WHERE id = ? AND user_id = ?",
            (resume_id, user["id"]),
        ).fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="Resume upload not found.")

        file_path = row["file_path"]
        conn.execute(
            "DELETE FROM resume_uploads WHERE id = ? AND user_id = ?",
            (resume_id, user["id"]),
        )

    if file_path and os.path.exists(file_path):
        os.remove(file_path)

    return {"deleted": True, "id": resume_id}


# ═════════════════════════════════════════════════════════════
# Chunk 6: Voice Intro
# ═════════════════════════════════════════════════════════════

class VoiceIntroRequest(BaseModel):
    transcript: str


@router.post("/api/voice/intro")
async def save_voice_intro(
    body: VoiceIntroRequest,
    user: Dict[str, Any] = Depends(get_current_user),
):
    raw_transcript = (body.transcript or "").strip()
    if not raw_transcript:
        raise HTTPException(status_code=400, detail="Voice transcript cannot be empty.")
    if len(raw_transcript) > MAX_VOICE_CHARS:
        raise HTTPException(
            status_code=400,
            detail=f"Voice transcript exceeds {MAX_VOICE_CHARS} character limit ({len(raw_transcript)} chars).",
        )

    # Redact PII before storing in DB (raw transcript is NEVER stored)
    redacted = redact_text(raw_transcript, user_name=user.get("name"))
    intro_id = f"voi_{uuid.uuid4().hex[:12]}"
    now = _now_iso()

    with db_session() as conn:
        conn.execute(
            """
            INSERT INTO voice_intros
              (id, user_id, redacted_transcript, char_count, redaction_count, redaction_categories, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                intro_id,
                user["id"],
                redacted["text"],
                len(raw_transcript),
                redacted["count"],
                json.dumps(redacted["categories"]),
                now,
            ),
        )

    return {
        "id": intro_id,
        "redacted_text": redacted["text"],
        "char_count": len(raw_transcript),
        "redaction_count": redacted["count"],
        "categories": redacted["categories"],
        "created_at": now,
    }


# ═════════════════════════════════════════════════════════════
# Chunk 7: Gemini Skill Extraction
# ═════════════════════════════════════════════════════════════

class ExtractRequest(BaseModel):
    text: Optional[str] = None


@router.post("/api/onboarding/extract")
async def extract_onboarding_skills(
    body: Optional[ExtractRequest] = None,
    user: Dict[str, Any] = Depends(get_current_user),
):
    parts: List[str] = []
    with db_session() as conn:
        res_row = conn.execute(
            "SELECT redacted_text FROM resume_uploads WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
            (user["id"],),
        ).fetchone()
        if res_row and res_row["redacted_text"]:
            parts.append(res_row["redacted_text"])

        voi_row = conn.execute(
            "SELECT redacted_transcript FROM voice_intros WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
            (user["id"],),
        ).fetchone()
        if voi_row and voi_row["redacted_transcript"]:
            parts.append(voi_row["redacted_transcript"])

    if body and body.text and body.text.strip():
        parts.append(redact_text(body.text.strip(), user_name=user.get("name"))["text"])

    combined_text = "\n\n".join(parts).strip()
    if not combined_text:
        raise HTTPException(
            status_code=400,
            detail="No redacted resume or voice intro found for this user.",
        )

    try:
        result = extract_skills_from_text(combined_text)
    except ValueError as missing_key_err:
        raise HTTPException(status_code=503, detail=str(missing_key_err))
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Skill extraction failed: {exc}")

    now = _now_iso()
    saved_candidates = []
    with db_session() as conn:
        for item in result["skills"]:
            cand_id = f"cand_{uuid.uuid4().hex[:12]}"
            conn.execute(
                """
                INSERT INTO skill_candidates
                  (id, user_id, skill_id, skill_name, evidence_quote, confidence, needs_confirmation, status, source_type, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, 'proposed', 'onboarding', ?, ?)
                """,
                (
                    cand_id,
                    user["id"],
                    item["skill_id"],
                    item["skill_name"],
                    item["evidence_quote"],
                    item["confidence"],
                    1 if item["needs_confirmation"] else 0,
                    now,
                    now,
                ),
            )
            saved_candidates.append({
                "id": cand_id,
                **item,
                "status": "proposed",
            })

    return {
        "candidates": saved_candidates,
        "dropped_hallucinations": result["dropped_hallucinations"],
    }


# ═════════════════════════════════════════════════════════════
# Chunk 8: Candidate Review & Confirm
# ═════════════════════════════════════════════════════════════

class CandidatePatchRequest(BaseModel):
    status: Literal["confirmed", "edited", "rejected"]
    skill_name: Optional[str] = None
    skill_id: Optional[str] = None


class ConfirmSkillsRequest(BaseModel):
    candidate_ids: Optional[List[str]] = None


@router.get("/api/onboarding/candidates")
async def get_candidates(user: Dict[str, Any] = Depends(get_current_user)):
    with db_session() as conn:
        rows = conn.execute(
            "SELECT * FROM skill_candidates WHERE user_id = ? ORDER BY created_at DESC",
            (user["id"],),
        ).fetchall()
    return {
        "candidates": [
            {
                **dict(r),
                "needs_confirmation": bool(r["needs_confirmation"]),
            }
            for r in rows
        ]
    }


@router.patch("/api/onboarding/candidates/{candidate_id}")
async def update_candidate(
    candidate_id: str,
    body: CandidatePatchRequest,
    user: Dict[str, Any] = Depends(get_current_user),
):
    now = _now_iso()
    with db_session() as conn:
        row = conn.execute(
            "SELECT * FROM skill_candidates WHERE id = ? AND user_id = ?",
            (candidate_id, user["id"]),
        ).fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="Skill candidate not found.")

        new_name = body.skill_name.strip() if body.skill_name else row["skill_name"]
        new_sid = body.skill_id.strip() if body.skill_id else row["skill_id"]

        conn.execute(
            """
            UPDATE skill_candidates
            SET status = ?, skill_name = ?, skill_id = ?, updated_at = ?
            WHERE id = ? AND user_id = ?
            """,
            (body.status, new_name, new_sid, now, candidate_id, user["id"]),
        )
        updated = conn.execute(
            "SELECT * FROM skill_candidates WHERE id = ?", (candidate_id,)
        ).fetchone()

    return {
        **dict(updated),
        "needs_confirmation": bool(updated["needs_confirmation"]),
    }


@router.post("/api/onboarding/confirm")
async def confirm_candidates(
    body: Optional[ConfirmSkillsRequest] = None,
    user: Dict[str, Any] = Depends(get_current_user),
):
    now = _now_iso()
    with db_session() as conn:
        if body and body.candidate_ids:
            placeholders = ",".join("?" for _ in body.candidate_ids)
            rows = conn.execute(
                f"""
                SELECT * FROM skill_candidates
                WHERE user_id = ? AND id IN ({placeholders}) AND status IN ('confirmed', 'edited')
                """,
                [user["id"], *body.candidate_ids],
            ).fetchall()
        else:
            rows = conn.execute(
                """
                SELECT * FROM skill_candidates
                WHERE user_id = ? AND status IN ('confirmed', 'edited')
                """,
                (user["id"],),
            ).fetchall()

        confirmed_count = 0
        for r in rows:
            us_id = f"usk_{uuid.uuid4().hex[:12]}"
            conn.execute(
                """
                INSERT INTO user_skills (id, user_id, skill_id, skill_name, level, source, confirmed_at)
                VALUES (?, ?, ?, ?, 1, ?, ?)
                ON CONFLICT(user_id, skill_id) DO UPDATE SET
                    skill_name = excluded.skill_name,
                    source = excluded.source,
                    confirmed_at = excluded.confirmed_at
                """,
                (us_id, user["id"], r["skill_id"], r["skill_name"], r["status"], now),
            )
            confirmed_count += 1

        user_skills = conn.execute(
            "SELECT * FROM user_skills WHERE user_id = ? ORDER BY confirmed_at DESC",
            (user["id"],),
        ).fetchall()

    return {
        "confirmed_count": confirmed_count,
        "user_skills": [dict(s) for s in user_skills],
    }


# ═════════════════════════════════════════════════════════════
# Chunk 9: Match & Gap Analysis
# ═════════════════════════════════════════════════════════════

class AnalysisRunRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    role_id: str
    skills: Optional[List[str]] = None
    skill_levels: Optional[Dict[str, int]] = None


@router.post("/api/analysis/run")
async def run_analysis(
    body: AnalysisRunRequest,
    user: Dict[str, Any] = Depends(get_current_user),
):
    with db_session() as conn:
        rows = conn.execute(
            "SELECT skill_name, level FROM user_skills WHERE user_id = ?",
            (user["id"],),
        ).fetchall()

    db_skills = [r["skill_name"] for r in rows]
    skill_names = db_skills if db_skills else (body.skills or [])
    levels = body.skill_levels or {r["skill_name"]: int(r["level"]) for r in rows}

    match_in = MatchInput(
        skills=skill_names,
        role_id=body.role_id,
        skill_levels=levels,
    )
    try:
        result = compute_role_match(match_in)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))

    run_id = f"run_{uuid.uuid4().hex[:12]}"
    now = _now_iso()

    with db_session() as conn:
        conn.execute(
            """
            INSERT INTO analysis_runs
              (id, user_id, role_id, role_title, score, matched_skills_json, missing_skills_json, explanation, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, NULL, ?)
            """,
            (
                run_id,
                user["id"],
                result["role_id"],
                result["role_title"],
                result["score"],
                json.dumps(result["matched_skills"]),
                json.dumps(result["missing_skills"]),
                now,
            ),
        )

    return {
        "run_id": run_id,
        "evaluated_skills": skill_names,
        **result,
        "created_at": now,
    }


# ═════════════════════════════════════════════════════════════
# Chunk 10: Analysis Explanation
# ═════════════════════════════════════════════════════════════

class AnalysisExplainRequest(BaseModel):
    run_id: str


@router.post("/api/analysis/explain")
async def explain_analysis_run(
    body: AnalysisExplainRequest,
    user: Dict[str, Any] = Depends(get_current_user),
):
    with db_session() as conn:
        row = conn.execute(
            "SELECT * FROM analysis_runs WHERE id = ? AND user_id = ?",
            (body.run_id, user["id"]),
        ).fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="Analysis run not found.")

    matched = json.loads(row["matched_skills_json"] or "[]")
    missing = json.loads(row["missing_skills_json"] or "[]")

    try:
        expl = generate_analysis_explanation(
            score=float(row["score"]),
            matched_skills=matched,
            missing_skills=missing,
        )
    except ValueError as missing_key_err:
        raise HTTPException(status_code=503, detail=str(missing_key_err))

    with db_session() as conn:
        conn.execute(
            "UPDATE analysis_runs SET explanation = ? WHERE id = ? AND user_id = ?",
            (expl["explanation"], body.run_id, user["id"]),
        )

    return {
        "run_id": body.run_id,
        **expl,
    }


# ═════════════════════════════════════════════════════════════
# Chunk 11: Resume PDF Generator (reportlab)
# ═════════════════════════════════════════════════════════════

def _build_resume_pdf(
    user: Dict[str, Any],
    confirmed_skills: List[str],
    run_row: Dict[str, Any],
) -> bytes:
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.units import inch
    from reportlab.pdfgen import canvas

    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=A4)
    width, height = A4

    y = height - 0.8 * inch
    left = 0.75 * inch

    # Candidate Name
    c.setFont("Helvetica-Bold", 18)
    c.drawString(left, y, user.get("name") or "Candidate")
    y -= 24

    c.setFont("Helvetica", 10)
    exp_years = float(user.get("experience_years") or 0.0)
    c.drawString(left, y, f"Experience: {exp_years:.1f} years")
    y -= 24

    # Confirmed Skills
    c.setFont("Helvetica-Bold", 12)
    c.drawString(left, y, "Confirmed Skills")
    y -= 16
    c.setFont("Helvetica", 10)
    skills_line = ", ".join(confirmed_skills) if confirmed_skills else "None confirmed yet"
    c.drawString(left, y, skills_line[:95])
    if len(skills_line) > 95:
        y -= 14
        c.drawString(left, y, skills_line[95:190])
    y -= 26

    # Role Suggestion & Score
    c.setFont("Helvetica-Bold", 12)
    c.drawString(left, y, "Role Suggestion & Match Summary")
    y -= 16
    c.setFont("Helvetica", 10)
    pct = round(float(run_row["score"]) * 100, 1)
    c.drawString(left, y, f"Suggested Role: {run_row['role_title']} (Match Score: {pct}%)")
    y -= 16

    explanation = run_row.get("explanation") or ""
    if explanation:
        # Simple line wrap
        words = explanation.split()
        line = ""
        for w in words:
            if len(line) + len(w) + 1 > 88:
                c.drawString(left, y, line)
                y -= 14
                line = w
            else:
                line = f"{line} {w}".strip()
        if line:
            c.drawString(left, y, line)
            y -= 20

    # Skill Gap List
    missing = json.loads(run_row.get("missing_skills_json") or "[]")
    c.setFont("Helvetica-Bold", 12)
    c.drawString(left, y, "Skill Gaps to Address")
    y -= 16
    c.setFont("Helvetica", 10)
    if missing:
        for gap in missing:
            c.drawString(left + 12, y, f"- {gap}")
            y -= 14
    else:
        c.drawString(left, y, "No remaining skill gaps identified for this role.")

    # Required Footer
    c.setFont("Helvetica-Oblique", 9)
    c.drawString(left, 0.55 * inch, "Generated by SkillNav, review before sharing")

    c.showPage()
    c.save()
    return buf.getvalue()


@router.get("/api/resume/generate/{run_id}")
async def generate_resume_pdf(
    run_id: str,
    user: Dict[str, Any] = Depends(get_current_user),
):
    with db_session() as conn:
        run_row = conn.execute(
            "SELECT * FROM analysis_runs WHERE id = ? AND user_id = ?",
            (run_id, user["id"]),
        ).fetchone()
        if run_row is None:
            raise HTTPException(
                status_code=404,
                detail="Analysis run not found for this user.",
            )

        skills_rows = conn.execute(
            "SELECT skill_name FROM user_skills WHERE user_id = ? ORDER BY confirmed_at ASC",
            (user["id"],),
        ).fetchall()

    confirmed_skills = [r["skill_name"] for r in skills_rows]
    pdf_bytes = _build_resume_pdf(user, confirmed_skills, dict(run_row))

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="skillnav_resume_{run_id}.pdf"'
        },
    )


# ═════════════════════════════════════════════════════════════
# Chunk 12: User Data Cleanup
# ═════════════════════════════════════════════════════════════

@router.delete("/api/user/data")
async def delete_user_data(user: Dict[str, Any] = Depends(get_current_user)):
    uid = user["id"]
    with db_session() as conn:
        uploads = conn.execute(
            "SELECT file_path FROM resume_uploads WHERE user_id = ?", (uid,)
        ).fetchall()
        cur_u = conn.execute("DELETE FROM resume_uploads WHERE user_id = ?", (uid,))
        cur_v = conn.execute("DELETE FROM voice_intros WHERE user_id = ?", (uid,))
        cur_c = conn.execute("DELETE FROM skill_candidates WHERE user_id = ?", (uid,))

    # Remove uploaded files from disk
    for u in uploads:
        fp = u["file_path"]
        if fp and os.path.exists(fp):
            try:
                os.remove(fp)
            except OSError:
                pass

    user_dir = os.path.join(UPLOADS_ROOT, uid)
    if os.path.isdir(user_dir):
        shutil.rmtree(user_dir, ignore_errors=True)

    return {
        "deleted": True,
        "uploads_removed": cur_u.rowcount,
        "voice_intros_removed": cur_v.rowcount,
        "candidates_removed": cur_c.rowcount,
    }
