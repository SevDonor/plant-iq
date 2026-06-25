---
phase: 4
title: Browser Regression Verification
status: completed
priority: P1
dependencies:
  - 1
  - 2
  - 3
effort: 0.5 day
---

# Phase 4: Browser Regression Verification

## Overview

Verify the UX fixes with build checks and in-app browser interaction tests. This phase is the release gate for the follow-up fix.

## Requirements

- Functional: all fixed and previously working flows pass.
- Non-functional: no build errors, no console errors, no responsive overflow.
- Accessibility: unique accessible names for previously ambiguous controls.

## Architecture

Verification matrix:

| Area | Check |
|------|-------|
| Build | `npm run build` |
| Console | no new `error`/`warn` logs during test flow |
| Accessibility labels | detail buttons resolve uniquely |
| Interaction | notification/add plant produce visible state changes |
| Regression | existing dashboard/detail/care/statistics/settings flows still pass |
| Responsive | 390x844, 1920x1080, 2560x1440, 3840x2160 |

## Related Code Files

- No code creation required unless adding a reusable smoke script.
- Optional create: `scripts/browser-smoke-test.mjs` if repeatability is desired.

## Implementation Steps

1. Run build:

```bash
npm run build
```

2. Open/claim `http://127.0.0.1:5173/` in the in-app browser.
3. Check console logs before interaction.
4. Run interaction regression:
   - refresh dashboard.
   - unique detail action for `Cây Trầu Bà`.
   - unique detail action for `Cây Lưỡi Hổ`.
   - manual pump state update.
   - notification panel open/close.
   - add plant form open/cancel.
   - add plant form submit and new card visible.
   - reminder create/toggle/delete.
   - statistics filter.
   - settings save.
5. Run viewport audit:
   - 390x844
   - 1920x1080
   - 2560x1440
   - 3840x2160
6. Confirm no horizontal overflow.
7. Record final findings in the implementation handoff or journal.

## Success Criteria

- [ ] `npm run build` passes.
- [ ] No browser console errors/warnings in the tested flow.
- [ ] `Xem chi tiết Cây Trầu Bà` count is 1.
- [ ] `Xem chi tiết Cây Lưỡi Hổ` count is 1.
- [ ] `Thêm cây mới` changes visible state.
- [ ] `Xem thông báo` changes visible state.
- [ ] Existing working flows remain pass.
- [ ] All target viewports have no horizontal overflow.

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Browser test mutates mock UI state | Later checks become order-dependent | Start from page reload before each major flow if needed |
| Add plant local state affects detail assumptions | Detail checks may target new plant accidentally | Use explicit accessible names in test |
| Console warnings from chart internals | Noise | Treat new app-level warnings as failures; document third-party warnings if any |
