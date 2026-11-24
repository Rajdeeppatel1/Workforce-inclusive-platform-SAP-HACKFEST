"""
API Routes for SAP Generative AI Hub Features
═════════════════════════════════════════════
- POST /api/jd/check-bias
- POST /api/credentials/extract
- POST /api/explain-score
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

from services.sap_genai import (
    analyze_jd_bias,
    extract_certificate_skills,
    generate_why_this_score,
    generate_skill_embedding
)

router = APIRouter(prefix="/api", tags=["sap-genai"])


class JDBiasRequest(BaseModel):
    jd_text: str = Field(..., min_length=10, description="Job description text to analyze for bias")


class CredentialExtractRequest(BaseModel):
    raw_text: str = Field(..., description="OCR text or credential metadata extracted from certificate")


class ScoreExplanationRequest(BaseModel):
    matched_skills: List[str]
    missing_skills: List[str] = Field(default_factory=list)
    weak_skills: Optional[List[str]] = Field(default_factory=list)


@router.post("/jd/check-bias")
async def check_jd_bias(req: JDBiasRequest):
    """
    Detects age, gender, and pedigree bias in Job Descriptions,
    returning an inclusion score, flagged snippets, and a rewritten inclusive JD.
    """
    return analyze_jd_bias(req.jd_text)


@router.post("/credentials/extract")
async def extract_credentials(req: CredentialExtractRequest):
    """
    Extracts skills, issuer, title, and verification status from certificate OCR text.
    """
    return extract_certificate_skills(req.raw_text)


@router.post("/explain-score")
async def explain_score(req: ScoreExplanationRequest):
    """
    Generates a concise 2-sentence plain-English explanation of why this score was awarded.
    """
    explanation = generate_why_this_score(
        matched=req.matched_skills,
        missing=req.missing_skills,
        weak=req.weak_skills
    )
    return {"explanation": explanation}
