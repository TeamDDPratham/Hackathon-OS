# Workflow: Test Project

## Purpose
Execute a comprehensive quality, regression, build, and browser verification suite across all frontend and backend services.

## Lifecycle Position
```text
BUILD-FEATURE ──▶ [TEST-PROJECT] ──▶ SECURITY-REVIEW ──▶ RED-TEAM
```

## Prerequisites
- Completed features or MVP build ready for verification.

## Relevant Skills
- [`.agents/skills/testing`](../skills/testing/SKILL.md)
- [`.agents/skills/runtime-management`](../skills/runtime-management/SKILL.md)

## Inputs
- Full codebase.

## Step-by-Step Procedure
1. **Run Typechecks & Linters**: Execute compiler/type checks and ensure zero fatal linter errors.
2. **Execute Automated Unit & Integration Tests**:
   - Run backend test runner (e.g., `pytest`, `vitest`, `npm test`).
   - Assert all tests pass green.
3. **Execute Build Verification**:
   - Run production build command (e.g., `npm run build`, `pnpm build`).
   - Verify zero build/bundling errors.
4. **Tooling-Aware Browser & UI Verification**:
   - **Step A**: Detect available browser automation tools (Playwright / Puppeteer).
   - **Step B**: If automation tooling is installed and configured, execute automated e2e scripts.
   - **Step C**: If automation tooling is unavailable, start local server, verify active listening port with `runtime-management`, and execute manual UI journey or active browser tool.
   - **Step D**: Explicitly document in test results whether verification was automated or manual.
5. **Log & Fix Failures**: Immediately fix any identified regressions or test failures.

## Expected Outputs
- 100% passing test suite.
- Clean production build output.
- Verified UI journey with no console errors.

## Verification Criteria
- [ ] Automated tests pass completely.
- [ ] Build succeeds without warnings treated as errors.
- [ ] No uncaught console exceptions during UI journey.
