# Roadmap

> [!NOTE]
> This document outlines the phased development plan for the N-Queens Puzzle Game, from the current web app through mobile and online multiplayer.

---

## Table of Contents

- [Phase 1 — V1 Web App (Current)](#phase-1--v1-web-app-current)
- [Phase 2 — V1.5 React Native Mobile](#phase-2--v15-react-native-mobile)
- [Phase 3 — V2 Online / Dynamic](#phase-3--v2-online--dynamic)
- [Known Limitations](#known-limitations)
- [Open Questions](#open-questions)

---

## Phase 1 — V1 Web App (Current)

**Status:** 🚧 In Development

The initial release focuses on a fully playable, polished web experience.

### Milestones

| # | Milestone | Description | Status |
|---|-----------|-------------|--------|
| 1.1 | Project Setup | Next.js 16, TypeScript, Tailwind, Vitest, folder structure | ✅ Done |
| 1.2 | Core Logic | Board, solver, scoring, validation, hints — all pure TS | 🚧 In Progress |
| 1.3 | Configuration | game.config, scoring.config, levels.config, achievements.config | 📋 Planned |
| 1.4 | State Management | Zustand store with game, progress, settings slices + persistence | 📋 Planned |
| 1.5 | Design System | Theme tokens, GameButton, GamePanel, GameModal, typography | 📋 Planned |
| 1.6 | Game Board UI | Board, Cell, Queen components with animations | 📋 Planned |
| 1.7 | Game Modes | Classic, Time Attack, Practice mode implementations | 📋 Planned |
| 1.8 | Campaign | Level definitions, chapter unlocks, pre-placed queen levels | 📋 Planned |
| 1.9 | Daily Challenge | Seeded puzzle generation, streak tracking | 📋 Planned |
| 1.10 | HUD & Screens | Timer, score display, hint button, win/lose screens, settings | 📋 Planned |
| 1.11 | Sound & Haptics | Sound effects, vibration feedback (via browser APIs) | 📋 Planned |
| 1.12 | Polish & QA | Animation refinement, edge case handling, accessibility audit | 📋 Planned |
| 1.13 | Deployment | Production build, hosting setup, performance optimization | 📋 Planned |

### Deliverables

- Fully playable N-Queens puzzle game in the browser
- 5 game modes: Classic, Time Attack, Campaign, Daily, Practice
- Board sizes 1–16
- Scoring, stars, hints, undo/redo
- Coins and XP economy
- Campaign with multiple chapters
- Daily challenge with streak tracking
- Local storage persistence
- Responsive design (desktop + mobile browser)
- >90% test coverage on core logic

---

## Phase 2 — V1.5 React Native Mobile

**Status:** 📋 Planned

A native mobile app that shares core logic with the web app.

### Goals

- **Framework:** React Native with Expo + TypeScript
- **Code sharing:** Reuse `core/`, `config/`, and `types/` from the web app unchanged
- **Native replacements:**
  - Web Audio → `expo-av`
  - `navigator.vibrate` → `expo-haptics`
  - `localStorage` → `@react-native-async-storage/async-storage`
  - Framer Motion → `react-native-reanimated`
- **Native rendering:** Skia or SVG for queens and board bevel effects
- **Platform targets:** iOS and Android

### Milestones

| # | Milestone | Description |
|---|-----------|-------------|
| 2.1 | Mono-repo setup | Configure npm workspaces or shared package linking |
| 2.2 | Core integration | Verify `core/` and `config/` import cleanly in RN |
| 2.3 | Native UI | Rebuild board, buttons, panels with React Native components |
| 2.4 | Native services | Implement AudioService, VibrationService, StorageAdapter for mobile |
| 2.5 | Navigation | React Navigation for screen flow |
| 2.6 | App Store prep | Icons, splash screens, store listings |
| 2.7 | Beta testing | TestFlight + internal Android testing |
| 2.8 | Launch | App Store + Google Play release |

### Prerequisites

- Phase 1 must be feature-complete and stable
- `core/` purity must be verified (no browser API leaks)
- Design system must be documented well enough to recreate in native

---

## Phase 3 — V2 Online / Dynamic

**Status:** 📋 Planned (Future)

Online features, multiplayer, and dynamic content.

### Features

| Feature | Description |
|---------|-------------|
| **User accounts** | Email/OAuth login, profile with stats |
| **Global leaderboards** | Daily, weekly, all-time scoreboards per board size |
| **Head-to-head matches** | Real-time 1v1: same puzzle, race to solve |
| **Challenges** | Send puzzle challenges to friends |
| **Cloud save** | Sync progress across devices (web ↔ mobile) |
| **Anti-cheat** | Server-side replay validation, time sanity checks |
| **Dynamic content** | Server-pushed weekly challenges, seasonal events |
| **Tournaments** | Bracket-style competitions with rewards |
| **Social features** | Friend list, chat, achievement sharing |

### Technical Requirements

- Backend API (see [backend_spec.md](./backend_spec.md))
- WebSocket server for real-time features
- PostgreSQL database
- Authentication provider (OAuth2)
- CDN for static assets
- Rate limiting and abuse prevention

---

## Known Limitations

These are known limitations of the **V1 web app** that are accepted for the initial release:

| # | Limitation | Impact | Resolution |
|---|-----------|--------|------------|
| 1 | No cloud save | Progress is lost if browser data is cleared | Phase 3: cloud save |
| 2 | No cross-device sync | Web and mobile progress are separate | Phase 3: cloud save |
| 3 | No multiplayer | Single-player only | Phase 3: head-to-head |
| 4 | No global leaderboard | Daily challenge scores are local only | Phase 3: leaderboards |
| 5 | Board size 16 solver can be slow | Bitmask solver may take seconds for N=16 full solve | Use web worker or pre-compute |
| 6 | No in-progress game save | Refreshing mid-game loses progress | Phase 2: auto-save in-progress games |
| 7 | No offline support | Requires initial page load (no service worker PWA) | Phase 2: PWA support |
| 8 | Desktop-only keyboard controls | Mobile relies entirely on touch | Phase 1: add mobile-friendly gesture controls |
| 9 | No colorblind mode | Conflict highlighting relies on red/green | Phase 1.12: add pattern-based conflict indicators |

---

## Open Questions

These are unresolved decisions that will be addressed as development progresses:

| # | Question | Context | Proposed Resolution |
|---|----------|---------|-------------------|
| 1 | Should the Daily Challenge board size rotate or be fixed at 8×8? | Variety vs. consistency | Weighted random 6–10, biased toward 8 (implemented in config) |
| 2 | Should campaign levels have a "par moves" in addition to par time? | Adds another scoring dimension | Start with time-only, evaluate after playtesting |
| 3 | How should pre-placed queens be indicated visually? | Must be clearly distinct from player-placed queens | Different color/style + lock icon overlay |
| 4 | Should there be a "zen mode" with no scoring at all? | Some players prefer pure puzzle solving | Practice mode already serves this — evaluate if distinct zen mode is needed |
| 5 | What is the right coin economy balance? | Too generous → hints feel free; too stingy → frustrating | Playtest with initial values, adjust via config |
| 6 | Should the app be a PWA with offline support in V1? | Adds complexity but improves mobile web experience | Defer to V1.5 unless there's strong demand |
| 7 | How to share `core/` between web and mobile repos? | npm workspace, symlink, or git submodule | Evaluate when Phase 2 begins |
| 8 | Should there be difficulty labels (Easy/Medium/Hard) in addition to board sizes? | More accessible to casual players | Yes — map board sizes to difficulty labels in config |
