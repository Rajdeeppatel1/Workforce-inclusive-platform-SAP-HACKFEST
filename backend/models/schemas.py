"""
SkillNav Pydantic Schemas
═════════════════════════
Defines raw candidate profiles, sanitized blind profiles,
alternative evidence models, job definitions, and match results.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime


class AlternativeEvidence(BaseModel):
    """
    Non-traditional evidence signals:
    GitHub repos, freelance projects, open-source PRs, YouTube tutorials,
    career-break projects, self-taught certifications.
    """
    category: str = Field(
        ...,
        description="github | freelance | open_source | self_taught | career_break_project | certification"
    )
    title: str
    description: Optional[str] = ""
    skills_demonstrated: List[str] = Field(default_factory=list)
    verification_url: Optional[str] = None
    weight_multiplier: float = Field(default=1.0, ge=0.5, le=2.0)


class RawCandidateProfile(BaseModel):
    """
    Raw candidate input before blind sanitization.
    Protected and pedigree attributes may be present here, but will be stripped
    before any AI scoring, database persistence, or vector indexing.
    """
    profile_id: Optional[str] = None

    # Protected & Pedigree Attributes (STRIPPED BY BLIND MATCHER)
    name: Optional[str] = None
    gender: Optional[str] = None
    age: Optional[int] = None
    location: Optional[str] = None
    college_name: Optional[str] = None
    college_tier: Optional[str] = None

    # Skills & Alternative Evidence (PRESERVED)
    skills: List[str] = Field(default_factory=list)
    years_experience: Optional[float] = 0.0
    alternative_evidence: List[AlternativeEvidence] = Field(default_factory=list)
    preferred_roles: List[str] = Field(default_factory=list)


class SanitizedBlindProfile(BaseModel):
    """
    Blind profile: STRICTLY ZERO protected or pedigree attributes.
    Guaranteed safe for DB persistence, vector embeddings, and fair AI scoring.
    """
    profile_id: str
    skills: List[str]
    alternative_evidence: List[AlternativeEvidence]
    sanitized_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")
    stripped_attributes: List[str] = Field(default_factory=list)
    evidence_count: int = 0
    anonymized_hash: str


class JobListing(BaseModel):
    job_id: str
    title: str
    department: str
    required_skills: List[str]
    preferred_skills: List[str] = Field(default_factory=list)
    min_readiness_threshold: float = 60.0
    description: str
    skill_vector: Optional[List[float]] = None


class JobMatchResult(BaseModel):
    job_id: str
    title: str
    department: str
    match_score: float
    matched_skills: List[str]
    missing_skills: List[str]
    alternative_evidence_boost: float
    confidence: float
    is_counterfactual_stable: bool = True
