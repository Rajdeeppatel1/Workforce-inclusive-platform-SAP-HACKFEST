"""
SkillNav Analysis Explanation Engine (Chunk 10)
═══════════════════════════════════════════════
Generates a 3-4 sentence explanation for a role match score.
Rules:
1. Prompt contains ONLY skill names and score (zero PII or protected attributes).
2. "You are suitable" phrase is included ONLY when score >= suitability_threshold (default 0.7).
3. Hallucination guard: if Gemini introduces ANY new number not in the input,
   fall back to a deterministic 3-4 sentence template.
"""

import os
import re
from typing import List, Dict, Any, Optional, Set
from config import settings
from llm import ask_gemini


NUMBER_RE = re.compile(r"\b\d+(?:\.\d+)?\b")


def deterministic_explanation(
    score: float,
    matched_skills: List[str],
    missing_skills: List[str],
    threshold: float,
) -> str:
    pct = round(score * 100, 1)
    matched_str = ", ".join(matched_skills) if matched_skills else "none recorded yet"
    missing_str = ", ".join(missing_skills) if missing_skills else "no major skill gaps"

    if score >= threshold:
        suitability_sentence = (
            f"You are suitable for this role with a verified match score of {pct}%."
        )
    else:
        suitability_sentence = (
            f"Your current match score is {pct}%, which is below the suitability threshold."
        )

    s2 = f"Your confirmed strengths include {matched_str}."
    s3 = f"Key skills to develop next are {missing_str}."
    s4 = "Focus on closing these gaps through practice projects and skill assessments."
    return f"{suitability_sentence} {s2} {s3} {s4}"


def _allowed_numbers(score: float, matched_skills: List[str], missing_skills: List[str]) -> Set[str]:
    pct_1 = round(score * 100, 1)
    pct_int = int(round(score * 100))
    allowed = {
        str(score),
        f"{score:.2f}",
        f"{score:.4f}",
        str(pct_1),
        str(pct_int),
        str(len(matched_skills)),
        str(len(missing_skills)),
    }
    # Also allow stripped trailing .0 forms (e.g. "80" for "80.0")
    if str(pct_1).endswith(".0"):
        allowed.add(str(pct_1)[:-2])
    return allowed


def _has_new_numbers(text: str, allowed: Set[str]) -> bool:
    found = NUMBER_RE.findall(text or "")
    return any(num not in allowed for num in found)


def generate_analysis_explanation(
    score: float,
    matched_skills: List[str],
    missing_skills: List[str],
    client: Any = None,
) -> Dict[str, Any]:
    """
    Produces a 3-4 sentence skills-only explanation.
    Uses Gemini when available; validates output for suitability wording & no hallucinated numbers.
    """
    threshold = float(getattr(settings, "suitability_threshold", 0.7))
    pct = round(score * 100, 1)
    suitable = score >= threshold

    # Prompt strictly contains ONLY skill names and score
    matched_str = ", ".join(matched_skills) if matched_skills else "None"
    missing_str = ", ".join(missing_skills) if missing_skills else "None"

    suitability_instruction = (
        'Include the exact phrase "You are suitable" in your explanation.'
        if suitable
        else 'Do NOT use the phrase "You are suitable" because the score is below the suitability threshold.'
    )

    prompt = (
        "Write a clear, concise 3 to 4 sentence explanation for a candidate's role match.\n"
        "Use ONLY the provided skill names and score. Do not invent any new numbers or percentages.\n"
        f"{suitability_instruction}\n\n"
        f"Match Score: {pct}%\n"
        f"Matched Skills: {matched_str}\n"
        f"Missing Skills (Gaps): {missing_str}\n"
    )

    allowed = _allowed_numbers(score, matched_skills, missing_skills)
    used_fallback = False
    explanation_text = ""

    # Check if key exists when client is not mocked
    api_key = (os.environ.get("GEMINI_API_KEY") or "").strip()
    if client is None and not api_key:
        raise ValueError(
            "GEMINI_API_KEY is missing. Please configure GEMINI_API_KEY in backend/.env or environment variables."
        )

    try:
        raw = ask_gemini(prompt=prompt, schema=None, client=client, strict=True)
        candidate_text = str(raw).strip()
        # Guard 1: Check for any new hallucinated numbers
        if _has_new_numbers(candidate_text, allowed):
            used_fallback = True
            explanation_text = deterministic_explanation(score, matched_skills, missing_skills, threshold)
        # Guard 2: Enforce suitability phrase rule
        elif suitable and "you are suitable" not in candidate_text.lower():
            used_fallback = True
            explanation_text = deterministic_explanation(score, matched_skills, missing_skills, threshold)
        elif (not suitable) and "you are suitable" in candidate_text.lower():
            used_fallback = True
            explanation_text = deterministic_explanation(score, matched_skills, missing_skills, threshold)
        else:
            explanation_text = candidate_text
    except Exception:
        used_fallback = True
        explanation_text = deterministic_explanation(score, matched_skills, missing_skills, threshold)

    return {
        "explanation": explanation_text,
        "suitable": suitable,
        "threshold": threshold,
        "used_deterministic_fallback": used_fallback,
    }
