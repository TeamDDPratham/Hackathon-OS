# Workflow: Prepare Demo

## Purpose
Engineer a bulletproof, deterministic 3-minute live presentation script, seed realistic demo data, and establish offline/fallback contingency protocols.

## Lifecycle Position
```text
DEMO-RESILIENCE ──▶ [PREPARE-DEMO] ──▶ FINAL-AUDIT
```

## Prerequisites
- Polished product with verified fallbacks and passing tests.

## Relevant Skills
- [`.agents/skills/demo-engineering`](../skills/demo-engineering/SKILL.md)
- [`.agents/skills/documentation`](../skills/documentation/SKILL.md)

## Inputs
- Final working product and [`docs/hackathon-strategy.md`](../../docs/hackathon-strategy.md).

## Step-by-Step Procedure
1. **Refine 3-Minute Demo Script**:
   - Complete [`docs/demo-script.md`](../../docs/demo-script.md) with exact timing breakdowns:
     - 0:00–0:30 (Hook & Pain Point)
     - 0:30–1:15 (Core Solution Live)
     - 1:15–2:00 (Killer Feature "Wow" Moment)
     - 2:00–2:40 (Technical Differentiation & Architecture)
     - 2:40–3:00 (Impact & Closing)
2. **Build Deterministic Demo Reset**:
   - Provide a 1-click button or script to reset seed data to pristine state before presenting.
3. **Set Up Emergency Fallbacks**:
   - Open a backup tab with pre-cached results or pre-recorded 60-second video demo in case of live internet failure.
4. **Conduct Rehearsal Run**:
   - Time the walkthrough end-to-end and verify that every click, keystroke, and response executes smoothly.

## Expected Outputs
- Fully finalized [`docs/demo-script.md`](../../docs/demo-script.md).
- Ready-to-demo application with pristine seed data and fallback contingencies.

## Verification Criteria
- [ ] Complete demo runs in under 3 minutes (180 seconds).
- [ ] Emergency backup plan is verified and ready in a background tab.
