import httpx
from typing import List
from backend.models.schemas import Finding, DiscoveredEndpoint, SeverityLevel, FindingStatus, SecurityCategory

SAFE_MALFORMED_PAYLOADS = [
    {"query": "admin' OR 1=1 --", "name": "SQL Injection Character Probe"},
    {"query": "<script>alert(1)</script>", "name": "Cross-Site Scripting Probe"},
    {"query": "A" * 2000, "name": "Large String Boundary Check"},
    {"id": -1, "name": "Negative Integer Boundary Check"},
    {"id": "not_an_int", "name": "Type Confusion String-in-Integer"},
    {"unexpected_field_xyz": True, "name": "Mass Assignment / Unexpected Field"}
]

async def test_input_validation(
    client: httpx.AsyncClient,
    target_url: str,
    endpoints: List[DiscoveredEndpoint],
    auth_token: str = None
) -> List[Finding]:
    findings: List[Finding] = []

    post_endpoints = [ep for ep in endpoints if ep.method in ["POST", "PUT", "PATCH"]]

    for ep in post_endpoints:
        url = target_url.rstrip("/") + ep.path
        headers = {"Authorization": f"Bearer {auth_token}"} if auth_token else {}
        headers["Content-Type"] = "application/json"

        for payload in SAFE_MALFORMED_PAYLOADS:
            try:
                resp = await client.post(url, json=payload, headers=headers, timeout=3.5)
                
                # Check for unhandled 500 errors or uncaught server exceptions
                if resp.status_code == 500:
                    findings.append(Finding(
                        id=f"val_err_{abs(hash(ep.path + payload['name'])) % 10000}",
                        title="Unhandled Server Exception on Malformed Input",
                        category=SecurityCategory.INPUT_VALIDATION,
                        severity=SeverityLevel.HIGH,
                        endpoint=ep.path,
                        method=ep.method,
                        description=f"Endpoint '{ep.path}' crashed with HTTP 500 Internal Server Error when tested with '{payload['name']}'.",
                        evidence={
                            "payload_tested": payload,
                            "response_status": 500,
                            "response_body_sample": resp.text[:250]
                        },
                        impact="Unsanitized inputs can trigger unhandled backend exceptions, service instability, or deeper injection vulnerabilities.",
                        recommendation="Implement strict schema validation (e.g. Pydantic / Joi) and return 422 Unprocessable Entity or 400 Bad Request instead of crashing with 500.",
                        remediation_code="class SearchQuery(BaseModel):\n    query: str = Field(..., max_length=100, pattern=r'^[a-zA-Z0-9\\s_-]+$')\n\n@router.post('/search')\ndef search(body: SearchQuery):\n    return db.search(body.query)",
                        status=FindingStatus.FAIL,
                        cwe_id="CWE-20"
                    ))
                    break # Don't flood the same endpoint with 10 duplicate 500 errors
            except Exception:
                pass

    return findings
