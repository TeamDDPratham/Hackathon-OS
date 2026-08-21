# Workflow: Create MVP

## Purpose
Scaffold and build the minimal end-to-end working product (CORE tier features only) capable of proving the fundamental value proposition.

## Lifecycle Position
```text
INIT-ENV ──▶ [CREATE-MVP] ──▶ BUILD-FEATURE ──▶ TEST-PROJECT
```

## Prerequisites
- Verified local environment from [`init-env.md`](./init-env.md).
- Completed [`docs/architecture.md`](../../docs/architecture.md).

## Relevant Skills
- [`.agents/skills/rapid-prototyping`](../skills/rapid-prototyping/SKILL.md)
- [`.agents/skills/backend`](../skills/backend/SKILL.md)
- [`.agents/skills/frontend`](../skills/frontend/SKILL.md)
- [`.agents/skills/database`](../skills/database/SKILL.md)
- [`.agents/skills/git-safety`](../skills/git-safety/SKILL.md)

## Step-by-Step Procedure
1. **Create Pre-Scaffold Git Checkpoint**: Commit baseline setup via `git-safety`.
2. **Setup Database & Migrations**: Define initial schemas, run migrations, and write a realistic `seeds/` script.
3. **Implement Core Backend Service**: Implement the primary domain service and API endpoints.
4. **Implement Core Frontend View**: Build the primary screen with clean visual hierarchy, form input, and 4 UI states (loading, empty, populated, error).
5. **Wire End-to-End Vertical Slice**: Connect UI $\to$ API $\to$ Service $\to$ DB $\to$ UI.
6. **Verify Startup & Flow**: Launch local server and test the primary journey.
7. **Update Live Memory (Gate B Milestone)**: Update [`docs/current-state.md`](../../docs/current-state.md) and [`docs/risk-register.md`](../../docs/risk-register.md).

## Expected Outputs
- A working, launchable MVP implementing 100% of CORE tier features.
- Updated `docs/current-state.md`.

## Verification Criteria
- [ ] Application starts locally without errors.
- [ ] Primary user workflow can be executed end-to-end.
- [ ] No OPTIONAL or non-essential features were built yet.
