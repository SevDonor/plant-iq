---
phase: 2
title: Project Scaffold and Design System
status: completed
priority: P1
dependencies:
  - 1
effort: 0.5-1 day
---

# Phase 2: Project Scaffold and Design System

## Overview

Create the Vite/React/Tailwind project foundation and encode the Plant-IQ visual system so every page can reuse consistent spacing, colors, cards, icons, and responsive layout.

## Requirements

- Functional: app bootstraps, Tailwind compiles, Lucide/Recharts/Firebase dependencies installed.
- Non-functional: clean file tree, small components, no secrets, buildable from empty env.
- UI: pastel botanical dashboard matching the screenshot, not a generic admin template.

## Architecture

Root app owns the shell:

```text
App.jsx
  Sidebar
  Topbar
  active page outlet
  BottomNav on mobile/tablet
```

Tailwind owns design tokens through config and utility classes:

- Background: pale green to pale yellow app gradient.
- Surfaces: white/near-white cards with soft green/blue borders.
- Primary: plant green.
- Status: green good, amber warning, red danger.
- Radius: requested 20px for major cards; smaller 12-16px for controls.
- Shadow: soft, layered, low opacity.

## Related Code Files

- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.js`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `.env.example`
- Create: `src/main.jsx`
- Create: `src/App.jsx`
- Create: `src/index.css`
- Create: `src/components/Sidebar.jsx`
- Create: `src/components/Topbar.jsx`
- Create: `src/components/BottomNav.jsx`

## Implementation Steps

1. Initialize a Vite React app structure manually or via npm scaffold.
2. Install production dependencies:
   - `@vitejs/plugin-react`
   - `vite`
   - `react`
   - `react-dom`
   - `tailwindcss`
   - `postcss`
   - `autoprefixer`
   - `lucide-react`
   - `recharts`
   - `firebase`
3. Configure scripts:
   - `dev`: `vite`
   - `build`: `vite build`
   - `preview`: `vite preview`
4. Configure Tailwind content globs for `index.html` and `src/**/*.{js,jsx}`.
5. Add base CSS:
   - `box-sizing: border-box`
   - modern font stack
   - antialiasing
   - root background
   - focus-visible ring
6. Implement layout shell:
   - fixed-width desktop sidebar.
   - main content with responsive padding.
   - topbar with greeting/date/weather/status actions.
   - bottom nav visible on small screens.
7. Use Lucide icons consistently for sidebar, actions, alerts, device, settings.
8. Define reusable class patterns through composition in JSX, not by creating a large CSS framework.

## Success Criteria

- [ ] App renders a shell with sidebar/topbar/bottom nav.
- [ ] Tailwind styles apply correctly.
- [ ] Lucide icons render.
- [ ] Production build works before page complexity is added.
- [ ] No component exceeds 200 lines unless there is a clear reason.

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| One-note green palette | UI feels flat | Add pale blue, amber, violet sensor accents while green remains primary |
| Rounded cards everywhere become childish | Less professional | Use 20px only for major cards; tighter radius for controls |
| Desktop-only implementation | Poor mobile result | Add responsive shell early |
| CSS sprawl | Hard to maintain | Prefer Tailwind utilities and small component props |
