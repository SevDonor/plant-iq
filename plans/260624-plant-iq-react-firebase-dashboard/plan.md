---
title: Build Plant-IQ React Firebase IoT Dashboard
description: >-
  Implementation plan for a complete React/Vite/Tailwind/Firebase smart plant
  IoT dashboard with mock fallback, ESP32-ready data contracts, responsive UI,
  and Vercel deployment.
status: completed
priority: P2
branch: main
tags:
  - react
  - vite
  - tailwind
  - firebase
  - iot
  - dashboard
  - plant-care
blockedBy: []
blocks: []
created: '2026-06-24T11:43:10.492Z'
createdBy: 'ck:plan'
source: skill
---

# Build Plant-IQ React Firebase IoT Dashboard

## Overview

Build `Plant-IQ`, a complete frontend-first smart garden dashboard for ESP32 sensor data flowing through Firebase to a React web app deployed on Vercel. The app must run without real Firebase credentials by falling back to `src/data/mockData.js`, while preserving a clean Firebase service boundary so a later Tauri/Electron conversion is straightforward.

Requested stack:

| Area | Decision |
|------|----------|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Icons | `lucide-react` |
| Charts | `recharts` |
| Data/backend | Firebase Realtime Database first; Firestore only if later scope changes |
| Hosting | Vercel |
| Backend server | None in phase 1 |
| Desktop readiness | Service isolation, no unnecessary browser-only APIs, successful production build |

Product positioning:

| Competitor type | Examples | What they do well | Plant-IQ response |
|-----------------|----------|-------------------|-------------------|
| Plant care apps | Planta, Blossom, PlantIn | Care schedules, plant guidance, reminders, diagnosis workflows | Match reminders and approachable care language; do not overbuild diagnosis in v1 |
| IoT dashboards | Blynk, Arduino Cloud | Widgets, realtime metrics, device control, fleet/device state | Provide realtime current sensor cards, chart history, pump toggle, device status |
| Generic Firebase dashboards | Community templates | Quick auth/data scaffolds | Build a domain-specific UX instead of a generic admin shell |

Design target:

- Match the supplied dashboard image: left sidebar, airy white/green surfaces, soft botanical accents, rounded 20px cards, pastel green/yellow background, dense but calm sensor layout.
- Use a web-dashboard interpretation of `ck:ui-ux-pro-max`: accessible contrast, 44px interactive targets, responsive breakpoints, real loading/error/empty states, no emoji as structural icons.
- Use Lucide icons for navigation/actions/status. Botanical illustrations may be CSS/SVG or lightweight local assets, but should not block the build.

External reference notes:

- Planta public site emphasizes individualized care schedules, reminders, recommendations, guides, identification, and light meter: https://getplanta.com/
- Blossom App Store listing emphasizes plant care information for watering, propagation, pruning, fertilizing: https://apps.apple.com/us/app/blossom-plant-care-guide/id1487453649
- Blynk positions itself as low-code IoT infrastructure for connecting devices, apps, and device fleets: https://blynk.io/
- Blynk dashboard article frames dashboards as a single pane of glass for IoT data: https://blynk.io/blog/gain-a-holistic-view-of-your-iot-data-across-fleets-with-blynks-new-dashboards
- Arduino Cloud dashboards document widget-based dashboards and sharing: https://cloud.arduino.cc/features-custom-dashboard/
- Vercel Firebase templates confirm Firebase + Vercel is a normal deployment path: https://vercel.com/templates/firebase

Scope boundaries:

- Include all requested pages and components.
- Include mock data and Firebase service functions.
- Include README and `.env.example`.
- Do not add authentication, payments, backend API, AI diagnosis, image upload, notification delivery, or multi-user permissions in v1 unless the user expands scope.
- Do not hard-code production secrets or real Firebase credentials.

## Phases

| Phase | Name | Status |
|-------|------|--------|
| 1 | [Discovery and Product UX](./phase-01-discovery-and-product-ux.md) | Completed |
| 2 | [Project Scaffold and Design System](./phase-02-project-scaffold-and-design-system.md) | Completed |
| 3 | [Firebase Data Layer and Mock Fallback](./phase-03-firebase-data-layer-and-mock-fallback.md) | Completed |
| 4 | [Dashboard Implementation](./phase-04-dashboard-implementation.md) | Completed |
| 5 | [Secondary Pages and Responsive Navigation](./phase-05-secondary-pages-and-responsive-navigation.md) | Completed |
| 6 | [Quality Gates Documentation and Deployment](./phase-06-quality-gates-documentation-and-deployment.md) | Completed |

## Dependencies

No cross-plan dependencies detected. Repository had no unfinished project-local plans at planning time.

## Acceptance Criteria

- `npm install` completes.
- `npm run dev` starts a Vite dev server.
- `npm run build` completes without import, Tailwind, chart, or Firebase/env errors.
- App works with no `.env` by using mock data.
- App can use Firebase Realtime Database when `VITE_FIREBASE_*` values are provided.
- Main dashboard visually matches the supplied screenshot direction.
- All requested pages exist and are reachable through sidebar and mobile/bottom navigation.
- Loading, error, and empty states exist for data-dependent sections.
- README explains install, local run, Firebase config, database structure, ESP32 write pattern, Vercel deploy, and desktop conversion notes.

## Architecture Summary

```text
ESP32
  writes sensor/device/reminder data
Firebase Realtime Database
  /devices, /sensors, /plants, /reminders
React service layer
  src/firebase/firebaseConfig.js
  src/firebase/plantService.js
  mock fallback from src/data/mockData.js
React UI
  pages + reusable dashboard cards + charts + navigation
Vercel
  static Vite build
```

Key design choice: keep Firebase access behind `plantService.js`. Components consume normalized domain data and actions, not raw Firebase refs. This limits coupling and makes later Tauri/Electron migration feasible.

## Proposed File Tree

```text
plant-iq/
  package.json
  index.html
  vite.config.js
  tailwind.config.js
  postcss.config.js
  .env.example
  README.md
  src/
    main.jsx
    App.jsx
    index.css
    firebase/
      firebaseConfig.js
      plantService.js
    data/
      mockData.js
    components/
      Sidebar.jsx
      Topbar.jsx
      WeatherCard.jsx
      PlantStatusCard.jsx
      SensorCard.jsx
      SensorChart.jsx
      ReminderCard.jsx
      PlantListCard.jsx
      DeviceCard.jsx
      AlertCard.jsx
      BottomNav.jsx
    pages/
      Dashboard.jsx
      PlantList.jsx
      PlantDetail.jsx
      Care.jsx
      Statistics.jsx
      Settings.jsx
```

## Open Questions

- Should navigation use React Router, or keep lightweight local state routing for v1? Recommendation: use `react-router-dom` only if deep links are required now.
- Should plant illustrations be inline SVG/CSS or image assets? Recommendation: inline SVG/CSS for v1 to avoid asset/network fragility.
- Should Firebase use Realtime Database exclusively? Recommendation: yes, because ESP32 sensor streams map naturally to RTDB paths.
