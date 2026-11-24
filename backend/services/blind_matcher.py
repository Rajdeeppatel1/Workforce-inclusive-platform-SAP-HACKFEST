"""
SkillNav Blind Matcher Service
══════════════════════════════
Core fairness engine: strips protected and pedigree attributes
(name, gender, age, college_name, college_tier, location)
and produces a strictly sanitized, audit-logged blind profile.
"""

import hashlib
import uuid
from datetime import datetime
from typing import Dict, Any, Tuple
from models.schemas import RawCandidateProfile, SanitizedBlindProfile


# Attributes strictly banned from persistence and vector scoring
PROTECTED_AND_PEDIGREE_KEYS = {
    "name",
    "gender",
    "age",
    "location",
    "college_name",
    "college_tier",
}


def strip_protected_attributes(profile: RawCandidateProfile) -> SanitizedBlindProfile:
    """
    Takes a RawCandidateProfile, identifies and removes all protected/pedigree attributes,
    and returns a SanitizedBlindProfile containing only verified skills and alternative evidence.
    Also logs stripped attributes and generates a deterministic pseudonymous profile_id.
    """
    profile_dict = profile.model_dump()

    stripped_found = []
    for key in PROTECTED_AND_PEDIGREE_KEYS:
        val = profile_dict.get(key)
        if val is not None and str(val).strip() != "":
            stripped_found.append(key)

    # Deterministic or generated pseudonymous ID
    skills_signature = ",".join(sorted([s.lower().strip() for s in profile.skills]))
    if profile.profile_id:
        pid = profile.profile_id
    else:
        pid = f"anon_{uuid.uuid4().hex[:12]}"

    anon_hash = hashlib.sha256(
        f"{pid}:{skills_signature}:{len(profile.alternative_evidence)}".encode("utf-8")
    ).hexdigest()[:16]

    # Normalize skills
    cleaned_skills = sorted(list({s.strip() for s in profile.skills if s.strip()}))

    return SanitizedBlindProfile(
        profile_id=pid,
        skills=cleaned_skills,
        alternative_evidence=profile.alternative_evidence,
        sanitized_at=datetime.utcnow().isoformat() + "Z",
        stripped_attributes=stripped_found,
        evidence_count=len(profile.alternative_evidence),
        anonymized_hash=anon_hash,
    )


def compute_alternative_evidence_boost(evidence_list) -> float:
    """
    Calculates fair score boost based on alternative evidence (GitHub repos,
    freelance work, self-taught projects, career returner signals).
    Capped at 25% max boost to augment skill matches without artificial distortion.
    """
    if not evidence_list:
        return 0.0

    total_boost = 0.0
    for ev in evidence_list:
        multiplier = getattr(ev, "weight_multiplier", 1.0)
        category = getattr(ev, "category", "general")
        skills_count = len(getattr(ev, "skills_demonstrated", []))

        # Weight signals
        base = 3.5 if category in {"github", "freelance"} else 2.5
        total_boost += min(8.0, (base + min(skills_count * 1.0, 3.0)) * multiplier)

    return round(min(total_boost, 25.0), 2)
