import pytest
import pytest_asyncio
import httpx
from backend.main import app
from backend.models.schemas import Finding, SeverityLevel
from backend.services.scoring import calculate_security_score

@pytest.mark.asyncio
async def test_health_endpoint():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "sentinel-api-backend"

@pytest.mark.asyncio
async def test_mock_vulnerable_endpoints():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as client:
        # Check admin users unauthenticated access
        resp = await client.get("/api/mock-vulnerable/admin/users")
        assert resp.status_code == 200
        assert len(resp.json()) >= 3

        # Check BOLA endpoint
        resp_user1 = await client.get("/api/mock-vulnerable/users/1")
        assert resp_user1.status_code == 200
        assert resp_user1.json()["username"] == "alice"

        # Check search error leak
        resp_err = await client.post("/api/mock-vulnerable/search", json={"query": "admin' OR 1=1 --"})
        assert resp_err.status_code == 500
        assert "Syntax error in SQL" in resp_err.text

def test_deterministic_scoring():
    # 1. Zero findings -> Score 100 Grade A
    score, grade = calculate_security_score([])
    assert score == 100
    assert grade == "A"

    # 2. Critical (-25) + High (-15) + Medium (-8) = 100 - 48 = 52 Grade D
    mock_findings = [
        Finding(
            id="f1", title="Critical Flaw", category="Authentication",
            severity=SeverityLevel.CRITICAL, endpoint="/api/test", method="GET",
            description="desc", impact="imp", recommendation="rec"
        ),
        Finding(
            id="f2", title="High Flaw", category="Authorization / Access Control",
            severity=SeverityLevel.HIGH, endpoint="/api/test", method="GET",
            description="desc", impact="imp", recommendation="rec"
        ),
        Finding(
            id="f3", title="Med Flaw", category="Security Headers",
            severity=SeverityLevel.MEDIUM, endpoint="/api/test", method="GET",
            description="desc", impact="imp", recommendation="rec"
        )
    ]
    score, grade = calculate_security_score(mock_findings)
    assert score == 52
    assert grade == "D"
