---
phase: 5
title: Secondary Pages and Responsive Navigation
status: completed
priority: P2
dependencies:
  - 3
  - 4
effort: 1-1.5 days
---

# Phase 5: Secondary Pages and Responsive Navigation

## Overview

Implement the remaining requested pages and navigation states without duplicating dashboard logic. These pages should feel complete enough for a real product demo, not placeholder screens.

## Requirements

- Functional: Plant list, plant detail, care/reminders, statistics, settings.
- Non-functional: shared components, clear empty/error states, desktop-first with usable mobile layout.
- UX: navigation active states, predictable detail actions, accessible forms/toggles.

## Architecture

```text
pages/PlantList.jsx
  PlantListCard grid

pages/PlantDetail.jsx
  info + thresholds + status + care schedule + sensor history + manual pump

pages/Care.jsx
  reminder list + create form + toggles + completed/pending

pages/Statistics.jsx
  time filters + line charts + averages

pages/Settings.jsx
  plant thresholds + Firebase config hints + ESP32 device settings + save
```

## Related Code Files

- Create: `src/pages/PlantList.jsx`
- Create: `src/pages/PlantDetail.jsx`
- Create: `src/pages/Care.jsx`
- Create: `src/pages/Statistics.jsx`
- Create: `src/pages/Settings.jsx`
- Create: `src/components/PlantListCard.jsx`
- Create: `src/components/DeviceCard.jsx`
- Modify: `src/components/Sidebar.jsx`
- Modify: `src/components/BottomNav.jsx`
- Modify: `src/App.jsx`
- Modify: `src/firebase/plantService.js` for page action needs

## Implementation Steps

1. Plant List:
   - Render grid cards for Cây Trầu Bà, Cây Lưỡi Hổ, Cây Kim Tiền, Cây Sen Đá.
   - Each card shows species, status, soil moisture, temperature, light, detail button.
   - Include `Thêm cây mới` action as a styled button; v1 may open a non-persistent form or disabled future-state modal if not in scope.
2. Plant Detail:
   - Show plant info, planted date, age, thresholds, current status.
   - Show care schedule and sensor history.
   - Add manual pump button:
     - calls `updatePumpState(true)`.
     - updates UI to `Đang tưới`.
     - includes disabled/loading state while write is pending.
3. Care:
   - Show reminders by type: watering, fertilizing, leaf check, soil change.
   - Create reminder form with visible labels.
   - Toggle enabled/disabled.
   - Mark completed/pending.
   - Use `createReminder`, `updateReminder`, `deleteReminder`.
4. Statistics:
   - Time filters: 24h, 7 days, 30 days.
   - Line charts for temperature, air humidity, soil moisture, light.
   - Average cards for temperature, humidity, light, watering count.
   - Keep values visible outside hover tooltips.
5. Settings:
   - Plant information section.
   - Threshold inputs for soil moisture, temperature, air humidity, light.
   - Firebase config display that explains env mode without exposing secrets.
   - ESP32 device card: Device ID, online/offline, last update.
   - Save settings button calls `updatePlantSettings`.
6. Responsive navigation:
   - Sidebar for desktop.
   - BottomNav for mobile/tablet.
   - Ensure no horizontal scroll at 375px.
7. Shared states:
   - Empty state for no plants/reminders/history.
   - Error state with retry path.
   - Loading skeletons for async data.

## Success Criteria

- [ ] All five secondary pages are reachable.
- [ ] All requested fields/actions are visible.
- [ ] Forms have labels and loading/error feedback.
- [ ] Mobile layout is usable at 375px.
- [ ] No duplicate hard-coded datasets inside page components.
- [ ] Manual pump action uses service layer, not direct Firebase code.

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Secondary pages become static placeholders | Demo feels incomplete | Implement real mock-driven state and actions |
| Reminder CRUD scope grows | Delays v1 | Use lightweight local/Firebase service actions, no calendar engine |
| Settings exposes secrets | Security issue | Show config status only, never values |
| Bottom nav overcrowded | Mobile UX suffers | Use max five primary items; put less common actions in settings/sidebar |
