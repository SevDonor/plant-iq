---
phase: 2
title: Notifications and Add Plant Interactions
status: completed
priority: P1
dependencies:
  - 1
effort: 0.5-1 day
---

# Phase 2: Notifications and Add Plant Interactions

## Overview

Replace inert affordances with visible, useful UI behavior for `Xem thông báo` and `Thêm cây mới`.

## Requirements

- Functional: notification button opens a panel; add-plant button opens a form or future-state panel.
- Non-functional: no Firebase requirement; mock-local interaction is acceptable.
- UX: every click produces clear feedback within the same screen.

## Architecture

```text
Topbar
  notification button
  onToggleNotifications()
  aria-expanded + aria-controls

Dashboard/App shell
  NotificationPanel
    alerts + activity
    dismiss/close button

PlantList
  AddPlantModal
    name
    scientificName
    species
    thresholds minimal defaults
    cancel + submit
```

Two implementation choices are acceptable:

1. Add local UI-only modal in `PlantList.jsx`.
2. Promote add-plant state/actions to `App.jsx` if new plant should appear globally immediately.

Recommendation: promote to `App.jsx` so the created mock plant appears in Plant List and can be selected.

## Related Code Files

- Modify: `src/App.jsx`
- Modify: `src/components/Topbar.jsx`
- Modify: `src/pages/PlantList.jsx`
- Modify: `src/data/mockData.js`
- Optional create: `src/components/NotificationPanel.jsx`
- Optional create: `src/components/AddPlantModal.jsx`

## Implementation Steps

1. Add notification state:
   - `notificationsOpen`
   - toggle from `Topbar`
   - close on explicit close button.
2. Implement notification panel:
   - Show threshold alerts from current sensor.
   - Show latest activity rows.
   - Include `Đóng thông báo` button.
   - Use `role="dialog"` or a clearly labelled region.
3. Add `aria-expanded` and `aria-controls` to notification button.
4. Implement add-plant modal/form:
   - visible labels, not placeholder-only.
   - required name/species fields.
   - cancel button.
   - submit button with disabled/loading feedback.
5. On submit, append a mock-local plant with safe default thresholds and status.
6. Show the new plant in Plant List immediately.
7. Optional: add a short inline success status after submit.

## Success Criteria

- [ ] Clicking `Xem thông báo` changes visible page state.
- [ ] Notification panel contains alerts/activity and can be dismissed.
- [ ] Clicking `Thêm cây mới` opens visible form/modal.
- [ ] Add-plant form has visible labels and cancel path.
- [ ] Submitting a valid plant adds it to the plant grid.
- [ ] No console errors after notification/add-plant interactions.

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Modal keyboard trap not implemented | Accessibility gap | Keep modal simple and provide clear close/cancel; focus polish can be follow-up |
| New mock plant lacks data required by cards | Runtime errors | Generate complete plant object with defaults |
| Notification popover overlaps topbar on small screens | Mobile usability issue | Use responsive fixed panel below topbar or full-width mobile sheet |
