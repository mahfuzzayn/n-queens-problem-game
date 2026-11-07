# N-Queens Puzzle Game — Documentation

> **Game-centric N-Queens puzzle game** with a Clash of Clans-inspired visual style.
> Place N queens on an N×N chessboard so that no two queens attack each other.
> Built with Next.js 16, React 19, Zustand, Tailwind CSS, and Framer Motion.

---

## Quick Start

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Run the test suite
npm test

# Production build
npm run build
```

---

## Table of Contents

| Document | Description |
|----------|-------------|
| [OVERVIEW.md](./OVERVIEW.md) | What the game is, game modes, board sizes, and feature list |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | High-level architecture, folder structure, layer diagram, and data flow |
| [ALGORITHMS.md](./ALGORITHMS.md) | N-Queens math, conflict detection, backtracking solver, bitmask optimization, and hint engine |
| [GAME_LOGIC.md](./GAME_LOGIC.md) | State machine, move model, undo/redo, timer, scoring, hints, and economy |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Design philosophy, tokens, color palette, typography, button anatomy, and animations |
| [COMPONENTS.md](./COMPONENTS.md) | UI component catalog with props, variants, and usage examples |
| [STATE_AND_STORAGE.md](./STATE_AND_STORAGE.md) | Zustand store architecture, slices, storage adapters, repositories, and migrations |
| [CONFIGURATION.md](./CONFIGURATION.md) | Game config files, scoring, levels, achievements, themes, and how to rebalance |
| [TESTING.md](./TESTING.md) | Test strategy, running tests, coverage targets, and how to add tests |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Coding standards, file naming, how-to guides for adding content, and PR checklist |
| [ROADMAP.md](./ROADMAP.md) | Phase 1 (web), Phase 2 (mobile), Phase 3 (online), known limitations, and open questions |
| [DECISIONS.md](./DECISIONS.md) | Architecture Decision Records (ADRs) with alternatives and reasoning |
| [BACKEND_SPEC.md](./BACKEND_SPEC.md) | V2 forward-looking backend specification: data models, API, auth, realtime, and anti-cheat |

---

## Requirements

See [OVERVIEW.md](./OVERVIEW.md) for the full feature list and game requirements.
