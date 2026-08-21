import httpx
from typing import List
from backend.models.schemas import Finding, DiscoveredEndpoint, SeverityLevel, FindingStatus, SecurityCategory

RECOMMENDED_HEADERS = {
    "Content-Security-Policy": {
        "severity": SeverityLevel.MEDIUM,
        "impact": "Protects against Cross-Site Scripting (XSS) and unauthorized script injection.",
        "recommendation": "Set a robust Content-Security-Policy header restricting script and resource sources."
    },
    "Strict-Transport-Security": {
        "severity": SeverityLevel.MEDIUM,
        "impact": "Enforces HTTPS connections and prevents SSL stripping / man-in-the-middle attacks.",
        "recommendation": "Configure Strict-Transport-Security: max-age=31536000; includeSubDomains."
    },
    "X-Content-Type-Options": {
        "severity": SeverityLevel.LOW,
        "impact": "Prevents MIME-sniffing attacks where browsers execute non-executable files as scripts.",
        "recommendation": "Add header 'X-Content-Type-Options: nosniff'."
    },
    "X-Frame-Options": {
        "severity": SeverityLevel.LOW,
        "impact": "Protects users against Clickjacking attacks by preventing API UI/pages from being embedded in iframes.",
        "recommendation": "Add header 'X-Frame-Options: DENY' or 'SAMEORIGIN'."
    }
}

async def test_security_headers(
    client: httpx.AsyncClient,
    target_url: str,
    endpoints: List[DiscoveredEndpoint]
) -> List[Finding]:
    findings: List[Finding] = []

    # Sample top 3 endpoints to check response security headers
    sample_endpoints = endpoints[:3] if endpoints else [DiscoveredEndpoint(path="/", method="GET")]

    for ep in sample_endpoints:
        url = target_url.rstrip("/") + ep.path
        try:
            resp = await client.get(url, timeout=3.0)
            headers_lower = {k.lower(): v for k, v in resp.headers.items()}

            for header_name, meta in RECOMMENDED_HEADERS.items():
                if header_name.lower() not in headers_lower:
                    findings.append(Finding(
                        id=f"hdr_missing_{abs(hash(ep.path + header_name)) % 10000}",
                        title=f"Missing Security Header: {header_name}",
                        category=SecurityCategory.SECURITY_HEADERS,
                        severity=meta["severity"],
                        endpoint=ep.path,
                        method="GET",
                        description=f"The endpoint '{ep.path}' does not return the recommended '{header_name}' security response header.",
                        evidence={
                            "checked_header": header_name,
                            "present_headers": list(resp.headers.keys())
                        },
                        impact=meta["impact"],
                        recommendation=meta["recommendation"],
                        remediation_code=f"# Add middleware in FastAPI / Express:\nresponse.headers['{header_name}'] = '...'",
                        status=FindingStatus.WARN if meta["severity"] == SeverityLevel.LOW else FindingStatus.FAIL,
                        cwe_id="CWE-693"
                    ))
            # Check for information leakage in headers
            if "server" in headers_lower and any(v in headers_lower["server"].lower() for v in ["apache", "nginx", "php", "ubuntu", "debug"]):
                findings.append(Finding(
                    id=f"hdr_leak_{abs(hash(ep.path)) % 10000}",
                    title="Server Version & Environment Disclosure in Header",
                    category=SecurityCategory.INFO_DISCLOSURE,
                    severity=SeverityLevel.LOW,
                    endpoint=ep.path,
                    method="GET",
                    description=f"Server returned verbose banner: '{resp.headers.get('server')}'",
                    evidence={"server_header": resp.headers.get("server")},
                    impact="Reveals exact OS, web server, and runtime version which aids attackers in looking up known CVE exploits.",
                    recommendation="Mask or remove the 'Server' and 'X-Powered-By' response headers in production.",
                    remediation_code="# Disable server headers in reverse proxy (Nginx / Cloudflare):\nserver_tokens off;",
                    status=FindingStatus.WARN,
                    cwe_id="CWE-200"
                ))
            break # Once checked across baseline, don't duplicate 50 identical header warnings
        except Exception:
            continue

    return findings
