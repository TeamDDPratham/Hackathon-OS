---
name: ai-engineering
description: Integrate LLMs and multimodal AI models safely with structured JSON outputs, prompt versioning, rigorous output validation, retry layers, and fallback logic.
---

# AI Engineering Skill

## Purpose
This skill governs the integration of AI/LLM models, ensuring that intelligent capabilities are deterministic, validated, fast, and fail-safe during live demos.

## AI Engineering Standards
1. **Meaningful Use of AI**:
   - Apply AI only where it provides genuine cognitive, analytical, or synthesis value. Never use AI as a generic novelty layer.
2. **Structured JSON Envelopes**:
   - Always leverage native JSON Mode or structured outputs (e.g., Pydantic schemas, Function Calling).
   - Never accept unstructured prose if the downstream application expects typed data.
3. **Multi-Stage Output Validation**:
   - **Stage 1 (Syntax)**: Validate valid JSON parsing.
   - **Stage 2 (Schema)**: Validate type conformance against data models.
   - **Stage 3 (Business Invariants)**: Validate ranges, enum bounds, and domain consistency.
4. **Three-Layer Fallback Architecture**:
   - **Layer 1 (Smart Retry)**: If validation fails, retry once with low temperature or include validation error in prompt context.
   - **Layer 2 (Heuristic Fallback)**: If model is unresponsive or times out (>3–5s), generate response using rule-based algorithms.
   - **Layer 3 (Cached / Preset Seed)**: Provide deterministic, pre-computed demonstration responses if third-party network fails completely.
5. **Prompt Management**:
   - Store system prompts as clean template files or constants in dedicated `prompts/` modules.
   - Include few-shot examples when demanding complex structured responses.
6. **Prompt Injection & Safety**:
   - Wrap user inputs with delimiters and sanitize against instruction overrides.
