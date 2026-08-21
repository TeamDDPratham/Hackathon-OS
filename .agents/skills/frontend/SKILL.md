---
name: frontend
description: Develop polished, responsive, accessible web interfaces with clean visual hierarchy, proper state management, and comprehensive 4-state UI handling.
---

# Frontend Engineering Skill

## Purpose
This skill guides the creation of engaging, responsive, and reliable frontends that impress judges within seconds.

## Frontend Engineering Standards
1. **The 4 Essential UI States**:
   Every dynamic screen or component fetching or mutating data MUST explicitly handle:
   - **Loading**: Skeletons or subtle spinners preventing layout shifts.
   - **Empty**: Friendly empty state graphics/text with a clear call-to-action.
   - **Success / Populated**: Clean visual hierarchy, consistent typography, responsive layout.
   - **Error**: Non-cryptic error banners with a clear retry trigger.
2. **State Management**:
   - Keep server-state (React Query / SWR / caching) separate from client UI state (modals, inputs).
   - Avoid deep prop-drilling; use lightweight context or state hooks.
3. **Design System & Typography**:
   - Limit font families (1–2 max) and establish consistent spacing scales (multiples of 4/8px).
   - Use high-contrast, accessible palettes.
4. **Zero Layout Shifts & Responsive Behavior**:
   - Ensure the application renders cleanly across standard laptop (1440px), tablet, and mobile viewports.
   - Guard against content overflow, horizontal scrolling, and overlapping text.
