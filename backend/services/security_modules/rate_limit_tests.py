import httpx
import asyncio
from typing import List
from backend.models.schemas import Finding, DiscoveredEndpoint, SeverityLevel, FindingStatus, SecurityCategory

# Safe bounded test (5 rapid requests only - NOT an aggressive load test)
BURST_COUNT = 6

async def test_rate_limiting(
    client: httpx.AsyncClient,
    target_url: str,
    endpoints: List[DiscoveredEndpoint]
) -> List[Finding]:
    findings: List[Finding] = []

    # Prioritize login or search endpoints for rate limit checks
    target_ep = next((ep for ep in endpoints if "login" in ep.path.lower() or "auth" in ep.path.lower()), None)
    if not target_ep and endpoints:
        target_ep = endpoints[0]

    if target_ep:
        url = target_url.rstrip("/") + target_ep.path
        success_codes = 0
        rate_limited = False
        rate_limit_headers_present = False

        for i in range(BURST_COUNT):
            try:
                if target_ep.method == "POST":
                    resp = await client.post(url, json={"username": f"probe_user_{i}", "password": "wrong_password_123"}, timeout=2.0)
                else:
                    resp = await client.get(url, timeout=2.0)

                headers_lower = {k.lower(): v for k, v in resp.headers.items()}
                if any(h in headers_lower for h in ["x-ratelimit-limit", "ratelimit-limit", "retry-after"]):
                    rate_limit_headers_present = True

                if resp.status_code == 429:
                    rate_limited = True
                    break
                elif resp.status_code in [200, 400, 401, 404]:
                    success_codes += 1
            except Exception:
                pass
            await asyncio.sleep(0.05)

        # If endpoint is an auth/login endpoint and processed 6 rapid requests with zero rate-limit headers or 429 status
        if "login" in target_ep.path.lower() or "auth" in target_ep.path.lower():
            if not rate_limited and not rate_limit_headers_present:
                findings.append(Finding(
                    id=f"rate_lim_{abs(hash(target_ep.path)) % 10000}",
                    title="Missing Rate Limiting on Authentication Endpoint",
                    category=SecurityCategory.RATE_LIMITING,
                    severity=SeverityLevel.HIGH,
                    endpoint=target_ep.path,
                    method=target_ep.method,
                    description=f"Endpoint '{target_ep.path}' allowed consecutive rapid requests without returning HTTP 429 or rate-limiting headers (X-RateLimit-Limit / Retry-After).",
                    evidence={
                        "burst_requests_sent": BURST_COUNT,
                        "successful_responses_received": success_codes,
                        "rate_limit_headers_found": rate_limit_headers_present
                    },
                    impact="Enables credential stuffing, automated brute-force attacks, and API resource exhaustion.",
                    recommendation="Configure rate-limiting middleware (e.g. slowapi / Redis token bucket) to throttle requests to at most 5 attempts per minute per IP.",
                    remediation_code="# Example with slowapi in FastAPI:\nfrom slowapi import Limiter\nlimiter = Limiter(key_func=get_remote_address)\n\n@router.post('/login')\n@limiter.limit('5/minute')\ndef login(request: Request):\n    ...",
                    status=FindingStatus.FAIL,
                    cwe_id="CWE-799"
                ))

    return findings
