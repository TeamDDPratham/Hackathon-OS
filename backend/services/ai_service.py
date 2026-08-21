import os
import json
from typing import Dict, Any, Optional

class AIService:
    def __init__(self):
        self.api_key = os.getenv("AI_API_KEY")
        self.client = None
        if self.api_key and self.api_key != "your_gemini_api_key_here":
            try:
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
            except Exception:
                self.client = None

    def enrich_remediation(self, finding_title: str, category: str, evidence: str) -> Dict[str, str]:
        """
        Provides plain-language explanations with deterministic fallback if Gemini is offline or unconfigured.
        """
        # Deterministic 3-Layer Graceful Fallback
        fallback_summary = f"Security vulnerability in {category}: {finding_title}. Address this issue by validating all input constraints and enforcing server-side authorization boundaries."
        fallback_patch = "Ensure all API routes implement defensive authentication guards and return appropriate 4xx status codes on invalid payloads."

        if not self.client:
            return {
                "plain_language_explanation": fallback_summary,
                "recommended_patch": fallback_patch,
                "ai_enriched": False
            }

        try:
            prompt = f"Explain this API vulnerability in 2 concise sentences for developers and provide a quick 3-line defensive code recommendation.\nTitle: {finding_title}\nCategory: {category}\nEvidence: {evidence}"
            response = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
            )
            return {
                "plain_language_explanation": response.text.strip(),
                "recommended_patch": fallback_patch,
                "ai_enriched": True
            }
        except Exception:
            return {
                "plain_language_explanation": fallback_summary,
                "recommended_patch": fallback_patch,
                "ai_enriched": False
            }

ai_service = AIService()
