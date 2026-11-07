# N-Queens Puzzle Game — Documentation

> **Game-centric N-Queens puzzle game** with a Clash of Clans-inspired visual style.
> Place N queens on an N×N chessboard so that no two queens attack each other.
> Built with Next.js 16, React 19, Zustand, Tailwind CSS, and Framer Motion.

---

## Quick Start

```bash
# Navigate to web app
cd web-app

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
| [overview.md](./overview.md) | What the game is, game modes, board sizes, and feature list |
| [architecture.md](./architecture.md) | High-level architecture, folder structure, layer diagram, and data flow |
| [algorithms.md](./algorithms.md) | N-Queens math, conflict detection, backtracking solver, bitmask optimization, and hint engine |
| [game_logic.md](./game_logic.md) | State machine, move model, undo/redo, timer, scoring, hints, and economy |
| [design_system.md](./design_system.md) | Design philosophy, tokens, color palette, typography, button anatomy, and animations |
| [components.md](./components.md) | UI component catalog with props, variants, and usage examples |
| [state_and_storage.md](./state_and_storage.md) | Zustand store architecture, slices, storage adapters, repositories, and migrations |
| [configuration.md](./configuration.md) | Game config files, scoring, levels, achievements, themes, and how to rebalance |
| [testing.md](./testing.md) | Test strategy, running tests, coverage targets, and how to add tests |
| [contributing.md](./contributing.md) | Coding standards, file naming, how-to guides for adding content, and PR checklist |
| [roadmap.md](./roadmap.md) | Phase 1 (web), Phase 2 (mobile), Phase 3 (online), known limitations, and open questions |
| [decisions.md](./decisions.md) | Architecture Decision Records (ADRs) with alternatives and reasoning |
| [backend_spec.md](./backend_spec.md) | V2 forward-looking backend specification: data models, API, auth, realtime, and anti-cheat |
| [works.md](./works.md) | Guardrails, rules, bug fixes log, and chat handoff procedures |
| [goals.md](./goals.md) | Complete phase-by-phase goal tracker with checkboxes |
| [summary_chat.md](./summary_chat.md) | Session handoff summary and work progress |
| [requirements.md](./requirements.md) | Master requirements specification |

---

## Requirements

See [requirements.md](./requirements.md) for the master build specification.
