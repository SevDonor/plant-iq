---
phase: 3
title: Firebase Data Layer and Mock Fallback
status: completed
priority: P1
dependencies:
  - 2
effort: 0.5-1 day
---

# Phase 3: Firebase Data Layer and Mock Fallback

## Overview

Build the data boundary that lets the app run with Firebase Realtime Database or with local mock data when env values are absent. Components should not need to know which mode is active.

## Requirements

- Functional: implement requested service functions and mock fallback.
- Non-functional: no crash when `.env` is missing; Firebase comments explain ESP32 integration points.
- Data integrity: normalize sensor thresholds and alert derivation in reusable helpers/service code.

## Architecture

```text
src/firebase/firebaseConfig.js
  reads VITE_FIREBASE_* env
  exports app/database or null mode safely

src/firebase/plantService.js
  subscribeSensorData(callback)
  updatePumpState(isOn)
  updatePlantSettings(settings)
  createReminder(reminder)
  updateReminder(id, data)
  deleteReminder(id)
  helper: derivePlantAlerts(current, thresholds)

src/data/mockData.js
  weather
  plants
  currentSensor
  sensorHistory
  reminders
  device
  activity
```

Realtime Database contract:

```text
/devices/esp32-plant-001
  status: "online"
  lastSeen: timestamp
  pump: false

/sensors/esp32-plant-001/current
  temperature: 26
  airHumidity: 66
  soilMoisture: 79
  light: 604
  airQuality: 34
  timestamp: timestamp

/sensors/esp32-plant-001/history/{autoId}
  temperature: 26
  airHumidity: 66
  soilMoisture: 79
  light: 604
  airQuality: 34
  timestamp: timestamp

/plants/plant-001
  name: "Cây Trầu Bà"
  scientificName: "Epipremnum aureum"
  ageMonth: 8
  status: "Phát triển tốt"
  deviceId: "esp32-plant-001"
  thresholds: {...}

/reminders/plant-001/{autoId}
  title: "Tưới nước"
  type: "watering"
  schedule: "Mỗi ngày 07:00"
  enabled: true
  note: "Tưới 200ml"
```

## Related Code Files

- Create: `src/firebase/firebaseConfig.js`
- Create: `src/firebase/plantService.js`
- Create: `src/data/mockData.js`
- Modify: pages/components consuming data after this phase

## Implementation Steps

1. Add `.env.example` with all requested Firebase variables:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_DATABASE_URL`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
2. Implement `hasFirebaseConfig` by checking required env values, especially `DATABASE_URL`.
3. Initialize Firebase only when config is complete.
4. Implement `subscribeSensorData(callback)`:
   - Firebase mode: subscribe to current sensor, plant, device, reminders, history.
   - Mock mode: immediately call callback with mock snapshot and return noop unsubscribe.
5. Implement write functions:
   - Firebase mode: use RTDB `set`, `update`, `push`, `remove`.
   - Mock mode: resolve a promise and optionally update in-memory mock state for UI feedback.
6. Implement alert logic:
   - soil moisture below min -> `Cần tưới nước`
   - temperature above max -> `Nhiệt độ cao`
   - light below min -> `Thiếu ánh sáng`
   - all pass -> `Cây đang phát triển tốt`
7. Add concise comments only around Firebase/ESP32 connection assumptions.
8. Keep service exports stable for later desktop conversion.

## Success Criteria

- [ ] App does not throw when no `.env` exists.
- [ ] All requested service functions exist.
- [ ] Mock data is rich enough for every page and state.
- [ ] Alert derivation is reusable and covered by manual verification or unit-style helper checks.
- [ ] Firebase imports are isolated to `src/firebase/*`.

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Firebase env partial config crashes app | Bad first run | Guard initialization and fallback to mock |
| Components import Firebase directly | Hard desktop conversion | Enforce service-only access |
| RTDB history grows unbounded | Future performance issue | README notes ESP32/history retention strategy; v1 charts consume limited history |
| Mock write behavior lies too much | Confusing UX | Show optimistic UI but label Firebase mode in settings/device card |
