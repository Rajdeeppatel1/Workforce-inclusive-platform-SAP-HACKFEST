"""
Unit Tests for Step 2: Blind Matching & Counterfactual Fairness
"""

import sys
import os

# Ensure backend root is in sys.path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from models.schemas import RawCandidateProfile, AlternativeEvidence
from services.blind_matcher import strip_protected_attributes, compute_alternative_evidence_boost
from db.hana_vector import init_hana_tables, vector_match_jobs, python_cosine_similarity


def test_strip_protected_attributes():
    print("Testing strip_protected_attributes()...")
    raw = RawCandidateProfile(
        name="Priya Sharma",
        gender="Female",
        age=27,
        location="Indore, MP",
        college_name="Indore Institute of Science & Technology",
        college_tier="Tier-3",
        skills=["Python", "FastAPI", "React", "SQL"],
        alternative_evidence=[
            AlternativeEvidence(
                category="github",
                title="Fullstack Microservices Demo",
                skills_demonstrated=["python", "fastapi", "docker"]
            )
        ]
    )

    sanitized = strip_protected_attributes(raw)
    sanitized_dict = sanitized.model_dump()

    # Verify banned keys do not exist in sanitized model
    assert "name" not in sanitized_dict
    assert "gender" not in sanitized_dict
    assert "age" not in sanitized_dict
    assert "location" not in sanitized_dict
    assert "college_name" not in sanitized_dict
    assert "college_tier" not in sanitized_dict

    # Verify stripped attributes are properly logged
    expected_stripped = {"name", "gender", "age", "location", "college_name", "college_tier"}
    assert set(sanitized.stripped_attributes) == expected_stripped

    # Skills preserved & normalized
    assert "FastAPI" in sanitized.skills or "fastapi" in [s.lower() for s in sanitized.skills]
    assert sanitized.evidence_count == 1
    print("✓ strip_protected_attributes passed.")


def test_alternative_evidence_boost():
    print("Testing compute_alternative_evidence_boost()...")
    evidence = [
        AlternativeEvidence(category="github", title="Repo 1", skills_demonstrated=["python", "docker"]),
        AlternativeEvidence(category="freelance", title="Client Project", skills_demonstrated=["react", "tailwind css"])
    ]
    boost = compute_alternative_evidence_boost(evidence)
    assert 5.0 <= boost <= 25.0
    print(f"✓ compute_alternative_evidence_boost passed (computed boost: {boost}%).")


def test_vector_matching_and_counterfactual():
    print("Testing vector matching and counterfactual stability...")
    init_res = init_hana_tables()
    print(f"  HANA init status: {init_res.get('status')}")

    skills = ["Python", "FastAPI", "Docker", "REST APIs", "SQL"]

    # Candidate 1: Tier-1 Male
    cand1 = RawCandidateProfile(
        name="Arjun Kapoor",
        gender="Male",
        college_name="IIT Delhi",
        college_tier="Tier-1",
        location="Delhi",
        skills=skills
    )

    # Candidate 2: Tier-3 Female from non-metro
    cand2 = RawCandidateProfile(
        name="Sunita Yadav",
        gender="Female",
        college_name="Bhopal Rural Engg College",
        college_tier="Tier-3",
        location="Bhopal",
        skills=skills
    )

    s1 = strip_protected_attributes(cand1)
    s2 = strip_protected_attributes(cand2)

    m1 = vector_match_jobs(candidate_skills=s1.skills)
    m2 = vector_match_jobs(candidate_skills=s2.skills)

    assert len(m1) > 0
    assert len(m2) > 0

    score1 = m1[0].match_score
    score2 = m2[0].match_score

    print(f"  Candidate 1 (Tier-1 Male) Top Score: {score1}")
    print(f"  Candidate 2 (Tier-3 Female) Top Score: {score2}")

    delta = abs(score1 - score2)
    assert delta == 0.0, f"Score delta must be 0.0! Got {delta}"
    print("✓ Counterfactual fairness passed: exactly 0.0% variance!")


if __name__ == "__main__":
    test_strip_protected_attributes()
    test_alternative_evidence_boost()
    test_vector_matching_and_counterfactual()
    print("\n🎉 ALL STEP 2 TESTS PASSED!")
