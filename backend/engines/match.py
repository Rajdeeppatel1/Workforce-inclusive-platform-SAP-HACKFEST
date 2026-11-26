"""
SkillNav Deterministic Match & Gap Engine (Chunk 9)
═══════════════════════════════════════════════════
Weights:
- Required skills: 0.8
- Nice-to-have skills: 0.2
- Level cap: If candidate skill level < role min_level, score is capped at 0.65.

Strict Input Schema:
- `extra="forbid"` rejects any protected/pedigree field (name, gender, age, college, location, etc.).
"""

import json
import os
from typing import List, Dict, Any, Optional, Set
from pydantic import BaseModel, ConfigDict, Field

ROLES_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "data", "roles.json")
)
TAXONOMY_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "data", "taxonomy.json")
)

REQUIRED_WEIGHT = 0.8
NICE_WEIGHT = 0.2
LEVEL_CAP_MAX_SCORE = 0.65

# Canonical alias groups so taxonomy skill names match role requirement labels accurately
SYNONYM_GROUPS = [
    {"sql", "sql basics", "structured query language"},
    {"python", "python basics", "python programming"},
    {"javascript", "javascript basics", "js"},
    {"git", "git & version control", "version control"},
    {"rest apis", "http & rest", "http & rest apis", "rest", "restful services"},
    {"docker", "containerization", "containers"},
    {"kubernetes", "container orchestration"},
    {"ci/cd", "ci/cd pipelines"},
    {"linux", "linux basics", "bash"},
    {"react", "component ui frameworks"},
    {"fastapi", "web api frameworks"},
    {"database design", "databases (relational vs nosql)", "relational databases"},
    {"cloud basics", "cloud basics (iaas/paas/saas)", "cloud computing"},
    {"cloud architecture", "cloud storage & scaling"},
    {"machine learning", "machine learning basics", "ml", "supervised vs unsupervised learning"},
    {"model validation", "overfitting & train/test split", "cross validation"},
    {"data science", "ml evaluation metrics"},
    {"vector embeddings", "vector search", "semantic & vector search"},
    {"excel & spreadsheet analytics", "excel"},
    {"data visualisation basics", "data visualization"},
    {"business communication (email, reports)", "business communication"},
    {"basic accounting (debit/credit, gst basics)", "basic accounting (debit/credit, gst)", "accounting"},
    {"project management basics (agile, scrum)", "project management (agile, scrum)", "agile", "scrum"},
]


class MatchInput(BaseModel):
    """Strictly forbids protected or extra fields."""
    model_config = ConfigDict(extra="forbid")

    skills: List[str] = Field(default_factory=list)
    role_id: str
    skill_levels: Optional[Dict[str, int]] = None


def load_roles(roles_path: str = ROLES_PATH) -> List[Dict[str, Any]]:
    with open(roles_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data.get("roles", [])


def _expand_skill_tokens(skills: List[str]) -> Set[str]:
    """Expands each user skill with its canonical synonyms/aliases for accurate matching."""
    expanded: Set[str] = set()
    for raw in skills:
        if not raw or not raw.strip():
            continue
        norm = raw.strip().lower()
        expanded.add(norm)
        for grp in SYNONYM_GROUPS:
            if norm in grp:
                expanded.update(grp)
    return expanded


def compute_role_match(
    match_input: MatchInput,
    role: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Computes deterministic match score (0.0 to 1.0) and skill gap list.
    """
    if role is None:
        roles = load_roles()
        role = next((r for r in roles if r["role_id"] == match_input.role_id), None)
        if role is None:
            raise ValueError(f"Role '{match_input.role_id}' not found.")

    user_tokens = _expand_skill_tokens(match_input.skills)
    req_skills = role.get("required_skills", [])
    nice_skills = role.get("nice_to_have_skills", [])

    matched_required = [s for s in req_skills if s.lower() in user_tokens]
    missing_required = [s for s in req_skills if s.lower() not in user_tokens]

    matched_nice = [s for s in nice_skills if s.lower() in user_tokens]
    missing_nice = [s for s in nice_skills if s.lower() not in user_tokens]

    req_ratio = (len(matched_required) / len(req_skills)) if req_skills else 1.0
    nice_ratio = (len(matched_nice) / len(nice_skills)) if nice_skills else 1.0

    raw_score = (req_ratio * REQUIRED_WEIGHT) + (nice_ratio * NICE_WEIGHT)

    # Apply level cap if candidate level is below role min_level
    min_level = int(role.get("min_level", 1))
    levels = match_input.skill_levels or {}
    if levels:
        matched_levels = [
            int(levels.get(s) or levels.get(s.lower()) or 1)
            for s in matched_required
        ]
        candidate_level = max(matched_levels) if matched_levels else 1
    else:
        candidate_level = 1 if match_input.skills else 0

    level_capped = False
    final_score = raw_score
    if candidate_level < min_level and final_score > LEVEL_CAP_MAX_SCORE:
        final_score = LEVEL_CAP_MAX_SCORE
        level_capped = True

    final_score = round(min(max(final_score, 0.0), 1.0), 4)

    return {
        "role_id": role["role_id"],
        "role_title": role["title"],
        "score": final_score,
        "score_percent": round(final_score * 100, 1),
        "required_weight": REQUIRED_WEIGHT,
        "nice_weight": NICE_WEIGHT,
        "level_capped": level_capped,
        "min_level": min_level,
        "candidate_level": candidate_level,
        "matched_skills": matched_required + matched_nice,
        "missing_skills": missing_required + missing_nice,
        "matched_required": matched_required,
        "missing_required": missing_required,
        "matched_nice": matched_nice,
        "missing_nice": missing_nice,
    }
