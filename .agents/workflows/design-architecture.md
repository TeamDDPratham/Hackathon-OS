# Workflow: Design Architecture

## Purpose
Select the optimal technology stack based on the approved solution concept, design modular layered architecture, define data models and API contracts, and document architectural decisions.

## Lifecycle Position
```text
🛑 [HUMAN GATE 1 APPROVED] ──▶ [DESIGN-ARCHITECTURE] ──▶ INIT-ENV ──▶ CREATE-MVP
```

## Prerequisites
- User sign-off at **Mandatory Human Gate 1**.
- Completed [`docs/hackathon-strategy.md`](../../docs/hackathon-strategy.md).

## Relevant Skills
- [`.agents/skills/architecture`](../skills/architecture/SKILL.md)
- [`.agents/skills/backend`](../skills/backend/SKILL.md)
- [`.agents/skills/database`](../skills/database/SKILL.md)
- [`.agents/skills/ai-engineering`](../skills/ai-engineering/SKILL.md)
- [`.agents/skills/documentation`](../skills/documentation/SKILL.md)

## Inputs
- Approved solution strategy from `docs/hackathon-strategy.md`.

## Step-by-Step Procedure
1. **Technology Stack Selection**: Choose the fastest, most reliable frameworks for Frontend, Backend, DB, and AI.
2. **Layered Component Design**:
   - Establish presentation, API, service, repository, and persistence boundaries.
   - Isolate AI interactions into dedicated services with structured outputs.
3. **Data Modeling**: Design entities, relationships, indexes, and migrations strategy.
4. **API Contracts**: Define endpoint routes, request schemas, response formats, and error codes.
5. **Security & Deployment Planning**: Plan auth mechanism, secret storage, and preview hosting.
6. **Populate Documentation (Gate A Milestone)**:
   - Update [`docs/architecture.md`](../../docs/architecture.md).
   - Record Architecture Decision Records in [`docs/decisions.md`](../../docs/decisions.md).
   - Update [`docs/current-state.md`](../../docs/current-state.md).

## Expected Outputs
- Populated [`docs/architecture.md`](../../docs/architecture.md).
- New ADR entries in [`docs/decisions.md`](../../docs/decisions.md).
- Updated [`docs/current-state.md`](../../docs/current-state.md).

## Verification Criteria
- [ ] Layered separation rules in `AGENTS.md` are respected (no UI $\to$ DB shortcuts).
- [ ] AI services are isolated behind dedicated interfaces.
- [ ] No application code is written yet; architecture is fully documented.
