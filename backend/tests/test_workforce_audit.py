"""
Tests for the Workforce Equity Audit (services/workforce_audit.py, routers/workforce.py).
"""

import os

import pytest
from fastapi.testclient import TestClient

from main import app
from services.workforce_audit import AuditInputError, audit_workforce

client = TestClient(app)

HEADER = "employee_id,role,skill_score,performance_rating,promoted_last_cycle,annual_salary,gender,career_gap"
SAMPLE_CSV = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "public", "workforce_sample.csv")
)


def _csv(rows):
    return "\n".join([HEADER] + [",".join(str(v) for v in r) for r in rows])


def _fair_rows(n_per_group=8):
    """Identical skills, ratings, pay and promotions across every gender/career_gap group."""
    rows = []
    i = 0
    for gender in ("female", "male"):
        for gap in ("no", "yes"):
            for k in range(n_per_group):
                i += 1
                promoted = "yes" if k % 4 == 0 else "no"
                rows.append([f"E{i}", "Backend Engineer", 80, 4, promoted, 1200000, gender, gap])
    return rows


def _attr(result, name):
    return next(a for a in result["attributes"] if a["attribute"] == name)


def _check(attr, metric):
    return next(c for c in attr["checks"] if c["metric"] == metric)


def test_fair_workforce_passes_every_check():
    result = audit_workforce(_csv(_fair_rows()))

    assert result["employee_count"] == 32
    assert result["overall_status"] == "PASS"
    assert {a["attribute"] for a in result["attributes"]} == {"gender", "career_gap"}
    assert result["pay_review"] == []


def test_same_skill_lower_pay_for_women_fails_pay_gap_and_flags_employees():
    rows = _fair_rows()
    rows = [r[:5] + [960000 if r[6] == "female" else r[5]] + r[6:] for r in rows]

    result = audit_workforce(_csv(rows))
    pay = _check(_attr(result, "gender"), "adjusted_pay_gap")

    assert pay["status"] == "FAIL"
    assert pay["value"] == pytest.approx(20.0, abs=0.1)
    assert result["overall_status"] == "FAIL"
    flagged = {p["employee_id"] for p in result["pay_review"]}
    female_ids = {r[0] for r in rows if r[6] == "female"}
    assert flagged == female_ids
    assert all("gender" not in p for p in result["pay_review"]), "review list must not expose protected data"


def test_career_returners_never_promoted_fails_promotion_parity():
    rows = _fair_rows()
    rows = [r[:4] + ["no" if r[7] == "yes" else r[4]] + r[5:] for r in rows]

    result = audit_workforce(_csv(rows))

    assert _check(_attr(result, "career_gap"), "promotion_parity")["status"] == "FAIL"
    assert _check(_attr(result, "gender"), "promotion_parity")["status"] == "PASS"


def test_lower_ratings_at_equal_skill_fails_rating_gap():
    rows = _fair_rows()
    rows = [r[:3] + [3 if r[6] == "female" else 4] + r[4:] for r in rows]

    result = audit_workforce(_csv(rows))

    assert _check(_attr(result, "gender"), "rating_gap")["status"] == "FAIL"


def test_small_groups_are_skipped_not_scored():
    rows = _fair_rows()
    rows[0][6] = "non-binary"  # a group of 1 must not be scored or exposed

    result = audit_workforce(_csv(rows))
    gender = _attr(result, "gender")

    assert {g["group"] for g in gender["groups"]} == {"female", "male"}
    assert gender["skipped_groups"] == [{"group": "non-binary", "count": 1}]


def test_attribute_with_one_evaluable_group_is_insufficient_data():
    rows = [r[:7] + ["no"] for r in _fair_rows()]

    result = audit_workforce(_csv(rows))

    assert _attr(result, "career_gap")["status"] == "INSUFFICIENT_DATA"


def test_missing_required_column_is_rejected():
    with pytest.raises(AuditInputError) as err:
        audit_workforce("employee_id,role,skill_score\nE1,Dev,80")

    assert any("annual_salary" in e for e in err.value.errors)


def test_bad_values_report_row_numbers():
    rows = _fair_rows()
    rows[2][2] = "abc"
    rows[5][3] = 9

    with pytest.raises(AuditInputError) as err:
        audit_workforce(_csv(rows))

    text = " ".join(err.value.errors)
    assert "Row 4" in text and "skill_score" in text
    assert "Row 7" in text and "performance_rating" in text


def test_no_protected_columns_is_rejected():
    csv_text = "employee_id,role,skill_score,performance_rating,promoted_last_cycle,annual_salary\n" + "\n".join(
        f"E{i},Dev,80,4,no,100000" for i in range(12)
    )
    with pytest.raises(AuditInputError) as err:
        audit_workforce(csv_text)

    assert any("protected" in e.lower() for e in err.value.errors)


def test_audit_endpoint_accepts_csv_upload():
    res = client.post(
        "/api/workforce/audit",
        files={"file": ("team.csv", _csv(_fair_rows()).encode(), "text/csv")},
    )

    assert res.status_code == 200
    assert res.json()["overall_status"] == "PASS"


def test_audit_endpoint_returns_400_with_errors_for_bad_csv():
    res = client.post(
        "/api/workforce/audit",
        files={"file": ("team.csv", b"employee_id\nE1", "text/csv")},
    )

    assert res.status_code == 400
    assert res.json()["detail"]["errors"]


def test_bundled_sample_dataset_surfaces_real_disparities():
    with open(SAMPLE_CSV, "r", encoding="utf-8") as f:
        result = audit_workforce(f.read())

    assert result["employee_count"] >= 60
    assert result["overall_status"] == "FAIL"
    assert result["pay_review"], "sample should flag at least one underpaid employee"
