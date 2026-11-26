"""
Comprehensive End-to-End System Test Suite for SkillNav
Tests all routers, AI endpoints, fairness audits, voice intents, and database queries.
"""

import sys
import os

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi.testclient import TestClient
from main import app
from llm import ask_gemini
from pydantic import BaseModel
from typing import List, Optional

client = TestClient(app)

def test_1_health_and_sap():
    print("\n--- 1. Testing Health & SAP Connectivity ---")
    r = client.get("/api/health")
    assert r.status_code == 200, f"Health check failed: {r.text}"
    assert r.json()["status"] == "healthy"
    print("  ✓ /api/health OK")

    r = client.get("/api/sap/status")
    assert r.status_code == 200, f"SAP status failed: {r.text}"
    data = r.json()
    assert "hana" in data
    assert "aicore" in data
    assert "mode" in data
    print(f"  ✓ /api/sap/status OK (HANA: {data['hana']['connected']}, AI Core: {data['aicore']['configured']}, Mode: {data['mode']})")

def test_2_fresher_catalog_and_profiles():
    print("\n--- 2. Testing Fresher Catalog & Profiles ---")
    r = client.get("/api/fresher/catalog")
    assert r.status_code == 200, f"Catalog failed: {r.text}"
    cat = r.json()
    assert "official_portals" in cat and len(cat["official_portals"]) > 0
    assert "dsa_platforms" in cat and len(cat["dsa_platforms"]) > 0
    assert "youtube_creators" in cat and len(cat["youtube_creators"]) > 0
    assert "aiml_platforms" in cat and len(cat["aiml_platforms"]) > 0
    assert "practice_platforms" in cat and len(cat["practice_platforms"]) > 0
    print(f"  ✓ /api/fresher/catalog OK: {len(cat['official_portals'])} portals, {len(cat['dsa_platforms'])} DSA, {len(cat['youtube_creators'])} creators")

    # Mock Login
    r = client.post("/api/login/mock?profile_id=seed_priya_sharma_01")
    assert r.status_code == 200, f"Mock login failed: {r.text}"
    login_data = r.json()
    assert "profile_id" in login_data
    profile_id = login_data["profile_id"]
    print(f"  ✓ /api/login/mock OK: logged in as {login_data['name']} ({profile_id})")

    # Get single profile
    r = client.get(f"/api/profile?profile_id={profile_id}")
    assert r.status_code == 200, f"Single profile failed: {r.text}"
    p_data = r.json()
    assert p_data["profile_id"] == profile_id
    print(f"  ✓ /api/profile?profile_id={profile_id} OK")

    # Update consent
    r = client.post("/api/consent", json={"profile_id": profile_id, "consent": True})
    assert r.status_code == 200
    print(f"  ✓ /api/consent OK")

def test_3_fresher_quiz_and_badges():
    print("\n--- 3. Testing Server-Graded Skill Quiz ---")
    r = client.get("/api/quiz/python")
    assert r.status_code == 200, f"Quiz load failed: {r.text}"
    assert len(r.json()["questions"]) == 5

    r = client.post(
        "/api/quiz/python/submit",
        json={"profile_id": "seed_priya_sharma_01", "answers": {}},
    )
    assert r.status_code == 200, f"Quiz submit failed: {r.text}"
    result = r.json()
    assert result["score"] == 0 and result["passed"] is False
    assert result["saved"] is True
    print(f"  ✓ /api/quiz/python/submit OK: {result['score']}/{result['total']} saved = {result['saved']}")

def test_4_blind_matching_and_explain():
    print("\n--- 4. Testing Blind Matching & Explainability ---")
    match_payload = {
        "profile": {
            "name": "Priya Sharma",
            "gender": "Female",
            "age": 27,
            "college_name": "State Rural Engineering College",
            "college_tier": "Tier-3",
            "location": "Bhopal, MP",
            "skills": ["python", "fastapi", "react", "sql", "docker"],
            "alternative_evidence": [
                {
                    "category": "github",
                    "title": "Inclusive Microservice App",
                    "skills_demonstrated": ["python", "fastapi", "docker"]
                }
            ]
        }
    }
    r = client.post("/api/match/analyze", json=match_payload)
    assert r.status_code == 200, f"Match analyze failed: {r.text}"
    match_data = r.json()
    assert "match_score" in match_data
    assert "why_this_score" in match_data
    assert match_data["is_blind_certified"] is True
    print(f"  ✓ /api/match/analyze OK: score={match_data['match_score']}%, job='{match_data.get('job_title')}'")

    # Vector job matches
    r = client.post("/api/matches", json=match_payload["profile"])
    assert r.status_code == 200, f"Matches failed: {r.text}"
    matches_list = r.json()
    assert len(matches_list) > 0
    print(f"  ✓ /api/matches OK: returned {len(matches_list)} matched jobs")

    # Explain score
    r = client.post("/api/explain-score", json={
        "matched_skills": ["python", "fastapi"],
        "missing_skills": ["sap btp"],
        "weak_evidence": ["sql"]
    })
    assert r.status_code == 200
    print(f"  ✓ /api/explain-score OK")

def test_5_counterfactual_fairness():
    print("\n--- 5. Testing Counterfactual Fairness & Naive Toggle ---")
    payload = {
        "skills": ["python", "fastapi", "docker", "sql"],
        "alternative_evidence": [
            {
                "category": "github",
                "title": "Microservices Repository",
                "skills_demonstrated": ["python", "docker"]
            }
        ],
        "use_naive_matcher": False
    }
    r = client.post("/api/fairness/counterfactual-test", json=payload)
    assert r.status_code == 200, f"Counterfactual test failed: {r.text}"
    res = r.json()
    assert res["status"] in ("PASS", "PASSED"), f"Expected PASS in fair mode, got {res['status']}"
    assert res["certified_fair"] is True
    assert res["max_deviation_percent"] <= 1.0
    print(f"  ✓ Fair Counterfactual Parity OK: {res['status']} ({res['max_deviation_percent']}% variance)")

    # Naive matcher toggle
    payload["use_naive_matcher"] = True
    r = client.post("/api/fairness/counterfactual-test", json=payload)
    assert r.status_code == 200
    res_naive = r.json()
    assert res_naive["status"] == "FAIL"
    assert res_naive["max_deviation_percent"] > 10.0
    print(f"  ✓ Naive Matcher Toggle OK: {res_naive['status']} ({res_naive['max_deviation_percent']}% variance)")

    # SAP Build Appeal Challenge
    challenge_payload = {
        "profileId": "seed_priya_sharma_01",
        "challengedItem": "Missing Skill: Docker",
        "reason": "I have 3 GitHub repos with production Dockerfiles.",
        "additionalEvidenceUrl": "https://github.com/priyasharma/docker-microservices"
    }
    r = client.post("/api/fairness/challenge", json=challenge_payload)
    assert r.status_code == 200, f"Challenge failed: {r.text}"
    chal_res = r.json()
    assert "case_id" in chal_res
    print(f"  ✓ /api/fairness/challenge OK: case_id = {chal_res['case_id']}")

    # Appeal Queue
    r = client.get("/api/fairness/appeal-queue")
    assert r.status_code == 200
    q_data = r.json()
    assert "total_queued" in q_data
    print(f"  ✓ /api/fairness/appeal-queue OK (Total queued: {q_data['total_queued']})")

def test_6_evidence_and_mentors():
    print("\n--- 6. Testing Role Validation, Mock OCR & Mentors ---")
    r = client.get("/api/roles")
    assert r.status_code == 200
    roles_data = r.json()
    roles = roles_data.get("roles", [])
    assert len(roles) > 0
    print(f"  ✓ /api/roles OK: {len(roles)} roles found")

    # Mock OCR
    r = client.post("/api/credentials/mock-ocr", json={"filename": "certificate_python_fastapi.pdf"})
    assert r.status_code == 200
    ocr_data = r.json()
    assert len(ocr_data.get("skills", [])) > 0
    print(f"  ✓ /api/credentials/mock-ocr OK: extracted {ocr_data['skills']}")

    # Roles validate
    role_id = roles[0].get("role_id", "role-01")
    r = client.post("/api/roles/validate", json={
        "skills": ["python", "fastapi", "docker"],
        "role_id": role_id
    })
    assert r.status_code == 200
    print(f"  ✓ /api/roles/validate OK")

    # Mentors list
    r = client.get("/api/mentors")
    assert r.status_code == 200
    mentors_data = r.json()
    mentors = mentors_data.get("mentors", [])
    assert len(mentors) > 0
    print(f"  ✓ /api/mentors OK: {len(mentors)} mentors found")

    # Doubt summarizer
    r = client.post("/api/mentors/summarize-doubt", json={"doubt_text": "I am struggling with Docker networking and bridging."})
    assert r.status_code == 200, f"Doubt summarization failed: {r.text}"
    doubt_res = r.json()
    assert "summary" in doubt_res
    print(f"  ✓ /api/mentors/summarize-doubt OK: '{doubt_res['summary'][:60]}...'")

    # Book mentor
    r = client.post("/api/mentors/book", json={
        "mentor_id": mentors[0]["mentor_id"],
        "mentor_naam": mentors[0]["name"],
        "slot": "Tomorrow at 4:00 PM IST",
        "draft_message": "Docker network bridging issue"
    })
    assert r.status_code == 200, f"Book mentor failed: {r.text}"
    book_res = r.json()
    assert book_res.get("status") == "confirmed_simulation"
    print(f"  ✓ /api/mentors/book OK: booking_reference = {book_res.get('booking_reference')}")

def test_7_voice_assistant_and_actions():
    print("\n--- 7. Testing Voice Intent & Actions ---")
    r = client.get("/api/voice/actions")
    assert r.status_code == 200, f"Voice actions failed: {r.text}"
    actions_data = r.json()
    assert "allowed_actions" in actions_data and len(actions_data["allowed_actions"]) > 0
    print(f"  ✓ /api/voice/actions OK: {len(actions_data['allowed_actions'])} actions supported")

    # Intent mapping
    for phrase in ["test kholo", "trending skills suno", "prepare page", "dashboard dikhao", "evidence kholo"]:
        r = client.post("/api/voice/intent", json={"command": phrase})
        assert r.status_code == 200, f"Voice intent failed for '{phrase}': {r.text}"
        data = r.json()
        assert "action" in data
        assert data["allowed"] is True
        print(f"  ✓ /api/voice/intent for '{phrase}' -> action='{data['action']}', route='{data.get('route')}'")

def test_8_ask_gemini_llm():
    print("\n--- 8. Testing ask_gemini LLM Function ---")
    class TestResponse(BaseModel):
        summary: str
        confidence: float
        topics: List[str]

    res = ask_gemini(
        prompt="Analyze the skill profile with Python and FastAPI for an engineering role.",
        schema=TestResponse
    )
    assert res is not None
    assert isinstance(res, TestResponse)
    assert len(res.summary) > 0
    print(f"  ✓ ask_gemini OK: {res.summary[:80]}... (Confidence: {res.confidence})")

if __name__ == "__main__":
    print("=" * 60)
    print("RUNNING COMPLETE SKILLNAV AUTOMATED TEST SUITE")
    print("=" * 60)
    try:
        test_1_health_and_sap()
        test_2_fresher_catalog_and_profiles()
        test_3_fresher_quiz_and_badges()
        test_4_blind_matching_and_explain()
        test_5_counterfactual_fairness()
        test_6_evidence_and_mentors()
        test_7_voice_assistant_and_actions()
        test_8_ask_gemini_llm()
        print("\n" + "=" * 60)
        print("🎉 ALL 8 TEST SUITES COMPLETED SUCCESSFULLY WITH ZERO ERRORS!")
        print("=" * 60)
    except Exception as e:
        import traceback
        traceback.print_exc()
        sys.exit(1)
