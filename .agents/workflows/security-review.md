# Workflow: Security Review & Security Recheck (security-review)

## Purpose
Perform a structured security audit across secret management, injection vectors, authentication, authorization, and data handling. This workflow supports two explicit operating contexts: **Initial Security Review** and **Post-Polish Security Recheck**.

## Context Modes

### Context A: INITIAL SECURITY REVIEW
- **When Triggered**: In the core build lifecycle between `test-project` and `red-team`.
- **Scope**: Comprehensive baseline security audit of newly constructed schemas, auth middleware, API routes, and secret configurations.

### Context B: SECURITY RECHECK
- **When Triggered**: In the post-polish lifecycle immediately following `regression-test` and prior to `demo-resilience`.
- **Scope**: Lightweight, targeted delta verification focusing exclusively on security regressions, accidental secret exposure, or broken authorization boundaries introduced during the polish and bug-fixing phase.

---

## Lifecycle Position

### In Core Build Phase:
```text
TEST-PROJECT ──▶ [SECURITY-REVIEW (Initial)] ──▶ RED-TEAM ──▶ JUDGE-REVIEW
```

### In Post-Polish Phase:
```text
POLISH-PRODUCT ──▶ REGRESSION-TEST ──▶ [SECURITY-REVIEW (Recheck)] ──▶ DEMO-RESILIENCE ──▶ PREPARE-DEMO
```

---

## Relevant Skills
- [`.agents/skills/security`](../skills/security/SKILL.md)

## Inputs
- Full codebase, `.env.example`, `.gitignore`, API endpoints, and database models.

---

## Step-by-Step Procedure

### 1. Secret & Git Hygiene Audit
- Check `.gitignore` contains `.env`, `.env.*`, credentials, and keys.
- Scan codebase and recent diffs for hardcoded API keys, passwords, or tokens.

### 2. Injection & Input Validation Audit
- Verify all database queries use ORM or parameterized SQL.
- Verify frontend safely escapes user-generated and AI-generated content.
- Verify shell executions (if any) do not pass raw user strings.

### 3. Auth & Access Control Audit
- Verify protected routes strictly enforce authentication tokens.
- Check for IDOR (ensure users cannot access other users' records).

### 4. Document Findings & Remediation
- Fix all critical and high-severity security issues immediately.
- If in **Security Recheck** mode, verify specifically that UI/UX polish additions did not expose private endpoints or client-side tokens.
- Document resolved items in [`docs/risk-register.md`](../../docs/risk-register.md).

---

## Expected Outputs
- Zero critical or high-severity vulnerabilities.
- Clean `.gitignore` and `.env` hygiene.

## Verification Criteria
- [ ] No hardcoded secrets anywhere in the repo.
- [ ] All API inputs are strictly schema-validated.
- [ ] Auth boundaries are verified.
