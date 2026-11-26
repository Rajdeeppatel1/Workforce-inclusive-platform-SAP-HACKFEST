"""
SkillNav Configuration
─────────────────────
Environment variables for SAP BTP services.
All SAP fields are Optional — the app auto-falls back to local engines.

Variable names match .env.example exactly (no prefix).
"""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from .env file."""

    # ── App ──
    app_name: str = "SkillNav"
    debug: bool = True

    # ── SAP HANA Cloud ──
    hana_host: Optional[str] = None
    hana_port: int = 443
    hana_user: Optional[str] = None
    hana_password: Optional[str] = None

    # ── SAP AI Core / Generative AI Hub ──
    aicore_client_id: Optional[str] = None
    aicore_client_secret: Optional[str] = None
    aicore_auth_url: Optional[str] = None
    aicore_base_url: Optional[str] = None
    aicore_resource_group: str = "default"

    # ── SAP Build Process Automation ──
    sap_build_workflow_url: Optional[str] = None
    sap_build_client_id: Optional[str] = None
    sap_build_client_secret: Optional[str] = None
    sap_build_token_url: Optional[str] = None

    # ── SAP Analytics Cloud ──
    sac_story_embed_url: Optional[str] = None

    # ── LLM & AI ──
    gemini_api_key: Optional[str] = None
    port: int = 8000
    host: str = "0.0.0.0"

    model_config = {
        "env_file": ".env",
        "case_sensitive": False,
        "extra": "ignore",
    }


settings = Settings()
