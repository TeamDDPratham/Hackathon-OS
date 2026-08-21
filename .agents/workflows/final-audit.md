# Workflow: Final Audit & Recovery Loop (final-audit)

## Purpose
Execute the definitive 8-pillar audit across the entire system. Inspect the active **Time Controller Mode**, evaluate blocker severity, route allowed issues backward for remediation, run regression verification, and **re-run final-audit** until the project is certified **READY FOR SUBMISSION**.

## Lifecycle Position
```text
PREPARE-DEMO ──▶ [TIME-CHECK] ──▶ [FINAL-AUDIT]
                                         │
                   ┌─────────────────────┴─────────────────────┐
                   ▼                                           ▼
               [PASS]                                       [FAIL]
                   │                                           │
                   ▼                                           ▼
             🏆 SUBMISSION                              CLASSIFY BLOCKER
                                                               │
                                                               ▼
                                                       CHECK TIME MODE
                                                       ┌───────┴───────┐
                                                       ▼               ▼
                                                  [ALLOWED]     [NOT ALLOWED]
                                                       │               │
                                                       ▼               ▼
                                                  ROUTE WORKFLOW  ESCALATE TO
                                                 (Code/Sec/UX/AI)    HUMAN
                                                       │
                                                       ▼
                                                  FIX + VERIFY
                                                       │
                                                       ▼
                                                REGRESSION-TEST
                                                       │
                                                       ▼
                                                [FINAL-AUDIT]
```

## Prerequisites
- Completed demo preparation, working deployment, and synchronized documentation.

## Relevant Skills
- [`.agents/skills/time-management`](../skills/time-management/SKILL.md)
- [`.agents/skills/hackathon-judge`](../skills/hackathon-judge/SKILL.md)
- [`.agents/skills/security`](../skills/security/SKILL.md)
- [`.agents/skills/testing`](../skills/testing/SKILL.md)
- [`.agents/skills/documentation`](../skills/documentation/SKILL.md)

---

## 1. Pre-Audit Time Check
Before evaluating the 8 pillars, execute `time-check` to determine the current operational mode:
- If in **NORMAL / ACCELERATED**: Standard remediation permitted.
- If in **MVP LOCK**: Only critical and high-impact remediation allowed.
- If in **DEMO FREEZE**: Only demo, reliability, security, or deployment crash blockers allowed. Never attempt an architectural rewrite.
- If in **SUBMISSION LOCK**: Only submission-critical blockers allowed.

---

## 2. The 8-Pillar Audit Checklist

1. **Pillar 1: Functionality Audit**: All CORE and KILLER features work reliably without crashing.
2. **Pillar 2: Architecture Audit**: Strict layered separation preserved (no direct UI $\to$ DB leaks).
3. **Pillar 3: Security & Secrets Audit**: Clean `.gitignore`, `.env.example` in place, zero hardcoded credentials.
4. **Pillar 4: Performance Audit**: Initial load <500ms, streaming AI tokens within 1s, zero noticeable UI lag.
5. **Pillar 5: UX & Design Audit**: All 4 UI states (Loading/Empty/Populated/Error) handled across all screens.
6. **Pillar 6: Testing & Regression Audit**: Full automated test suite passes green; zero runtime console exceptions.
7. **Pillar 7: Demo & Resilience Audit**: Deterministic 3-minute demo script verified; offline fallbacks ready in background tab.
8. **Pillar 8: Documentation Audit**: `README.md`, `current-state.md`, `decisions.md`, and submission copy 100% accurate.

---

## 3. Blocker Classification & Specialist Routing

If any pillar fails, classify each issue by severity and determine if remediation is permitted under the active Time Controller mode:

| Blocker Domain | Target Specialist Workflow | Recovery Action |
| :--- | :--- | :--- |
| **Code / Functional / API** | `test-project` / `create-mvp` | Fix bug, patch unit/integration tests |
| **Security / Secrets / Auth**| `security-review` | Scrub secrets, fix auth boundaries |
| **UX / Layout / States** | `polish-product` | Polish 4 UI states, spacing, and micro-copy |
| **Performance / Latency** | `performance` (Skill) / `polish-product` | Optimize query, implement token streaming |
| **AI Reliability / Schema** | `ai-engineering` (Skill) / `build-feature` | Enforce JSON schemas, add prompt retries |
| **Architecture / Layer Leak**| `design-architecture` | Restore layered service boundaries |
| **Demo / Fallback / Fixture**| `demo-resilience` | Update mock fixtures, tune 3s timeouts |
| **Product / Differentiation**| `judge-review` | Refine value proposition and killer moment |
| **Documentation / Copy** | `documentation` | Synchronize README and submission assets |

---

## 4. The Complete Recovery & Re-Audit Loop

```text
1. CLASSIFY BLOCKER ──▶ Determine severity & target specialist workflow.
2. CHECK TIME MODE  ──▶ Is remediation permitted under active mode?
                        - [ALLOWED]     ──▶ ROUTE WORKFLOW ──▶ FIX + VERIFY.
                        - [NOT ALLOWED] ──▶ ESCALATE TO HUMAN.
3. REGRESSION-TEST  ──▶ Run regression-test.md across build, tests, startup, and core flows.
4. RE-RUN AUDIT     ──▶ Return to final-audit.md to re-evaluate all 8 pillars.
```

> **Non-Termination Rule**: The recovery loop NEVER terminates at `regression-test`. It MUST loop back into `final-audit` until all pillars pass (PASS $\to$ SUBMISSION) or an explicit human override is granted.

---

## 5. Infinite Loop Circuit Breaker
- **Maximum Recovery Iterations**: **3 Cycles**.
- If blockers persist after 3 remediation cycles:
  1. Pause execution immediately.
  2. Summarize remaining issues, current time remaining, and trade-offs to the user.
  3. Prompt for human decision: Proceed to Submission with known caveats OR approve a specific manual patch.

---

## Final Verdict Format

```markdown
# Final Audit Verdict: [ PASS / FAIL ]

- **Current Time Mode**: [e.g. DEMO FREEZE (7.5% time remaining)]
- **Pillar 1 (Functionality)**: PASS / FAIL
- **Pillar 2 (Architecture)**: PASS / FAIL
- **Pillar 3 (Security)**: PASS / FAIL
- **Pillar 4 (Performance)**: PASS / FAIL
- **Pillar 5 (UX / Design)**: PASS / FAIL
- **Pillar 6 (Testing)**: PASS / FAIL
- **Pillar 7 (Demo Resilience)**: PASS / FAIL
- **Pillar 8 (Documentation)**: PASS / FAIL

## Outcome:
- IF ALL PASS ──▶ 🏆 PROCEED TO SUBMISSION
- IF ANY FAIL ──▶ CLASSIFY ──▶ CHECK MODE ──▶ [ALLOWED: FIX ──▶ REGRESSION-TEST ──▶ RE-RUN FINAL-AUDIT] / [NOT ALLOWED: ESCALATE TO HUMAN]
```
