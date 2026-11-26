# Planned Improvements (`IMPROVEMENTS.md`)

1. **Authentication & Session Tokens**
   - Replace the `X-User-Id` header check with signed JWT tokens (OAuth2 / BTP XSUAA) in production deployments.

2. **OCR Support for Scanned PDFs**
   - Integrate Tesseract or cloud document OCR for image-only scanned PDF resumes where `pypdf` extracts empty text.

3. **Multi-Page PDF Resume Layout**
   - Upgrade `reportlab` canvas generation to `SimpleDocTemplate` with flowables for candidates with extensive project histories.

4. **Streaming & Async LLM Calls**
   - Move Gemini extraction and explanation calls to background task queues or async clients under high concurrency.
