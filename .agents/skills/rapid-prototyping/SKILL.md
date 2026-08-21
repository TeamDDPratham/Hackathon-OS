---
name: rapid-prototyping
description: Build high-speed, working MVP scaffolding with clean patterns, modular components, minimal dependencies, and rapid verification feedback loops.
---

# Rapid Prototyping Skill

## Purpose
This skill enables accelerating MVP implementation velocity without sacrificing architectural sanity or code quality.

## Execution Rules
1. **Vertical Slice First**: Build one complete, end-to-end working path (UI $\to$ API $\to$ Service $\to$ DB $\to$ UI) before broadening feature breadth.
2. **Leverage Clean Component Kits**: Use mature, accessible headless/styled component systems (e.g., shadcn/ui, Tailwind CSS) rather than writing CSS from scratch.
3. **Mock First, Integrate Fast**: Stub downstream service responses or third-party APIs during initial frontend/backend wiring to unblock concurrent development.
4. **Iterative Verification**: Run and test each endpoint and view immediately upon creation.
5. **No Dead Code**: Resist adding speculative utility functions or premature abstractions.
