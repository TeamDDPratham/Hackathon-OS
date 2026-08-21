---
name: testing
description: Execute systematic testing across unit, integration, edge-case, and UI browser journeys, proactively finding bugs before judges do.
---

# Testing & Verification Skill

## Purpose
This skill actively hunts bugs, edge cases, and runtime exceptions, ensuring zero embarrassing glitches occur during live evaluation.

## Testing Strategy
1. **Unit Testing**:
   - Test domain logic, scoring algorithms, and utility transformers in isolation.
   - Assert edge conditions (null values, boundary numbers, empty arrays, unicode strings).
2. **API & Integration Testing**:
   - Verify HTTP status codes (`200`, `201`, `400`, `401`, `404`, `422`).
   - Validate payload schemas against standardized response structures.
3. **Browser Journey Verification**:
   - Manually or via Playwright verify the complete critical user path:
     - Page load $\to$ Authentication $\to$ Form Submission $\to$ Async Processing $\to$ Result Display.
   - Verify that clicking buttons multiple times does not trigger race conditions or duplicate network calls.
4. **Zero Flakiness Rule**:
   - If an automated test fails intermittently, identify the root timing/async issue and fix it immediately. Never ignore failing tests.
