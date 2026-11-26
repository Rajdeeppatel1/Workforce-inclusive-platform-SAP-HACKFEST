"""
Tests for the server-graded skill quiz module (routers/quiz.py).
"""

import json
import os

from fastapi.testclient import TestClient

from main import app
from routers.quiz import QUIZ_BANK_PATH

client = TestClient(app)

PROFILE_ID = "seed_rajdeep_patel_01"

with open(QUIZ_BANK_PATH, "r", encoding="utf-8") as _f:
    BANK = json.load(_f)["quizzes"]


def _answers(quiz, correct_count):
    """Answers the first `correct_count` questions correctly and the rest wrongly."""
    answers = {}
    for i, q in enumerate(quiz["questions"]):
        right = q["correctIndex"]
        answers[str(q["id"])] = right if i < correct_count else (right + 1) % len(q["options"])
    return answers


def _quiz(quiz_id):
    return next(q for q in BANK if q["id"] == quiz_id)


def test_bank_is_well_formed():
    ids = [q["id"] for q in BANK]
    assert len(ids) == len(set(ids)), "quiz ids must be unique"
    names = [q["name"] for q in BANK]
    assert len(names) == len(set(names)), "quiz names must be unique"
    for quiz in BANK:
        assert len(quiz["questions"]) >= 5, quiz["id"]
        assert quiz["skills_awarded"], quiz["id"]
        q_ids = [q["id"] for q in quiz["questions"]]
        assert len(q_ids) == len(set(q_ids)), quiz["id"]
        for q in quiz["questions"]:
            assert len(q["options"]) == 4, (quiz["id"], q["id"])
            assert len(set(q["options"])) == 4, (quiz["id"], q["id"])
            assert 0 <= q["correctIndex"] < 4, (quiz["id"], q["id"])
            assert q["explanation"].strip(), (quiz["id"], q["id"])


def test_every_app_skill_has_a_quiz():
    data_dir = os.path.dirname(QUIZ_BANK_PATH)
    with open(os.path.join(data_dir, "fresher_catalog.json"), encoding="utf-8") as f:
        catalog = json.load(f)
    with open(os.path.join(data_dir, "roles.json"), encoding="utf-8") as f:
        roles = json.load(f)["roles"]

    wanted = set(catalog["skills"])
    wanted |= {t["name"] for t in catalog["trending_skills"]}
    for role in roles:
        wanted |= set(role["required_skills"])

    covered = {tag.lower() for quiz in BANK for tag in quiz["skills_awarded"]}
    missing = sorted(s for s in wanted if s.lower() not in covered)
    assert not missing, f"No quiz awards these skills: {missing}"


def test_categories_lists_all_quizzes_without_questions():
    r = client.get("/api/quiz/categories")
    assert r.status_code == 200
    data = r.json()
    assert data["count"] == len(BANK)
    assert all(q["status"] == "live" for q in data["quizzes"])
    assert "correctIndex" not in r.text and '"questions"' not in r.text


def test_answer_key_is_never_sent_before_submission():
    for quiz in BANK:
        r = client.get(f"/api/quiz/{quiz['id']}")
        assert r.status_code == 200, quiz["id"]
        assert len(r.json()["questions"]) == len(quiz["questions"])
        for q in r.json()["questions"]:
            assert "correctIndex" not in q and "explanation" not in q

    catalog = client.get("/api/fresher/catalog")
    assert catalog.status_code == 200
    assert len(catalog.json()["test_categories"]) == len(BANK)
    assert "correctIndex" not in catalog.text


def test_unknown_quiz_returns_404():
    assert client.get("/api/quiz/does-not-exist").status_code == 404
    assert client.post("/api/quiz/does-not-exist/submit", json={"answers": {}}).status_code == 404


def test_every_quiz_grades_a_perfect_and_a_failing_attempt():
    for quiz in BANK:
        total = len(quiz["questions"])
        r = client.post(f"/api/quiz/{quiz['id']}/submit", json={"answers": _answers(quiz, total)})
        assert r.status_code == 200, quiz["id"]
        res = r.json()
        assert (res["score"], res["percentage"], res["passed"]) == (total, 100.0, True), quiz["id"]
        assert res["saved"] is False  # no profile id supplied

        r = client.post(f"/api/quiz/{quiz['id']}/submit", json={"answers": _answers(quiz, 0)})
        res = r.json()
        assert (res["score"], res["passed"]) == (0, False), quiz["id"]
        assert all(not b["is_correct"] for b in res["breakdown"])


def test_pass_mark_is_sixty_percent():
    quiz = _quiz("sql")
    assert client.post("/api/quiz/sql/submit", json={"answers": _answers(quiz, 3)}).json()["passed"] is True
    assert client.post("/api/quiz/sql/submit", json={"answers": _answers(quiz, 2)}).json()["passed"] is False


def test_unanswered_and_invalid_answers_count_as_wrong():
    r = client.post("/api/quiz/git/submit", json={"answers": {"1": 99, "2": -1, "3": None, "999": 0}})
    assert r.status_code == 200
    res = r.json()
    assert res["score"] == 0
    assert all(b["selected_index"] is None for b in res["breakdown"])


def test_client_cannot_dictate_the_score():
    quiz = _quiz("kubernetes")
    r = client.post(
        "/api/quiz/kubernetes/submit",
        json={"answers": _answers(quiz, 0), "score": 5, "passed": True, "percentage": 100},
    )
    res = r.json()
    assert res["score"] == 0 and res["passed"] is False
    # The old endpoint that trusted a client-supplied score is gone.
    old = client.post(
        "/api/profile/quiz-score",
        json={"profile_id": PROFILE_ID, "category": "Kubernetes", "score": 5, "total": 5, "passed": True},
    )
    assert old.status_code in (404, 405)


def test_result_is_saved_to_profile_and_skill_is_added():
    client.post("/api/login/mock", params={"profile_id": PROFILE_ID})
    before = client.get("/api/profile", params={"profile_id": PROFILE_ID}).json()
    assert "Kubernetes" not in before["skills"]

    quiz = _quiz("kubernetes")
    res = client.post(
        "/api/quiz/kubernetes/submit",
        json={"profile_id": PROFILE_ID, "answers": _answers(quiz, 4)},
    ).json()
    assert res["saved"] is True
    assert res["skills_added"] == ["Kubernetes"]
    assert res["profile_entry"]["attempts"] == 1

    after = client.get("/api/profile", params={"profile_id": PROFILE_ID}).json()
    assert "Kubernetes" in after["skills"]
    entry = next(s for s in after["quiz_scores"] if s["quiz_id"] == "kubernetes")
    assert (entry["score"], entry["total"], entry["percentage"], entry["passed"]) == (4, 5, 80.0, True)


def test_failed_attempt_is_recorded_but_awards_no_skill():
    quiz = _quiz("sap-hana")
    res = client.post(
        "/api/quiz/sap-hana/submit",
        json={"profile_id": PROFILE_ID, "answers": _answers(quiz, 1)},
    ).json()
    assert res["saved"] is True and res["passed"] is False and res["skills_added"] == []

    profile = client.get("/api/profile", params={"profile_id": PROFILE_ID}).json()
    assert "SAP HANA" not in profile["skills"]
    entry = next(s for s in profile["quiz_scores"] if s["quiz_id"] == "sap-hana")
    assert entry["passed"] is False and entry["percentage"] == 20.0


def test_reattempts_update_one_entry_and_keep_the_best_score():
    quiz = _quiz("linux")
    for correct in (5, 1):
        client.post("/api/quiz/linux/submit", json={"profile_id": PROFILE_ID, "answers": _answers(quiz, correct)})

    profile = client.get("/api/profile", params={"profile_id": PROFILE_ID}).json()
    entries = [s for s in profile["quiz_scores"] if s["quiz_id"] == "linux"]
    assert len(entries) == 1
    entry = entries[0]
    assert entry["attempts"] == 2
    assert entry["percentage"] == 20.0 and entry["best_percentage"] == 100.0
    assert entry["passed"] is True and entry["last_attempt_passed"] is False
    assert "Linux" in profile["skills"]


def test_profile_save_cannot_forge_or_erase_quiz_results():
    profile = client.get("/api/profile", params={"profile_id": PROFILE_ID}).json()
    real = profile["quiz_scores"]
    assert real

    profile["quiz_scores"] = [{
        "category": "SAP BTP", "quiz_id": "sap-btp", "score": 5, "total": 5,
        "percentage": 100.0, "passed": True,
    }]
    assert client.post("/api/profile", json=profile).status_code == 200

    stored = client.get("/api/profile", params={"profile_id": PROFILE_ID}).json()
    assert stored["quiz_scores"] == real


def test_unknown_profile_gets_a_result_but_nothing_is_stored():
    quiz = _quiz("react")
    res = client.post(
        "/api/quiz/react/submit",
        json={"profile_id": "nobody_here_123", "answers": _answers(quiz, 5)},
    ).json()
    assert res["score"] == 5 and res["passed"] is True
    assert res["saved"] is False

    from routers.auth_profile import PROFILES_DIR
    assert not os.path.exists(os.path.join(PROFILES_DIR, "nobody_here_123.json"))
