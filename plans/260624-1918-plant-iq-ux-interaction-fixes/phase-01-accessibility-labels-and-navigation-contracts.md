---
phase: 1
title: Accessibility Labels and Navigation Contracts
status: completed
priority: P1
dependencies: []
effort: 0.5 day
---

# Phase 1: Accessibility Labels and Navigation Contracts

## Overview

Fix duplicate action labels and make navigation contracts deterministic for keyboard users, screen readers, and browser regression tests.

## Requirements

- Functional: every plant detail action must be uniquely targetable and navigate to the intended detail context.
- Non-functional: no visual regressions; no broad routing rewrite.
- Accessibility: no repeated generic accessible names for semantically different actions.

## Architecture

Add contextual action labels at component boundaries:

```text
PlantListCard
  button aria-label="Xem chi tiết {plant.name}"
  onDetail(plant.id)

PlantStatusCard
  button aria-label="Xem chi tiết {plant.name} đang theo dõi"

Sidebar promo
  button aria-label="Xem danh sách cây từ thẻ gợi ý"

App
  selectedPlantId state
  detail page receives selected plant when available
```

Keep current local-state navigation. Do not introduce React Router in this fix.

## Related Code Files

- Modify: `src/App.jsx`
- Modify: `src/components/PlantListCard.jsx`
- Modify: `src/components/PlantStatusCard.jsx`
- Modify: `src/components/Sidebar.jsx`
- Modify: `src/pages/PlantList.jsx`
- Modify: `src/pages/PlantDetail.jsx`

## Implementation Steps

1. Add `aria-label` props or derived labels to all `Xem chi tiết` buttons.
2. Change `PlantListCard` so `onDetail(plant.id)` is called from each card.
3. Add `selectedPlantId` state in `App.jsx`.
4. When a user clicks a plant card, set `selectedPlantId` and navigate to `detail`.
5. Pass selected plant into `PlantDetail`.
6. Ensure fallback detail behavior still uses `plant-001` if no selected ID exists.
7. Update the sidebar promo button label so it does not conflict with plant detail actions.

## Success Criteria

- [ ] Browser locator for `Xem chi tiết Cây Trầu Bà` resolves to exactly one button.
- [ ] Browser locator for `Xem chi tiết Cây Lưỡi Hổ` resolves to exactly one button.
- [ ] Sidebar promo no longer shares the same accessible name as plant-card detail buttons.
- [ ] Clicking a plant-card detail action opens detail context for that plant.
- [ ] Pump button still works on detail page.

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Selected plant breaks mock snapshot assumptions | Detail page may show undefined fields | Fallback to `data.plant` and normalize missing threshold fields |
| Labels drift from visible text | Screen reader confusion | Keep visible text `Xem chi tiết`; add contextual aria-label only |
| More state in `App.jsx` | Slight complexity | Keep state minimal: `selectedPlantId` only |
