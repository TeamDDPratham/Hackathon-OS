---
name: security
description: Audit authentication, authorization, secret hygiene, input sanitization, injection vectors, and dependency vulnerabilities.
---

# Security & Compliance Skill

## Purpose
This skill audits the codebase for security flaws, secret leaks, and data exposure vulnerabilities that could compromise the project or turn off technical judges.

## Security Audit Checklist
1. **Secret & Credential Hygiene**:
   - Verify `.env` is listed in `.gitignore`.
   - Grep codebase for hardcoded tokens, API keys, private certificates, or local absolute credential paths.
2. **Input Validation & Injection Prevention**:
   - Check SQL injection: ensure all database calls use parameterized queries or ORM abstractions.
   - Check XSS: ensure React/frontend framework sanitizes HTML dangerously set by user or AI inputs.
   - Check Command Injection: never pass untrusted strings to shell execution functions.
3. **Authentication & Authorization**:
   - Verify that private endpoints validate JWT/session tokens.
   - Enforce resource ownership checks (prevent IDOR — Insecure Direct Object References).
4. **CORS & Headers**:
   - Configure restrictive CORS origins for production builds.
   - Prevent unnecessary headers exposing framework versions.
