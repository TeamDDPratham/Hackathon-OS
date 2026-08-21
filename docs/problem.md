# Hackathon Problem Statement & Deconstruction

> **Project Name**: Sentinel API (Automated API Security Testing Platform)  
> **Ingestion Timestamp**: 2026-08-22 00:20 IST  
> **Total Time Budget**: 6.0 Hours (Reserved Buffer: 1.0 Hour / Effective Build Window: 5.0 Hours)

---

## 1. Problem Statement
APIs frequently expose sensitive application business logic and databases. Weak authentication, authorization controls (BOLA/IDOR), missing input validation, excessive error disclosure, missing security headers, and unrestricted rate-limiting leave APIs vulnerable to abuse and data breaches. Developers and security auditors need a safe, automated, deterministic platform to evaluate target APIs, surface vulnerabilities with actionable evidence, and receive remediation guidance.

---

## 2. Target Personas
1. **Primary**: Backend / Security Engineer (Needs to test API endpoints against OWASP API Top 10 vulnerabilities with reproducible evidence and remediation).
2. **Secondary / Judge**: Hackathon Evaluator (Needs a 1-click Demo Target scan to instantly visualize vulnerabilities, progress, security score, and remediation in <60 seconds).

---

## 3. Explicit Requirements
1. **Target Input & Discovery**: Support direct URL target input and OpenAPI / Swagger spec ingestion.
2. **Deterministic Security Test Engine**:
   - Authentication Testing (PASS / WARN / FAIL on unprotected routes).
   - Authorization & Access Control (Compare unauthenticated vs authenticated access).
   - Input Validation (Safe bounded malformed strings, oversized numbers, invalid JSON types).
   - Security Headers Check (`CSP`, `HSTS`, `X-Content-Type-Options`, `X-Frame-Options`).
   - Rate Limiting Indicators (Safe bounded repeated requests, Retry-After header detection).
   - Information Disclosure (Stack traces, framework/version leaks, database error messages).
3. **Finding Normalizer & Risk Scoring**: Standardized finding schema with Severity (CRITICAL, HIGH, MEDIUM, LOW, INFO) and deterministic score (0–100).
4. **Remediation Guidance**: Clear description of what was detected, why it matters, evidence, endpoint, and actionable code/config fix.
5. **Local Demo Vulnerable API**: Self-contained intentionally vulnerable test target for 100% offline, fail-safe live judging.
6. **Cybersecurity Dashboard UI**: Real-time progress bar, statistics, severity badges, interactive finding drawer/modal, 4-state handling.

---

## 4. Constraints & Safety Guardrails
- **Defensive & Non-Destructive**: Zero destructive exploitation, zero denial-of-service, zero credential stuffing, bounded safe payloads.
- **Zero Cloud / AI Dependencies for Core Engine**: Fully operational offline without Gemini/external keys; optional AI for plain-language explanations with deterministic fallback.
- **Strict 6-Hour Time Window**: Avoid microservices, Kubernetes, complex multi-tenant auth, or heavy enterprise bloat.

---

## 5. Success Metrics
- End-to-end scan on Demo Target completes in <10 seconds.
- 100% reproducible deterministic security score and finding evidence.
- Zero uncaught exceptions; complete 4-state UI coverage.
