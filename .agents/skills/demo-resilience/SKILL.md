---
name: demo-resilience
description: Architect and verify 3-layer graceful fallbacks, deterministic mock fixtures, and contingency modes for live hackathon presentations.
---

# Demo Resilience & Graceful Fallback Skill

## Purpose
This skill ensures the application never breaks or produces raw error states during live judging, even when third-party AI APIs, cloud databases, or networks experience latency or complete outages.

## The 3-Layer Fallback Hierarchy

```text
Layer 1: PRIMARY (Live API / LLM / Network Execution)
   │ (Timeout > 3.5s, 429 Rate Limit, Network Drop, Malformed JSON)
   ▼
Layer 2: SECONDARY (Low-temp retry or lightweight local rule-based heuristic)
   │ (Complete model failure, severe rate-limit exhaustion)
   ▼
Layer 3: DETERMINISTIC FIXTURE (High-fidelity pre-computed mock seed data)
```

## Fixture & Mock Convention Standards
1. Store demo fallback seeds in a dedicated fixture directory based on stack:
   - Python: `tests/fixtures/` or `backend/fixtures/`
   - TypeScript/Node: `src/fixtures/` or `mock-data/`
2. **Schema Invariant**: Fixture objects MUST match 100% of the production schema and TypeScript/Pydantic types.
3. **Contract Synchronization**: Whenever an API route or model changes:
   - Update database model $\to$ Update API schema $\to$ Update fixture file $\to$ Update fallback service.
4. **Honest Separation**: Clearly flag fallback states in internal developer logs (e.g. `[DEMO-FALLBACK-ACTIVE]`), but maintain a seamless, polished UI experience for the user.

## Emergency Presentation Flags
Implement a URL parameter or environment variable toggle:
- `?demo_mode=true` or `FALLBACK_MODE=true`
- Instantly forces verified deterministic mock fixtures during internet failure on stage.
