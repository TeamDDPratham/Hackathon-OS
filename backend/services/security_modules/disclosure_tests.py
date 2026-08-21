import httpx
import re
from typing import List
from backend.models.schemas import Finding, DiscoveredEndpoint, SeverityLevel, FindingStatus, SecurityCategory

# Patterns indicating leaked stack traces, SQL syntax errors, or internal file paths
ERROR_LEAK_PATTERNS = [
    (r"Traceback \(most recent call last\):", "Python Stack Trace", SeverityLevel.HIGH),
    (r"Syntax error in SQL statement|ORA-\d{5}|PG::SyntaxError|mysql_fetch_array", "SQL Syntax Error Leak", SeverityLevel.CRITICAL),
    (r"\/var\/[a-zA-Z0-9_\-\.\/]+|C:\\[a-zA-Z0-9_\-\.\\]+", "Internal Absolute File Path", SeverityLevel.MEDIUM),
    (r"DEBUG-MODE-ON|DEBUG = True", "Debug Mode Active", SeverityLevel.HIGH)
]

async def test_information_disclosure(
    client: httpx.AsyncClient,
    target_url: str,
    endpoints: List[DiscoveredEndpoint]
) -> List[Finding]:
    findings: List[Finding] = []

    # Probe endpoints with trigger parameters like unexpected query strings or malformed requests
    for ep in endpoints:
        url = target_url.rstrip("/") + ep.path
        try:
            # 1. Trigger via unexpected query
            resp = await client.get(url + "?__debug=1&id='%20OR%201=1", timeout=3.0)
            text = resp.text

            for pattern, pattern_name, severity in ERROR_LEAK_PATTERNS:
                if re.search(pattern, text, re.IGNORECASE):
                    findings.append(Finding(
                        id=f"leak_{abs(hash(ep.path + pattern_name)) % 10000}",
                        title=f"Excessive Information Disclosure: {pattern_name}",
                        category=SecurityCategory.INFO_DISCLOSURE,
                        severity=severity,
                        endpoint=ep.path,
                        method=ep.method,
                        description=f"Endpoint '{ep.path}' leaked internal system details ({pattern_name}) in the HTTP response body.",
                        evidence={
                            "matched_pattern": pattern_name,
                            "leaked_snippet": text[:350]
                        },
                        impact="Attackers can deduce backend technology versions, database schemas, internal directory structures, and application flaws.",
                        recommendation="Disable debug modes in production and implement a global exception handler that returns generic error messages (e.g. {'error': 'Internal server error'}).",
                        remediation_code="@app.exception_handler(Exception)\nasync def global_exception_handler(request: Request, exc: Exception):\n    logger.error(f'Internal error: {exc}')\n    return JSONResponse(status_code=500, content={'error': 'An unexpected error occurred'})",
                        status=FindingStatus.FAIL,
                        cwe_id="CWE-209"
                    ))
                    break
        except Exception:
            continue

    return findings
