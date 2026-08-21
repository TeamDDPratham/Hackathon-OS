# Project Risk Register & Mitigation Strategy

> **Status**: ACTIVE  
> **Last Updated**: [Timestamp]

---

## Risk Severity Matrix

| Severity Level | Definition | Action Required |
| :--- | :--- | :--- |
| **CRITICAL** | Demo-killer or blocking flaw | Must fix immediately; stop optional work |
| **HIGH** | Significant UX/Technical failure | Fix in current sprint |
| **MEDIUM** | Noticeable edge case or delay | Add fallback or patch during polish sprint |
| **LOW** | Minor cosmetic or edge nuance | Document and deprioritize |

---

## Active Risk Log

| Risk ID | Category | Description | Probability (L/M/H) | Impact (L/M/H) | Severity | Mitigation & Contingency Strategy | Owner | Status |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- | :--- | :--- |
| **RSK-01** | Technical | Third-party AI rate limiting or network latency during live demo | Medium | High | **HIGH** | Implement local response caching, fallback mock seeds, and 3s timeouts | Lead Eng | Active |
| **RSK-02** | Time | Scope creep on nice-to-have features consuming polish time | High | High | **CRITICAL** | Strict enforcement of CORE $\to$ KILLER $\to$ POLISH feature tiers in AGENTS.md | Product | Active |
| **RSK-03** | AI | Hallucination or invalid JSON response breaks UI rendering | Medium | High | **HIGH** | Strict Pydantic/Zod schema validation + automatic one-shot retry layer | AI Eng | Active |
| **RSK-04** | Security | Accidental leak of API tokens in git commits | Low | Critical | **HIGH** | `.env` untracked rule, zero hardcoding policy, pre-commit inspection | Sec Eng | Active |
| **RSK-05** | Demo | Live internet connection drops on stage during presentation | Medium | Critical | **CRITICAL** | Pre-record crisp 60s backup video demo and host local offline fallback | Demo Eng | Active |

---

## Monitored Categories
1. **Technical**: Architecture stability, library compatibility, database performance.
2. **Product / Scope**: Misalignment with problem brief, over-scoping.
3. **AI**: Response latency, hallucinations, token costs, schema drift.
4. **Security**: Injection risks, auth loopholes, secret exposure.
5. **UX / UI**: Responsive layout breaking, confusing flows, lack of feedback.
6. **Integration**: Third-party API outages, webhook delivery failures.
7. **Deployment**: Build failures on Vercel/Cloud Run, environment variable mismatches.
8. **Demo**: Timing overrun, presenter stutter, live feature crash.
9. **Time**: Hackathon clock exhaustion before testing phase.
