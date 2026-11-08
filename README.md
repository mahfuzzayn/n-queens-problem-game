# N-Queens Puzzle Game

A **game-centric N-Queens puzzle game** with a cartoon fantasy strategy visual aesthetic (Clash of Clans inspired). Place N queens on an N×N chessboard so that no two queens attack each other.

## Repository Layout

```
n-queens-problem-game/
├── README.md                 # Root overview & setup
├── web-app/                  # Next.js web application (Phase 1 — complete ✅)
│   ├── docs/                 # Complete project documentation
│   ├── src/                  # Next.js App Router & Game code
│   │   ├── app/              # Pages & Layouts
│   │   ├── components/       # UI Primitives & Game Components
│   │   ├── config/           # Balance & Level configurations
│   │   ├── core/             # Pure TypeScript algorithms
│   │   ├── services/         # Storage, Audio, and Haptics adapters
│   │   ├── store/            # Zustand global state
│   │   ├── styles/           # Design tokens
│   │   └── types/            # TypeScript definitions
│   ├── tests/                # Vitest core unit tests
│   └── package.json
└── mobile-app/               # React Native / Expo application (Phase 2 — complete ✅)
    ├── App.tsx               # Main Mobile Entry & Screen Layout
    ├── src/
    │   ├── components/       # Native UI Primitives (Reanimated 3D buttons, panels, modals)
    │   ├── services/         # AsyncStorage, expo-av, and expo-haptics adapters
    │   └── store/            # Zustand state store
    ├── tests/                # Vitest mobile unit tests
    └── package.json
```

## Quick Start

### 1. Web App (Next.js)

```bash
cd web-app
npm install
npm run dev      # Start dev server
npm test         # Run unit test suite (23 tests)
npm run build    # Production build
```

### 2. Mobile App (React Native / Expo SDK 58)

```bash
cd mobile-app
npm install
npm test         # Run unit test suite (7 tests)
npx expo start   # Start Expo development server
npx expo run:android  # Run on Android
npx expo run:ios      # Run on iOS
```

## Architecture & Code Sharing
- **100% Zero Code Duplication:** `mobile-app` directly symlinks and imports `web-app/src/core/`, `web-app/src/config/`, and `web-app/src/types/`. All solver algorithms, validator routines, scoring engines, hints, and deterministic daily puzzle generators are shared.
- **Hardware Abstraction:** Decoupled adapter contracts for Storage (`LocalStorageAdapter` vs `AsyncStorageAdapter`), Audio (`WebAudio` vs `expo-av`), and Haptics (`navigator.vibrate` vs `expo-haptics`).
- **Native 60fps Performance:** `react-native-reanimated` executes micro-animations (3D button press sink-down, modal popups, queen placement, conflict bounce) directly on the native UI thread.

## Documentation

All documentation is located in [`web-app/docs/`](./web-app/docs/readme.md):
- [Overview & Rules](./web-app/docs/overview.md)
- [Architecture & Layering](./web-app/docs/architecture.md)
- [Algorithms & Math](./web-app/docs/algorithms.md)
- [Game Logic & Scoring](./web-app/docs/game_logic.md)
- [Design System & Tokens](./web-app/docs/design_system.md)
- [Component Library](./web-app/docs/components.md)
- [Testing Strategy](./web-app/docs/testing.md)
- [Google Play Store & Deployment Guide](./web-app/docs/playstore.md)
- [Works Log & Guardrails](./web-app/docs/works.md)
- [Phase Goals Tracker](./web-app/docs/goals.md)
- [Architecture Decisions (ADRs)](./web-app/docs/decisions.md)
- [Session Summary](./web-app/docs/summary_chat.md)

## License

Private project.
