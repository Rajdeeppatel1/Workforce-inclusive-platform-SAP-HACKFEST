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


class QuizScore(BaseModel):
    category: str
    score: int
    total: int
    percentage: float
    passed: bool
    completed_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")


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
    quiz_scores: List[QuizScore] = Field(default_factory=list)
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


@router.get("/fresher/catalog")
async def get_fresher_catalog():
    """
    Returns skills, target companies, recommended certificates, and trending skills
    loaded directly from backend/data/fresher_catalog.json.
    """
    catalog_path = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..", "data", "fresher_catalog.json")
    )
    if not os.path.exists(catalog_path):
        raise HTTPException(status_code=404, detail="Fresher catalog not found")

    try:
        with open(catalog_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read fresher catalog: {str(e)}")


class SaveQuizScoreRequest(BaseModel):
    profile_id: str
    category: str
    score: int
    total: int = 5
    passed: bool


@router.post("/profile/quiz-score")
async def save_quiz_score(req: SaveQuizScoreRequest):
    """
    Saves candidate MCQ quiz score into backend/data/profiles/<profile_id>.json.
    Also adds verified skill tag if score >= 60%.
    """
    filepath = _get_profile_file_path(req.profile_id)
    profile_data = dict(SEEDED_MOCK_PROFILE)

    if os.path.exists(filepath):
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                profile_data = json.load(f)
        except Exception:
            pass

    if "quiz_scores" not in profile_data:
        profile_data["quiz_scores"] = []

    percentage = round((req.score / req.total) * 100, 1)
    new_entry = {
        "category": req.category,
        "score": req.score,
        "total": req.total,
        "percentage": percentage,
        "passed": req.passed,
        "completed_at": datetime.utcnow().isoformat() + "Z"
    }

    # Update or append category score
    existing_idx = next((i for i, q in enumerate(profile_data["quiz_scores"]) if q.get("category") == req.category), -1)
    if existing_idx >= 0:
        profile_data["quiz_scores"][existing_idx] = new_entry
    else:
        profile_data["quiz_scores"].append(new_entry)

    # If passed (>= 60%), add skill tag if not present
    if req.passed:
        current_skills = profile_data.get("skills", [])
        if req.category not in current_skills:
            current_skills.append(req.category)
            profile_data["skills"] = current_skills

    profile_data["updated_at"] = datetime.utcnow().isoformat() + "Z"

    try:
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(profile_data, f, indent=2)
        return {
            "status": "success",
            "message": f"Quiz score ({req.score}/{req.total}) saved to profile.",
            "quiz_scores": profile_data["quiz_scores"],
            "profile": profile_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save quiz score: {str(e)}")


# ═════════════════════════════════════════════════════════════
# Certificate Mock OCR & Roles Validation (No live external API)
# ═════════════════════════════════════════════════════════════

ROLES_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "data", "roles.json")
)


@router.get("/roles")
async def get_roles():
    """
    Returns target company roles from backend/data/roles.json (no live API).
    """
    if not os.path.exists(ROLES_PATH):
        raise HTTPException(status_code=404, detail="roles.json not found")
    try:
        with open(ROLES_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load roles: {str(e)}")


class MockOcrRequest(BaseModel):
    filename: Optional[str] = "certificate.pdf"
    raw_text: Optional[str] = ""


@router.post("/credentials/mock-ocr")
async def mock_ocr(req: MockOcrRequest):
    """
    Mock OCR engine: parses certificate and returns naam, issuer, date, skills, and title.
    """
    text = (req.raw_text or "").lower()
    fn = (req.filename or "").lower()

    # Rule-based synthetic extraction
    if "aws" in text or "cloud" in fn or "aws" in fn:
        return {
            "naam": "Rajdeep Patel",
            "title": "AWS Certified Cloud Solutions Practitioner",
            "issuer": "Amazon Web Services (AWS)",
            "date": "2024-08",
            "skills": ["Docker", "Cloud Basics", "REST APIs", "Python"],
            "status": "Extracted (Needs Confirmation)"
        }
    elif "meta" in text or "react" in fn or "frontend" in text:
        return {
            "naam": "Rajdeep Patel",
            "title": "Modern Frontend Development with React & Tailwind",
            "issuer": "Meta / Coursera",
            "date": "2024-07",
            "skills": ["React", "JavaScript", "Tailwind CSS", "TypeScript"],
            "status": "Extracted (Needs Confirmation)"
        }
    elif "docker" in text or "devops" in fn or "linux" in text:
        return {
            "naam": "Rajdeep Patel",
            "title": "Containerization & Microservices Foundations",
            "issuer": "Linux Foundation / CNCF",
            "date": "2024-09",
            "skills": ["Docker", "Linux", "CI/CD", "Python"],
            "status": "Extracted (Needs Confirmation)"
        }
    else:
        # Default Python / REST API Specialization
        return {
            "naam": "Rajdeep Patel",
            "title": "Python for Everybody & Backend Microservices",
            "issuer": "Coursera / DeepLearning",
            "date": "2024-10",
            "skills": ["Python", "FastAPI", "SQL", "REST APIs"],
            "status": "Extracted (Needs Confirmation)"
        }


class ValidateRoleRequest(BaseModel):
    role_id: str
    skills: List[str] = Field(default_factory=list)
    certificate_title: Optional[str] = None
    profile_id: Optional[str] = "seed_rajdeep_patel_01"


@router.post("/roles/validate")
async def validate_role(req: ValidateRoleRequest):
    """
    Validates candidate certificate & skills against target role requirements in backend/data/roles.json.
    Returns: 'Aap is role ke liye eligible hain' (apply ho gaya nahi).
    """
    if not os.path.exists(ROLES_PATH):
        raise HTTPException(status_code=404, detail="roles.json not found")

    try:
        with open(ROLES_PATH, "r", encoding="utf-8") as f:
            roles_data = json.load(f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read roles.json: {str(e)}")

    roles_list = roles_data.get("roles", [])
    target_role = next((r for r in roles_list if r.get("role_id") == req.role_id), None)

    if not target_role:
        target_role = roles_list[0] if roles_list else None

    if not target_role:
        raise HTTPException(status_code=404, detail="No role found in roles.json")

    # Match skills (case-insensitive)
    candidate_skills_norm = {s.strip().lower() for s in req.skills if s.strip()}
    required_skills = target_role.get("required_skills", [])

    matched = []
    missing = []
    for r_skill in required_skills:
        if r_skill.strip().lower() in candidate_skills_norm:
            matched.append(r_skill)
        else:
            missing.append(r_skill)

    min_required = target_role.get("min_matching_skills", 3)
    match_pct = round((len(matched) / len(required_skills)) * 100, 1) if required_skills else 100.0
    is_eligible = len(matched) >= min_required or match_pct >= 60.0

    return {
        "role_id": target_role.get("role_id"),
        "role_title": target_role.get("title"),
        "company": target_role.get("company"),
        "eligible": is_eligible,
        "result_message": "Aap is role ke liye eligible hain" if is_eligible else "Aapko is role ke liye kuch aur skills add karne honge",
        "notice": "Aap is role ke liye eligible hain (apply ho gaya nahi)",
        "matched_skills": matched,
        "missing_skills": missing,
        "match_percentage": match_pct,
        "required_skills": required_skills,
        "applied_status": "Eligible Only • Not Applied",
        "explanation": f"Matched {len(matched)} of {len(required_skills)} core skills required by {target_role.get('company')}."
    }


# ═════════════════════════════════════════════════════════════
# Mentors & Doubt Summarizer (Mentors from mentors.json, Gemini API)
# ═════════════════════════════════════════════════════════════

MENTORS_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "data", "mentors.json")
)


@router.get("/mentors")
async def get_mentors():
    """
    Returns expert mentor profiles from backend/data/mentors.json.
    """
    if not os.path.exists(MENTORS_PATH):
        raise HTTPException(status_code=404, detail="mentors.json not found")
    try:
        with open(MENTORS_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load mentors: {str(e)}")


class DoubtSummaryRequest(BaseModel):
    doubt_text: str = Field(..., min_length=5, description="Candidate technical or career doubt")
    mentor_naam: Optional[str] = "Expert Mentor"
    mentor_role: Optional[str] = "Engineering Lead"


@router.post("/mentors/summarize-doubt")
async def summarize_doubt(req: DoubtSummaryRequest):
    """
    Uses Gemini API (or local resilient fallback) to summarize a user's doubt
    and generate a professional draft message for the expert mentor.
    """
    from services.gemini_service import summarize_doubt_for_expert
    summary_result = summarize_doubt_for_expert(
        doubt_text=req.doubt_text,
        mentor_naam=req.mentor_naam,
        mentor_role=req.mentor_role
    )
    return summary_result


class MentorBookRequest(BaseModel):
    mentor_id: str
    mentor_naam: str
    slot: Optional[str] = "Tomorrow at 4:00 PM IST"
    draft_message: Optional[str] = None


@router.post("/mentors/book")
async def book_mentor(req: MentorBookRequest):
    """
    Simulates booking a 1:1 mentorship session.
    Booking sirf confirmation message, koi real booking nahi.
    """
    return {
        "status": "confirmed_simulation",
        "mentor_id": req.mentor_id,
        "mentor_naam": req.mentor_naam,
        "slot": req.slot,
        "confirmation_message": f"Session request confirmed for {req.mentor_naam}! Aapko slot details email par bhej di gayi hain.",
        "notice": "Booking sirf confirmation message hai, koi real booking nahi.",
        "booking_reference": f"SIM-BOOK-{req.mentor_id.upper()}-2026"
    }


