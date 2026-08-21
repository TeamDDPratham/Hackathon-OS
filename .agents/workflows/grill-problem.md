# Workflow: Grill Problem

## Purpose
Challenge the problem definition and initial assumptions with tough, adversarial questions to expose flawed premises, hidden complexities, and weak value propositions before designing solutions.

## Lifecycle Position
```text
ANALYZE-PROBLEM ──▶ [GRILL-PROBLEM] ──▶ GENERATE-SOLUTIONS ──▶ [HUMAN GATE 1]
```

## Prerequisites
- [`docs/problem.md`](../../docs/problem.md) must be populated by the `analyze-problem` workflow.

## Relevant Skills
- [`.agents/skills/hackathon-judge`](../skills/hackathon-judge/SKILL.md)
- [`.agents/skills/problem-analysis`](../skills/problem-analysis/SKILL.md)

## Inputs
- Populated [`docs/problem.md`](../../docs/problem.md).

## Step-by-Step Procedure
1. **Challenge User Need**: Ask: *"Is this a real, urgent pain point or a vitamin nobody will pay for/use?"*
2. **Challenge Alternatives**: Ask: *"Why can't someone just solve this with an Excel sheet, simple script, or existing free tool?"*
3. **Challenge Technical Viability**: Ask: *"Are the required APIs/models available, fast enough, and reliable within hackathon limits?"*
4. **Challenge AI Necessity**: Ask: *"Does this actually need AI, or is AI being forced onto a simple deterministic problem?"*
5. **Challenge Demo Viability**: Ask: *"Can the core value be demonstrated live in under 60 seconds?"*
6. **Synthesize Feedback**: Update the assumptions, constraints, and risk register in [`docs/risk-register.md`](../../docs/risk-register.md).

## Expected Outputs
- Updated [`docs/problem.md`](../../docs/problem.md) with refined assumptions.
- Initial entries in [`docs/risk-register.md`](../../docs/risk-register.md).

## Verification Criteria
- [ ] At least 3 non-trivial adversarial questions or vulnerabilities have been investigated.
- [ ] Flawed assumptions have been discarded or adjusted.

## Failure Handling
- If the problem concept falls apart under questioning, pivot the focus to a more defensible adjacent user pain point before proceeding to solution generation.
