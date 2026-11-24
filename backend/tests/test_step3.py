"""
Unit Tests for Step 3: SAP Generative AI Hub Services
"""

import sys
import os

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from services.sap_genai import (
    generate_skill_embedding,
    analyze_jd_bias,
    extract_certificate_skills,
    generate_why_this_score
)
from fastapi.testclient import TestClient
from main import app


def test_embedding_generation():
    print("Testing generate_skill_embedding()...")
    vec = generate_skill_embedding("Python, FastAPI, SAP BTP, Vector Search")
    assert len(vec) == 1536
    # Check normalization
    import numpy as np
    norm = np.linalg.norm(vec)
    assert abs(norm - 1.0) < 1e-3
    print("✓ generate_skill_embedding passed (1536-dim unit vector).")


def test_jd_bias_analysis():
    print("Testing analyze_jd_bias()...")
    biased_jd = """
    Looking for a young, energetic rockstar developer to crush it in our fast-paced startup.
    Must have a B.Tech mandatory from Tier-1 college (IIT/NIT only).
    Digital native with strong manpower management skills.
    """
    res = analyze_jd_bias(biased_jd)
    assert res["inclusion_score"] < 70
    assert len(res["flags"]) >= 3
    
    categories = {f["category"] for f in res["flags"]}
    assert "age" in categories
    assert "gender" in categories
    assert "pedigree" in categories
    
    assert "Tier-1" not in res["rewritten_jd"]
    assert "rockstar" not in res["rewritten_jd"].lower()
    print(f"✓ analyze_jd_bias passed (Score: {res['inclusion_score']}/100, Flags: {len(res['flags'])}).")


def test_certificate_ocr_extraction():
    print("Testing extract_certificate_skills()...")
    ocr_sample = """
    Coursera Verified Certificate
    This is to certify that Rahul Sharma has successfully completed
    Specialization in Python for Everybody and REST APIs
    Date: October 2024
    """
    cert_res = extract_certificate_skills(ocr_sample)
    assert cert_res["issuer"] == "Coursera"
    assert "Python" in cert_res["skills"] or "REST APIs" in [s.upper() for s in cert_res["skills"]]
    assert cert_res["status"] == "Verified"
    print(f"✓ extract_certificate_skills passed (Issuer: {cert_res['issuer']}, Skills: {cert_res['skills']}).")


def test_why_this_score():
    print("Testing generate_why_this_score()...")
    expl = generate_why_this_score(
        matched=["Python", "FastAPI", "Docker"],
        missing=["SAP BTP", "HANA Vector"]
    )
    assert len(expl.split(".")) >= 2
    assert "Python" in expl
    print(f"✓ generate_why_this_score passed: '{expl}'")


def test_api_endpoints():
    print("Testing API endpoints via TestClient...")
    client = TestClient(app)

    # Test JD Bias Check
    jd_resp = client.post("/api/jd/check-bias", json={"jd_text": "Looking for young energetic developer with Tier-1 degree."})
    assert jd_resp.status_code == 200
    assert jd_resp.json()["inclusion_score"] < 80

    # Test Credentials Extraction
    cred_resp = client.post("/api/credentials/extract", json={"raw_text": "AWS Certified Solutions Architect Associate 2023 with Docker and Kubernetes skills."})
    assert cred_resp.status_code == 200
    assert cred_resp.json()["issuer"] == "AWS"

    # Test Explain Score
    exp_resp = client.post("/api/explain-score", json={"matched_skills": ["React"], "missing_skills": ["TypeScript"]})
    assert exp_resp.status_code == 200
    assert "React" in exp_resp.json()["explanation"]

    print("✓ All Step 3 API endpoints returned 200 OK.")


if __name__ == "__main__":
    test_embedding_generation()
    test_jd_bias_analysis()
    test_certificate_ocr_extraction()
    test_why_this_score()
    test_api_endpoints()
    print("\n🎉 ALL STEP 3 TESTS PASSED!")
