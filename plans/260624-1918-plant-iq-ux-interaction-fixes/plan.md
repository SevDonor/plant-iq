---
title: Fix Plant-IQ UX Interaction Gaps
description: >-
  Follow-up implementation plan to fix UX/accessibility issues found during
  in-app browser testing: duplicate detail labels, inert notification/add-plant
  actions, mobile dashboard density, and regression verification.
status: completed
priority: P1
branch: main
tags:
  - react
  - ux
  - accessibility
  - responsive
  - browser-test
blockedBy: []
blocks: []
created: '2026-06-24T12:18:10.158Z'
createdBy: 'ck:plan'
source: skill
---

# Fix Plant-IQ UX Interaction Gaps

## Overview

Browser testing on `http://127.0.0.1:5173/` confirmed core Plant-IQ flows work, but surfaced four UX gaps:

| Finding | Severity | Evidence | Fix Direction |
|---------|----------|----------|---------------|
| Duplicate `Xem chi tiết` labels | High | 5 buttons share same accessible name; automation clicked sidebar promo instead of plant detail | Add contextual `aria-label`s and stable action contracts |
| `Thêm cây mới` inert | High | Click produced no visible state change | Add modal/form or explicit disabled/future-state behavior |
| `Xem thông báo` inert | Medium | Click produced no visible state change | Add notification popover/panel with alerts/activity |
| Mobile dashboard too long | Medium | No overflow, but sensor section stacks into a long scan path | Add compact mobile summary/accordion behavior or responsive sensor density |

Confirmed working and must not regress:

- Dashboard refresh works.
- Sidebar navigation works.
- Plant List renders.
- Plant Detail works when the correct detail button is clicked.
- Manual pump updates to `Đang tưới`.
- Care: create reminder, toggle, delete all work.
- Statistics filter works.
- Settings save works.
- No console errors/warnings during tested flows.
- No horizontal overflow at 1920x1080, 2560x1440, 3840x2160, and 390x844.

## Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | [Accessibility Labels and Navigation Contracts](./phase-01-accessibility-labels-and-navigation-contracts.md) | Completed |
| 2 | [Notifications and Add Plant Interactions](./phase-02-notifications-and-add-plant-interactions.md) | Completed |
| 3 | [Mobile Density and Responsive Polish](./phase-03-mobile-density-and-responsive-polish.md) | Completed |
| 4 | [Browser Regression Verification](./phase-04-browser-regression-verification.md) | Completed |

## Dependencies

No blocking unfinished plans. This plan depends on the completed baseline plan:

- `plans/260624-plant-iq-react-firebase-dashboard/plan.md`

## Scope

In scope:

- Fix duplicate accessible names for detail actions.
- Add visible behavior for notification button.
- Add visible behavior for add-plant action.
- Improve mobile dashboard scan density without redesigning all pages.
- Re-run build and browser regression checks.

Out of scope:

- Real Firebase persistence for newly added plants beyond current mock/service model.
- Authentication, multi-user ownership, image upload, AI diagnosis, push notifications.
- Major visual rebrand.
- Replacing local state navigation with React Router.

## Target Touchpoints

- `src/App.jsx`
- `src/components/Topbar.jsx`
- `src/components/Sidebar.jsx`
- `src/components/PlantStatusCard.jsx`
- `src/components/PlantListCard.jsx`
- `src/components/BottomNav.jsx`
- `src/components/AlertCard.jsx`
- `src/pages/Dashboard.jsx`
- `src/pages/PlantList.jsx`
- `src/pages/Care.jsx`
- `src/data/mockData.js`

## Acceptance Criteria

- Browser automation can uniquely target detail actions by accessible name:
  - `Xem chi tiết Cây Trầu Bà`
  - `Xem chi tiết Cây Lưỡi Hổ`
  - sidebar promo has a distinct label.
- Clicking each plant-list detail button navigates to a detail view for that plant or clearly indicates selected plant context.
- Clicking `Thêm cây mới` opens a visible modal/form or clearly communicated future-state panel.
- Add-plant form has visible labels, cancel path, and submit feedback.
- Clicking `Xem thông báo` opens a visible notification popover/panel and can be dismissed.
- Mobile dashboard at `390x844` has no horizontal overflow and reduces first-page scroll burden compared with current sensor stack.
- Existing working flows remain pass:
  - refresh, navigation, plant detail, pump, reminder create/toggle/delete, statistics filter, settings save.
- `npm run build` passes.
- Browser console has no new warnings/errors during regression run.

## Verification Commands

```bash
npm run build
```

Browser checks:

```text
Open http://127.0.0.1:5173/
Test viewports:
- 390x844
- 1920x1080
- 2560x1440
- 3840x2160
Run interaction pass:
- Dashboard refresh
- Detail buttons
- Pump
- Add plant
- Notification popover
- Reminder create/toggle/delete
- Statistics filter
- Settings save
```

## Open Questions

None. Use pragmatic defaults:

- Add plant can be mock-local only.
- Notification panel can show existing alerts/activity, not real push notifications.
- Mobile compact mode can be UI-only state, no new data contract.
