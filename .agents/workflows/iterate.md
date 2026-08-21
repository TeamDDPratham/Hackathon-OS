# Workflow: Iterative Development & Triage (iterate)

## Purpose
Structure rapid iterative micro-cycles (`BUILD ──▶ VERIFY ──▶ IDENTIFY ──▶ CLASSIFY ──▶ FIX ──▶ RE-VERIFY`) and route discovered issues backward to the appropriate specialist workflow.

## Lifecycle Position
```text
┌────────────────────────────────────────────────────────────────────────┐
│                        ITERATIVE FEEDBACK LOOP                         │
│  BUILD ──▶ VERIFY ──▶ IDENTIFY ISSUE ──▶ CLASSIFY ──▶ FIX ──▶ RE-VERIFY│
└────────────────────────────────────────────────────────────────────────┘
```

## Relevant Skills
- [`.agents/skills/testing`](../skills/testing/SKILL.md)
- [`.agents/skills/git-safety`](../skills/git-safety/SKILL.md)
- [`.agents/skills/runtime-management`](../skills/runtime-management/SKILL.md)

## Step-by-Step Procedure
1. **Execute Step / Build**: Implement changes for the current task.
2. **Immediate Verification**: Run tests, typecheck, and inspect local runtime state.
3. **Identify & Classify Discovered Issue**:
   When an issue or test failure arises, classify it into one of the 8 standard issue categories:

   | Issue Category | Description / Symptoms | Target Recovery Workflow |
   | :--- | :--- | :--- |
   | **BUG** | Unhandled exception, logic error, broken API contract | `test-project` / `create-mvp` |
   | **SECURITY** | Exposed secret, unauthenticated endpoint, injection | `security-review` |
   | **PERFORMANCE**| Slow query, non-streaming AI response, UI lag | `performance` (Skill) / `polish-product` |
   | **UX** | Jarring layout shift, missing loading/error states | `polish-product` |
   | **ARCHITECTURE**| Broken layered boundary, circular dependency | `design-architecture` |
   | **PRODUCT** | Solution does not address core persona pain point | `judge-review` / `generate-solutions` |
   | **DEMO** | Network drop crashes UI, live latency exceeds 3s | `demo-resilience` |
   | **DOCUMENTATION**| Stale ADR, outdated README or current-state | `documentation` |

4. **Execute Target Workflow**: Route execution backward to the specified workflow and apply the fix.
5. **Re-Verify**: Run regression verification before resuming forward progression.

## Expected Outputs
- Structured issue classification and immediate backward recovery routing.
- Zero unresolved regression issues stacked on top of existing code.
