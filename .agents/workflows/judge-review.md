# Workflow: Judge Review

## Purpose
Simulate a skeptical hackathon judge evaluation, quantitatively score the project against the 100-point rubric, identify fatal weaknesses, and prepare for **Mandatory Human Gate 2**.

## Lifecycle Position
```text
RED-TEAM ──▶ [JUDGE-REVIEW] ──▶ 🛑 [MANDATORY HUMAN GATE 2] ──▶ POLISH-PRODUCT
```

## Prerequisites
- Completed application with working features, passing tests, and red-team hardening.

## Relevant Skills
- [`.agents/skills/hackathon-judge`](../skills/hackathon-judge/SKILL.md)
- [`.agents/skills/hackathon-strategy`](../skills/hackathon-strategy/SKILL.md)

## Inputs
- Completed product, documentation, and user journeys.

## Step-by-Step Procedure
1. **Apply 10-Dimension Scorecard**:
   - Score each of the 10 dimensions from 1 to 10 in [`docs/judge-review.md`](../../docs/judge-review.md).
2. **Perform Qualitative Audit**:
   - Identify the single **Biggest Strength**.
   - Identify the single **Biggest Weakness / Vulnerability**.
   - Formulate the **Top 3 Most Dangerous Judge Questions** and prep strong defenses.
3. **Select Top 3 High-ROI Fixes**:
   - Identify the 3 most impactful, rapid-to-implement enhancements that will raise the score immediately.
4. **Update Documentation (Gate C Milestone)**:
   - Save full evaluation into [`docs/judge-review.md`](../../docs/judge-review.md).
   - Update [`docs/hackathon-strategy.md`](../../docs/hackathon-strategy.md).
5. **🛑 MANDATORY HUMAN GATE 2 PRESENTATION**:
   - Present the audit findings to the user:
     1. Current simulated score (/100)
     2. Biggest weaknesses & vulnerabilities
     3. Top 3 highest-ROI improvements
     4. Estimated time for each
     5. Expected judging impact
     6. Risks of implementing each
   - **STOP AND WAIT FOR EXPLICIT USER APPROVAL BEFORE PROCEEDING TO POLISH-PRODUCT.**

## Expected Outputs
- Completed scorecard and qualitative audit in `docs/judge-review.md`.
- User sign-off at Human Gate 2 on polish priorities.

## Verification Criteria
- [ ] No unearned or inflated scores; realistic, critical evaluation.
- [ ] Agent pauses for user approval at Human Gate 2.
