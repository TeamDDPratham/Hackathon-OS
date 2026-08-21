# Sentinel API — System Architecture & Design

> **Status**: APPROVED (Post Human Gate 1)  
> **Last Updated**: 2026-08-22 00:26 IST

---

## 1. System Topology

```text
┌────────────────────────────────────────────────────────────────────────┐
│             PRESENTATION LAYER (Next.js 14 / TypeScript)               │
│  - Cyber Dark Dashboard (Tailwind CSS, Lucide Icons)                   │
│  - Real-Time Scan Progress & Statistics                                │
│  - Interactive Finding Inspector & Code Diff Viewer                    │
│  - Deterministic Security Score Meter (0-100)                          │
│  - 4-State UI (Loading Skeleton, Empty State, Active Scan, Error)      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP REST & SSE Polling
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 API & ROUTING LAYER (FastAPI / Python)                 │
│  - /api/health (Health check)                                          │
│  - /api/scans (POST: start scan, GET: list scans)                      │
│  - /api/scans/{id} (GET: scan details, POST: cancel)                   │
│  - /api/scans/{id}/findings (GET: categorized vulnerabilities)         │
│  - /api/demo/scan (POST: 1-click mock vulnerable scan)                 │
│  - /api/mock-vulnerable/* (Intentionally vulnerable demo endpoints)    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│             SERVICE & SCAN ENGINE LAYER (Python Services)              │
│  - ScanOrchestrator: Coordinates discovery, execution, normalization   │
│  - EndpointDiscovery: Extracts routes from OpenAPI specs or crawls     │
│  - SecurityModules:                                                    │
│    ├── 1. AuthEngine (Missing auth on sensitive endpoints)             │
│    ├── 2. AuthZEngine (BOLA / IDOR cross-tenant access testing)        │
│    ├── 3. InputValidationEngine (Type confusion, boundary checks)      │
│    ├── 4. SecurityHeadersEngine (CSP, HSTS, X-Frame, X-Content-Type)   │
│    ├── 5. RateLimitEngine (Bounded burst tests, Retry-After header)    │
│    └── 6. InfoDisclosureEngine (Stack trace leaks, SQL syntax errors)  │
│  - ScoringEngine: Deterministic formula: 100 - sum(severity_weights)   │
│  - RemediationEngine: Deterministic code/config remediation rules      │
│  - AIService: Optional Gemini explanations with 100% offline fallback  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│             PERSISTENCE LAYER (In-Memory / SQLite)                     │
│  - ScanStore (Stores scans, findings, discovered endpoints)            │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. API Contract & Schema Definition

### Finding Schema:
```json
{
  "id": "find_auth_01",
  "title": "Unauthenticated Access to Sensitive Resource",
  "category": "Authentication",
  "severity": "HIGH",
  "endpoint": "/api/users/profile",
  "method": "GET",
  "description": "The endpoint was accessed without an Authorization header and returned 200 OK with sensitive user payload.",
  "evidence": {
    "request": "GET /api/users/profile HTTP/1.1\nHost: target-api",
    "response_status": 200,
    "response_sample": "{\"id\": 1, \"email\": \"admin@company.com\", \"role\": \"admin\"}"
  },
  "impact": "Unauthenticated attackers can exfiltrate sensitive user records.",
  "recommendation": "Enforce authentication middleware on all private API routes and verify JWT signatures.",
  "remediation_code": "@router.get('/profile')\ndef get_profile(current_user: User = Depends(get_current_user)):\n    return current_user",
  "status": "FAIL"
}
```

### Deterministic Score Calculation:
- **Starting Score**: `100`
- **Penalty Weights**:
  - `CRITICAL`: -25 points
  - `HIGH`: -15 points
  - `MEDIUM`: -8 points
  - `LOW`: -3 points
  - `INFO`: 0 points
- **Clamped Score**: `max(0, min(100, 100 - TotalPenalties))`
- **Score Ratings**:
  - `90 - 100`: Excellent (A)
  - `75 - 89`: Good (B)
  - `60 - 74`: Needs Improvement (C)
  - `40 - 59`: Poor (D)
  - `0 - 39`: Critical Vulnerabilities Found (F)
