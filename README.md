# SkillNav — Inclusive Workforce & Opportunity Navigator

> Skills-first, bias-aware, accessible career navigator powered by SAP BTP.

## Core USP
- **Blind Matching Engine** — strips all protected/pedigree attributes before AI scoring
- **Alternative Evidence** — GitHub, freelance, self-taught projects, career-break learning
- **Counterfactual Fairness Test** — live proof that protected attributes don't affect scores
- **SAP Integration** — HANA Cloud Vector Engine, AI Core, Build Process Automation

## Tech Stack
| Layer | Stack |
|-------|-------|
| Frontend | React (Vite), Tailwind CSS, Lucide Icons, i18next (EN/HI) |
| Backend | Python FastAPI, Pydantic, python-multipart |
| Database | SAP HANA Cloud Vector Engine (`hdbcli`) + local cosine-sim fallback |
| AI/OCR | SAP Generative AI Hub (`sap-ai-sdk-gen`) + rule-based fallback |

## Quick Start

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
pip install -r requirements.txt
cp .env.example .env       # Fill in SAP credentials
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
pnpm install
pnpm dev                   # http://localhost:5173
```

## Design System
- **Background:** `#FFFFFF` (white), `#F8FAFC` (cards)
- **Primary Dark:** `#0A0A0A` (text, sidebar)
- **Accent:** `#2563EB` (CTAs, active items, score rings)
- **Borders:** `1px solid #E2E8F0`, `12px` radius, zero heavy shadows
- **Accessibility:** WCAG 2.1 AA, 44px touch targets, focus-visible rings

## Project Structure
```
skillnav/
├── frontend/          # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── i18n/
│   │   └── theme/
│   └── ...
├── backend/           # Python FastAPI
│   ├── main.py
│   ├── config.py
│   └── ...
└── README.md
```
