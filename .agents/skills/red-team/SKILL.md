---
name: red-team
description: Actively attempt to break the system with malicious payloads, extreme edge cases, simulated network drops, rate limits, and unexpected inputs.
---

# Red Team & Chaos Testing Skill

## Purpose
This skill actively attacks the application using adversarial inputs, failure injections, and chaotic user behaviors to guarantee the demo never crashes during live presentation.

## Red Teaming Protocols
1. **Adversarial Input Attacks**:
   - Submit gigantic strings (1MB+), zero-length inputs, special unicode/emojis, SQL injection probes, and prompt injection strings.
   - Assert that the application returns friendly validation messages and does not crash or display raw stack traces.
2. **Network & Chaos Simulation**:
   - Cut off network connections during ongoing async AI requests.
   - Simulate 3rd-party API timeout (simulate 10s latency) and assert that graceful fallback kicks in.
3. **State Inconsistency Attacks**:
   - Double-click submit buttons rapidly.
   - Navigate away from pages while background mutations are in-flight.
   - Log findings into a red-team report and verify all critical vulnerabilities are resolved before demo rehearsal.
