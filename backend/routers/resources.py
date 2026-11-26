"""
SkillNav Learning Resources Router
══════════════════════════════════
Serves curated vendor, DSA, educator, and AI/ML learning platforms from backend/data/resources.json.
"""

from fastapi import APIRouter, HTTPException
import json
import os
from typing import List, Optional

router = APIRouter(prefix="/api/resources", tags=["learning-resources"])

RESOURCES_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "data", "resources.json")
)

@router.get("")
@router.get("/")
async def get_resources(
    category: Optional[str] = None,
    level: Optional[str] = None,
    skill: Optional[str] = None
):
    """
    Returns verified external learning resources.
    Filterable by category (vendor, dsa, educators, aiml), level, or skill.
    """
    if not os.path.exists(RESOURCES_PATH):
        raise HTTPException(status_code=404, detail="Resources not found")

    try:
        with open(RESOURCES_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read resources: {str(e)}")

    if category and category.lower() != "all":
        data = [r for r in data if r.get("category", "").lower() == category.lower()]

    if level and level.lower() != "all":
        data = [r for r in data if r.get("level", "").lower() == level.lower()]

    if skill and skill.strip():
        s_lower = skill.strip().lower()
        data = [
            r for r in data
            if any(s_lower in s.lower() for s in r.get("skills", []))
            or s_lower in r.get("title", "").lower()
        ]

    return data
