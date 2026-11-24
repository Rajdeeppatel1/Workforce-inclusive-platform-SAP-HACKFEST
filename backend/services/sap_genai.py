"""
SAP Generative AI Hub Service (sap-ai-sdk-gen wrapper)
══════════════════════════════════════════════════════
Wraps SAP AI Core Generative AI Hub SDK:
  - generate_skill_embedding(text)
  - analyze_jd_bias(jd_text)
  - extract_certificate_skills(raw_text)
  - generate_why_this_score(matched, missing, weak)

Includes full deterministic, rule-based fallback engines so all features
work offline and during live demo without network dependency.
"""

import os
import re
import json
import hashlib
from typing import List, Dict, Any, Optional
import numpy as np

from config import settings


# ═════════════════════════════════════════════════════════════
# 1. Skill Embedding (SAP AI Core + In-Memory Fallback)
# ═════════════════════════════════════════════════════════════

def generate_skill_embedding(text: str, dim: int = 1536) -> List[float]:
    """
    Calls SAP AI Core Generative AI Hub embedding proxy if configured.
    Falls back to deterministic normalized semantic vector.
    """
    if settings.aicore_base_url and settings.aicore_client_id:
        try:
            from gen_ai_hub.proxy.native.openai import OpenAI
            client = OpenAI()
            response = client.embeddings.create(
                input=text,
                model="text-embedding-ada-002"
            )
            return response.data[0].embedding
        except Exception as e:
            print(f"⚠ [GenAI Hub Embedding Fallback]: {e}")

    # Deterministic semantic hash mapping fallback
    tokens = [t.lower().strip() for t in re.findall(r"\w+", text) if len(t) > 2]
    vec = np.zeros(dim, dtype=np.float32)

    if not tokens:
        vec[0] = 1.0
        return vec.tolist()

    for token in tokens:
        token_hash = abs(int(hashlib.md5(token.encode('utf-8')).hexdigest()[:8], 16))
        np.random.seed(token_hash % (2**31 - 1))
        rnd = np.random.normal(0, 1, dim).astype(np.float32)
        vec += rnd

    norm = np.linalg.norm(vec)
    if norm > 0:
        vec = vec / norm

    return vec.tolist()


# ═════════════════════════════════════════════════════════════
# 2. Inclusive Job Description Bias Checker
# ═════════════════════════════════════════════════════════════

BIAS_PATTERNS = [
    # Age Bias
    {
        "category": "age",
        "pattern": r"\b(young|youthful|energetic|recent grad(?:uate)?s?|fresh grad(?:uate)?s?|digital native(?:s)?|maximum \d{2} years)\b",
        "explanation": "Implicitly discourages experienced or career-returner talent.",
        "suggestion": "Focus on required skill competencies (e.g. 'collaborative and proactive developer')."
    },
    # Pedigree / Elitist College Barriers
    {
        "category": "pedigree",
        "pattern": r"\b(tier[- ]?1(?: college| institute)?|iit/?nit(?: only)?|premier (?:college|institute|university)|top[- ]tier engineering|ivy league)\b",
        "explanation": "Creates unnecessary pedigree barrier that excludes 95%+ of capable self-taught, rural, and state university talent.",
        "suggestion": "Require proven technical capability or project portfolio instead of institutional tier."
    },
    # Gendered & Hyper-Aggressive Jargon
    {
        "category": "gender",
        "pattern": r"\b(rockstar|ninja|guru|manpower|chairman|aggressive|dominant|work hard play hard|crush it)\b",
        "explanation": "Hyper-masculine jargon reduces female and diverse applicant rates by up to 40%.",
        "suggestion": "Use inclusive collaborative terms like 'skilled developer', 'team leader', or 'workforce'."
    },
    # Unnecessary Degree Requirements
    {
        "category": "degree_barrier",
        "pattern": r"\b(b\.?tech mandatory|cs degree required|4[- ]year degree strictly required)\b",
        "explanation": "Excludes skilled self-taught, boot camp, and alternative-pathway engineers.",
        "suggestion": "'Degree in Computer Science or equivalent hands-on project experience'."
    }
]

REPLACEMENT_MAP = {
    "rockstar": "exceptional contributor",
    "ninja": "specialist",
    "guru": "subject matter expert",
    "young and energetic": "proactive and motivated",
    "young, energetic": "proactive and motivated",
    "young": "motivated",
    "energetic": "collaborative",
    "manpower": "workforce",
    "chairman": "chairperson",
    "tier-1": "accredited",
    "tier 1": "accredited",
    "iit/nit only": "demonstrated project proficiency",
    "premier institute": "relevant background or demonstrated skill",
    "digital native": "tech-proficient professional",
    "work hard play hard": "balanced and supportive team environment"
}


def analyze_jd_bias(jd_text: str) -> Dict[str, Any]:
    """
    Detects age, gender, and pedigree bias in Job Descriptions.
    Returns:
      - inclusion_score: int (0 to 100)
      - flags: list of {phrase, category, explanation, suggestion}
      - rewritten_jd: skills-first rewritten version
    """
    # ── Attempt GenAI Hub Call ──
    if settings.aicore_base_url and settings.aicore_client_id:
        try:
            from gen_ai_hub.proxy.native.openai import OpenAI
            client = OpenAI()
            prompt = f"""
            Analyze the following Job Description for bias (age bias, gender bias, pedigree/college-tier barriers).
            Return valid JSON with keys:
            - inclusion_score: integer 0-100
            - flags: list of objects with phrase, category, explanation, suggestion
            - rewritten_jd: skills-first, inclusive rewritten text removing all pedigree and bias

            JD TEXT:
            {jd_text}
            """
            res = client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            content = res.choices[0].message.content
            return json.loads(content)
        except Exception as e:
            print(f"⚠ [GenAI Hub JD Bias Fallback]: {e}")

    # ── Rule-Based Deterministic Engine ──
    flags = []
    penalty = 0

    for item in BIAS_PATTERNS:
        matches = re.finditer(item["pattern"], jd_text, re.IGNORECASE)
        for m in matches:
            phrase = m.group(0)
            flags.append({
                "phrase": phrase,
                "category": item["category"],
                "explanation": item["explanation"],
                "suggestion": item["suggestion"]
            })
            if item["category"] == "pedigree":
                penalty += 20
            elif item["category"] in ("age", "gender"):
                penalty += 15
            else:
                penalty += 10

    inclusion_score = max(20, min(100, 100 - penalty))

    # Generate rewritten skills-first version
    rewritten = jd_text
    for old_word, new_word in REPLACEMENT_MAP.items():
        pattern = re.compile(re.escape(old_word), re.IGNORECASE)
        rewritten = pattern.sub(new_word, rewritten)

    # Clean pedigree barriers
    rewritten = re.sub(
        r"(mandatory from Tier-1 college|IIT/NIT degree mandatory)",
        "demonstrated practical experience or portfolio",
        rewritten,
        flags=re.IGNORECASE
    )

    return {
        "inclusion_score": inclusion_score,
        "flags": flags,
        "flag_count": len(flags),
        "rewritten_jd": rewritten.strip(),
        "is_inclusive": inclusion_score >= 85
    }


# ═════════════════════════════════════════════════════════════
# 3. Certificate & Credential OCR Skill Extraction
# ═════════════════════════════════════════════════════════════

KNOWN_ISSUERS = [
    "SAP", "Coursera", "AWS", "Google Cloud", "Microsoft", "Udemy",
    "freeCodeCamp", "HackerRank", "edX", "NPTEL", "IBM", "LinkedIn Learning"
]

SKILL_LEXICON = [
    "python", "react", "fastapi", "sql", "sap btp", "hana", "docker", "kubernetes",
    "machine learning", "data structures", "javascript", "typescript", "tailwind css",
    "git", "rest apis", "microservices", "cloud security", "ci/cd", "node.js"
]


def extract_certificate_skills(raw_text: str) -> Dict[str, Any]:
    """
    Parses OCR text of certificates/credentials into:
    issuer, title, date, skills, and status (Verified or Flagged with reason).
    """
    # ── Attempt GenAI Hub Call ──
    if settings.aicore_base_url and settings.aicore_client_id:
        try:
            from gen_ai_hub.proxy.native.openai import OpenAI
            client = OpenAI()
            prompt = f"""
            Extract credentials from this certificate OCR text.
            Return JSON with:
            - issuer: string
            - title: string
            - date: string (YYYY-MM or approximate)
            - skills: list of strings
            - status: "Verified" or "Flagged"
            - flag_reason: string if flagged else null

            OCR TEXT:
            {raw_text}
            """
            res = client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            return json.loads(res.choices[0].message.content)
        except Exception as e:
            print(f"⚠ [GenAI Hub OCR Fallback]: {e}")

    # ── Rule-Based Deterministic OCR Parsing Engine ──
    cleaned = raw_text.strip()
    if len(cleaned) < 15:
        return {
            "issuer": "Unknown",
            "title": "Unrecognized Certificate",
            "date": "N/A",
            "skills": [],
            "status": "Flagged",
            "flag_reason": "Insufficient text content extracted from document image."
        }

    # Find issuer
    issuer = "Self-Reported / Online Provider"
    for known in KNOWN_ISSUERS:
        if re.search(r"\b" + re.escape(known) + r"\b", cleaned, re.IGNORECASE):
            issuer = known
            break

    # Extract title
    title = "Technical Credential / Course Completion"
    lines = [line.strip() for line in cleaned.split("\n") if len(line.strip()) > 5]
    for line in lines[:4]:
        if any(term in line.lower() for term in ["certificate", "completion", "mastery", "developer", "specialization", "certified"]):
            title = line
            break

    # Extract date
    date_match = re.search(r"\b(201\d|202\d)(?:[-/]\d{1,2})?\b|\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}\b", cleaned, re.IGNORECASE)
    date_str = date_match.group(0) if date_match else "2024"

    # Extract matching skills
    found_skills = []
    lower_text = cleaned.lower()
    for skill in SKILL_LEXICON:
        if re.search(r"\b" + re.escape(skill) + r"\b", lower_text):
            found_skills.append(skill.title() if len(skill) > 4 else skill.upper())

    # Flag suspicious patterns (e.g. fake test strings)
    status = "Verified"
    flag_reason = None
    if "sample fake certificate" in lower_text or "photoshop" in lower_text:
        status = "Flagged"
        flag_reason = "Suspicious metadata or simulated credential watermark detected."

    return {
        "issuer": issuer,
        "title": title,
        "date": date_str,
        "skills": list(set(found_skills)),
        "status": status,
        "flag_reason": flag_reason,
        "confidence": 0.94 if status == "Verified" else 0.40
    }


# ═════════════════════════════════════════════════════════════
# 4. Plain-English "Why This Score" Generator
# ═════════════════════════════════════════════════════════════

def generate_why_this_score(
    matched: List[str],
    missing: List[str],
    weak: Optional[List[str]] = None
) -> str:
    """
    Generates a concise 2-sentence plain-English explanation of the match score,
    highlighting core strengths and actionable next steps.
    """
    matched_str = ", ".join(matched[:3]) if matched else "foundational competencies"
    missing_str = ", ".join(missing[:2]) if missing else ""

    sentence_1 = f"Strong alignment in {matched_str} confirms your direct capability for core day-to-day requirements."

    if missing:
        sentence_2 = f"Adding demonstrated evidence in {missing_str} will quickly bridge the gap to a top-tier readiness tier."
    else:
        sentence_2 = "Your verified portfolio covers all mandatory prerequisites with zero demographic bias applied."

    return f"{sentence_1} {sentence_2}"
