# Workflow: Regression Testing (regression-test)

## Purpose
Enforce a strict quality gate after any significant change (polish, refactoring, AI prompt update, schema migration, or auth change) to guarantee that previously working features and core user journeys have not broken.

## Lifecycle Position
```text
POLISH-PRODUCT ──▶ [REGRESSION-TEST] ──▶ SECURITY-REVIEW (Recheck) ──▶ DEMO-RESILIENCE ──▶ PREPARE-DEMO
```

## Prerequisites
- Working application with newly introduced feature, bug fix, or polish adjustment.

## Relevant Skills
- [`.agents/skills/testing`](../skills/testing/SKILL.md)
- [`.agents/skills/runtime-management`](../skills/runtime-management/SKILL.md)

## Step-by-Step Procedure
1. **Pillar 1: Build & Typecheck**:
   - Run production build command (`npm run build` / `pnpm build` / compiler check).
   - Assert zero build failures.
2. **Pillar 2: Automated Unit & Integration Suite**:
   - Run backend and frontend automated test runners.
   - Assert 100% test pass rate.
3. **Pillar 3: Application Startup & Port Hygiene**:
   - Start the local dev server using `runtime-management`.
   - Confirm application process is listening on the assigned port without zombie conflicts.
4. **Pillar 4: Core User Journey Verification**:
   - Execute the primary end-to-end user workflow:
     - Form input $\to$ Service processing $\to$ AI response/Data rendering $\to$ State update.
5. **Pillar 5: Killer Feature & AI Verification**:
   - Specifically trigger the Killer Feature and ensure latency is low (<2s) and structured outputs conform to schemas.
6. **Pillar 6: Fallback Verification**:
   - Verify that deterministic fallback mocks work properly if network is disabled.
7. **Transition to Security Recheck**:
   - After regression test passes, transition directly to [`security-review.md`](./security-review.md) in **Security Recheck** context.

## Regression Gate Rule
🛑 **DO NOT PROCEED TO SECURITY RECHECK OR DEMO RESILIENCE IF REGRESSION VERIFICATION FAILS.**
If any test or flow fails, route immediately to `iterate.md` or `test-project.md` to patch the regression before moving forward.

## Expected Outputs
- Fully verified application state with zero regressions across core flows.
- Clean handoff to `security-review` (Security Recheck mode).
