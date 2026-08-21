---
name: architecture
description: Design tailored, modular, layered system architectures for hackathon MVPs, select optimal tech stacks, enforce strict service boundaries, and apply time-aware architecture restrictions.
---

# Architecture Skill

## Purpose
This skill governs the synthesis of clean, modular, and reliable system architectures dynamically aligned to the selected solution concept, while strictly enforcing time-aware architecture restrictions as the hackathon deadline nears.

## Principles of Hackathon Architecture
1. **Modular Monolith Default**: Keep deployment simple; avoid distributed microservices unless strictly required.
2. **Layered Separation**:
   - **Presentation**: Components, client validation, UI state.
   - **API / Controller**: Routing, request validation, serialization, auth middleware.
   - **Service**: Domain algorithms, business logic, AI orchestration.
   - **Repository / Persistence**: Database queries, schema migrations, caching.
3. **Dedicated AI Isolation**: AI calls live in service wrappers with structured input/output schemas. Never invoke LLMs directly from UI components or API route handlers.
4. **No Premature Optimization**: Optimize for maintainability and demo speed first; optimize hot paths only when evidence warrants.

---

## Time-Aware Architecture Restrictions

Architecture flexibility decreases strictly as the hackathon clock runs down:

| Operational Mode | Architecture Rules & Restrictions |
| :--- | :--- |
| **NORMAL (>50%)** | Architecture adjustments and stack optimizations allowed when justified with an ADR record in `docs/decisions.md`. |
| **ACCELERATED (25%–50%)** | Architecture changes require strong technical justification; no speculative refactoring or unproven third-party services. |
| **MVP LOCK (10%–25%)** | **Architecture is FROZEN.** Any architectural pivot or schema overhaul requires explicit human approval. |
| **DEMO FREEZE (5%–10%)** | **Architecture changes PROHIBITED** unless required to fix an active, fatal crash in the demo flow. |
| **SUBMISSION LOCK (<5%)** | **Architecture changes STRICTLY PROHIBITED.** Codebase is frozen. |

---

## Architectural Protocol
1. **Stack Selection**: Choose frameworks that minimize boilerplate and offer rock-solid typing and DX.
2. **Component Mapping**: Outline folder structure and boundaries.
3. **Data Modeling**: Design minimal, highly consistent database entities and relational models.
4. **Contract Definition**: Establish explicit API schemas (OpenAPI / TypeScript interfaces / Pydantic models).
5. **Document Decisions**: Populate [`docs/architecture.md`](../../docs/architecture.md) and record ADRs in [`docs/decisions.md`](../../docs/decisions.md).
