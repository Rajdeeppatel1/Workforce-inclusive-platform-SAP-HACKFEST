"""
Unit Tests for Step 4: Fairness, Counterfactual Parity & SAP Build Appeal
"""

import sys
import os

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi.testclient import TestClient
from main import app
from services.sap_build_appeal import trigger_sap_build_appeal, get_appeal_queue_status


def test_match_analyze_endpoint():
    print("Testing POST /api/match/analyze...")
    client = TestClient(app)

    payload = {
        "profile": {
            "name": "Pooja Verma",
            "gender": "Female",
            "age": 29,
            "college_name": "Regional State Institute",
            "college_tier": "Tier-3",
            "location": "Bhopal, MP",
            "skills": ["python", "fastapi", "docker", "sql", "rest apis"],
            "alternative_evidence": [
                {
                    "category": "github",
                    "title": "FastAPI Cloud Microservice",
                    "skills_demonstrated": ["python", "fastapi", "docker"]
                }
            ]
        }
    }

    resp = client.post("/api/match/analyze", json=payload)
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.text}"
    data = resp.json()

    # Verify score, matched skills, missing skills, weak evidence, why_this_score
    assert "match_score" in data
    assert "matched_skills" in data
    assert "missing_skills" in data
    assert "weak_evidence" in data
    assert "why_this_score" in data
    assert data["is_blind_certified"] is True
    assert set(data["stripped_attributes"]) == {"name", "gender", "age", "college_name", "college_tier", "location"}

    print(f"✓ /api/match/analyze passed (Score: {data['match_score']}%, Matched: {data['matched_skills']})")
    print(f"  Explanation: {data['why_this_score']}")


def test_counterfactual_test_endpoint():
    print("Testing POST /api/fairness/counterfactual-test...")
    client = TestClient(app)

    payload = {
        "skills": ["python", "fastapi", "docker", "rest apis"],
        "alternative_evidence": [
            {
                "category": "freelance",
                "title": "Client Inventory App",
                "skills_demonstrated": ["python", "docker"]
            }
        ]
    }

    resp = client.post("/api/fairness/counterfactual-test", json=payload)
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.text}"
    data = resp.json()

    assert data["status"] in ("PASS", "PASSED")
    assert data["certified_fair"] is True
    assert data["max_deviation_percent"] <= 1.0

    identities = {id_res["identity_name"]: id_res["match_score"] for id_res in data["identities_tested"]}
    assert len(identities) == 3

    # Verify exact parity
    scores = list(identities.values())
    assert scores[0] == scores[1] == scores[2], f"All scores must be identical: {scores}"

    # Also test naive biased matcher toggle
    resp_naive = client.post("/api/fairness/counterfactual-test", json={**payload, "use_naive_matcher": True})
    assert resp_naive.status_code == 200
    naive_data = resp_naive.json()
    assert naive_data["status"] == "FAIL"
    assert naive_data["max_deviation_percent"] > 10.0

    print(f"✓ Counterfactual Parity verified across all 3 identities: {identities} (Status: {data['status']})")
    print(f"✓ Naive Matcher Toggle verified: status={naive_data['status']}, max_deviation={naive_data['max_deviation_percent']}%")


def test_sap_build_appeal_endpoint():
    print("Testing POST /api/fairness/challenge (SAP Build Appeal)...")
    client = TestClient(app)

    payload = {
        "profileId": "anon_test_user_789",
        "challengedItem": "Missing Skill: Docker Containerization",
        "reason": "I have 3 production Docker repositories on GitHub that demonstrate full mastery.",
        "additionalEvidenceUrl": "https://github.com/my-profile/production-docker-demo"
    }

    resp = client.post("/api/fairness/challenge", json=payload)
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.text}"
    data = resp.json()

    assert "case_id" in data
    assert data["case_id"].startswith("SAP-BUILD-")
    assert data["workflow_definition_id"] == "skillnav.appeal.review"
    assert data["profile_id"] == "anon_test_user_789"
    assert "status" in data

    # Verify queue status
    queue_status = get_appeal_queue_status()
    assert queue_status["total_queued"] >= 1

    print(f"✓ SAP Build Appeal passed: generated case_id '{data['case_id']}' (Target: {data['target_engine']})")


if __name__ == "__main__":
    test_match_analyze_endpoint()
    test_counterfactual_test_endpoint()
    test_sap_build_appeal_endpoint()
    print("\n🎉 ALL STEP 4 TESTS PASSED!")
