"""
SkillNav SQLite Database Connection & Helpers
═════════════════════════════════════════════
Provides thread-safe SQLite connections with foreign key enforcement.
"""

import os
import sqlite3
from contextlib import contextmanager

DEFAULT_DB_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "data", "skillnav.db")
)


def get_db_path() -> str:
    return os.environ.get("SKILLNAV_DB_PATH") or DEFAULT_DB_PATH


def get_connection(db_path: str = None) -> sqlite3.Connection:
    path = db_path or get_db_path()
    os.makedirs(os.path.dirname(path), exist_ok=True)
    conn = sqlite3.connect(path, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn


@contextmanager
def db_session(db_path: str = None):
    conn = get_connection(db_path)
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()
