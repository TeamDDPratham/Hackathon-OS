# Workflow: Demo Resilience & Graceful Fallbacks

## Purpose
Implement and verify multi-layer failovers, local response caching, and deterministic demo fixtures so that external network dropouts or LLM rate limits cannot break the live presentation.

## Lifecycle Position
```text
POLISH-PRODUCT ──▶ [DEMO-RESILIENCE] ──▶ PREPARE-DEMO ──▶ FINAL-AUDIT
```

## Prerequisites
- Completed application with working features and API endpoints.

## Relevant Skills
- [`.agents/skills/demo-resilience`](../skills/demo-resilience/SKILL.md)
- [`.agents/skills/ai-engineering`](../skills/ai-engineering/SKILL.md)
- [`.agents/skills/testing`](../skills/testing/SKILL.md)

## Step-by-Step Procedure
1. **Identify Critical Demo Paths**:
   - Trace the exact user journey that will be showcased during the 3-minute presentation.
2. **Build High-Fidelity Mock Fixtures**:
   - Save realistic, pre-computed response payloads in the project fixture folder (`tests/fixtures/` or `mock-data/`).
   - Verify fixture schemas exactly match production types.
3. **Configure Service Fallback Layer**:
   - Implement timeout guards (e.g. 3.5s limit) on all external AI and 3rd-party API calls.
   - On timeout or HTTP 429/500, seamlessly serve the structured fallback fixture.
4. **Add Emergency Demo Mode Toggle**:
   - Enable `?demo_mode=true` query param or `FALLBACK_MODE=true` environment flag for offline zero-latency presentation.
5. **Simulate Outage Verification**:
   - Disable internet or inject fake API errors and execute the complete demo flow.
   - Confirm the UI remains functional, responsive, and aesthetically pristine.

## Expected Outputs
- Hardened fallback handlers across all critical API/AI calls.
- Verified fixture files conforming to current data contracts.

## Verification Criteria
- [ ] Application completes the full demo flow with network disabled.
- [ ] No unhandled UI crashes or broken layouts during fallback activation.
