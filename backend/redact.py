"""
SkillNav PII & Protected Attribute Redaction Engine
═════════════════════════════════════════════════
Redacts:
- Email addresses
- Indian phone numbers (+91 / 10-digit)
- Indian PIN codes (6-digit)
- Address-like lines
- User's name (if supplied or labeled)
- Gender pronouns & descriptors (English and Hindi)
- College / university / institute names

Returns: {"text": str, "count": int, "categories": dict[str, int]}
"""

import re
from typing import Dict, Any, Optional, List, Tuple


EMAIL_RE = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b")
# Indian phone: optional +91 / 91 / 0, optional space/dash, then 10 digits starting with 6-9 (with optional spaces/dashes)
INDIAN_PHONE_RE = re.compile(
    r"(?<!\d)(?:\+91[\s\-]?|91[\s\-]?|0)?[6-9]\d{4}[\s\-]?\d{5}(?!\d)"
)
# Indian PIN code: 6 digits starting with 1-8 (optionally space after 3rd digit)
PIN_CODE_RE = re.compile(r"(?<!\d)[1-8]\d{2}\s?\d{3}(?!\d)")

ADDRESS_LINE_RE = re.compile(
    r"(?im)^.*?\b(?:house\s*(?:no\.?|#)?|flat\s*(?:no\.?|#)?|plot\s*(?:no\.?|#)?|street|road|rd\.?|lane|sector|colony|nagar|vihar|enclave|phase|ward|district|tehsil|taluka|address\s*:|residing\s+at|resident\s+of)\b.*$"
)

COLLEGE_RE = re.compile(
    r"(?i)\b(?:"
    r"(?:iit|nit|iiit|bits|iim|vit|srm|manipal)\s+[a-z]{2,}(?:\s+[a-z]{2,})?"
    r"|[A-Za-z&\.\s]{2,50}\b(?:university|college|institute\s+of\s+technology|engineering\s+college|polytechnic|vidyalaya|mahavidyalaya)"
    r")\b"
)

# English gender pronouns and explicit markers
ENGLISH_GENDER_RE = re.compile(
    r"\b(?:he|him|his|himself|she|her|hers|herself|male|female|mr\.?|mrs\.?|ms\.?|miss|sir|madam)\b",
    re.IGNORECASE,
)

# Hindi gender pronouns & gendered nouns (word-boundary safe for Devanagari)
HINDI_GENDER_TERMS = [
    "वह", "उसका", "उसकी", "उसके", "उन्होंने", "उसे",
    "लड़का", "लड़की", "महिला", "पुरुष", "श्रीमती", "श्री",
]
HINDI_GENDER_RE = re.compile(
    r"(?<!\w)(?:" + "|".join(re.escape(w) for w in HINDI_GENDER_TERMS) + r")(?!\w)"
)

LABELED_NAME_RE = re.compile(
    r"(?i)\b(?:name|candidate\s*name|applicant\s*name|naam)\s*[:=]\s*[^\n\r,]+"
)


def _sub_count(pattern: re.Pattern, repl: str, text: str) -> Tuple[str, int]:
    new_text, n = pattern.subn(repl, text)
    return new_text, n


def redact_text(
    text: str,
    user_name: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Redacts PII and protected attributes from raw resume or transcript text.
    Returns:
      {
        "text": redacted_text,
        "count": total_redactions,
        "categories": {"email": ..., "phone": ..., "pincode": ..., "address": ..., "name": ..., "gender": ..., "college": ...}
      }
    """
    if not text:
        return {"text": "", "count": 0, "categories": {}}

    categories: Dict[str, int] = {}
    working = text

    # 1. Emails
    working, n_email = _sub_count(EMAIL_RE, "[REDACTED_EMAIL]", working)
    if n_email:
        categories["email"] = n_email

    # 2. Indian Phones
    working, n_phone = _sub_count(INDIAN_PHONE_RE, "[REDACTED_PHONE]", working)
    if n_phone:
        categories["phone"] = n_phone

    # 3. Address-like lines (before pincode so full address lines are cleanly replaced)
    working, n_addr = _sub_count(ADDRESS_LINE_RE, "[REDACTED_ADDRESS]", working)
    if n_addr:
        categories["address"] = n_addr

    # 4. Indian PIN codes
    working, n_pin = _sub_count(PIN_CODE_RE, "[REDACTED_PINCODE]", working)
    if n_pin:
        categories["pincode"] = n_pin

    # 5. College / University names
    working, n_college = _sub_count(COLLEGE_RE, "[REDACTED_COLLEGE]", working)
    if n_college:
        categories["college"] = n_college

    # 6. User Name (exact full name + parts >= 3 chars + labeled names)
    n_name = 0
    working, n_labeled = _sub_count(LABELED_NAME_RE, "[REDACTED_NAME]", working)
    n_name += n_labeled

    if user_name and user_name.strip():
        clean_name = user_name.strip()
        full_re = re.compile(r"\b" + re.escape(clean_name) + r"\b", re.IGNORECASE)
        working, cnt = _sub_count(full_re, "[REDACTED_NAME]", working)
        n_name += cnt

        parts = [p.strip() for p in clean_name.split() if len(p.strip()) >= 3]
        for part in parts:
            part_re = re.compile(r"\b" + re.escape(part) + r"\b", re.IGNORECASE)
            working, cnt_p = _sub_count(part_re, "[REDACTED_NAME]", working)
            n_name += cnt_p

    if n_name:
        categories["name"] = n_name

    # 7. Gender pronouns (English + Hindi)
    working, n_en_gender = _sub_count(ENGLISH_GENDER_RE, "[REDACTED_PRONOUN]", working)
    working, n_hi_gender = _sub_count(HINDI_GENDER_RE, "[REDACTED_PRONOUN]", working)
    n_gender = n_en_gender + n_hi_gender
    if n_gender:
        categories["gender"] = n_gender

    total_count = sum(categories.values())
    return {
        "text": working,
        "count": total_count,
        "categories": categories,
    }
