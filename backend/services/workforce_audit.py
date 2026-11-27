"""
Workforce Equity Audit
══════════════════════
Answers one question for an existing team: do employees with the SAME skill level
get DIFFERENT outcomes depending on gender, age, career gap, etc.?

Every metric compares an employee to skill-matched peers first, so a group that is
simply more senior or more skilled is not flagged as "biased":
  • promotion_parity  – promotions received vs. promotions expected for each person's
                         skill band (indirect standardisation). Ratio of worst/best group;
                         < 0.8 is the EEOC "four-fifths rule" threshold.
  • adjusted_pay_gap  – salary vs. the median salary of peers in the same role AND skill
                         band. Gap between best- and worst-paid group, in %.
  • rating_gap        – performance rating vs. the mean rating of the same skill band.
                         Gap between best- and worst-rated group, in rating points.

Privacy: groups smaller than MIN_GROUP_SIZE are never scored or broken out, the pay
review list never contains protected attributes, and nothing is persisted.
"""

import csv
import io
from collections import defaultdict
from statistics import mean, median
from typing import Dict, List

REQUIRED_COLUMNS = (
    "employee_id",
    "role",
    "skill_score",
    "performance_rating",
    "promoted_last_cycle",
    "annual_salary",
)
PROTECTED_COLUMNS = ("gender", "age_band", "career_gap", "disability", "college_tier", "location_tier")

# (upper bound exclusive, label) — skill_score is 0-100
SKILL_BANDS = ((50, "Developing"), (70, "Proficient"), (85, "Advanced"), (101, "Expert"))

MIN_ROWS = 10
MAX_ROWS = 5000
MIN_GROUP_SIZE = 5
MAX_REPORTED_ERRORS = 10
UNDISCLOSED = "not disclosed"

PROMOTION_FAIL, PROMOTION_WARN = 0.8, 0.9      # ratio, lower is worse
PAY_GAP_FAIL, PAY_GAP_WARN = 10.0, 5.0         # percent
RATING_GAP_FAIL, RATING_GAP_WARN = 0.5, 0.25   # rating points
PAY_REVIEW_THRESHOLD = 0.90                    # flag pay < 90% of skill-matched peer median
MIN_PEERS_FOR_PAY_REVIEW = 3

YES = {"yes", "y", "true", "1"}
NO = {"no", "n", "false", "0"}
STATUS_ORDER = {"PASS": 0, "WARN": 1, "FAIL": 2}


class AuditInputError(ValueError):
    def __init__(self, errors: List[str]):
        super().__init__("; ".join(errors))
        self.errors = errors


# ── Parsing & validation ──────────────────────────────────────────────

def _skill_band(score: float) -> str:
    return next(label for bound, label in SKILL_BANDS if score < bound)


def _parse_number(raw: str, column: str, low: float, high: float, errors: List[str], row_no: int):
    try:
        value = float(raw.replace(",", "").strip())
    except (ValueError, AttributeError):
        errors.append(f"Row {row_no}: {column} must be a number, got '{raw}'")
        return None
    if not low <= value <= high:
        errors.append(f"Row {row_no}: {column} must be between {low:g} and {high:g}, got {value:g}")
        return None
    return value


def _parse_row(raw: Dict[str, str], row_no: int, protected: List[str], errors: List[str]):
    skill = _parse_number(raw["skill_score"], "skill_score", 0, 100, errors, row_no)
    rating = _parse_number(raw["performance_rating"], "performance_rating", 1, 5, errors, row_no)
    salary = _parse_number(raw["annual_salary"], "annual_salary", 1, 1e12, errors, row_no)
    promoted_raw = (raw["promoted_last_cycle"] or "").strip().lower()
    if promoted_raw not in YES | NO:
        errors.append(f"Row {row_no}: promoted_last_cycle must be yes/no, got '{raw['promoted_last_cycle']}'")
    employee_id = (raw["employee_id"] or "").strip()
    role = (raw["role"] or "").strip()
    if not employee_id or not role:
        errors.append(f"Row {row_no}: employee_id and role are required")
    if None in (skill, rating, salary) or promoted_raw not in YES | NO or not employee_id or not role:
        return None
    return {
        "employee_id": employee_id,
        "role": role,
        "skill_band": _skill_band(skill),
        "rating": rating,
        "salary": salary,
        "promoted": promoted_raw in YES,
        "groups": {col: (raw.get(col) or "").strip().lower() or UNDISCLOSED for col in protected},
    }


def parse_workforce_csv(csv_text: str):
    reader = csv.DictReader(io.StringIO(csv_text.lstrip("﻿")))
    columns = [c.strip().lower() for c in (reader.fieldnames or [])]
    reader.fieldnames = columns

    missing = [c for c in REQUIRED_COLUMNS if c not in columns]
    if missing:
        raise AuditInputError([f"Missing required column(s): {', '.join(missing)}"])
    protected = [c for c in PROTECTED_COLUMNS if c in columns]
    if not protected:
        raise AuditInputError([f"Add at least one protected column to audit: {', '.join(PROTECTED_COLUMNS)}"])

    errors: List[str] = []
    employees = []
    for row_no, raw in enumerate(reader, start=2):
        if row_no - 1 > MAX_ROWS:
            raise AuditInputError([f"File has more than {MAX_ROWS} rows; split it by department"])
        parsed = _parse_row(raw, row_no, protected, errors)
        if parsed:
            employees.append(parsed)

    if errors:
        extra = len(errors) - MAX_REPORTED_ERRORS
        raise AuditInputError(errors[:MAX_REPORTED_ERRORS] + ([f"...and {extra} more"] if extra > 0 else []))
    if len(employees) < MIN_ROWS:
        raise AuditInputError([f"Need at least {MIN_ROWS} employees for a meaningful audit, got {len(employees)}"])
    return employees, protected


# ── Peer baselines ────────────────────────────────────────────────────

def _with_peer_baselines(employees: List[dict]) -> List[dict]:
    by_band, by_role_band = defaultdict(list), defaultdict(list)
    for e in employees:
        by_band[e["skill_band"]].append(e)
        by_role_band[(e["role"], e["skill_band"])].append(e)

    band_promo = {b: mean(e["promoted"] for e in es) for b, es in by_band.items()}
    band_rating = {b: mean(e["rating"] for e in es) for b, es in by_band.items()}
    peer_salary = {k: median(e["salary"] for e in es) for k, es in by_role_band.items()}
    peer_count = {k: len(es) for k, es in by_role_band.items()}

    return [
        {
            **e,
            "expected_promotion": band_promo[e["skill_band"]],
            "rating_residual": e["rating"] - band_rating[e["skill_band"]],
            "pay_ratio": e["salary"] / peer_salary[(e["role"], e["skill_band"])],
            "peer_count": peer_count[(e["role"], e["skill_band"])],
        }
        for e in employees
    ]


# ── Per-attribute checks ──────────────────────────────────────────────

def _group_stats(name: str, members: List[dict]) -> dict:
    expected = sum(m["expected_promotion"] for m in members)
    actual = sum(m["promoted"] for m in members)
    return {
        "group": name,
        "count": len(members),
        "promotion_ratio": round(actual / expected, 3) if expected else 1.0,
        "pay_ratio": round(mean(m["pay_ratio"] for m in members), 4),
        "rating_residual": round(mean(m["rating_residual"] for m in members), 3),
    }


def _status(value: float, fail: float, warn: float, higher_is_worse: bool) -> str:
    if higher_is_worse:
        return "FAIL" if value >= fail else "WARN" if value >= warn else "PASS"
    return "FAIL" if value < fail else "WARN" if value < warn else "PASS"


def _checks(attribute: str, groups: List[dict]) -> List[dict]:
    lo_p, hi_p = min(groups, key=lambda g: g["promotion_ratio"]), max(groups, key=lambda g: g["promotion_ratio"])
    parity = lo_p["promotion_ratio"] / hi_p["promotion_ratio"] if hi_p["promotion_ratio"] else 1.0

    lo_pay, hi_pay = min(groups, key=lambda g: g["pay_ratio"]), max(groups, key=lambda g: g["pay_ratio"])
    pay_gap = (1 - lo_pay["pay_ratio"] / hi_pay["pay_ratio"]) * 100

    lo_r, hi_r = min(groups, key=lambda g: g["rating_residual"]), max(groups, key=lambda g: g["rating_residual"])
    rating_gap = hi_r["rating_residual"] - lo_r["rating_residual"]

    return [
        {
            "metric": "promotion_parity",
            "value": round(parity, 3),
            "status": _status(parity, PROMOTION_FAIL, PROMOTION_WARN, higher_is_worse=False),
            "explanation": (
                f"{attribute}='{lo_p['group']}' got {lo_p['promotion_ratio']:.0%} of the promotions expected for "
                f"their skill level, vs {hi_p['promotion_ratio']:.0%} for '{hi_p['group']}'. "
                f"Below 0.80 fails the four-fifths rule."
            ),
        },
        {
            "metric": "adjusted_pay_gap",
            "value": round(pay_gap, 1),
            "status": _status(pay_gap, PAY_GAP_FAIL, PAY_GAP_WARN, higher_is_worse=True),
            "explanation": (
                f"Compared with peers in the same role and skill band, '{lo_pay['group']}' earn "
                f"{lo_pay['pay_ratio'] - 1:+.1%} and '{hi_pay['group']}' earn {hi_pay['pay_ratio'] - 1:+.1%}."
            ),
        },
        {
            "metric": "rating_gap",
            "value": round(rating_gap, 2),
            "status": _status(rating_gap, RATING_GAP_FAIL, RATING_GAP_WARN, higher_is_worse=True),
            "explanation": (
                f"At equal skill, '{lo_r['group']}' are rated {lo_r['rating_residual']:+.2f} and "
                f"'{hi_r['group']}' {hi_r['rating_residual']:+.2f} points vs. the skill-band average."
            ),
        },
    ]


def _audit_attribute(attribute: str, employees: List[dict]) -> dict:
    members = defaultdict(list)
    for e in employees:
        members[e["groups"][attribute]].append(e)

    groups = [_group_stats(g, ms) for g, ms in sorted(members.items()) if len(ms) >= MIN_GROUP_SIZE]
    skipped = [{"group": g, "count": len(ms)} for g, ms in sorted(members.items()) if len(ms) < MIN_GROUP_SIZE]

    if len(groups) < 2:
        return {"attribute": attribute, "status": "INSUFFICIENT_DATA", "groups": groups,
                "skipped_groups": skipped, "checks": []}

    checks = _checks(attribute, groups)
    worst = max((c["status"] for c in checks), key=STATUS_ORDER.get)
    return {"attribute": attribute, "status": worst, "groups": groups, "skipped_groups": skipped, "checks": checks}


def _pay_review(employees: List[dict]) -> List[dict]:
    flagged = [
        e for e in employees
        if e["peer_count"] >= MIN_PEERS_FOR_PAY_REVIEW and e["pay_ratio"] < PAY_REVIEW_THRESHOLD
    ]
    return [
        {
            "employee_id": e["employee_id"],
            "role": e["role"],
            "skill_band": e["skill_band"],
            "pay_vs_peers_pct": round((e["pay_ratio"] - 1) * 100, 1),
        }
        for e in sorted(flagged, key=lambda e: e["pay_ratio"])
    ]


# ── Public entrypoint ────────────────────────────────────────────────

def audit_workforce(csv_text: str) -> dict:
    """Parse an employee CSV and return the equity audit. Raises AuditInputError on bad input."""
    employees, protected = parse_workforce_csv(csv_text)
    employees = _with_peer_baselines(employees)
    attributes = [_audit_attribute(a, employees) for a in protected]

    scored = [a["status"] for a in attributes if a["status"] in STATUS_ORDER]
    overall = max(scored, key=STATUS_ORDER.get) if scored else "INSUFFICIENT_DATA"

    return {
        "employee_count": len(employees),
        "overall_status": overall,
        "attributes": attributes,
        "pay_review": _pay_review(employees),
        "method": {
            "min_group_size": MIN_GROUP_SIZE,
            "skill_bands": [label for _, label in SKILL_BANDS],
            "thresholds": {
                "promotion_parity": {"fail_below": PROMOTION_FAIL, "warn_below": PROMOTION_WARN},
                "adjusted_pay_gap_pct": {"fail_at": PAY_GAP_FAIL, "warn_at": PAY_GAP_WARN},
                "rating_gap_points": {"fail_at": RATING_GAP_FAIL, "warn_at": RATING_GAP_WARN},
                "pay_review_below_peer_median": PAY_REVIEW_THRESHOLD,
            },
        },
    }
