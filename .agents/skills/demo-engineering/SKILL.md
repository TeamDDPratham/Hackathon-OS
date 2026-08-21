---
name: demo-engineering
description: Structure, time, and stress-test the 3-minute live demonstration, engineer deterministic demo seeds, and build resilient failover contingency modes.
---

# Demo Engineering Skill

## Purpose
This skill designs and bulletproofs the live presentation flow so that judges experience an unforgettable, flawless, and technically convincing product showcase.

## Demo Engineering Guidelines
1. **The 3-Minute Golden Script**:
   - **0:00–0:30**: Problem Hook & Human Pain Point.
   - **0:30–1:15**: Core Solution in Action (First click to result).
   - **1:15–2:00**: Killer Feature ("The Wow Moment").
   - **2:00–2:40**: Technical Architecture & Differentiation.
   - **2:40–3:00**: Impact & Next Steps.
2. **Deterministic Pre-Seeding**:
   - Build a "Demo Reset" button or script that instantly wipes ephemeral state and seeds beautiful, realistic demo data in 1 second.
3. **Emergency Failover Plan**:
   - Have a pre-rendered, high-resolution 60-second backup video clip ready in a background tab if live internet fails.
   - Keep cached demo responses accessible via a hidden query param (e.g. `?demo_mode=true`).
4. **Rehearsal & Timing Verification**:
   - Practice the flow end-to-end to ensure the entire journey comfortably finishes within the time limit.
