"""
SkillNav Backend — FastAPI Application
══════════════════════════════════════
Inclusive Workforce & Opportunity Navigator

Step 1 Endpoints:
  GET  /api/health      → service health check
  GET  /api/sap/status  → live SAP HANA + AI Core connectivity badge
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from config import settings
from routes.matching_routes import router as matching_router
from routes.genai_routes import router as genai_router
from routers.fairness import router as fairness_router
from routers.auth_profile import router as auth_profile_router


# ═══════════════════════════════════════════
# Lifespan
# ═══════════════════════════════════════════

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 SkillNav Backend starting...")
    print(f"   SAP HANA:   {'configured ✓' if settings.hana_host else 'local fallback'}")
    print(f"   AI Core:    {'configured ✓' if settings.aicore_base_url else 'local fallback'}")
    print(f"   SAP Build:  {'configured ✓' if settings.sap_build_workflow_url else 'local queue'}")
    print(f"   SAC Embed:  {'configured ✓' if settings.sac_story_embed_url else 'not set'}")
    yield
    print("👋 SkillNav Backend shutting down.")


app = FastAPI(
    title="SkillNav API",
    description="Skills-first, bias-aware, accessible career navigator powered by SAP BTP.",
    version="1.0.0",
    lifespan=lifespan,
)

# ═══════════════════════════════════════════
# CORS — allow frontend dev server and Vercel domains
# ═══════════════════════════════════════════

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "https://*.vercel.app",
    ],
    allow_origin_regex=r"^https://.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(matching_router)
app.include_router(genai_router)
app.include_router(fairness_router)
app.include_router(auth_profile_router)


# ═══════════════════════════════════════════
# GET /api/health
# ═══════════════════════════════════════════

@app.get("/api/health")
async def health():
    """Simple service health check."""
    return {"status": "healthy", "service": "skillnav-backend", "version": "1.0.0"}


# ═══════════════════════════════════════════
# GET /api/sap/status  (PRD Update #4)
# ═══════════════════════════════════════════

@app.get("/api/sap/status")
async def sap_status():
    """
    Tests live connectivity to SAP HANA Cloud (SELECT 1 FROM DUMMY)
    and checks SAP AI Core env configuration.
    Returns status flags for the frontend header badge.
    """
    hana_connected = False
    hana_detail = "not configured"
    aicore_configured = False
    aicore_detail = "not configured"

    # ── 1. Test SAP HANA Cloud connectivity ──
    if settings.hana_host:
        try:
            from hdbcli import dbapi
            conn = dbapi.connect(
                address=settings.hana_host,
                port=int(settings.hana_port),
                user=settings.hana_user,
                password=settings.hana_password,
                encrypt=True,
                sslValidateCertificate=False,
            )
            cursor = conn.cursor()
            cursor.execute("SELECT 1 FROM DUMMY")
            row = cursor.fetchone()
            if row and row[0] == 1:
                hana_connected = True
                hana_detail = f"connected to {settings.hana_host}"
            cursor.close()
            conn.close()
        except ImportError:
            hana_detail = "hdbcli package not installed"
        except Exception as e:
            hana_detail = f"connection failed: {str(e)[:120]}"

    # ── 2. Check SAP AI Core env configuration ──
    if settings.aicore_base_url and settings.aicore_client_id:
        aicore_configured = True
        aicore_detail = f"configured ({settings.aicore_base_url})"

        # Optionally test token endpoint
        if settings.aicore_auth_url and settings.aicore_client_secret:
            try:
                import requests
                token_resp = requests.post(
                    settings.aicore_auth_url,
                    data={"grant_type": "client_credentials"},
                    auth=(settings.aicore_client_id, settings.aicore_client_secret),
                    timeout=5,
                )
                if token_resp.status_code == 200:
                    aicore_detail = "authenticated & reachable"
                else:
                    aicore_detail = f"auth returned {token_resp.status_code}"
            except Exception as e:
                aicore_detail = f"auth check failed: {str(e)[:80]}"

    # ── 3. Determine overall mode ──
    both = hana_connected and aicore_configured
    either = hana_connected or aicore_configured

    return {
        "hana": {
            "connected": hana_connected,
            "detail": hana_detail,
        },
        "aicore": {
            "configured": aicore_configured,
            "detail": aicore_detail,
        },
        "sap_build": {
            "configured": bool(settings.sap_build_workflow_url),
        },
        "sac": {
            "configured": bool(settings.sac_story_embed_url),
        },
        "mode": "live" if both else ("hybrid" if either else "local"),
        "label": (
            "SAP AI Core • HANA Vector Connected"
            if both
            else "Partial SAP Connection"
            if either
            else "Running Locally (SAP Offline)"
        ),
    }


# ═══════════════════════════════════════════
# Root
# ═══════════════════════════════════════════

@app.get("/")
async def root():
    return {
        "service": "SkillNav API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "/api/sap/status",
    }
