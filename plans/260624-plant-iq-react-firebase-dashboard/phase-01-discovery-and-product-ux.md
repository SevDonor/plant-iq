---
phase: 1
title: Discovery and Product UX
status: completed
priority: P1
dependencies: []
effort: 0.5 day
---

# Phase 1: Discovery and Product UX

## Overview

Lock product scope, UX direction, competitor assumptions, and the implementation-ready information architecture before creating code. This phase prevents Plant-IQ from becoming either a generic IoT widget board or a shallow plant app clone.

## Requirements

- Functional: define dashboard/page scope, data entities, navigation model, and page acceptance criteria.
- Non-functional: desktop-first responsive layout, accessible UI, maintainable component boundaries, mock-first run path.
- Product: blend plant-care friendliness with realtime IoT utility.

## Architecture

Plant-IQ v1 should be a single React app with route/page views and shared data service hooks/actions. The UX hierarchy:

1. Dashboard: current state, weather, plant health, sensor KPIs, reminders, activity.
2. Plant list: multiple plant overview and add-plant affordance.
3. Plant detail: thresholds, status, schedule, sensor history, manual pump action.
4. Care: reminders CRUD-like UI.
5. Statistics: multi-series charts with time filters and averages.
6. Settings: thresholds, Firebase/device config, save flow.

## Competitor Comparison

| Product | Relevant pattern | Gap Plant-IQ can exploit |
|---------|------------------|--------------------------|
| Planta | Individual schedules, plant recommendations, light meter, consumer-friendly language | Lacks native ESP32/Firebase control in this project context |
| Blossom | Care guide content and plant parent education | More content-heavy than sensor/action-heavy |
| Blynk | Realtime IoT dashboards, device control, fleet/device management | Generic IoT UX, less emotionally aligned to plant care |
| Arduino Cloud | Widget dashboards, live device variables, sharing | Maker/operator UX; less polished consumer dashboard feel |

Design implication: copy the care clarity of Planta/Blossom and the operational confidence of Blynk/Arduino, but keep v1 focused on one smart plant/device.

## Related Code Files

- Create later: all requested root config, `src/`, `src/components/`, `src/pages/`, `src/firebase/`, `src/data/`.
- Modify later: none, repo is empty except `.git` at planning time.

## Implementation Steps

1. Translate the pasted requirements into a page/component checklist.
2. Normalize mojibake source text into Vietnamese labels during implementation.
3. Decide RTDB as the only Firebase database for v1 unless user overrides.
4. Decide routing strategy:
   - Preferred minimal option: local `activePage` state for a dashboard prototype.
   - Upgrade option: `react-router-dom` if URL deep links are required.
5. Define plant health states:
   - `good`: all thresholds pass.
   - `warning`: one threshold outside range, not critical.
   - `danger`: severe value or multiple threshold failures.
6. Define UX states for every data section: loading, error, empty, populated.
7. Record final labels and copy in Vietnamese; avoid emoji for structural UI icons.

## Success Criteria

- [ ] Page list and component list match user request.
- [ ] Firebase data paths and app domain models are mapped.
- [ ] Competitor-derived UX priorities are documented.
- [ ] Open decisions are either resolved or carried into implementation notes.

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Overbuilding plant diagnosis | Slower delivery, fake intelligence | Keep diagnosis out of v1; show threshold-based alerts only |
| Generic dashboard look | Fails screenshot requirement | Use supplied visual system as primary reference |
| Too much hard-coded UI data | Hard to connect Firebase | Centralize mock domain data in `mockData.js` |
| Routing scope creep | More dependencies and test surface | Use local state unless deep links are confirmed |
