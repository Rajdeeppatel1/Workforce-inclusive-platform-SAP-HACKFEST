"""
SkillNav Skill Quiz Router
══════════════════════════
Server-graded skill assessments. Answer keys never leave the backend until a
quiz has been submitted, and the pass/fail decision is always computed here.

Endpoints:
- GET  /api/quiz/categories        → all quizzes (metadata only, no questions)
- GET  /api/quiz/{quiz_id}         → questions and options (no answer key)
- POST /api/quiz/{quiz_id}/submit  → grades answers, returns the full result,
                                     and records it on the candidate profile
"""

import json
import os
from datetime import datetime, timezone
from functools import lru_cache
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from routers.auth_profile import load_profile_record, write_profile_record

router = APIRouter(prefix="/api/quiz", tags=["skill-quiz"])

QUIZ_BANK_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "data", "quiz_bank.json")
)

DEFAULT_PASS_MARK = 60.0


@lru_cache(maxsize=1)
def _load_bank() -> Dict[str, Any]:
    with open(QUIZ_BANK_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def _pass_mark() -> float:
    return float(_load_bank().get("pass_mark_percent", DEFAULT_PASS_MARK))


def _quiz_meta(quiz: Dict[str, Any]) -> Dict[str, Any]:
    """Public description of a quiz: never includes questions or answers."""
    return {
        "id": quiz["id"],
        "name": quiz["name"],
        "displayName": quiz["displayName"],
        "group": quiz.get("group", "General"),
        "description": quiz.get("description", ""),
        "status": "live",
        "total_questions": len(quiz["questions"]),
        "estimated_minutes": quiz.get("estimated_minutes", 10),
        "skills_awarded": quiz.get("skills_awarded", [quiz["name"]]),
    }


def list_quiz_metadata() -> List[Dict[str, Any]]:
    return [_quiz_meta(q) for q in _load_bank()["quizzes"]]


def _find_quiz(quiz_id: str) -> Dict[str, Any]:
    wanted = quiz_id.strip().lower()
    for quiz in _load_bank()["quizzes"]:
        if quiz["id"].lower() == wanted or quiz["name"].lower() == wanted:
            return quiz
    raise HTTPException(status_code=404, detail=f"Quiz '{quiz_id}' not found")


@router.get("/categories")
async def get_quiz_categories():
    quizzes = list_quiz_metadata()
    groups: List[str] = []
    for q in quizzes:
        if q["group"] not in groups:
            groups.append(q["group"])
    return {
        "pass_mark_percent": _pass_mark(),
        "count": len(quizzes),
        "groups": groups,
        "quizzes": quizzes,
    }


@router.get("/{quiz_id}")
async def get_quiz(quiz_id: str):
    """Returns the questions for one quiz with the answer key removed."""
    quiz = _find_quiz(quiz_id)
    return {
        **_quiz_meta(quiz),
        "pass_mark_percent": _pass_mark(),
        "questions": [
            {"id": q["id"], "question": q["question"], "options": q["options"]}
            for q in quiz["questions"]
        ],
    }


class QuizSubmission(BaseModel):
    profile_id: Optional[str] = None
    # question id → index of the chosen option. Unanswered questions may be omitted.
    answers: Dict[str, Optional[int]] = Field(default_factory=dict)


def _record_on_profile(
    profile_id: str, quiz: Dict[str, Any], entry: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Upserts the result into the stored profile's quiz_scores and adds the
    verified skill tags when the quiz was passed.
    Returns {saved, save_message, profile, entry, skills_added}.
    """
    profile = load_profile_record(profile_id)
    if profile is None:
        return {
            "saved": False,
            "save_message": "No server profile exists for this ID, so the result was not stored on the server.",
            "profile": None,
            "entry": entry,
            "skills_added": [],
        }

    scores = [s for s in profile.get("quiz_scores") or [] if isinstance(s, dict)]
    previous = next(
        (
            s for s in scores
            if s.get("quiz_id") == quiz["id"] or s.get("category") == quiz["name"]
        ),
        None,
    )

    attempts = int(previous.get("attempts", 1)) + 1 if previous else 1
    prev_best = float(previous.get("best_percentage", previous.get("percentage", 0))) if previous else 0.0
    ever_passed = bool(previous and previous.get("passed"))

    entry = {
        **entry,
        "attempts": attempts,
        "best_percentage": max(prev_best, entry["percentage"]),
        # Once a competency is verified a weaker re-attempt does not revoke it.
        "passed": entry["passed"] or ever_passed,
        "last_attempt_passed": entry["passed"],
    }

    if previous is not None:
        scores[scores.index(previous)] = entry
    else:
        scores.append(entry)
    profile["quiz_scores"] = scores

    skills_added: List[str] = []
    if entry["last_attempt_passed"]:
        skills = list(profile.get("skills") or [])
        known = {s.strip().lower() for s in skills}
        for tag in quiz.get("skills_awarded", [quiz["name"]]):
            if tag.lower() not in known:
                skills.append(tag)
                known.add(tag.lower())
                skills_added.append(tag)
        profile["skills"] = skills

    profile["updated_at"] = entry["completed_at"]

    try:
        write_profile_record(profile_id, profile)
    except OSError as e:
        return {
            "saved": False,
            "save_message": f"The result could not be written to the server profile ({e.__class__.__name__}).",
            "profile": None,
            "entry": entry,
            "skills_added": skills_added,
        }

    return {
        "saved": True,
        "save_message": "Result saved to your profile.",
        "profile": profile,
        "entry": entry,
        "skills_added": skills_added,
    }


@router.post("/{quiz_id}/submit")
async def submit_quiz(quiz_id: str, submission: QuizSubmission):
    """
    Grades the submitted answers on the server and records the result on the
    candidate's profile. The score and pass/fail flag are never taken from the client.
    """
    quiz = _find_quiz(quiz_id)
    questions = quiz["questions"]

    breakdown = []
    score = 0
    for q in questions:
        selected = submission.answers.get(str(q["id"]))
        if selected is not None and not (0 <= selected < len(q["options"])):
            selected = None
        is_correct = selected == q["correctIndex"]
        if is_correct:
            score += 1
        breakdown.append({
            "id": q["id"],
            "question": q["question"],
            "options": q["options"],
            "selected_index": selected,
            "correct_index": q["correctIndex"],
            "is_correct": is_correct,
            "explanation": q.get("explanation", ""),
        })

    total = len(questions)
    percentage = round(score / total * 100, 1) if total else 0.0
    pass_mark = _pass_mark()
    passed = percentage >= pass_mark

    entry = {
        "quiz_id": quiz["id"],
        "category": quiz["name"],
        "display_name": quiz["displayName"],
        "score": score,
        "total": total,
        "percentage": percentage,
        "passed": passed,
        "completed_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
    }

    if submission.profile_id:
        saved = _record_on_profile(submission.profile_id, quiz, entry)
    else:
        saved = {
            "saved": False,
            "save_message": "No profile ID was supplied, so the result was not stored.",
            "profile": None,
            "entry": entry,
            "skills_added": [],
        }

    return {
        "quiz_id": quiz["id"],
        "category": quiz["name"],
        "display_name": quiz["displayName"],
        "score": score,
        "total": total,
        "percentage": percentage,
        "pass_mark_percent": pass_mark,
        "passed": passed,
        "completed_at": entry["completed_at"],
        "breakdown": breakdown,
        "skills_awarded": quiz.get("skills_awarded", [quiz["name"]]) if passed else [],
        "skills_added": saved["skills_added"],
        "profile_entry": saved["entry"],
        "saved": saved["saved"],
        "save_message": saved["save_message"],
        "quiz_scores": saved["profile"]["quiz_scores"] if saved["profile"] else None,
    }
