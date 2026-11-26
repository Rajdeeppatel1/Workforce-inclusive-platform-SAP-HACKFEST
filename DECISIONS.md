# Architecture & Engineering Decisions (`DECISIONS.md`)

1. **SQLite Migration Alongside Legacy JSON Profiles**
   - Added a relational SQLite database (`backend/data/skillnav.db`) with foreign keys (`PRAGMA foreign_keys = ON`) for `resume_uploads`, `voice_intros`, `skill_candidates`, `user_skills`, and `analysis_runs`.
   - Existing JSON candidate profiles are idempotently seeded into `users` on startup so legacy endpoints and tests continue functioning seamlessly.

2. **Privacy-First Redaction Before Persistence & AI**
   - `backend/redact.py` strips emails, Indian phone numbers, PIN codes, address lines, user names, English/Hindi gender pronouns, and college/university names prior to storing resume text or voice transcripts in the database.
   - Raw resume text and raw voice transcripts are never persisted in SQLite.

3. **Hallucination-Guarded Skill Extraction (`google-genai`)**
   - `backend/llm.py` uses the official `google-genai` SDK (`gemini-2.5-flash` default) with a 30-second timeout, 1 retry, and strict Pydantic validation.
   - `backend/extract.py` enforces verbatim substring verification (`evidence_quote` must exist in the redacted input) and flags low-confidence extractions (`confidence < 0.5`) as `needs_confirmation`.

4. **Deterministic Bias-Free Matching & Safe Explanations**
   - `backend/engines/match.py` uses `ConfigDict(extra="forbid")` to reject protected attributes at the schema boundary (`422` error).
   - Scoring weights are fixed at `0.8` required skills + `0.2` nice-to-have skills, with a `0.65` level cap when candidate skill level is below `min_level`.
   - `backend/engines/explain.py` restricts prompts to skill names and score only, enforces `"You are suitable"` only when `score >= 0.7`, and falls back to a deterministic template if Gemini introduces any ungrounded number.
