# Workflow: Build Feature

## Purpose
Incrementally implement a single well-defined feature (such as the KILLER FEATURE or high-priority enhancement) following strict layered boundaries and verification steps.

## Lifecycle Position
```text
CREATE-MVP ──▶ [BUILD-FEATURE] ──▶ TEST-PROJECT ──▶ SECURITY-REVIEW
```

## Prerequisites
- A working baseline MVP.
- Feature prioritized in [`docs/hackathon-strategy.md`](../../docs/hackathon-strategy.md).

## Relevant Skills
- [`.agents/skills/backend`](../skills/backend/SKILL.md)
- [`.agents/skills/frontend`](../skills/frontend/SKILL.md)
- [`.agents/skills/ai-engineering`](../skills/ai-engineering/SKILL.md)
- [`.agents/skills/testing`](../skills/testing/SKILL.md)
- [`.agents/skills/git-safety`](../skills/git-safety/SKILL.md)

## Step-by-Step Procedure
1. **Inspect Existing Architecture**: Review existing services, schemas, and endpoints to avoid duplication.
2. **Design Interfaces**: Define request/response models and service signatures.
3. **Implement Service & Logic**:
   - If AI-powered: write versioned prompt, define strict JSON output schema, and configure fallback handling.
   - If domain logic: write pure functions and business algorithms.
4. **Implement API Route**: Expose validated HTTP endpoint with error handling.
5. **Implement UI Component**: Build responsive frontend component with the 4 UI states.
6. **Automated & Manual Verification**:
   - Run unit/integration tests for the new endpoint.
   - Verify user interaction end-to-end.
7. **Update Live Memory**: Update [`docs/current-state.md`](../../docs/current-state.md) and commit logical checkpoint.

## Expected Outputs
- Verified working feature integrated into the codebase.
- Updated `docs/current-state.md`.

## Verification Criteria
- [ ] Feature satisfies Definition of Done in `AGENTS.md`.
- [ ] No regression in previously working features.
- [ ] Tested across all 4 UI states.
