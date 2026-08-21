# Autonomous Hackathon OS 🚀

An adaptive, time-aware, autonomous engineering system designed to systematically transform an arbitrary hackathon problem statement into an award-winning, demo-ready product.

---

## ⏱️ The Hackathon Time Controller

The **Time Controller** sits above the entire engineering lifecycle, progressively reducing risk as the hackathon deadline nears:

```text
HACKATHON CLOCK
       │
       ▼
NORMAL MODE (> 50% Time Remaining)
• Objective: Explore solutions, design modular architecture, build core MVP vertical slice.
• Allowed: Core, Killer, Polish, and high-value Optional features. Stack/ADR adjustments permitted.
       │
       ▼
ACCELERATED MODE (25% – 50% Time Remaining)
• Objective: Finish MVP integration and wire the Killer Feature. Freeze dependencies.
• Allowed: Core + Killer + Reliability. Architecture changes require strong justification.
       │
       ▼
MVP LOCK (10% – 25% Time Remaining)
• Objective: Scope is frozen. Reach a stable, rock-solid demonstrable product.
• Prohibited: Framework migrations, database overhauls, speculative features.
• Allowed: Critical bug fixes, high-impact UX polish, killer feature completion, test fixes.
       │
       ▼
DEMO FREEZE (5% – 10% Time Remaining)
• Objective: DO NOT BREAK THE DEMO. Protect the best possible live showcase.
• Prohibited: All new features, visual redesigns, architecture changes, migrations.
• Allowed: Fallback & mock fixture tuning, critical crash fixes, 3-minute timed script rehearsal.
       │
       ▼
SUBMISSION LOCK (< 5% Time Remaining)
• Objective: Submit a working project on time. Survival & verification mode.
• Allowed: Final 8-pillar audit, deployment URL checks, submission text packaging, smoke tests.
```

---

## 🧭 Adaptive Lifecycle & Complete Operational Flow

```text
PROBLEM INGESTION
       │
       ▼
1. ANALYZE PROBLEM (analyze-problem)
       │
       ▼
2. GRILL PROBLEM (grill-problem)
       │
       ▼
3. GENERATE SOLUTIONS (generate-solutions)
       │
       ▼
🛑 ═════════════════════════════════════════════════════════════════════ 🛑
   MANDATORY HUMAN GATE 1: Solution & Stack Selection Approval
   (Present Problem, Top Concepts, Winning Recommendation, Scope, Timeline)
🛑 ═════════════════════════════════════════════════════════════════════ 🛑
       │
       ▼ [Autonomous Momentum Begins]
4. DESIGN ARCHITECTURE (design-architecture)
       │
       ▼
5. INIT ENVIRONMENT (init-env)
       │
       ▼
6. CREATE MVP (create-mvp)
       │
       ▼
7. BUILD KILLER FEATURE (build-feature)
       │
       ▼
8. TEST PROJECT (test-project)
       │
       ▼
9. SECURITY REVIEW (security-review: Initial Mode)
       │
       ▼
10. RED TEAM (red-team)
       │
       ▼
11. JUDGE REVIEW (judge-review)
       │
       ▼
🛑 ═════════════════════════════════════════════════════════════════════ 🛑
   MANDATORY HUMAN GATE 2: Polish Priorities Approval
   (Present Scorecard, Flaws, Top 3 High-ROI Improvements, Time Estimates)
🛑 ═════════════════════════════════════════════════════════════════════ 🛑
       │
       ▼ [Autonomous Momentum Resumes]
12. POLISH PRODUCT (polish-product)
       │
       ▼
13. REGRESSION TEST (regression-test)
       │
       ▼
14. SECURITY RECHECK (security-review: Recheck Mode)
       │
       ▼
15. DEMO RESILIENCE (demo-resilience)
       │
       ▼
16. PREPARE DEMO (prepare-demo)
       │
       ▼
17. FINAL AUDIT (final-audit)
       │
       ├─── PASS ──────────────────────────▶ 🏆 SUBMISSION READY
       │
       └─── FAIL
              │
              ▼
       CLASSIFY BLOCKER
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

---

## 📂 Repository Structure

```text
├── AGENTS.md                  # Authoritative system constitution & Time Controller rules
├── README.md                  # System overview and entrypoint instructions
├── .gitignore                 # Comprehensive secret and build artifact exclusion
├── .env.example               # Safe environment variable configuration template
│
├── docs/                      # Persistent project memory & templates
│   ├── problem.md             # Deconstructed problem statement & requirements
│   ├── architecture.md        # Dynamic system architecture & diagrams
│   ├── current-state.md       # Live tracking of implemented features & Time Clock
│   ├── decisions.md           # Architecture Decision Records (ADRs)
│   ├── hackathon-strategy.md  # Competitive strategy, differentiators, Time Deadlines
│   ├── demo-script.md         # 3-minute timed live demo script & fallbacks
│   ├── judge-review.md        # Skeptical 100-point evaluation matrix
│   └── risk-register.md       # Risk register with severity & mitigations
│
└── .agents/                   # Custom agent intelligence & execution runbooks
    ├── skills/                # Role-specific skills with concrete decision rules
    │   ├── problem-analysis/  # Requirement extraction & persona mapping
    │   ├── solution-design/   # Concept generation & scoring
    │   ├── architecture/      # Modular system design & time-aware restrictions
    │   ├── runtime-management/# Port management, process hygiene, PowerShell inspection
    │   ├── rapid-prototyping/ # Fast vertical slice build rules
    │   ├── frontend/          # 4-state UI, responsive design, visual hierarchy
    │   ├── backend/           # Typed endpoints, schemas, service layer
    │   ├── ai-engineering/    # Structured outputs, validation, multi-layer fallbacks
    │   ├── database/          # Schemas, indexing, migrations, seed data
    │   ├── testing/           # Unit, integration, and browser testing
    │   ├── security/          # Secret hygiene, input sanitization, auth audits
    │   ├── ux/                # 30-second rule, micro-interactions, sample data
    │   ├── performance/       # Latency elimination, streaming AI, query optimization
    │   ├── time-management/   # Time Controller, 5 modes, dynamic ROI filtering
    │   ├── hackathon-strategy/# ROI prioritization, 10-15% time buffers, killer feature
    │   ├── hackathon-judge/   # Skeptical rubric scoring & flaw identification
    │   ├── red-team/          # Adversarial fuzzing, chaos testing, timeout probes
    │   ├── demo-resilience/   # 3-layer graceful fallbacks & mock fixtures
    │   ├── demo-engineering/  # 3-min script, deterministic seed reset, video backup
    │   ├── git-safety/        # Pre-refactor checkpointing & rollback strategies
    │   └── documentation/     # Synchronous state and submission assets
    │
    └── workflows/             # Step-by-step executable runbooks
        ├── analyze-problem.md
        ├── grill-problem.md
        ├── generate-solutions.md
        ├── design-architecture.md
        ├── init-env.md
        ├── create-mvp.md
        ├── build-feature.md
        ├── test-project.md
        ├── security-review.md
        ├── red-team.md
        ├── judge-review.md
        ├── polish-product.md
        ├── regression-test.md
        ├── demo-resilience.md
        ├── prepare-demo.md
        ├── time-check.md
        ├── iterate.md
        └── final-audit.md
```

---

## ⚡ How to Start When the Hackathon Begins

When your hackathon problem statement arrives:

1. **Provide the prompt and event duration** to the assistant:
   ```text
   Here is our hackathon problem statement:
   [Paste prompt here]

   Total Duration: 24 hours
   Run workflow: analyze-problem
   ```
2. The Time Controller will initialize the clock in [`docs/current-state.md`](./docs/current-state.md), calculate the 10–15% buffer, deconstruct the problem in `docs/problem.md`, challenge it via `grill-problem`, and pause at **Human Gate 1** before implementing architecture.
