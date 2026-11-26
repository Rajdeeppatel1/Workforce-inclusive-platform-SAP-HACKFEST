"""
SkillNav Voice Intent Router
════════════════════════════
Uses Gemini API (via ask_gemini) to classify voice commands
into a fixed whitelist of allowed actions:
- NAVIGATE_TEST (/fresher/test)
- NAVIGATE_PREPARE (/fresher/prepare)
- NAVIGATE_DASHBOARD (/dashboard)
- NAVIGATE_EVIDENCE (/evidence)
- NAVIGATE_MATCHES (/matches)
- NAVIGATE_MENTORS (/mentors)
- NAVIGATE_PROFILE (/profile)
- SPEAK_TRENDING_SKILLS (Browser TTS output)
- SPEAK_HELP (Browser TTS output)
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
import re

from llm import ask_gemini, sanitize_prompt

router = APIRouter(prefix="/api/voice", tags=["voice-navigation"])

# Fixed Whitelist of Allowed Actions
ALLOWED_ACTIONS_MAP: Dict[str, Optional[str]] = {
    "NAVIGATE_TEST": "/fresher/test",
    "NAVIGATE_PREPARE": "/fresher/prepare",
    "NAVIGATE_DASHBOARD": "/dashboard",
    "NAVIGATE_EVIDENCE": "/evidence",
    "NAVIGATE_MATCHES": "/matches",
    "NAVIGATE_MENTORS": "/mentors",
    "NAVIGATE_PROFILE": "/profile",
    "SPEAK_TRENDING_SKILLS": None,
    "SPEAK_HELP": None,
}


class VoiceCommandRequest(BaseModel):
    command: Optional[str] = Field(None, description="Raw speech-to-text voice utterance")
    transcript: Optional[str] = Field(None, description="Alternative field for speech transcript")
    language: Optional[str] = "hi-IN"


class VoiceIntentModel(BaseModel):
    action: str = Field(description="Must be strictly one of: NAVIGATE_TEST, NAVIGATE_PREPARE, NAVIGATE_DASHBOARD, NAVIGATE_EVIDENCE, NAVIGATE_MATCHES, NAVIGATE_MENTORS, NAVIGATE_PROFILE, SPEAK_TRENDING_SKILLS, SPEAK_HELP, UNKNOWN_ACTION")
    tts_speech: str = Field(description="Spoken confirmation message for Text-to-Speech")
    explanation: Optional[str] = ""


class VoiceIntentResponse(BaseModel):
    action: str
    route: Optional[str] = None
    tts_speech: str
    allowed: bool
    command_received: str
    engine: str = "Gemini Intent Engine"


@router.get("/actions")
async def get_allowed_voice_actions():
    """
    Returns the fixed whitelist of allowed actions supported by the voice navigator.
    """
    actions = [
        {"action": "NAVIGATE_TEST", "route": "/fresher/test", "description": "Open 5-MCQ skill quiz", "sample_utterances": ["test kholo", "quiz shuru karo", "take test"]},
        {"action": "NAVIGATE_PREPARE", "route": "/fresher/prepare", "description": "Open practice and learning resources", "sample_utterances": ["prepare kholo", "learning resources", "practice karo"]},
        {"action": "NAVIGATE_DASHBOARD", "route": "/dashboard", "description": "Navigate to candidate dashboard", "sample_utterances": ["dashboard kholo", "my score", "readiness dekho"]},
        {"action": "NAVIGATE_EVIDENCE", "route": "/evidence", "description": "Navigate to verified evidence & certificates", "sample_utterances": ["evidence kholo", "praman dekho", "certificate upload"]},
        {"action": "NAVIGATE_MATCHES", "route": "/matches", "description": "Navigate to fair job matches", "sample_utterances": ["jobs dikhao", "job match kholo", "matching roles"]},
        {"action": "NAVIGATE_MENTORS", "route": "/mentors", "description": "Open mentor booking & doubt box", "sample_utterances": ["mentor se milao", "doubt poochna hai", "mentorship"]},
        {"action": "NAVIGATE_PROFILE", "route": "/profile", "description": "View candidate profile & experience", "sample_utterances": ["profile kholo", "meri profile"]},
        {"action": "SPEAK_TRENDING_SKILLS", "route": None, "description": "Read aloud trending market skills via TTS", "sample_utterances": ["trending skills suno", "market skills kya hain"]},
        {"action": "SPEAK_HELP", "route": None, "description": "Read aloud voice navigation help", "sample_utterances": ["help", "madad", "kaise use karein"]}
    ]
    return {"allowed_actions": actions, "count": len(actions)}


@router.post("/intent", response_model=VoiceIntentResponse)
async def classify_voice_intent(req: VoiceCommandRequest):
    """
    Classifies a candidate's voice utterance into a fixed whitelist of allowed actions
    using Gemini API (with deterministic fallback).
    Returns route to navigate or text to speak via Web Speech TTS.
    """
    raw_cmd = (req.command or req.transcript or "").strip().lower()
    display_cmd = (req.command or req.transcript or "").strip()
    if not raw_cmd:
        raise HTTPException(status_code=400, detail="Voice command or transcript cannot be empty")

    # Rule-Based Fast Path / Fallback mapping
    if any(k in raw_cmd for k in ["test", "quiz", "assessment", "pariksha", "mcq"]):
        return VoiceIntentResponse(
            action="NAVIGATE_TEST",
            route="/fresher/test",
            tts_speech="Opening skill assessment test.",
            allowed=True,
            command_received=display_cmd,
            engine="Fast Classification Rule"
        )
    elif any(k in raw_cmd for k in ["trending", "trend", "skill suno", "market skill", "demand"]):
        return VoiceIntentResponse(
            action="SPEAK_TRENDING_SKILLS",
            route=None,
            tts_speech="Currently in high demand are FastAPI, Docker, React, and Vector Search.",
            allowed=True,
            command_received=display_cmd,
            engine="Fast Classification Rule"
        )
    elif any(k in raw_cmd for k in ["dashboard", "readiness", "score ring"]):
        return VoiceIntentResponse(
            action="NAVIGATE_DASHBOARD",
            route="/dashboard",
            tts_speech="Opening candidate dashboard.",
            allowed=True,
            command_received=display_cmd,
            engine="Fast Classification Rule"
        )
    elif any(k in raw_cmd for k in ["evidence", "certificate", "praman", "github", "proof"]):
        return VoiceIntentResponse(
            action="NAVIGATE_EVIDENCE",
            route="/evidence",
            tts_speech="Opening evidence and certificate ledger.",
            allowed=True,
            command_received=display_cmd,
            engine="Fast Classification Rule"
        )
    elif any(k in raw_cmd for k in ["match", "job", "naukri", "opportunity", "fair match"]):
        return VoiceIntentResponse(
            action="NAVIGATE_MATCHES",
            route="/matches",
            tts_speech="Opening fair job matching workspace.",
            allowed=True,
            command_received=display_cmd,
            engine="Fast Classification Rule"
        )
    elif any(k in raw_cmd for k in ["mentor", "expert", "doubt", "sawaal", "guidance"]):
        return VoiceIntentResponse(
            action="NAVIGATE_MENTORS",
            route="/mentors",
            tts_speech="Opening domain experts and doubt box.",
            allowed=True,
            command_received=display_cmd,
            engine="Fast Classification Rule"
        )
    elif any(k in raw_cmd for k in ["prepare", "practice", "study", "padhai", "tayari"]):
        return VoiceIntentResponse(
            action="NAVIGATE_PREPARE",
            route="/fresher/prepare",
            tts_speech="Opening practice platforms and learning resources.",
            allowed=True,
            command_received=display_cmd,
            engine="Fast Classification Rule"
        )
    elif any(k in raw_cmd for k in ["profile", "experience", "education"]):
        return VoiceIntentResponse(
            action="NAVIGATE_PROFILE",
            route="/profile",
            tts_speech="Opening candidate profile and goals.",
            allowed=True,
            command_received=display_cmd,
            engine="Fast Classification Rule"
        )

    # If not matched by fast path, call Gemini LLM
    prompt = f"""
    You are an intent classifier for a voice-controlled career platform.
    User voice command: "{raw_cmd}"

    Allowed Actions (STRICT LIST):
    - NAVIGATE_TEST: User wants to take test, quiz, or assessment (e.g. "test kholo")
    - SPEAK_TRENDING_SKILLS: User wants to hear or see trending skills (e.g. "trending skills suno")
    - NAVIGATE_DASHBOARD: User wants to go to dashboard or check readiness
    - NAVIGATE_EVIDENCE: User wants to see certificates or evidence
    - NAVIGATE_MATCHES: User wants to see job matches or vacancies
    - NAVIGATE_MENTORS: User wants to talk to mentor or ask doubt
    - NAVIGATE_PREPARE: User wants practice resources or learning
    - NAVIGATE_PROFILE: User wants to view or edit profile
    - UNKNOWN_ACTION: Any command outside this list

    Classify the utterance into one of these actions and generate a short, friendly TTS speech response.
    """

    llm_result: VoiceIntentModel = ask_gemini(prompt, schema=VoiceIntentModel)
    action_name = llm_result.action.strip()

    # Enforce fixed whitelist security check
    if action_name in ALLOWED_ACTIONS_MAP:
        return VoiceIntentResponse(
            action=action_name,
            route=ALLOWED_ACTIONS_MAP[action_name],
            tts_speech=llm_result.tts_speech,
            allowed=True,
            command_received=display_cmd,
            engine="Gemini 1.5 Flash Intent Engine"
        )

    # Safe fallback if unknown
    return VoiceIntentResponse(
        action="UNKNOWN_ACTION",
        route=None,
        tts_speech="Kshama karein, ye command samajh nahi aaya. Aap 'test kholo' ya 'trending skills suno' bol sakte hain.",
        allowed=False,
        command_received=req.command,
        engine="Fixed Whitelist Enforcer"
    )
