---
name: performance
description: Profile and eliminate latency bottlenecks, slow database queries, excessive network roundtrips, bloated assets, and non-streaming LLM responses.
---

# Performance Engineering Skill

## Purpose
This skill optimizes application speed and responsiveness, guaranteeing crisp transitions and sub-second interactions during live presentations.

## Performance Checklist
1. **Network & Payload Optimization**:
   - Minimize unnecessary API calls; batch requests where appropriate.
   - Strip unused fields from JSON payloads before transmitting over the wire.
2. **AI Latency & Streaming**:
   - Stream AI text/token responses to the frontend using Server-Sent Events (SSE) or WebSockets so the user sees immediate activity within 500ms rather than waiting for 5 seconds.
3. **Database Query Efficiency**:
   - Eliminate `N+1` queries using joined loads.
   - Index high-cardinality search/filter columns.
4. **Client-Side Rendering**:
   - Optimize component re-renders (memoization where expensive).
   - Lazy-load heavy charting or visualization libraries.
