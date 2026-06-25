---
phase: 6
title: Quality Gates Documentation and Deployment
status: completed
priority: P1
dependencies:
  - 2
  - 3
  - 4
  - 5
effort: 0.5-1 day
---

# Phase 6: Quality Gates Documentation and Deployment

## Overview

Verify the project installs, runs, builds, and can be understood by another developer or by the user when connecting ESP32/Firebase/Vercel.

## Requirements

- Functional: local dev and production build pass.
- Documentation: README covers setup, Firebase, ESP32 writes, deploy, desktop conversion.
- Quality: no broken imports, Tailwind config errors, Firebase crashes, or obvious responsive regressions.

## Architecture

Quality gate order:

```text
npm install
  -> npm run build
  -> npm run dev smoke check
  -> optional browser screenshot/manual responsive pass
  -> README validation
```

If a dev server is started for verification, keep it running only if the user needs to inspect; otherwise stop it before final.

## Related Code Files

- Create: `README.md`
- Modify: `.env.example`
- Modify: source files based on validation failures
- Optional create: no test files unless implementation complexity warrants it

## Implementation Steps

1. Run `npm install`.
2. Run `npm run build`.
3. Run `npm run dev` and confirm Vite starts.
4. Smoke test pages:
   - Dashboard.
   - Plant list.
   - Plant detail.
   - Care.
   - Statistics.
   - Settings.
5. Verify no Firebase config:
   - remove/omit `.env`.
   - app uses mock data.
   - no console-blocking crash from Firebase initialization.
6. Verify Tailwind:
   - classes render.
   - no PostCSS/Tailwind import errors.
7. Verify responsive:
   - 375px mobile.
   - 768px tablet.
   - 1440px desktop.
   - no horizontal scroll.
8. Verify accessibility basics:
   - buttons have labels.
   - focus ring visible.
   - status text not color-only.
   - chart has visible numeric summary.
9. Write README sections:
   - giới thiệu Plant-IQ.
   - cách cài đặt.
   - cách chạy local.
   - cấu hình Firebase.
   - Firebase Realtime Database structure.
   - ESP32 write examples/pseudocode.
   - deploy Vercel.
   - Tauri/Electron conversion notes.
10. Fix any validation failures directly; do not hide errors.

## Success Criteria

- [ ] `npm install` passes.
- [ ] `npm run dev` starts.
- [ ] `npm run build` passes.
- [ ] No import/Tailwind/Firebase missing-env crash.
- [ ] README is complete and matches actual scripts/files.
- [ ] Final handoff includes exact run commands and any unresolved issues.

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Vite build catches late import typo | Blocks delivery | Run build after each major phase or before final at minimum |
| README drifts from actual code | User setup fails | Write README after implementation and verify commands |
| Firebase security rules absent | Real deploy may be unsafe | README flags production rule hardening as required before public data |
| Desktop conversion promise too broad | Misleading | Document readiness constraints, not full conversion |
