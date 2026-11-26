"""
SkillNav Gemini LLM Service
═══════════════════════════
Calls Google Gemini API using GEMINI_API_KEY from environment.
Key is NEVER hardcoded in code.
Includes a deterministic fallback engine so the app runs offline without crashing.
"""

import os
import json
import re
import requests
from typing import Dict, Any, Optional

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"


def summarize_doubt_for_expert(
    doubt_text: str,
    mentor_naam: str = "Expert Mentor",
    mentor_role: str = "Engineering Lead"
) -> Dict[str, Any]:
    """
    Takes user doubt, calls Gemini 1.5 Flash to summarize it and generate a structured
    draft message for the expert. Falls back deterministically if no key is configured.
    """
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()

    if api_key:
        try:
            prompt = f"""
            You are a technical mentorship assistant for SkillNav (universal, inclusive career platform).
            A candidate has submitted this technical question or career doubt:

            ---
            {doubt_text}
            ---

            Target Mentor: {mentor_naam} ({mentor_role})

            Please summarize this doubt and prepare a structured, professional draft message for the mentor.
            Return ONLY a valid JSON object (no markdown code blocks, just raw JSON) with these exact keys:
            {{
              "summary": "1-2 sentence crisp technical summary of the core issue",
              "draft_message": "A polite, concise message for the mentor explaining the problem, what was attempted, and the specific question",
              "key_topics": ["topic1", "topic2"],
              "suggested_agenda": "Brief 15-minute 1:1 discussion bullet points"
            }}
            """

            payload = {
                "contents": [
                    {
                        "parts": [
                            {"text": prompt}
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.2,
                    "topK": 40,
                    "topP": 0.95,
                    "maxOutputTokens": 800,
                }
            }

            resp = requests.post(
                f"{GEMINI_API_URL}?key={api_key}",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=10
            )

            if resp.status_code == 200:
                result = resp.json()
                raw_text = result["candidates"][0]["content"]["parts"][0]["text"].strip()
                # Clean possible markdown formatting
                if raw_text.startswith("```"):
                    raw_text = re.sub(r"^```(?:json)?\n?", "", raw_text)
                    raw_text = re.sub(r"\n?```$", "", raw_text)
                parsed = json.loads(raw_text.strip())
                parsed["engine"] = "Gemini 1.5 Flash (Live API)"
                return parsed
        except Exception as e:
            print(f"⚠ Gemini API error, using deterministic fallback: {e}")

    # ═════════════════════════════════════════════════════════════
    # Deterministic Rule-Based Fallback
    # ═════════════════════════════════════════════════════════════
    words = [w.strip() for w in re.findall(r"\b[A-Za-z0-9_+#.-]{2,}\b", doubt_text)]
    tech_keywords = [
        "python", "react", "docker", "fastapi", "sql", "api", "rest", "database",
        "kubernetes", "cloud", "aws", "backend", "frontend", "vector", "embeddings",
        "ci/cd", "microservices", "async", "testing", "architecture", "redis", "linux"
    ]
    detected_topics = [
        w.title() for w in set(words) if w.lower() in tech_keywords
    ]
    if not detected_topics:
        detected_topics = ["Engineering Fundamentals", "System Architecture"]

    cleaned_doubt = doubt_text.strip()
    if len(cleaned_doubt) > 140:
        summary_sentence = cleaned_doubt[:137] + "..."
    else:
        summary_sentence = cleaned_doubt

    topics_str = ", ".join(detected_topics)
    draft = (
        f"Hi {mentor_naam},\n\n"
        f"I am preparing for an inclusive technical pathway in {topics_str} and came across a specific challenge.\n\n"
        f"Context & Core Doubt:\n"
        f"\"{summary_sentence}\"\n\n"
        f"What I've explored:\n"
        f"- Checked standard implementation guidelines and documentation for {topics_str}.\n\n"
        f"Could we spend 15 minutes reviewing best practices and production trade-offs during our mentorship session?\n\n"
        f"Thank you,\nRajdeep"
    )

    return {
        "summary": f"Question regarding {topics_str}: {summary_sentence}",
        "draft_message": draft,
        "key_topics": detected_topics,
        "suggested_agenda": f"1. Review {topics_str} architecture • 2. Debug edge cases • 3. Best practice recommendations",
        "engine": "Gemini Engine (Local Resilient Fallback)"
    }
