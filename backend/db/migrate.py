"""
SkillNav Database Migration Script
══════════════════════════════════
Idempotently creates:
- users (and seeds existing JSON profiles so foreign keys succeed)
- resume_uploads
- voice_intros
- skill_candidates (status: proposed / confirmed / edited / rejected)
- user_skills
- analysis_runs
"""

import json
import os
from datetime import datetime, timezone
from db.database import db_session, get_db_path

PROFILES_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "data", "profiles")
)


SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    experience_years REAL DEFAULT 0.0,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS resume_uploads (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    file_path TEXT NOT NULL,
    original_filename TEXT,
    mime_type TEXT,
    file_size INTEGER,
    redacted_text TEXT NOT NULL,
    redaction_count INTEGER DEFAULT 0,
    redaction_categories TEXT DEFAULT '{}',
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS voice_intros (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    redacted_transcript TEXT NOT NULL,
    char_count INTEGER NOT NULL,
    redaction_count INTEGER DEFAULT 0,
    redaction_categories TEXT DEFAULT '{}',
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS skill_candidates (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    skill_id TEXT NOT NULL,
    skill_name TEXT NOT NULL,
    evidence_quote TEXT NOT NULL,
    confidence REAL NOT NULL,
    needs_confirmation INTEGER DEFAULT 0,
    status TEXT NOT NULL CHECK(status IN ('proposed', 'confirmed', 'edited', 'rejected')),
    source_type TEXT DEFAULT 'onboarding',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_skills (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    skill_id TEXT NOT NULL,
    skill_name TEXT NOT NULL,
    level INTEGER DEFAULT 1,
    source TEXT DEFAULT 'confirmed',
    confirmed_at TEXT NOT NULL,
    UNIQUE(user_id, skill_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS analysis_runs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    role_id TEXT NOT NULL,
    role_title TEXT NOT NULL,
    score REAL NOT NULL,
    matched_skills_json TEXT NOT NULL,
    missing_skills_json TEXT NOT NULL,
    explanation TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
"""


def run_migration(db_path: str = None) -> None:
    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    with db_session(db_path) as conn:
        conn.executescript(SCHEMA_SQL)

        # Seed existing JSON profiles into users table without overwriting existing rows
        if os.path.isdir(PROFILES_DIR):
            for fname in os.listdir(PROFILES_DIR):
                if not fname.endswith(".json"):
                    continue
                fpath = os.path.join(PROFILES_DIR, fname)
                try:
                    with open(fpath, "r", encoding="utf-8") as f:
                        p = json.load(f)
                    uid = p.get("profile_id")
                    name = p.get("name") or "Candidate"
                    email = p.get("email") or ""
                    exp_list = p.get("experience") or []
                    exp_years = sum(float(e.get("years", 0) or 0) for e in exp_list)
                    if uid:
                        conn.execute(
                            """
                            INSERT OR IGNORE INTO users (id, name, email, experience_years, created_at)
                            VALUES (?, ?, ?, ?, ?)
                            """,
                            (uid, name, email, exp_years, now_iso),
                        )
                except Exception:
                    continue


if __name__ == "__main__":
    run_migration()
    print(f"Migration completed successfully at {get_db_path()}")
