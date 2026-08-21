# Workflow: Polish Product

## Purpose
Execute targeted visual, UX, performance, and narrative refinements (focusing on the Top 3 High-ROI fixes approved at Human Gate 2).

## Lifecycle Position
```text
🛑 [HUMAN GATE 2 APPROVED] ──▶ [POLISH-PRODUCT] ──▶ REGRESSION-TEST ──▶ SECURITY-REVIEW ──▶ DEMO-RESILIENCE
```

## Prerequisites
- User sign-off at **Mandatory Human Gate 2**.
- Identified Top 3 High-ROI fixes from [`docs/judge-review.md`](../../docs/judge-review.md).

## Relevant Skills
- [`.agents/skills/ux`](../skills/ux/SKILL.md)
- [`.agents/skills/frontend`](../skills/frontend/SKILL.md)
- [`.agents/skills/performance`](../skills/performance/SKILL.md)

## Inputs
- Top 3 High-ROI improvements from `docs/judge-review.md`.

## Step-by-Step Procedure
1. **Implement High-ROI Fix 1**: Complete and verify the first priority improvement.
2. **Implement High-ROI Fix 2**: Complete and verify the second priority improvement.
3. **Implement High-ROI Fix 3**: Complete and verify the third priority improvement.
4. **UI & UX Refinement**:
   - Polish button states, hover transitions, and micro-copy.
   - Add sample data "Try Sample Scenario" buttons for 1-click judge exploration.
   - Clean up spacing, typography hierarchy, and alignment across viewports.
5. **Performance Polish**:
   - Ensure initial page load is fast and AI streaming starts displaying within 500ms.
6. **Mandatory Post-Polish Regression Handoff**:
   - **DO NOT assume UI changes are safe.**
   - Immediately transition to [`regression-test.md`](./regression-test.md) to ensure no functionality was broken.

## Expected Outputs
- A visually elevated, fast, and friction-free product ready for regression testing.

## Verification Criteria
- [ ] Top 3 High-ROI fixes are fully implemented.
- [ ] Flow transitions directly to `regression-test` before demo preparation.
