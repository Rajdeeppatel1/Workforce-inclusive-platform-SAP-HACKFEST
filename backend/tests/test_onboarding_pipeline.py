"""
Comprehensive Pytest Suite for Chunks 1-12 & Full E2E Acceptance
"""

import io
import json
import os
import sys
from types import SimpleNamespace
from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient

BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)


@pytest.fixture
def isolated_env(tmp_path, monkeypatch):
    """Isolates SQLite DB and uploads directory for each test."""
    db_file = tmp_path / "test_skillnav.db"
    uploads_dir = tmp_path / "uploads"
    uploads_dir.mkdir(parents=True, exist_ok=True)

    monkeypatch.setenv("SKILLNAV_DB_PATH", str(db_file))

    import routers.onboarding_pipeline as op
    monkeypatch.setattr(op, "UPLOADS_ROOT", str(uploads_dir))

    from db.migrate import run_migration
    run_migration(str(db_file))
    return {"db_file": db_file, "uploads_dir": uploads_dir}


def _make_sample_pdf_bytes(text: str) -> bytes:
    from reportlab.pdfgen import canvas
    from reportlab.lib.pagesizes import A4

    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=A4)
    y = 780
    for line in text.splitlines():
        c.drawString(50, y, line)
        y -= 16
    c.showPage()
    c.save()
    return buf.getvalue()


def _make_sample_docx_bytes(text: str) -> bytes:
    from docx import Document

    doc = Document()
    for line in text.splitlines():
        doc.add_paragraph(line)
    buf = io.BytesIO()
    doc.save(buf)
    return buf.getvalue()


# ── Chunk 1: Config & App Start ──
def test_chunk1_app_starts_and_missing_key_error(monkeypatch):
    from main import app
    from config import Settings

    client = TestClient(app)
    r = client.get("/api/health")
    assert r.status_code == 200

    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    s = Settings(gemini_api_key="")
    with pytest.raises(ValueError, match="GEMINI_API_KEY is missing"):
        s.require_gemini_key()


# ── Chunk 2: Tables & Migration ──
def test_chunk2_tables_created_and_old_data_preserved(isolated_env):
    from db.database import db_session
    from db.migrate import run_migration

    with db_session() as conn:
        tables = {
            row["name"]
            for row in conn.execute(
                "SELECT name FROM sqlite_master WHERE type='table'"
            ).fetchall()
        }
        expected = {
            "users",
            "resume_uploads",
            "voice_intros",
            "skill_candidates",
            "user_skills",
            "analysis_runs",
        }
        assert expected.issubset(tables)

        priya = conn.execute(
            "SELECT * FROM users WHERE id = 'seed_priya_sharma_01'"
        ).fetchone()
        assert priya is not None
        assert priya["name"] == "Priya Sharma"

    # Re-running migration should preserve existing data
    run_migration(str(isolated_env["db_file"]))
    with db_session() as conn:
        priya2 = conn.execute(
            "SELECT * FROM users WHERE id = 'seed_priya_sharma_01'"
        ).fetchone()
        assert priya2 is not None


# ── Chunk 3: Taxonomy & Roles ──
def test_chunk3_taxonomy_and_roles():
    with open(os.path.join(BACKEND_DIR, "data", "taxonomy.json"), encoding="utf-8") as f:
        tax = json.load(f)
    assert tax.get("_source") == "sample"
    assert len(tax["skills"]) >= 55
    vendor_terms = {"sap", "aws", "azure", "gcp", "salesforce"}
    for s in tax["skills"]:
        words = set(s["name"].lower().split())
        assert not (words & vendor_terms), f"Vendor-specific term found in taxonomy: {s['name']}"

    with open(os.path.join(BACKEND_DIR, "data", "roles.json"), encoding="utf-8") as f:
        roles = json.load(f)
    assert roles.get("_source") == "sample"
    assert len(roles["roles"]) == 5


# ── Chunk 5: Redaction ──
def test_chunk5_redaction_no_pii_leak():
    from redact import redact_text

    raw = (
        "Name: Priya Sharma\n"
        "Email: priya.sharma@example.com\n"
        "Phone: +91 98765 43210\n"
        "Address: House No 42, Sector 14, Bhopal 462001\n"
        "Graduated from IIT Delhi. She built Python and SQL pipelines.\n"
        "वह एक सॉफ्टवेयर इंजीनियर है और उसकी प्रोजेक्ट रिपोर्ट तैयार है।"
    )
    res = redact_text(raw, user_name="Priya Sharma")
    redacted = res["text"]

    assert "priya.sharma@example.com" not in redacted
    assert "98765" not in redacted
    assert "462001" not in redacted
    assert "Sector 14" not in redacted
    assert "Priya" not in redacted
    assert "Sharma" not in redacted
    assert "IIT Delhi" not in redacted
    assert "वह" not in redacted
    assert "उसकी" not in redacted
    assert res["count"] >= 7
    assert "email" in res["categories"]
    assert "phone" in res["categories"]
    assert "address" in res["categories"]
    assert "gender" in res["categories"]
    assert "college" in res["categories"]
    assert "name" in res["categories"]
    # Technical skills remain intact
    assert "Python" in redacted
    assert "SQL" in redacted


# ── Chunk 4: Resume Upload & Delete ──
def test_chunk4_resume_upload_validation_and_delete(isolated_env):
    from main import app
    from db.database import db_session

    client = TestClient(app)
    headers = {"X-User-Id": "seed_priya_sharma_01"}

    # Auth required
    r_unauth = client.post(
        "/api/resume/upload",
        files={"file": ("test.pdf", b"%PDF-1.4 test", "application/pdf")},
    )
    assert r_unauth.status_code == 401

    # Wrong file type
    r_bad_type = client.post(
        "/api/resume/upload",
        headers=headers,
        files={"file": ("malware.exe", b"MZ...", "application/octet-stream")},
    )
    assert r_bad_type.status_code == 400

    # Oversized > 5MB
    big_bytes = b"%PDF-1.4\n" + b"A" * (5 * 1024 * 1024 + 10)
    r_big = client.post(
        "/api/resume/upload",
        headers=headers,
        files={"file": ("big.pdf", big_bytes, "application/pdf")},
    )
    assert r_big.status_code == 413

    # Valid DOCX upload with PII
    docx_bytes = _make_sample_docx_bytes(
        "Priya Sharma\nEmail: priya@test.in\nSkills: Python, SQL, Git\nPhone: +91 9826012345"
    )
    r_ok = client.post(
        "/api/resume/upload",
        headers=headers,
        files={
            "file": (
                "priya_resume.docx",
                docx_bytes,
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            )
        },
    )
    assert r_ok.status_code == 200, r_ok.text
    data = r_ok.json()
    assert "priya@test.in" not in data["redacted_text"]
    assert "Python" in data["redacted_text"]

    # Check DB does not store raw text and physical file exists
    with db_session() as conn:
        row = conn.execute(
            "SELECT * FROM resume_uploads WHERE id = ?", (data["id"],)
        ).fetchone()
        assert row is not None
        assert "priya@test.in" not in row["redacted_text"]
        saved_path = row["file_path"]
        assert os.path.exists(saved_path)

    # Delete resume -> file & row must disappear
    r_del = client.delete(f"/api/resume/{data['id']}", headers=headers)
    assert r_del.status_code == 200
    assert not os.path.exists(saved_path)
    with db_session() as conn:
        row_after = conn.execute(
            "SELECT * FROM resume_uploads WHERE id = ?", (data["id"],)
        ).fetchone()
        assert row_after is None


# ── Chunk 6: Voice Intro ──
def test_chunk6_voice_intro_limits_and_redaction(isolated_env):
    from main import app
    from db.database import db_session

    client = TestClient(app)
    headers = {"X-User-Id": "seed_priya_sharma_01"}

    # Empty rejected
    r_empty = client.post("/api/voice/intro", headers=headers, json={"transcript": "   "})
    assert r_empty.status_code == 400

    # > 3000 chars rejected
    r_long = client.post("/api/voice/intro", headers=headers, json={"transcript": "a" * 3001})
    assert r_long.status_code == 400

    # Valid transcript
    r_ok = client.post(
        "/api/voice/intro",
        headers=headers,
        json={"transcript": "Hi, my email is priya@mail.com and I built REST APIs in Python."},
    )
    assert r_ok.status_code == 200
    body = r_ok.json()
    assert "priya@mail.com" not in body["redacted_text"]
    assert "Python" in body["redacted_text"]

    with db_session() as conn:
        row = conn.execute("SELECT * FROM voice_intros WHERE id = ?", (body["id"],)).fetchone()
        assert row is not None
        assert "priya@mail.com" not in row["redacted_transcript"]


# ── Chunk 7: Gemini Extraction & Substring/Confidence Rules ──
def test_chunk7_gemini_extraction_mock_and_missing_key(monkeypatch):
    from extract import extract_skills_from_text
    from llm import ask_gemini

    # Missing key raises clear error
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    with pytest.raises(ValueError, match="GEMINI_API_KEY is missing"):
        ask_gemini("hello")

    # Mock client returning 1 valid, 1 low-confidence (<0.5), 1 hallucinated quote
    mock_payload = json.dumps({
        "skills": [
            {
                "skill_id": "python",
                "evidence_quote": "Built backend services with Python",
                "confidence": 0.92,
            },
            {
                "skill_id": "sql",
                "evidence_quote": "basic SQL queries",
                "confidence": 0.42,
            },
            {
                "skill_id": "linux",
                "evidence_quote": "Managed 50 Linux clusters in production",
                "confidence": 0.88,
            },
        ]
    })

    class MockModels:
        def generate_content(self, **kwargs):
            return SimpleNamespace(text=mock_payload)

    mock_client = SimpleNamespace(models=MockModels())

    redacted_input = "Built backend services with Python and wrote basic SQL queries."
    res = extract_skills_from_text(redacted_input, client=mock_client)

    assert res["dropped_hallucinations"] == 1  # linux quote not in input
    assert len(res["skills"]) == 2
    by_id = {s["skill_id"]: s for s in res["skills"]}
    assert by_id["python"]["needs_confirmation"] is False
    assert by_id["sql"]["needs_confirmation"] is True


# ── Chunk 8: Confirm Candidates ──
def test_chunk8_confirm_rejected_not_in_user_skills(isolated_env):
    from main import app
    from db.database import db_session

    client = TestClient(app)
    headers = {"X-User-Id": "seed_priya_sharma_01"}

    # Insert 2 proposed candidates directly or via mocked extract
    with patch("routers.onboarding_pipeline.extract_skills_from_text") as mock_ext:
        mock_ext.return_value = {
            "skills": [
                {
                    "skill_id": "python",
                    "skill_name": "Python",
                    "evidence_quote": "Built Python services",
                    "confidence": 0.95,
                    "needs_confirmation": False,
                },
                {
                    "skill_id": "excel",
                    "skill_name": "Excel & Spreadsheet Analytics",
                    "evidence_quote": "used spreadsheets",
                    "confidence": 0.4,
                    "needs_confirmation": True,
                },
            ],
            "dropped_hallucinations": 0,
        }
        client.post(
            "/api/voice/intro",
            headers=headers,
            json={"transcript": "Built Python services and used spreadsheets."},
        )
        r_ext = client.post("/api/onboarding/extract", headers=headers)
        assert r_ext.status_code == 200
        cands = r_ext.json()["candidates"]
        assert len(cands) == 2

    # Confirm python, reject excel
    py_cand = next(c for c in cands if c["skill_id"] == "python")
    ex_cand = next(c for c in cands if c["skill_id"] == "excel")

    r_p1 = client.patch(
        f"/api/onboarding/candidates/{py_cand['id']}",
        headers=headers,
        json={"status": "confirmed"},
    )
    assert r_p1.status_code == 200

    r_p2 = client.patch(
        f"/api/onboarding/candidates/{ex_cand['id']}",
        headers=headers,
        json={"status": "rejected"},
    )
    assert r_p2.status_code == 200

    r_conf = client.post("/api/onboarding/confirm", headers=headers)
    assert r_conf.status_code == 200
    saved_ids = {s["skill_id"] for s in r_conf.json()["user_skills"]}
    assert "python" in saved_ids
    assert "excel" not in saved_ids


# ── Chunk 9: Deterministic Match & Protected Field Error ──
def test_chunk9_match_deterministic_and_protected_field_error(isolated_env):
    from main import app
    from engines.match import MatchInput, compute_role_match
    from pydantic import ValidationError

    # Fixed input -> fixed deterministic score
    m1 = compute_role_match(MatchInput(skills=["Python", "React", "REST APIs", "SQL"], role_id="role-fsd-01"))
    m2 = compute_role_match(MatchInput(skills=["Python", "React", "REST APIs", "SQL"], role_id="role-fsd-01"))
    assert m1["score"] == m2["score"] == 0.6667  # 3/4 required * 0.8 + 1/3 nice * 0.2

    # Protected field in MatchInput raises ValidationError
    with pytest.raises(ValidationError):
        MatchInput(skills=["Python"], role_id="role-fsd-01", gender="Female")

    # Protected field in POST /api/analysis/run returns 422
    client = TestClient(app)
    r_bad = client.post(
        "/api/analysis/run",
        headers={"X-User-Id": "seed_priya_sharma_01"},
        json={"role_id": "role-fsd-01", "gender": "Female"},
    )
    assert r_bad.status_code == 422


# ── Chunk 10: Explanation Guardrails ──
def test_chunk10_explanation_suitability_and_no_new_numbers(monkeypatch):
    from engines.explain import generate_analysis_explanation

    monkeypatch.setenv("GEMINI_API_KEY", "dummy-key")

    # Mock Gemini with hallucinated number (99) -> triggers deterministic fallback
    class HallucinatingModels:
        def generate_content(self, **kwargs):
            return SimpleNamespace(text="You are suitable because you scored 99% across 12 projects.")

    res_hall = generate_analysis_explanation(
        score=0.8,
        matched_skills=["Python", "SQL"],
        missing_skills=["Docker"],
        client=SimpleNamespace(models=HallucinatingModels()),
    )
    assert res_hall["used_deterministic_fallback"] is True
    assert "You are suitable" in res_hall["explanation"]
    assert "99" not in res_hall["explanation"]

    # Score < 0.7 -> never says "You are suitable"
    res_low = generate_analysis_explanation(
        score=0.5,
        matched_skills=["Python"],
        missing_skills=["SQL", "Docker"],
        client=SimpleNamespace(models=HallucinatingModels()),
    )
    assert res_low["suitable"] is False
    assert "you are suitable" not in res_low["explanation"].lower()


# ── Chunk 11 & 12 + E2E Acceptance: Priya Upload -> Extract -> Confirm -> Analysis -> PDF -> Cleanup ──
def test_e2e_priya_acceptance_pipeline(isolated_env, monkeypatch):
    from main import app
    from db.database import db_session

    monkeypatch.setenv("GEMINI_API_KEY", "dummy-key")
    client = TestClient(app)
    headers = {"X-User-Id": "seed_priya_sharma_01"}

    # 1. Upload Priya sample PDF resume
    pdf_bytes = _make_sample_pdf_bytes(
        "Priya Sharma\n"
        "Email: priya.sharma@skillnav.io | Phone: +91 9876543210\n"
        "College: State Engineering College\n"
        "Skills: Built microservices with Python, React, REST APIs, and SQL."
    )
    r_up = client.post(
        "/api/resume/upload",
        headers=headers,
        files={"file": ("priya_resume.pdf", pdf_bytes, "application/pdf")},
    )
    assert r_up.status_code == 200
    assert "priya.sharma@skillnav.io" not in r_up.json()["redacted_text"]

    # 2. Extract skills (mock Gemini call)
    with patch("routers.onboarding_pipeline.extract_skills_from_text") as mock_ext:
        mock_ext.return_value = {
            "skills": [
                {"skill_id": "python", "skill_name": "Python", "evidence_quote": "Python", "confidence": 0.95, "needs_confirmation": False},
                {"skill_id": "react", "skill_name": "React", "evidence_quote": "React", "confidence": 0.9, "needs_confirmation": False},
                {"skill_id": "rest-apis", "skill_name": "REST APIs", "evidence_quote": "REST APIs", "confidence": 0.9, "needs_confirmation": False},
                {"skill_id": "sql", "skill_name": "SQL", "evidence_quote": "SQL", "confidence": 0.9, "needs_confirmation": False},
            ],
            "dropped_hallucinations": 0,
        }
        r_ext = client.post("/api/onboarding/extract", headers=headers)
        assert r_ext.status_code == 200
        cands = r_ext.json()["candidates"]
        assert len(cands) == 4

    # 3. Confirm all candidates
    for c in cands:
        client.patch(
            f"/api/onboarding/candidates/{c['id']}",
            headers=headers,
            json={"status": "confirmed"},
        )
    r_conf = client.post("/api/onboarding/confirm", headers=headers)
    assert r_conf.status_code == 200
    assert r_conf.json()["confirmed_count"] == 4

    # 4. Run Analysis
    r_run = client.post(
        "/api/analysis/run",
        headers=headers,
        json={"role_id": "role-fsd-01"},
    )
    assert r_run.status_code == 200
    run_data = r_run.json()
    assert run_data["score"] == 0.6667
    run_id = run_data["run_id"]

    # 5. Explain Analysis
    with patch("routers.onboarding_pipeline.generate_analysis_explanation") as mock_expl:
        mock_expl.return_value = {
            "explanation": "You are suitable for this role with a verified match score of 80.0%. Confirmed strengths: Python, React, REST APIs, SQL. Gaps: Git, Docker.",
            "suitable": True,
            "threshold": 0.7,
            "used_deterministic_fallback": True,
        }
        r_expl = client.post("/api/analysis/explain", headers=headers, json={"run_id": run_id})
        assert r_expl.status_code == 200
        assert "You are suitable" in r_expl.json()["explanation"]

    # 6. Generate PDF (valid %PDF and footer text check via pypdf)
    r_pdf = client.get(f"/api/resume/generate/{run_id}", headers=headers)
    assert r_pdf.status_code == 200
    assert r_pdf.headers["content-type"] == "application/pdf"
    assert r_pdf.content.startswith(b"%PDF")

    from pypdf import PdfReader
    pdf_reader = PdfReader(io.BytesIO(r_pdf.content))
    pdf_text = "\n".join(page.extract_text() or "" for page in pdf_reader.pages)
    assert "Priya Sharma" in pdf_text
    assert "Generated by SkillNav, review before sharing" in pdf_text

    # 7. Another user cannot access Priya's PDF
    r_other = client.get(
        f"/api/resume/generate/{run_id}",
        headers={"X-User-Id": "seed_rajdeep_patel_01"},
    )
    assert r_other.status_code == 404

    # 8. Cleanup user data
    r_clean = client.delete("/api/user/data", headers=headers)
    assert r_clean.status_code == 200
    assert r_clean.json()["uploads_removed"] >= 1
    with db_session() as conn:
        assert conn.execute("SELECT COUNT(*) AS c FROM resume_uploads WHERE user_id='seed_priya_sharma_01'").fetchone()["c"] == 0
        assert conn.execute("SELECT COUNT(*) AS c FROM skill_candidates WHERE user_id='seed_priya_sharma_01'").fetchone()["c"] == 0
