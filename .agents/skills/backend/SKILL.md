---
name: backend
description: Engineer robust, secure, and typed API endpoints, domain services, middleware, request validation schemas, and structured error handling.
---

# Backend Engineering Skill

## Purpose
This skill ensures the backend API and domain services operate reliably, securely, and with high predictability under demo and edge-case conditions.

## Backend Engineering Rules
1. **Strict Input Validation**:
   - Every route MUST validate incoming path, query, and body payloads against strong schemas (Pydantic / Zod / Joi).
   - Reject invalid requests early with descriptive HTTP `400` / `422` status codes.
2. **Layered Separation of Concerns**:
   - **Controllers / Route Handlers**: Handle HTTP requests, parse inputs, call domain services, format responses.
   - **Domain Services**: Execute business logic, manage state transitions, coordinate external integrations.
   - **Repositories**: Execute database queries and encapsulate persistence mechanisms.
3. **Structured Response Contracts**:
   - Follow consistent JSON response structures:
     ```json
     {
       "success": true,
       "data": { ... },
       "error": null
     }
     ```
   - On error:
     ```json
     {
       "success": false,
       "data": null,
       "error": { "code": "VALIDATION_FAILED", "message": "Field 'email' is invalid" }
     }
     ```
4. **Resilient Error & Exception Handling**:
   - Implement global exception middleware to catch unexpected runtime panics and return standardized `500` envelopes without leaking internal stack traces.
5. **Observability & Logging**:
   - Log meaningful request lifecycle events (method, path, status, latency) for easy debugging.
