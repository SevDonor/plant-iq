---
phase: 3
title: Mobile Density and Responsive Polish
status: completed
priority: P2
dependencies:
  - 1
  - 2
effort: 0.5 day
---

# Phase 3: Mobile Density and Responsive Polish

## Overview

Reduce mobile dashboard scroll burden while preserving the full desktop/FHD/2K/4K dashboard layout that already passes overflow checks.

## Requirements

- Functional: mobile dashboard exposes sensor data without forcing five full cards before charts/alerts.
- Non-functional: no horizontal overflow; FHD/2K/4K layout remains bounded.
- UX: maintain clear hierarchy and touch targets.

## Architecture

Current mobile issue:

```text
Weather card
Plant status card
Sensor section
  5 full cards stacked
Chart
Alerts
Reminders
Activity
```

Target mobile behavior:

```text
Weather card
Plant status card
Sensor compact strip or 2-column compact cards
Primary alert
Chart/reminders below
```

Preferred implementation:

- Add `compact` prop to `SensorCard`, or create mobile-only compact sensor list.
- Use responsive classes so desktop card layout remains unchanged.
- Keep all sensor values visible; do not hide critical metrics.

## Related Code Files

- Modify: `src/pages/Dashboard.jsx`
- Modify: `src/components/SensorCard.jsx`
- Modify: `src/components/SensorChart.jsx`
- Modify: `src/components/WeatherCard.jsx` if mobile height remains high
- Modify: `src/components/PlantStatusCard.jsx` if mobile height remains high

## Implementation Steps

1. Add compact mobile sensor rendering:
   - either `grid-cols-2` compact cards under `md`.
   - or a horizontal scroll-free `SensorSummaryGrid`.
2. Reduce mobile card chrome:
   - smaller icon containers.
   - shorter sparkline or hide sparkline below `sm`.
   - keep value/title/status visible.
3. Review WeatherCard mobile height:
   - preserve location, temperature, key metrics.
   - avoid excessive vertical gaps.
4. Review PlantStatusCard mobile height:
   - keep illustration compact.
   - ensure CTA remains visible.
5. Ensure bottom nav does not cover content:
   - keep adequate bottom padding.
6. Preserve current desktop layout and max-width canvas.

## Success Criteria

- [ ] At `390x844`, no horizontal overflow.
- [ ] At `390x844`, sensor section is materially shorter than current stacked full cards.
- [ ] All five sensor values remain visible on mobile.
- [ ] Bottom nav does not cover last visible content.
- [ ] At `1920x1080`, `2560x1440`, `3840x2160`, dashboard remains bounded and no horizontal overflow appears.

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Hiding sparklines reduces perceived richness | Mobile feels less premium | Hide only on very small screens; keep chart below |
| Compact cards become too small to read | Accessibility issue | Keep 16px labels where possible and values prominent |
| Desktop class changes regress FHD/2K/4K | User-visible layout regression | Re-run viewport audit after changes |
