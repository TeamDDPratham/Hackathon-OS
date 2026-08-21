import httpx
import re
from typing import List
from backend.models.schemas import Finding, DiscoveredEndpoint, SeverityLevel, FindingStatus, SecurityCategory

async def test_authorization_bola(
    client: httpx.AsyncClient,
    target_url: str,
    endpoints: List[DiscoveredEndpoint],
    auth_token: str = None
) -> List[Finding]:
    findings: List[Finding] = []

    # Patterns matching resource ID parameters (e.g., /users/{id}, /users/1, /orders/101)
    id_pattern = re.compile(r"/(users|accounts|orders|items|invoices|documents)/(\d+|\{[^}]+\})", re.IGNORECASE)

    for ep in endpoints:
        match = id_pattern.search(ep.path)
        if match:
            resource_type = match.group(1)
            # Test sequential IDs (e.g., ID 1 vs ID 2 vs ID 3) to test Broken Object Level Authorization
            test_paths = [
                re.sub(r"(?<=/)(?:\d+|\{[^}]+\})", "1", ep.path),
                re.sub(r"(?<=/)(?:\d+|\{[^}]+\})", "2", ep.path),
                re.sub(r"(?<=/)(?:\d+|\{[^}]+\})", "3", ep.path)
            ]
            
            try:
                responses = []
                for p in test_paths:
                    url = target_url.rstrip("/") + p
                    headers = {"Authorization": f"Bearer {auth_token}"} if auth_token else {}
                    r = await client.get(url, headers=headers, timeout=3.0)
                    if r.status_code == 200:
                        responses.append((p, r.text[:200]))

                # If the client can access multiple distinct tenant records without resource ownership validation
                if len(responses) >= 2:
                    findings.append(Finding(
                        id=f"bola_{abs(hash(ep.path)) % 10000}",
                        title="Broken Object Level Authorization (BOLA / IDOR)",
                        category=SecurityCategory.AUTHZ,
                        severity=SeverityLevel.HIGH,
                        endpoint=ep.path,
                        method="GET",
                        description=f"Endpoint '{ep.path}' allows retrieving arbitrary user/tenant records (e.g., IDs 1, 2, 3) without verifying object ownership.",
                        evidence={
                            "accessed_paths": [item[0] for item in responses],
                            "sample_response": responses[0][1]
                        },
                        impact="Attackers can enumerate and view private records of other users and organizations.",
                        recommendation="Implement strict authorization checks verifying that the requested resource ID belongs to the authenticated caller.",
                        remediation_code="@router.get('/users/{user_id}')\ndef get_user(user_id: int, current_user: User = Depends(get_current_user)):\n    if current_user.id != user_id and current_user.role != 'admin':\n        raise HTTPException(status_code=403, detail='Access denied')\n    return db.get_user(user_id)",
                        status=FindingStatus.FAIL,
                        cwe_id="CWE-639"
                    ))
            except Exception:
                pass

    return findings
