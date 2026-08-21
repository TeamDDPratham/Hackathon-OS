# Workflow: Generate Solutions

## Purpose
Brainstorm 3–5 distinct, innovative solution concepts, score them objectively, select the winning product blueprint, and prepare for **Mandatory Human Gate 1**.

## Lifecycle Position
```text
GRILL-PROBLEM ──▶ [GENERATE-SOLUTIONS] ──▶ 🛑 [MANDATORY HUMAN GATE 1] ──▶ DESIGN-ARCHITECTURE
```

## Prerequisites
- Completed [`docs/problem.md`](../../docs/problem.md) and [`docs/risk-register.md`](../../docs/risk-register.md).

## Relevant Skills
- [`.agents/skills/solution-design`](../skills/solution-design/SKILL.md)
- [`.agents/skills/hackathon-strategy`](../skills/hackathon-strategy/SKILL.md)

## Inputs
- Validated requirements and pain points from `docs/problem.md`.

## Step-by-Step Procedure
1. **Divergent Brainstorming**: Generate 3–5 fundamentally different solution concepts.
   - *Concept A*: Direct workflow automation / high-efficiency engine.
   - *Concept B*: Intelligent synthesis / multimodal copilot.
   - *Concept C*: Autonomous multi-agent / real-time collaborative system.
2. **Concept Evaluation**: Score each concept across:
   - Impact (/10)
   - Innovation & Differentiation (/10)
   - Technical Feasibility (/10)
   - Demo "Wow" Potential (/10)
   - Implementation Speed (/10)
3. **Select Winning Concept**: Pick the concept with the highest combined score that fits comfortably within the hackathon time limit.
4. **Define Feature Tiers**:
   - **CORE (MVP)**: Minimal end-to-end flow required to demonstrate value.
   - **KILLER FEATURE**: The standout technical capability / differentiator.
   - **POLISH**: Aesthetic, usability, and speed touches.
   - **OPTIONAL**: Scope cut if time is tight.
5. **Populate Documentation**: Record details in [`docs/hackathon-strategy.md`](../../docs/hackathon-strategy.md).
6. **🛑 MANDATORY HUMAN GATE 1 PRESENTATION**:
   - Present the summary to the user:
     1. Problem summary
     2. Top solution candidates
     3. Recommended solution
     4. Architecture direction & recommended tech stack
     5. MVP scope & Killer feature
     6. Major risks & Estimated implementation timeline
   - **STOP AND WAIT FOR EXPLICIT USER APPROVAL BEFORE PROCEEDING TO DESIGN-ARCHITECTURE.**

## Expected Outputs
- Completed [`docs/hackathon-strategy.md`](../../docs/hackathon-strategy.md).
- User sign-off at Human Gate 1.

## Verification Criteria
- [ ] 3–5 distinct concepts were compared.
- [ ] A single winning concept is selected with clear rationale.
- [ ] Agent pauses for user approval at Human Gate 1.
