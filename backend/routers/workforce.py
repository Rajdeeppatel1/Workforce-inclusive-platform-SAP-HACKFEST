"""
Workforce Equity Audit Router
═════════════════════════════
POST /api/workforce/audit  (multipart CSV upload) → equity audit across protected groups.
The file is processed in memory and never stored.
"""

from fastapi import APIRouter, File, HTTPException, UploadFile

from services.workforce_audit import AuditInputError, audit_workforce

router = APIRouter(prefix="/api/workforce", tags=["workforce-equity"])

MAX_UPLOAD_BYTES = 2 * 1024 * 1024  # stays well under Vercel's 4.5 MB body limit


@router.post("/audit")
async def audit(file: UploadFile = File(...)):
    content = await file.read(MAX_UPLOAD_BYTES + 1)
    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail={"errors": ["File is larger than 2 MB"]})
    try:
        text = content.decode("utf-8-sig")
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail={"errors": ["File must be a UTF-8 encoded CSV"]})
    try:
        return audit_workforce(text)
    except AuditInputError as err:
        raise HTTPException(status_code=400, detail={"errors": err.errors})
