"""
SkillNav API Routes for Blind Matching & Fairness
═════════════════════════════════════════════════
Exposes endpoints for:
- POST /api/profiles/sanitize  (strips protected attributes)
- POST /api/matches            (vector job matching on sanitized skills)
- POST /api/fairness/counterfactual-test (runs counterfactual test proving zero delta)
"""

from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from models.schemas import RawCandidateProfile, SanitizedBlindProfile, JobMatchResult
from services.blind_matcher import strip_protected_attributes, compute_alternative_evidence_boost
from db.hana_vector import vector_match_jobs, init_hana_tables

router = APIRouter(prefix="/api", tags=["blind-matching"])


@router.post("/profiles/sanitize", response_model=SanitizedBlindProfile)
async def sanitize_candidate_profile(raw_profile: RawCandidateProfile):
    """
    Strips protected and pedigree attributes (name, gender, age, college, location)
    and returns a clean blind profile safe for vector matching and SAP HANA persistence.
    """
    return strip_protected_attributes(raw_profile)


@router.post("/matches", response_model=List[JobMatchResult])
async def get_fair_job_matches(raw_profile: RawCandidateProfile, top_k: int = 5):
    """
    Runs fair blind job matching:
    1. Strips all protected attributes.
    2. Computes boost from alternative evidence (GitHub, freelance, etc.).
    3. Runs vector similarity against jobs via SAP HANA Cloud or in-memory fallback.
    """
    sanitized = strip_protected_attributes(raw_profile)
    boost = compute_alternative_evidence_boost(sanitized.alternative_evidence)
    matches = vector_match_jobs(
        candidate_skills=sanitized.skills,
        evidence_boost=boost,
        top_k=top_k
    )
    return matches


@router.post("/hana/init-tables")
async def trigger_hana_init():
    """Admin endpoint to initialize HANA tables and view."""
    return init_hana_tables()
