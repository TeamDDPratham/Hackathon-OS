# Architecture Decision Records (ADRs)

## ADR-001: Selection of FastAPI (Backend) & Next.js (Frontend)
- **Status**: ACCEPTED
- **Context**: 6-hour hackathon to build a high-performance, demonstrable API security testing platform.
- **Decision**: Use Python FastAPI with `httpx` for async non-blocking HTTP security testing, and Next.js 14 with Tailwind CSS for a reactive, high-polish cybersecurity UI.
- **Consequences**: Fast development velocity, native async security probes, clean typed API contracts.

## ADR-002: Embedded Local Mock Vulnerable API for 100% Offline Demo
- **Status**: ACCEPTED
- **Context**: Hackathon live presentations often suffer from WiFi drops, external target timeouts, or API outages.
- **Decision**: Embed an intentionally vulnerable set of mock routes directly inside the FastAPI backend (`/api/mock-vulnerable/*`).
- **Consequences**: Zero external dependencies needed for the 3-minute live judge demo.

## ADR-003: Deterministic Rule-Based Scoring with Optional AI Enrichment
- **Status**: ACCEPTED
- **Context**: Judges require reproducible, credible vulnerability scoring without arbitrary AI hallucination.
- **Decision**: Implement a mathematical penalty scoring algorithm (0–100) and deterministic remediation templates. Use Gemini solely for optional interactive natural-language explanations with full offline fallbacks.
- **Consequences**: 100% reliable scanner operation even if no Gemini API key is provided.
