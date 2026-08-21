# Workflow: Time & Operational Mode Check (time-check)

## Purpose
Inspect the current hackathon clock, calculate remaining time and percentages, determine the active operational mode (Normal, Accelerated, MVP Lock, Demo Freeze, Submission Lock), and output allowed/prohibited actions and recommended next steps.

## Lifecycle Position
```text
┌────────────────────────────────────────────────────────────────────────┐
│                        TIME CONTROLLER RUNBOOK                         │
│   Reads Clock ──▶ Calculates Metrics ──▶ Resolves Mode ──▶ Sets Guardrails│
└────────────────────────────────────────────────────────────────────────┘
```

## Prerequisites
- Start time and total duration provided by user or saved in [`docs/current-state.md`](../../docs/current-state.md).

## Relevant Skills
- [`.agents/skills/time-management`](../skills/time-management/SKILL.md)
- [`.agents/skills/hackathon-strategy`](../skills/hackathon-strategy/SKILL.md)

## Step-by-Step Procedure
1. **Read Clock Parameters**:
   - Check `docs/current-state.md` for `Total Duration` and `Start Time`.
   - If not set and needed for planning, prompt the user for the total duration (e.g. 12h, 24h, 36h).
2. **Calculate Timing Metrics**:
   - $\text{Elapsed} = \text{Current Time} - \text{Start Time}$
   - $\text{Remaining} = \text{Total Time} - \text{Elapsed Time}$
   - $\text{Remaining \%} = (\text{Remaining} / \text{Total Time}) \times 100$
   - $\text{Reserved Buffer} = 10\% \text{ to } 15\% \text{ of Total Time}$
3. **Determine Active Operational Mode**:
   - **NORMAL MODE**: $> 50\%$ remaining
   - **ACCELERATED MODE**: $25\% – 50\%$ remaining
   - **MVP LOCK**: $10\% – 25\%$ remaining
   - **DEMO FREEZE**: $5\% – 10\%$ remaining
   - **SUBMISSION LOCK**: $< 5\%$ remaining
4. **Log State & Recommend Action**:
   - Output structured status report.
   - Update `docs/current-state.md`.

---

## Standard Output Format

```text
==================================================
HACKATHON STATUS
==================================================
Total Time:        [e.g. 24h 00m]
Elapsed:           [e.g. 14h 30m]
Remaining:         [e.g. 09h 30m]
Remaining %:       [e.g. 39.5%]
Reserved Buffer:   [e.g. 03h 00m]
Current Mode:      [ACCELERATED MODE]

Current Objective:
[e.g. Complete core integrations, wire Killer Feature, and freeze dependencies.]

Allowed:
- Core and Killer feature development
- High-ROI UX and reliability fixes
- Standard bug patches and test runs

Prohibited:
- Large architecture migrations or stack changes
- Speculative experimental refactors
- Low-ROI optional features

Recommended Next Action:
[e.g. Run workflow: build-feature to finalize AI workflow integration.]
==================================================
```
