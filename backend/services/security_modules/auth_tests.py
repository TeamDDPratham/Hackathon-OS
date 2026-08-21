import httpx
from typing import List
from backend.models.schemas import Finding, DiscoveredEndpoint, SeverityLevel, FindingStatus, SecurityCategory

# Keywords suggesting sensitive resources requiring authentication
SENSITIVE_KEYWORDS = ["admin", "user", "profile", "account", "payment", "order", "invoice", "setting", "secret", "token", "credential"]

async def test_authentication(
    client: httpx.AsyncClient,
    target_url: str,
    endpoints: List[DiscoveredEndpoint],
    auth_token: str = None,
    auth_header_name: str = "Authorization"
) -> List[Finding]:
    findings: List[Finding] = []

    for ep in endpoints:
        is_sensitive = any(kw in ep.path.lower() for kw in SENSITIVE_KEYWORDS)
        url = target_url.rstrip("/") + ep.path
        
        # Test 1: Unauthenticated request to sensitive endpoint
        if is_sensitive:
            try:
                headers = {}
                if ep.method == "GET":
                    resp = await client.get(url, headers=headers, timeout=3.5)
                elif ep.method == "POST":
                    resp = await client.post(url, headers=headers, json={}, timeout=3.5)
                else:
                    continue

                if resp.status_code == 200:
                    # Endpoint returned success without any auth headers
                    resp_text = resp.text[:300]
                    findings.append(Finding(
                        id=f"auth_missing_{abs(hash(ep.path)) % 10000}",
                        title="Unauthenticated Access to Sensitive Resource",
                        category=SecurityCategory.AUTH,
                        severity=SeverityLevel.HIGH,
                        endpoint=ep.path,
                        method=ep.method,
                        description=f"The endpoint '{ep.path}' appears sensitive but was accessible without an authentication token (HTTP 200 OK).",
                        evidence={
                            "request": f"{ep.method} {ep.path} HTTP/1.1\nHost: {target_url}\nAuthorization: [NONE]",
                            "response_status": resp.status_code,
                            "response_snippet": resp_text
                        },
                        impact="Anonymous external attackers can exfiltrate sensitive user/admin data or perform unauthorized state changes.",
                        recommendation="Implement strict authentication middleware (e.g. JWT verification, OAuth2 Bearer check) before serving requests.",
                        remediation_code="@router.get('/admin/users')\ndef list_users(user: User = Depends(get_current_active_admin)):\n    return db.query(User).all()",
                        status=FindingStatus.FAIL,
                        cwe_id="CWE-306"
                    ))
            except Exception as e:
                pass

        # Test 2: If auth token is provided, test with invalid / bogus token
        if auth_token and is_sensitive:
            try:
                bogus_headers = {auth_header_name: "Bearer invalid_tampered_token_xyz_999"}
                if ep.method == "GET":
                    resp = await client.get(url, headers=bogus_headers, timeout=3.5)
                else:
                    resp = await client.post(url, headers=bogus_headers, json={}, timeout=3.5)

                if resp.status_code == 200:
                    findings.append(Finding(
                        id=f"auth_bypass_{abs(hash(ep.path)) % 10000}",
                        title="Improper Authentication Token Validation",
                        category=SecurityCategory.AUTH,
                        severity=SeverityLevel.CRITICAL,
                        endpoint=ep.path,
                        method=ep.method,
                        description=f"The endpoint '{ep.path}' accepted an invalid/forged authorization token and returned HTTP 200 OK.",
                        evidence={
                            "request": f"{ep.method} {ep.path} HTTP/1.1\n{auth_header_name}: Bearer invalid_tampered_token...",
                            "response_status": resp.status_code
                        },
                        impact="Attackers can bypass authentication completely by forging arbitrary token headers.",
                        recommendation="Verify JWT cryptographic signatures using a secure secret key and check expiration claims.",
                        remediation_code="try:\n    payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])\nexcept JWTError:\n    raise HTTPException(status_code=401, detail='Invalid token')",
                        status=FindingStatus.FAIL,
                        cwe_id="CWE-287"
                    ))
            except Exception:
                pass

    return findings
