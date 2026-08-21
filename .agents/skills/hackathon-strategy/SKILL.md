---
name: hackathon-strategy
description: Formulate winning hackathon strategies, maintain strict time buffers (10-15%), calculate time-penalized feature ROI, defend the killer differentiator, and align engineering with judging rubrics.
---

# Hackathon Strategy & Prioritization Skill

## Purpose
This skill ensures every hour of engineering effort directly enhances the project's competitive position and alignment with judging rubrics while strictly enforcing time buffers and dynamic ROI filtering.

---

## 1. Strategic Time Management (The 10–15% Buffer Rule)
When the total hackathon duration is known (e.g. 12h / 24h / 36h / 48h):
- **Maintain Time Tracking**:
  - `Total Time`: Full duration
  - `Elapsed Time`: Consumed time
  - `Remaining Time`: `Total Time - Elapsed Time`
  - `Reserved Safety Buffer`: 10–15% of total time strictly reserved for deployment glitches, network dropouts, integration failures, and demo rehearsals.
- **Rule**: Never treat the full hackathon clock as development time.

---

## 2. Dynamic Feature ROI Under Time Pressure

For any feature proposed after the MVP baseline is established, calculate the conceptual ROI:

$$\text{ROI} = \frac{\text{Expected User Impact} + \text{Judge Differentiation}}{(\text{Implementation Time} \times \text{Time Penalty}) + (\text{Risk} \times \text{Risk Penalty})}$$

As remaining time decreases, the Time Controller penalizes time and risk heavily:
- **Normal Mode (>50%)**: Accept if ROI > 1.0.
- **Accelerated Mode (25%–50%)**: Accept only if ROI > 2.0. Automatically drop low-impact nice-to-haves.
- **MVP Lock (10%–25%)**: Reject all speculative or non-critical features. Focus solely on stability.
- **Demo Freeze (5%–10%)**: Reject all new features. Only stability and fallback tuning.
- **Submission Lock (<5%)**: Reject all changes.

---

## 3. Core Value vs. Killer Demo Moment

Every project must explicitly define and defend:
1. **Core Value**: The primary problem solved in the simplest, most reliable way.
2. **Killer Feature**: The standout technical differentiator that sets the project apart.
3. **Killer Demo Moment**: The single, unforgettable visual/interactive action demonstrable in **60–90 seconds**.

### Protection Rule:
Once the killer feature is working, it becomes a **Protected Asset**. Unrelated refactoring, dependency upgrades, or optional features must never be allowed to destabilize the killer flow.
