# SkillNav — Universal Career Navigator
### *Inclusive Workforce, Skills-First Matching & Counterfactual Fairness Platform*

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_0.115+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_18_+_Vite-61DAFB?logo=react&logoColor=black)](https://reactjs.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Minimalist_Stitch-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG_2.1_AA_Compliant-2563EB)](https://www.w3.org/WAI/WCAG21/quickref/)
[![Gemini AI](https://img.shields.io/badge/AI-Google_Gemini_Engine-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)

---

## 🌟 Mission: Inclusive Workforce & Real-World Opportunity

Traditional recruitment algorithms filter out extraordinary talent based on **college pedigree, career gaps, gender, or geographic tier**. **SkillNav** is a production-ready, universal career navigator designed to eliminate demographic bias at the schema level and reward real, demonstrable skills.

SkillNav works with **real candidate data and real job descriptions**:
- Any real user can create, edit, and persist their real profile, projects, and credentials.
- Any recruiter or candidate can paste real job descriptions to detect exclusionary language and match against validated competencies.
- Real Google Gemini AI integration assists with doubt resolution, mentor drafting, and skills extraction—with **zero leakage of protected attributes**.

---

## 🚀 Key Architectural Pillars

### 1. Schema-Level Blind Matching Engine
Protected demographic and institutional attributes are stripped *before* candidate profiles reach vector matchers or AI scoring:
- **Strictly Banned Attributes:** `name` (`naam`), `gender`, `age`, `college_name`, `college_tier`, `career_gap`, and `city_tier`.
- **Scored On:** Verified competencies, code evidence (GitHub, GitLab), freelance deployments, open-source PRs, and verifiable certifications.

### 2. Counterfactual Fairness Parity Audit
A built-in stress-test audit panel that proves zero bias by cloning identical technical skills into distinct demographic profiles:
- **Candidate A:** Tier-1 Elite College (IIT), Male, 0 Gap, Bangalore Metro
- **Candidate B:** State Rural Engineering College, Female, Tier-3, 0 Gap, Bhopal
- **Candidate C:** Career Returner, Female, 2-Year Break, Tier-3, Indore

| Algorithm Engine | Max Disparity | Result Status | Behavior |
| :--- | :--- | :--- | :--- |
| **Fair Matcher (Blind Mode)** | **0.0%** | **PASS** (Emerald) | Protected attributes stripped; identical $85.9\%$ score for all 3 candidates. |
| **Naive Matcher (Legacy/Biased)** | **26.0%** | **FAIL** (Rose) | Rewards Tier-1 pedigree ($+10\%$) and penalizes Tier-3 ($-6\%$) and career breaks ($-10\%$). |

### 3. Real-World AI & LLM Engine (Google Gemini)
- Function: `ask_gemini(prompt, schema)` in `backend/llm.py`.
- **Prompt Sanitization:** Regular expressions actively scrub names, gender markers, colleges, and gap durations before queries leave the application.
- **Structured Validation:** Pydantic models validate LLM outputs for reliable system integration.
- **Resilient Fallback:** Automatically switches to deterministic, local rule engines if the remote endpoint or API key is offline.

### 4. Accessibility & Inclusive UI (WCAG 2.1 AA)
- **44px Minimum Touch Targets:** Every button, input, toggle, and icon button complies with WCAG 2.5.5 / 2.5.8 target size requirements (`min-h-[44px] min-w-[44px]`).
- **1-Click Hindi / English Bilingual Switch:** Direct toggle in the top navigation bar (`EN / हिंदी`) translates navigation, labels, and status badges.
- **Keyboard Navigation First:**
  - Accessible `Skip to main content` landmark link (`#main-content`).
  - Visible focus indicators (`:focus-visible` 2px royal blue outline rings).
  - Modal key-trapping and `Escape` key handlers.
- **Cognitive & Vision Controls:** Accessibility drawer with High Contrast mode, Dyslexia-friendly fonts (OpenDyslexic), and Text-to-Speech (Web Speech API).

---

## 🧭 Priya Sharma End-to-End Walkthrough

SkillNav includes a pre-seeded profile for **Priya Sharma**, a Tier-3 computer science graduate from Bhopal:

1. **Sign In (`POST /api/login/mock?profile_id=seed_priya_sharma_01`)**:
   Loads Priya's synthetic profile (Python, FastAPI, React, SQL, Docker).
2. **Career Status Selection (`/fresher` vs `/employed`)**:
   Priya chooses **Fresher Track** for degree-agnostic launchpad resources.
3. **Mandatory Data Consent Gate**:
   Displays *"Ye data sirf skill matching ke liye use hoga"*. Priya gives consent, unlocking the full candidate dashboard.
4. **Fresher Skills & Learning Catalog (`/fresher/prepare`)**:
   Recommends verified certifications and interactive practice platforms for Docker and REST APIs.
5. **Interactive Skill Quiz (`/fresher/test`)**:
   Priya completes a 5-MCQ technical quiz; the score is verified and saved to `backend/data/profiles/seed_priya_sharma_01.json`.
6. **Domain Mentorship & AI Doubt Box (`/mentors`)**:
   Priya submits a technical architecture question. Gemini AI summarizes the doubt into a structured mentor discussion draft.
7. **Certificate OCR & Role Matcher (`/evidence`)**:
   Priya uploads her certificate; the OCR pipeline verifies the issuer and maps competencies to target roles in `backend/data/roles.json`.
8. **Fair Job Match (`/matches`)**:
   Priya runs the blind matching algorithm. She tests the **Counterfactual Fairness Audit**, proving that her match score is 100% equal to a Tier-1 candidate with identical skills.

---

## 🛠️ Tech Stack & Directory Structure

```
skillnav/
├── backend/
│   ├── data/
│   │   ├── profiles/             # User JSON profile store (persisted)
│   │   │   ├── seed_priya_sharma_01.json
│   │   │   └── seed_rajdeep_patel_01.json
│   │   ├── fresher_catalog.json  # Skill tracks, quizzes, and learning materials
│   │   ├── mentors.json          # Verified industry mentors
│   │   └── roles.json            # Industry job profiles & competency maps
│   ├── routers/
│   │   ├── auth_profile.py       # Login, profile CRUD, consent gate, quiz scores
│   │   ├── fairness.py           # Blind matcher, counterfactual test, appeal workflow
│   │   └── voice_router.py       # Web Speech API intent parser & action mapper
│   ├── config.py                 # Pydantic BaseSettings configuration
│   ├── llm.py                    # Gemini API client with prompt sanitization
│   └── main.py                   # FastAPI server entrypoint
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AccessibilityDrawer.jsx  # Contrast, font scaling, dyslexia mode
│   │   │   ├── ConsentGate.jsx          # Protected data consent boundary
│   │   │   └── Layout.jsx               # Sidebar, 44px buttons, Hindi/English switch
│   │   ├── context/
│   │   │   ├── AccessibilityContext.jsx # Theme, speech & language state
│   │   │   └── ProfileContext.jsx       # Candidate profile synchronization
│   │   ├── i18n/
│   │   │   └── locales/ (en.json, hi.json)
│   │   ├── pages/
│   │   │   ├── FairJobMatch.jsx         # What-If simulator & Counterfactual Audit
│   │   │   ├── FresherTrack.jsx         # Fresher pathway & recommendations
│   │   │   ├── FresherTest.jsx          # 5-MCQ quiz engine
│   │   │   ├── FresherPrepare.jsx       # Catalog of preparation resources
│   │   │   ├── Mentorship.jsx           # Expert cards & Gemini doubt box
│   │   │   ├── Evidence.jsx             # Certificate upload & role validation
│   │   │   ├── JdChecker.jsx            # Real JD inclusive bias scanner
│   │   │   ├── Dashboard.jsx            # Unified candidate dashboard
│   │   │   └── Profile.jsx              # Real candidate profile editor
│   │   └── index.css                    # Design tokens & WCAG touch targets
│   └── package.json
└── README.md
```

---

## ⚡ Quickstart & Local Setup

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+** & npm / pnpm

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate      # On Windows
# source venv/bin/activate  # On Linux/macOS

# Install dependencies
pip install -r requirements.txt

# Configure Environment Variables in backend/.env
# (Create .env if not present)
echo GEMINI_API_KEY=your_gemini_api_key_here >> .env

# Start FastAPI development server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be live at: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install packages
npm install

# Start Vite dev server
npm run dev
```
Application will be live at: [http://localhost:5173](http://localhost:5173)

---

## 🔒 Security & Fair AI Commitment

1. **Environment Separation:** API keys are never hardcoded and must be loaded through environment variables (`GEMINI_API_KEY`).
2. **Schema-Level Sanitization:** Pydantic schemas enforce that protected demographic attributes cannot enter match scoring payloads.
3. **Auditability:** Every match calculation produces a plain-English explanation breakdown (`why_this_score`) and explicit appeal channels.
4. **Offline Resilience:** If third-party AI services are unreachable, SkillNav operates with zero downtime using local rule-based matchers.

---

## 📄 License
This project is open-source and distributed under the **Apache 2.0 License**.
Designed for the **Inclusive Workforce Theme**.

---

## Onboarding Pipeline Endpoints & Environment Variables

### Environment Variables (`backend/.env.example`)
- `GEMINI_API_KEY` — Required for Gemini AI skill extraction and match explanations (`google-genai` SDK). Raises a clear configuration error when missing.
- `GEMINI_MODEL` — Gemini model identifier (default: `gemini-2.5-flash`).
- `SUITABILITY_THRESHOLD` — Score threshold above which `"You are suitable"` is included in explanations (default: `0.7`).

### Onboarding & Analysis API Endpoints (`X-User-Id` Auth Header Required)
- `POST /api/resume/upload` — Upload PDF/DOCX resume (max 5 MB, MIME + extension validated), extract text, redact PII, and persist only redacted text in SQLite.
- `DELETE /api/resume/{id}` — Delete uploaded resume file from disk and database row.
- `POST /api/voice/intro` — Redact and store voice intro transcript (max 3000 chars).
- `POST /api/onboarding/extract` — Extract taxonomy-grounded skills via Gemini with verbatim evidence quote checks and low-confidence flags (`< 0.5`).
- `GET /api/onboarding/candidates` — List proposed/confirmed/edited/rejected skill candidates.
- `PATCH /api/onboarding/candidates/{id}` — Confirm, edit, or reject a skill candidate.
- `POST /api/onboarding/confirm` — Commit confirmed/edited candidates to `user_skills`.
- `POST /api/analysis/run` — Deterministic weighted match (`0.8` required + `0.2` nice-to-have + level cap); strictly rejects protected fields.
- `POST /api/analysis/explain` — Generate 3–4 sentence skills-only explanation with number hallucination guard.
- `GET /api/resume/generate/{run_id}` — Generate downloadable `reportlab` PDF with candidate name, confirmed skills, experience, role suggestion, skill gaps, and SkillNav disclaimer footer.
- `DELETE /api/user/data` — Remove user uploads, voice intros, and skill candidates.
