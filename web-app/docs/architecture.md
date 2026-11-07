# Architecture

> [!NOTE]
> This document describes the high-level architecture of the N-Queens Puzzle Game web application, its folder structure, layer separation, and data flow.

---

## Table of Contents

- [High-Level Architecture](#high-level-architecture)
- [Folder Structure](#folder-structure)
- [Layer Diagram](#layer-diagram)
- [Why `core/` is Pure](#why-core-is-pure)
- [Data Flow](#data-flow)
- [Phase 2 Mobile Integration Plan](#phase-2-mobile-integration-plan)
- [Phase 3 Online Extension Points](#phase-3-online-extension-points)

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Next.js App Shell                        │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    UI Components Layer                     │  │
│  │   GameBoard · GameButton · GamePanel · GameModal · etc.   │  │
│  └────────────────────────┬──────────────────────────────────┘  │
│                           │ props / callbacks                    │
│  ┌────────────────────────▼──────────────────────────────────┐  │
│  │                     Custom Hooks Layer                     │  │
│  │     useGame · useTimer · useHints · useUndo · etc.        │  │
│  └────────────────────────┬──────────────────────────────────┘  │
│                           │ actions / selectors                  │
│  ┌────────────────────────▼──────────────────────────────────┐  │
│  │                    Zustand Store Layer                     │  │
│  │        gameSlice · progressSlice · settingsSlice          │  │
│  └────────────────────────┬──────────────────────────────────┘  │
│                           │ pure function calls                  │
│  ┌────────────────────────▼──────────────────────────────────┐  │
│  │                      Core Layer (pure)                     │  │
│  │  board · solver · scoring · hints · validation · types    │  │
│  └────────────────────────┬──────────────────────────────────┘  │
│                           │                                      │
│  ┌────────────────────────▼──────────────────────────────────┐  │
│  │                    Services Layer                          │  │
│  │     StorageAdapter · AudioService · VibrationService      │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

The application is structured as a layered architecture where each layer only depends on the layer(s) below it. The **core layer** is completely pure (no side effects, no I/O, no framework dependencies) to enable code sharing with the React Native mobile app in Phase 2.

---

## Folder Structure

```
src/
├── app/                    # Next.js App Router pages and layouts
│   ├── layout.tsx          # Root layout with providers and fonts
│   ├── page.tsx            # Home / mode selection screen
│   ├── play/
│   │   └── page.tsx        # Main gameplay screen
│   └── globals.css         # Global styles and Tailwind base
│
├── components/             # React UI components
│   ├── ui/                 # Generic reusable UI primitives
│   │   ├── GameButton.tsx
│   │   ├── GamePanel.tsx
│   │   ├── GameModal.tsx
│   │   └── ...
│   ├── board/              # Board-specific components
│   │   ├── Board.tsx
│   │   ├── Cell.tsx
│   │   └── Queen.tsx
│   ├── hud/                # Heads-up display (timer, score, etc.)
│   └── screens/            # Full-screen compositions
│
├── hooks/                  # Custom React hooks
│   ├── useGame.ts
│   ├── useTimer.ts
│   └── ...
│
├── store/                  # Zustand state management
│   ├── gameSlice.ts
│   ├── progressSlice.ts
│   ├── settingsSlice.ts
│   └── useStore.ts         # Combined store with persist middleware
│
├── core/                   # Pure business logic (ZERO framework imports)
│   ├── board.ts            # Board creation, manipulation, queries
│   ├── solver.ts           # Backtracking + bitmask solver
│   ├── scoring.ts          # Score calculation, star thresholds
│   ├── hints.ts            # Hint generation logic
│   ├── validation.ts       # Move validation, conflict detection
│   ├── daily.ts            # Seeded daily puzzle generation
│   └── types.ts            # Core type definitions
│
├── services/               # Side-effect services (I/O, browser APIs)
│   ├── storage/
│   │   ├── StorageAdapter.ts
│   │   ├── LocalStorageAdapter.ts
│   │   └── repositories/
│   │       ├── ProgressRepository.ts
│   │       ├── SettingsRepository.ts
│   │       └── ScoreRepository.ts
│   ├── AudioService.ts
│   └── VibrationService.ts
│
├── config/                 # Static configuration (importable by core/)
│   ├── game.config.ts
│   ├── scoring.config.ts
│   ├── levels.config.ts
│   ├── achievements.config.ts
│   └── theme.tokens.ts
│
├── lib/                    # Shared utility functions
│   └── utils.ts
│
└── types/                  # Shared TypeScript type definitions
    └── index.ts
```

---

## Layer Diagram

```
  ┌──────────────────────┐
  │      UI (React)      │   Components, pages, layouts
  └──────────┬───────────┘
             │
  ┌──────────▼───────────┐
  │    Hooks (React)     │   useGame, useTimer, useHints
  └──────────┬───────────┘
             │
  ┌──────────▼───────────┐
  │   Store (Zustand)    │   gameSlice, progressSlice, settingsSlice
  └──────────┬───────────┘
             │
  ┌──────────▼───────────┐
  │   Core (Pure TS)     │   board, solver, scoring, hints, validation
  └──────────┬───────────┘
             │
  ┌──────────▼───────────┐
  │  Services (I/O)      │   Storage, Audio, Vibration
  └──────────────────────┘
```

**Dependency rule:** Each layer may only import from the layer(s) directly below it (or from `config/` and `types/`). The **core** layer must never import from hooks, store, components, or services.

---

## Why `core/` is Pure

The `core/` directory contains **zero** React, Next.js, or browser API imports. Every function in `core/` is a pure function: given the same inputs, it always returns the same output with no side effects.

**Benefits:**

1. **Testability:** Core logic can be tested with simple unit tests — no mocking of DOM, React, or browser APIs needed.
2. **Code Sharing:** The entire `core/` directory can be copied into the React Native mobile app (Phase 2) without modification.
3. **Determinism:** Game logic is fully deterministic, which is critical for features like replay validation and anti-cheat (Phase 3).
4. **Refactorability:** The UI framework can be swapped (e.g., from Next.js to Remix or Astro) without touching any game logic.

> [!IMPORTANT]
> **Enforcement:** Any PR that adds a React, Next.js, or browser import to a file in `core/` must be rejected. This constraint is documented in [contributing.md](./contributing.md) and will be enforced by lint rules.

---

## Data Flow

A typical user action flows through the layers as follows:

```
User taps a cell
       │
       ▼
  ┌─────────────────┐
  │  Cell component  │   onClick handler fires
  └────────┬────────┘
           │ calls hook
           ▼
  ┌─────────────────┐
  │   useGame hook   │   placeQueen(row, col)
  └────────┬────────┘
           │ dispatches action
           ▼
  ┌─────────────────┐
  │  Zustand store   │   gameSlice.placeQueen(row, col)
  └────────┬────────┘
           │ calls pure functions
           ▼
  ┌─────────────────┐
  │   core/board.ts  │   placeQueen(board, row, col) → newBoard
  │   core/valid..   │   detectConflicts(newBoard) → conflicts
  │   core/scoring   │   calculateScore(state) → score
  └────────┬────────┘
           │ returns new state
           ▼
  ┌─────────────────┐
  │  Zustand store   │   Updates state immutably
  └────────┬────────┘
           │ React re-renders subscribers
           ▼
  ┌─────────────────┐
  │  Cell component  │   Re-renders with updated queen/conflict state
  │  HUD component   │   Re-renders with updated score/move count
  └─────────────────┘
```

**Key points:**

- State is always updated **immutably** via Zustand.
- The store calls **pure core functions** to compute the next state.
- React components subscribe to specific store slices to minimize re-renders.
- Side effects (sound, vibration, storage persistence) are triggered by Zustand middleware or effect hooks, never by core functions.

---

## Phase 2 Mobile Integration Plan

In Phase 2, the React Native mobile app will share code with the web app:

```
Shared (copy or symlink):
  ├── core/          # 100% reusable — pure TypeScript
  ├── config/        # 100% reusable — static data
  └── types/         # 100% reusable — type definitions

Replaced in mobile:
  ├── components/    # Rewritten with React Native components + Skia/SVG
  ├── hooks/         # Adapted for mobile lifecycle (AppState, etc.)
  ├── store/         # Same Zustand store, different persist backend
  └── services/      # Replaced: expo-av, expo-haptics, AsyncStorage
```

> [!NOTE]
> The exact code sharing mechanism (npm workspace, symlink, or copy) will be decided when Phase 2 begins. See [roadmap.md](./roadmap.md) for the timeline.

---

## Phase 3 Online Extension Points

Phase 3 adds online features. The architecture is designed with these extension points:

1. **StorageAdapter interface:** The `StorageAdapter` abstraction allows swapping `LocalStorageAdapter` for an `ApiStorageAdapter` that syncs with a backend.
2. **Score submission:** The scoring pipeline in `core/scoring.ts` produces a deterministic score object that can be serialized and sent to a leaderboard API.
3. **Daily puzzle:** The seeded daily puzzle generator in `core/daily.ts` uses a deterministic seed, so the server can independently verify that a submitted solution matches the day's puzzle.
4. **Replay validation:** Because all game logic is pure and deterministic, a sequence of moves can be replayed server-side to verify scores (anti-cheat).
5. **WebSocket integration:** The store layer can subscribe to WebSocket events for real-time features (live leaderboards, head-to-head matches).

See [backend_spec.md](./backend_spec.md) for the full V2 backend specification.
