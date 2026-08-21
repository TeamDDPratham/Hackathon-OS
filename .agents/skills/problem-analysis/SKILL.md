---
name: problem-analysis
description: Understand arbitrary hackathon problem statements, extract explicit/implicit requirements, identify user personas and pain points, map constraints, and define success metrics.
---

# Problem Analysis Skill

## Purpose
This skill equips the agent to thoroughly deconstruct any arbitrary hackathon problem statement without jumping prematurely into coding or assuming specific technologies.

## When to Use
- Immediately upon receiving the hackathon problem statement or theme.
- When requirements shift or new constraints are introduced by hackathon organizers.

## Execution Rules & Guidelines

1. **Deconstruct the Raw Prompt**:
   - Extract the core friction and root causes.
   - Separate explicit constraints (e.g., must use specific API, must deploy on web) from open-ended goals.
2. **Define Personas & Friction**:
   - Identify who experiences the pain point most acutely (primary persona).
   - Document their workflow before vs. after your proposed intervention.
3. **Requirement Stratification**:
   - **Functional (FR)**: What the system must perform (inputs, transformations, outputs).
   - **Non-Functional (NFR)**: Latency, demo responsiveness, reliability, usability.
4. **Identify Gaps in Existing Alternatives**:
   - Why do current tools fail? (Too slow, too complex, expensive, lack automation).
5. **Populate `docs/problem.md`**:
   - Complete all sections of `docs/problem.md` without fabricating facts.
   - Formulate clear clarifying questions if material ambiguities exist.

## Output Deliverables
- A fully populated, structured [`docs/problem.md`](file:///c:/Users/Pratam%20Jain/Desktop/Runtime%20Terrorists/docs/problem.md).
