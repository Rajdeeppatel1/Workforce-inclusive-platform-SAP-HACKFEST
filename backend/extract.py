"""
SkillNav Skill Extraction Engine (Chunk 7)
══════════════════════════════════════════
Uses Gemini (`ask_gemini`) + `backend/data/taxonomy.json` + redacted text to extract skills:
  Output: {"skills": [{"skill_id": str, "skill_name": str, "evidence_quote": str, "confidence": float, "needs_confirmation": bool}]}

Rules:
1. Any extracted skill whose `evidence_quote` is NOT a substring of the input `redacted_text`
   (case-insensitive, whitespace-normalized) is DROPPED to prevent hallucinations.
2. Any extracted skill with `confidence < 0.5` has `needs_confirmation = True`.
3. Only skills present in `taxonomy.json` are accepted.
"""

import json
import os
import re
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

from llm import ask_gemini

TAXONOMY_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "data", "taxonomy.json")
)


class ExtractedSkillItem(BaseModel):
    skill_id: str
    evidence_quote: str
    confidence: float = Field(..., ge=0.0, le=1.0)


class GeminiExtractionResponse(BaseModel):
    skills: List[ExtractedSkillItem] = Field(default_factory=list)


def load_taxonomy(taxonomy_path: str = TAXONOMY_PATH) -> List[Dict[str, Any]]:
    with open(taxonomy_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data.get("skills", [])


def _normalize_ws(s: str) -> str:
    return re.sub(r"\s+", " ", s or "").strip().lower()


def extract_skills_from_text(
    redacted_text: str,
    taxonomy: Optional[List[Dict[str, Any]]] = None,
    client: Any = None,
) -> Dict[str, Any]:
    """
    Extracts grounded skills from redacted resume/voice text against the generic taxonomy.
    Raises ValueError if GEMINI_API_KEY is missing (when client is None).
    """
    if not redacted_text or not redacted_text.strip():
        return {"skills": [], "dropped_hallucinations": 0}

    skills_tax = taxonomy if taxonomy is not None else load_taxonomy()
    tax_by_id = {s["skill_id"].lower(): s for s in skills_tax}

    taxonomy_summary = "\n".join(
        f"- {s['skill_id']}: {s['name']}" for s in skills_tax
    )

    prompt = (
        "Extract demonstrable skills from the following redacted candidate text.\n"
        "You MUST only choose skill_id values from the taxonomy below.\n"
        "For every skill, provide an exact verbatim `evidence_quote` copied directly from the candidate text, "
        "and a `confidence` score between 0.0 and 1.0.\n\n"
        f"Taxonomy:\n{taxonomy_summary}\n\n"
        f"Candidate Redacted Text:\n{redacted_text}"
    )

    # strict=True ensures missing key or mock failure raises cleanly
    parsed: GeminiExtractionResponse = ask_gemini(
        prompt=prompt,
        schema=GeminiExtractionResponse,
        client=client,
        strict=True,
    )

    normalized_input = _normalize_ws(redacted_text)
    validated_skills: List[Dict[str, Any]] = []
    dropped_count = 0
    seen_ids = set()

    for item in parsed.skills:
        sid = item.skill_id.strip().lower()
        if sid not in tax_by_id:
            dropped_count += 1
            continue

        quote_norm = _normalize_ws(item.evidence_quote)
        if not quote_norm or quote_norm not in normalized_input:
            # Drop hallucinated quote that is not a substring of the redacted input
            dropped_count += 1
            continue

        if sid in seen_ids:
            continue
        seen_ids.add(sid)

        tax_entry = tax_by_id[sid]
        conf = float(item.confidence)
        validated_skills.append({
            "skill_id": tax_entry["skill_id"],
            "skill_name": tax_entry["name"],
            "evidence_quote": item.evidence_quote.strip(),
            "confidence": round(conf, 3),
            "needs_confirmation": conf < 0.5,
        })

    return {
        "skills": validated_skills,
        "dropped_hallucinations": dropped_count,
    }
