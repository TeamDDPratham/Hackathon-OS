---
name: time-management
description: Comprehensive Hackathon Time Controller tracking total duration, elapsed/remaining time, reserved buffers (10-15%), dynamic operational modes (Normal, Accelerated, MVP Lock, Demo Freeze, Submission Lock), and time-penalized ROI feature filtering.
---

# Hackathon Time Controller & Operational Modes Skill

## Purpose
The **Time Controller** sits above the entire Hackathon OS lifecycle as a cross-cutting system capability. It dynamically shifts engineering constraints, feature acceptance thresholds, and risk tolerances as the hackathon deadline approaches, ensuring the team delivers a finished, demonstrable, and defensible product without getting caught in late-stage scrambles.

---

## 1. Core Time Tracking Parameters

The Time Controller tracks the following parameters dynamically without assuming a fixed hackathon duration (adapting to 6h, 12h, 24h, 36h, 48h, etc.):

- **`TOTAL_TIME`**: The total allocated duration of the hackathon (in hours or minutes).
- **`START_TIME`**: Timestamp when work officially begins.
- **`CURRENT_TIME`**: Active timestamp during task execution.
- **`ELAPSED_TIME`**: `CURRENT_TIME - START_TIME`.
- **`REMAINING_TIME`**: `TOTAL_TIME - ELAPSED_TIME`.
- **`REMAINING_PERCENT`**: `(REMAINING_TIME / TOTAL_TIME) * 100`.
- **`RESERVED_BUFFER`**: 10–15% of `TOTAL_TIME` strictly reserved for deployment glitches, network dropouts, integration failures, and demo rehearsals.
- **`EFFECTIVE_DEV_TIME`**: `TOTAL_TIME - RESERVED_BUFFER`.
- **`CURRENT_MODE`**: One of the 5 time-pressure operational modes.

> **Zero Deadline Fantasy Rule**: Never fabricate start times or deadlines. If the user has not provided the hackathon duration, prompt them when time-aware planning is required and persist the values in `docs/current-state.md`.

---

## 2. The 5 Time-Pressure Operational Modes

```text
Time Remaining: 100% ────────▶ 50% ────────▶ 25% ────────▶ 10% ────────▶ 5% ────────▶ 0%
Mode:           NORMAL       ACCELERATED   MVP LOCK      DEMO FREEZE   SUBMISSION LOCK
```

### Mode 1: NORMAL MODE (> 50% Time Remaining)
- **Primary Objective**: Build a strong, innovative product while maintaining exploration flexibility.
- **Allowed Work**:
  - CORE features, KILLER feature, POLISH, and high-value OPTIONAL features.
  - Architecture adjustments and stack optimizations with ADR records.
  - Divergent solution comparisons and prototype exploration.
- **Architecture Freedom**: Full flexibility with documented justification.

### Mode 2: ACCELERATED MODE (25% – 50% Time Remaining)
- **Primary Objective**: Complete core integration and killer differentiator rather than expanding scope.
- **Allowed Work**:
  - CORE and KILLER features; essential reliability and testing.
  - Reduce/reject speculative refactors, complex experimental features, and OPTIONAL tier items.
- **Architecture Freedom**: Restricted; requires strong technical justification. New dependencies must provide immediate 10x value.

### Mode 3: MVP LOCK (10% – 25% Time Remaining)
- **Primary Objective**: Freeze product scope and reach a stable, rock-solid, demonstrable product.
- **Allowed Work**:
  - Critical bug fixes, high-impact UX polish, killer feature completion, test fixes, and deployment validation.
- **Prohibited**:
  - ❌ Framework migrations or major architecture rewrites.
  - ❌ Database schema overhauls.
  - ❌ Speculative features or cosmetic refactors with no demo benefit.
- **Architecture Freedom**: **FROZEN.** Architecture changes require explicit human approval.

### Mode 4: DEMO FREEZE (5% – 10% Time Remaining)
- **Primary Objective**: **DO NOT BREAK THE DEMO.** Protect the best possible live presentation.
- **Allowed Work**:
  - Critical bug fixes, fallback/mock fixture verification, deployment fixes, performance lag elimination, authentication blockers.
  - Every edit must be followed immediately by regression testing (`regression-test.md`).
- **Prohibited**:
  - ❌ New architecture or framework changes.
  - ❌ New features or visual overhauls.
  - ❌ Database migrations (unless required to unblock a fatal crash).
- **Architecture Freedom**: **PROHIBITED** unless fixing an active demo crash.

### Mode 5: SUBMISSION LOCK (< 5% Time Remaining)
- **Primary Objective**: Submit a working project on time. Survival & verification mode.
- **Allowed Work**:
  - Final 8-pillar audit (`final-audit.md`), deployment URL verification, Devpost/submission text packaging, demo script rehearsal, and smoke tests.
- **Prohibited**:
  - ❌ All code changes, new features, refactoring, and experimentation.
- **Architecture Freedom**: **COMPLETELY LOCKED.**

---

## 3. Dynamic Feature ROI Under Time Pressure

Every feature or enhancement proposed after MVP creation must be evaluated against the dynamic ROI formula:

$$\text{Dynamic ROI} = \frac{\text{Expected User Impact} + \text{Judge Differentiation}}{(\text{Implementation Time} \times \text{Time Penalty}) + (\text{Risk} \times \text{Risk Penalty})}$$

As time decreases, the penalty multiplier on time and risk accelerates:

| Operational Mode | Time Penalty Multiplier | Risk Penalty Multiplier | Feature Rejection Rule |
| :--- | :---: | :---: | :--- |
| **NORMAL** | $1.0\times$ | $1.0\times$ | Accept if ROI > 1.0 |
| **ACCELERATED** | $1.5\times$ | $1.5\times$ | Accept only if ROI > 2.0 (Reject low-impact ideas) |
| **MVP LOCK** | $3.0\times$ | $4.0\times$ | Reject all non-critical additions |
| **DEMO FREEZE** | $\infty$ | $\infty$ | **REJECT ALL NEW FEATURES** |
| **SUBMISSION LOCK** | $\infty$ | $\infty$ | **CODEBASE LOCKED** |

---

## 4. Protected Assets Under Time Pressure

1. **Killer Feature Protection**:
   - The system tracks the **Killer Feature** and its **60–90s Killer Demo Moment**.
   - In MVP Lock, Demo Freeze, and Submission Lock, the killer feature is strictly protected against accidental regressions or breaking refactors.
2. **Deterministic Fallback Protection**:
   - In Demo Freeze and Submission Lock, verify that all external API dependencies have verified deterministic fixtures ready for stage failover.
