"""
SAP Build Process Automation — Human-in-the-Loop Appeal Service
══════════════════════════════════════════════════════════════
Triggers SAP Build Process Automation workflow instances for candidate appeals:
- Endpoint: POST /api/fairness/challenge
- Payload: { "definitionId": "skillnav.appeal.review", "context": { "profileId", "challengedItem", "reason" } }
- OAuth2 token retrieval via SAP_BUILD_TOKEN_URL with client credentials.
- Automatic local queue fallback when SAP Build workflow is not deployed.
"""

import uuid
import datetime
import requests
from typing import Dict, Any, Optional, List
from pydantic import BaseModel, Field

from config import settings


# In-memory appeal queue for local fallback / demo resilience
LOCAL_APPEAL_QUEUE: List[Dict[str, Any]] = []


class AppealRequest(BaseModel):
    profileId: str = Field(..., description="Anonymized Candidate Profile ID")
    challengedItem: str = Field(..., description="Field or score being appealed, e.g. 'Match Score - Python Specialist'")
    reason: str = Field(..., description="Explanation of why the decision or skill credit is challenged")
    additionalEvidenceUrl: Optional[str] = Field(None, description="Link to repo, portfolio or certification proof")


class AppealResponse(BaseModel):
    case_id: str
    status: str
    target_engine: str
    workflow_definition_id: str
    profile_id: str
    challenged_item: str
    reason: str
    submitted_at: str
    eta: str
    message: str


def trigger_sap_build_appeal(
    profile_id: str,
    challenged_item: str,
    reason: str,
    additional_evidence_url: Optional[str] = None
) -> AppealResponse:
    """
    Triggers an SAP Build Process Automation workflow instance via OAuth REST API.
    Falls back gracefully to local priority queue if SAP Build is offline or not configured.
    """
    case_id = f"SAP-BUILD-{uuid.uuid4().hex[:8].upper()}"
    now_iso = datetime.datetime.utcnow().isoformat() + "Z"
    workflow_def = "skillnav.appeal.review"

    # ── Attempt Live SAP Build Process Automation Trigger ──
    if (
        settings.sap_build_workflow_url
        and settings.sap_build_client_id
        and settings.sap_build_client_secret
        and settings.sap_build_token_url
    ):
        try:
            # 1. Fetch OAuth2 Client Credentials Bearer Token
            token_resp = requests.post(
                settings.sap_build_token_url,
                data={
                    "grant_type": "client_credentials",
                    "client_id": settings.sap_build_client_id,
                    "client_secret": settings.sap_build_client_secret,
                },
                timeout=5.0,
            )

            if token_resp.status_code == 200:
                token_data = token_resp.json()
                access_token = token_data.get("access_token")

                # 2. Trigger Workflow Instance
                workflow_payload = {
                    "definitionId": workflow_def,
                    "context": {
                        "profileId": profile_id,
                        "challengedItem": challenged_item,
                        "reason": reason,
                        "evidenceUrl": additional_evidence_url or "",
                        "submittedAt": now_iso,
                        "caseId": case_id,
                    }
                }

                wf_resp = requests.post(
                    f"{settings.sap_build_workflow_url}/v1/workflow-instances",
                    headers={
                        "Authorization": f"Bearer {access_token}",
                        "Content-Type": "application/json",
                    },
                    json=workflow_payload,
                    timeout=6.0,
                )

                if wf_resp.status_code in (200, 201, 202):
                    wf_data = wf_resp.json()
                    live_instance_id = wf_data.get("id", case_id)
                    return AppealResponse(
                        case_id=live_instance_id,
                        status="TRIGGERED_LIVE_SAP_BUILD",
                        target_engine="SAP Build Process Automation (BTP Live)",
                        workflow_definition_id=workflow_def,
                        profile_id=profile_id,
                        challenged_item=challenged_item,
                        reason=reason,
                        submitted_at=now_iso,
                        eta="48 business hours",
                        message="Live SAP Build Process Automation workflow instance started. Routed to HR & DEI Ombudsperson review queue."
                    )
        except Exception as e:
            print(f"⚠ [SAP Build Live Trigger Failed — Falling back to queue]: {e}")

    # ── Local Queue Fallback (Democratized Demo Guarantee) ──
    record = {
        "case_id": case_id,
        "status": "QUEUED_FOR_HUMAN_REVIEW",
        "target_engine": "SkillNav Local Appeal Queue (SAP Build Offline Fallback)",
        "workflow_definition_id": workflow_def,
        "profile_id": profile_id,
        "challenged_item": challenged_item,
        "reason": reason,
        "additional_evidence_url": additional_evidence_url,
        "submitted_at": now_iso,
        "eta": "24-48 business hours",
        "message": "Appeal recorded in secure human review queue. Blind identity maintained; ombudsperson will inspect skill evidence without pedigree data."
    }
    LOCAL_APPEAL_QUEUE.append(record)

    return AppealResponse(**record)


def get_appeal_queue_status() -> Dict[str, Any]:
    """Returns local queue metrics for testing and demo inspection."""
    return {
        "total_queued": len(LOCAL_APPEAL_QUEUE),
        "recent_cases": LOCAL_APPEAL_QUEUE[-5:]
    }
