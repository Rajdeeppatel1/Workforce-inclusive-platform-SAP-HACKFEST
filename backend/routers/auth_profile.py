"""
SkillNav Auth & Profile Router
═════════════════════════════
Endpoints:
- POST /api/login/mock  → loads seeded synthetic demo profile
- GET  /api/profile     → retrieves candidate profile from backend/data/profiles/
- POST /api/profile     → saves/updates candidate profile into backend/data/profiles/<profile_id>.json
- POST /api/consent     → records candidate data-use consent
"""

import os
import json
from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

router = APIRouter(prefix="/api", tags=["auth-and-profile"])

# Profile storage path
PROFILES_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "data", "profiles")
)
os.makedirs(PROFILES_DIR, exist_ok=True)


class ExperienceEntry(BaseModel):
    role: str
    company_or_freelance: Optional[str] = ""
    years: float = 0.0
    description: Optional[str] = ""


class EducationEntry(BaseModel):
    degree: str
    field_of_study: str
    institution: Optional[str] = ""
    graduation_year: Optional[int] = None
    # Note: institution/pedigree is strictly stripped before scoring by the blind matcher


class Goals(BaseModel):
    target_role: str = "Full Stack Developer"
    weekly_study_hours: int = 10
    preferred_topics: List[str] = Field(default_factory=list)


class UserProfile(BaseModel):
    profile_id: str
    name: str = "Rajdeep Patel"
    email: Optional[str] = "rajdeep.demo@skillnav.io"
    is_synthetic: bool = True
    demo_label: str = "Synthetic Demo Profile"
    consent_given: bool = False
    consent_timestamp: Optional[str] = None
    skills: List[str] = Field(default_factory=list)
    experience: List[ExperienceEntry] = Field(default_factory=list)
    education: List[EducationEntry] = Field(default_factory=list)
    goals: Goals = Field(default_factory=Goals)
    alternative_evidence: List[Dict[str, Any]] = Field(default_factory=list)
    updated_at: Optional[str] = None


class ConsentRequest(BaseModel):
    profile_id: str
    consent: bool


SEEDED_MOCK_PROFILE: Dict[str, Any] = {
    "profile_id": "seed_rajdeep_patel_01",
    "name": "Rajdeep Patel",
    "email": "rajdeep.demo@skillnav.io",
    "is_synthetic": True,
    "demo_label": "Synthetic Demo Profile",
    "consent_given": False,
    "consent_timestamp": None,
    "skills": ["Python", "FastAPI", "React", "SQL", "Docker", "REST APIs"],
    "experience": [
        {
            "role": "Junior Full Stack Developer",
            "company_or_freelance": "Freelance & Open Source Projects",
            "years": 1.5,
            "description": "Built reactive web applications and backend microservices with FastAPI and React."
        }
    ],
    "education": [
        {
            "degree": "Bachelor of Technology",
            "field_of_study": "Computer Science",
            "institution": "State Technical Institute",
            "graduation_year": 2024
        }
    ],
    "goals": {
        "target_role": "Full Stack Developer",
        "weekly_study_hours": 10,
        "preferred_topics": ["Docker", "AWS Basics", "System Design"]
    },
    "alternative_evidence": [
        {
            "category": "github",
            "title": "Fullstack Task Manager & REST API",
            "description": "Production microservice with authentication and Docker orchestration",
            "skills_demonstrated": ["Python", "FastAPI", "Docker"],
            "verification_url": "https://github.com/developer/task-manager-api",
            "confidence": "High",
            "weight_multiplier": 1.2,
            "status": "Verified"
        },
        {
            "category": "freelance",
            "title": "Local Retail Inventory Portal",
            "description": "Shipped responsive React + Tailwind application for local storefronts",
            "skills_demonstrated": ["React", "Tailwind CSS", "SQL"],
            "verification_url": "https://retail-portal-demo.dev",
            "confidence": "High",
            "weight_multiplier": 1.1,
            "status": "Verified"
        }
    ],
    "updated_at": datetime.utcnow().isoformat() + "Z"
}


def _get_profile_file_path(profile_id: str) -> str:
    # Sanitize profile_id to prevent directory traversal
    safe_id = "".join([c for c in profile_id if c.isalnum() or c in ("-", "_")])
    if not safe_id:
        safe_id = "default_profile"
    return os.path.join(PROFILES_DIR, f"{safe_id}.json")


@router.post("/login/mock")
async def login_mock():
    """
    Simulates candidate Sign-In with a seeded synthetic profile.
    Saves to backend/data/profiles/seed_rajdeep_patel_01.json if not present.
    """
    filepath = _get_profile_file_path("seed_rajdeep_patel_01")
    if os.path.exists(filepath):
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                data = json.load(f)
                return data
        except Exception:
            pass

    # Save seeded profile
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(SEEDED_MOCK_PROFILE, f, indent=2)

    return SEEDED_MOCK_PROFILE


@router.get("/profile")
async def get_profile(profile_id: str = Query(default="seed_rajdeep_patel_01")):
    """
    Retrieves candidate profile from backend/data/profiles/<profile_id>.json.
    """
    filepath = _get_profile_file_path(profile_id)
    if not os.path.exists(filepath):
        # Fall back to seeded mock profile
        return SEEDED_MOCK_PROFILE

    try:
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read profile: {str(e)}")


@router.post("/profile")
async def save_profile(profile: UserProfile):
    """
    Saves or updates candidate profile to backend/data/profiles/<profile_id>.json.
    """
    profile.updated_at = datetime.utcnow().isoformat() + "Z"
    profile_dict = profile.model_dump()

    filepath = _get_profile_file_path(profile.profile_id)
    try:
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(profile_dict, f, indent=2)
        return {"status": "saved", "profile_id": profile.profile_id, "profile": profile_dict}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save profile: {str(e)}")


@router.post("/consent")
async def update_consent(req: ConsentRequest):
    """
    Records user consent: 'Ye data sirf skill matching ke liye use hoga.'
    Updates the JSON file in backend/data/profiles/<profile_id>.json.
    """
    filepath = _get_profile_file_path(req.profile_id)
    profile_data = dict(SEEDED_MOCK_PROFILE)

    if os.path.exists(filepath):
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                profile_data = json.load(f)
        except Exception:
            pass

    profile_data["consent_given"] = req.consent
    profile_data["consent_timestamp"] = datetime.utcnow().isoformat() + "Z" if req.consent else None
    profile_data["updated_at"] = datetime.utcnow().isoformat() + "Z"

    try:
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(profile_data, f, indent=2)
        return {
            "status": "success",
            "consent_given": req.consent,
            "message": "Consent recorded: Ye data sirf skill matching ke liye use hoga."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update consent: {str(e)}")
