# Workflow: Analyze Problem

## Purpose
Deconstruct an incoming hackathon problem statement into structured, actionable requirements, user personas, constraints, and success metrics without writing any application code.

## Lifecycle Position
```text
[ANALYZE-PROBLEM] ──▶ GRILL-PROBLEM ──▶ GENERATE-SOLUTIONS ──▶ [HUMAN GATE 1]
```

## Prerequisites
- Raw hackathon problem statement, prompt, or track brief provided by the user.

## Relevant Skills
- [`.agents/skills/problem-analysis`](../skills/problem-analysis/SKILL.md)
- [`.agents/skills/documentation`](../skills/documentation/SKILL.md)

## Inputs
- Verbatim problem prompt / theme description.
- Hackathon track guidelines and judging criteria.

## Step-by-Step Procedure
1. **Ingest Raw Text**: Read the raw problem statement completely.
2. **Deconstruct Core Friction**: Identify the fundamental human, technical, or economic problem.
3. **Map Personas**: Define primary and secondary user personas and their existing workflows.
4. **Extract Requirements**:
   - Classify requirements into **Functional** (FRs) and **Non-Functional** (NFRs).
   - Distinguish explicit mandates from implicit expectations.
5. **Identify Gaps & Constraints**: Document existing alternatives, time limitations, and platform constraints.
6. **Populate Documentation**: Write findings directly into [`docs/problem.md`](../../docs/problem.md).
7. **Formulate Clarifications**: List open questions if material ambiguities exist.

## Expected Outputs
- A fully populated [`docs/problem.md`](../../docs/problem.md).

## Verification Criteria
- [ ] No application code or project files have been generated yet.
- [ ] All sections of `docs/problem.md` are populated with non-fabricated, structured analysis.
- [ ] Explicit and implicit requirements are clearly separated.

## Failure Handling
- If the problem statement is extremely vague or brief, extract reasonable core assumptions, document them explicitly in `docs/problem.md`, and request clarification on critical forks.
