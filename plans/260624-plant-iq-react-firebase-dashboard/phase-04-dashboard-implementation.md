---
phase: 4
title: Dashboard Implementation
status: completed
priority: P1
dependencies:
  - 2
  - 3
effort: 1-1.5 days
---

# Phase 4: Dashboard Implementation

## Overview

Implement the main dashboard as the visual and functional centerpiece. It should closely follow the supplied screenshot while using real component/data boundaries.

## Requirements

- Functional: weather, plant status, sensor mini cards, 24h chart, reminders, alerts/activity.
- Non-functional: high visual polish, responsive behavior, loading/error/empty states.
- Accessibility: semantic headings, visible focus, text labels, chart summaries, no color-only statuses.

## Architecture

```text
pages/Dashboard.jsx
  use Plant service snapshot
  WeatherCard
  PlantStatusCard
  SensorCard x5
  SensorChart
  ReminderCard
  AlertCard / activity panel
```

Sensor cards:

| Metric | Unit | Accent | Icon |
|--------|------|--------|------|
| Temperature | °C | orange | Thermometer |
| Air humidity | % | blue | Droplets |
| Soil moisture | % | green | Leaf |
| Light | lx | amber | Sun |
| AQI | AQI | violet | Wind |

## Related Code Files

- Create: `src/pages/Dashboard.jsx`
- Create: `src/components/WeatherCard.jsx`
- Create: `src/components/PlantStatusCard.jsx`
- Create: `src/components/SensorCard.jsx`
- Create: `src/components/SensorChart.jsx`
- Create: `src/components/ReminderCard.jsx`
- Create: `src/components/AlertCard.jsx`
- Modify: `src/App.jsx`
- Modify: `src/data/mockData.js` if additional dashboard sample data is needed

## Implementation Steps

1. Build `Dashboard.jsx` with a two-tier layout:
   - top row: weather card and plant status card.
   - middle: sensor KPI cards.
   - bottom: reminders and activity/alerts panels.
2. Implement `WeatherCard` with:
   - TP.HCM / Phường 12 location.
   - 29°C, humidity, wind, UV, visibility.
   - guidance line: suitable light placement.
3. Implement `PlantStatusCard`:
   - Cây Trầu Bà, `Epipremnum aureum`.
   - age 8 months, planted date, stage/status.
   - illustration/icon plant visual.
   - health badge and detail button.
4. Implement `SensorCard` with value, unit, status pill, icon, and compact sparkline or mini trend line.
5. Implement `SensorChart` with Recharts:
   - 24h line/area view.
   - show multiple metrics only when legible.
   - visible legend or metric toggles.
   - tooltip with timestamp and units.
6. Implement reminders panel:
   - watering daily 07:00.
   - fertilizing T2/T5 09:00.
   - leaf check monthly 15th 18:00.
7. Implement activity/alerts:
   - plant growing well.
   - suitable light.
   - soil moisture stable.
   - threshold-derived warnings when mock/Firebase values change.
8. Add skeleton/loading cards.
9. Add error panel with retry or mock-mode fallback explanation.
10. Add empty state if no plant/sensor/reminder data.

## Success Criteria

- [ ] Dashboard visually aligns with supplied screenshot.
- [ ] Every requested dashboard data point is present.
- [ ] Charts render and do not overflow on mobile.
- [ ] Alert text changes according to thresholds.
- [ ] Pump state changes are reflected when called from detail/settings later.
- [ ] UI still looks good with mock data only.

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Chart dominates dashboard | Hurts screenshot match | Use compact dashboard chart; larger chart lives in Statistics |
| Too many decorative elements | Slower, noisy UI | Keep visuals functional; botanical illustration only where useful |
| Recharts responsive issues | Mobile overflow | Wrap with `ResponsiveContainer` and fixed min heights |
| Alert color reliance | Accessibility problem | Always include text and icon/status labels |
