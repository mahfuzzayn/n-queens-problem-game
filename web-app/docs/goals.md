# N-Queens Game — Goals & Progress Tracker

> Generated: 2026-11-07  
> Source: [requirements.md](./requirements.md)  
> This file tracks phase-by-phase progress with checkboxes. Tick items as they are completed.

---

## Phase 1: Scaffold (Section 16, Step 1)

- [x] Restructure to match required folder layout (`src/app/`, `src/components/ui/`, `src/components/game/`, `src/core/`, `src/hooks/`, `src/services/`, `src/store/`, `src/styles/`, `src/types/`, `src/config/`)
- [x] Move Next.js App Router pages into `src/app/`
- [x] Set up `tsconfig.json` path aliases (`@/` → `./src/*`)
- [x] Install required dependencies (Zustand, Framer Motion, class-variance-authority, Vitest, Howler.js, clsx, vite)
- [x] Set up ESLint + Prettier with strict TypeScript (no `any`)
- [x] Create design tokens file (`src/styles/tokens.css`)
- [x] Create `src/types/` base type definitions
- [x] Create `src/config/` config files (game, scoring, levels, achievements, theme)
- [x] Create `mobile-app/readme.md` placeholder
- [x] Create root `n-queens-game/readme.md`
- [x] Create docs skeleton (all 14 files listed in Section 12)

## Phase 2: Core Logic (Section 16, Step 2)

- [x] `src/core/types.ts` & `src/types/index.ts` — Board, Queen, GameState, LevelConfig, GameResult types
- [x] `src/core/board.ts` — Board representation & conversion helpers
- [x] `src/core/validator.ts` — `findConflicts()`, `isSolved()`, `getAttackedCells()`
- [x] `src/core/solver.ts` — Backtracking solver with bitmask optimization, `solve()`, `countSolutions()`, `generateSolutions()`
- [x] `src/core/scoring.ts` — Pure scoring function with config-driven weights
- [x] `src/core/hints.ts` — Tiered hint engine (`getHint()` with DEAD_END detection)
- [x] `src/core/puzzle-generator.ts` — Seeded PRNG, daily puzzle generation
- [x] `src/core/achievements.ts` — Data-driven achievements evaluator
- [x] `src/core/strings.ts` — All user-facing strings
- [x] Unit tests passing for all core modules (Vitest, 23/23 tests passing)
- [x] Verify: N=2, N=3 return no solution
- [x] Verify: Known solution counts (N=4→2, N=5→10, N=6→4, N=7→40, N=8→92)
- [x] Verify: Hints never suggest unsolvable cells
- [x] Verify: Scoring edge cases (zero time, max hints, negative clamp)
- [x] Verify: Daily generator deterministic for same date
- [x] Verify: `core/` has ZERO React/Next.js/browser imports

## Phase 3: Design System (Section 16, Step 3)

- [x] Design tokens CSS variables (colors, spacing, radii, shadows, fonts)
- [x] Google Fonts setup (Lilita One + Nunito)
- [x] `GameButton` component (primary, secondary, danger, gold, ghost; sizes; icon; loading)
- [x] `GamePanel` component
- [x] `GameModal` component
- [x] `StarRating` component
- [ ] `GameBadge` component
- [ ] `ProgressBar` component
- [ ] `StatChip` component
- [ ] `IconButton` component
- [ ] `Toggle` component
- [ ] `Stepper` component
- [ ] `Toast` component
- [ ] `Tabs` component
- [ ] `Tooltip` component
- [ ] `Ribbon` (banner) component
- [ ] `Tile` component
- [ ] `/styleguide` route rendering every component & variant
- [ ] `docs/components.md` with props & examples for each

## Phase 4: Board & Gameplay (Section 16, Step 4)

- [x] `Board` component (responsive, square, chessboard pattern, ornate frame)
- [x] `Cell` component (memoized, hover/tap feedback, attack line preview)
- [x] `Queen` SVG component (glossy, crown, animated conflict states)
- [x] Conflict highlighting (red glow, shake/bounce, attack line visualization)
- [x] `HUD` component (timer, score, moves, queens placed x/N)
- [x] Timer logic (count-up & countdown, pause/resume)
- [x] Board responsiveness (scales dynamically, mobile touch friendly)
- [ ] Board zoom/scroll for large N (N > 12)

## Phase 5: State & Persistence (Section 16, Step 5)

- [x] `StorageAdapter` interface + `LocalStorageAdapter` & `MemoryStorageAdapter`
- [x] Repository layer (`ProgressRepository`, `SettingsRepository`, `GameSaveRepository`)
- [x] Zustand `gameSlice` (board, queens, status, timer, moves, hints, undo/redo)
- [x] Zustand `progressSlice` (campaign stars, unlocked levels, bests, XP, coins, achievements, streaks)
- [x] Zustand `settingsSlice` (audio, haptics, theme, accessibility)
- [x] Schema versioning + migration structures
- [x] Error handling (private mode, quota, fallback to in-memory)
- [ ] Auto-save in-progress game (refresh restore)

## Phase 6: Game Features (Section 16, Step 6)

- [x] Hint system UI (3 tiers, counter, score penalty)
- [x] Undo/Redo (stack-based, unlimited)
- [x] Scoring system integration (score display, breakdown)
- [x] Star rating system (1-3 stars per level)
- [x] Results modal (Victory/Defeat, stars, score, time)
- [x] Coins/Gems economy & XP awarded on win
- [x] Achievement evaluation on victory
- [ ] Cooldown animation for hints
- [ ] Toast popups on unlock
- [ ] Personal bests per N and per mode

## Phase 7: Modes & Screens (Section 16, Step 7)

- [x] Mode & Size Select (presets 4, 5, 6, 7, 8, 9, 10, 12)
- [x] Classic mode (pick N, solve, count-up timer)
- [x] Time Attack mode support
- [ ] Splash / Home screen (logo, PLAY, secondary nav)
- [ ] Campaign Map (winding path, level nodes, star ratings, locks)
- [ ] Daily Puzzle UI screen
- [ ] Practice / Free Play mode screen
- [ ] Settings modal/screen
- [ ] How to Play (interactive mini-tutorial on 4×4)
- [ ] Stats & Achievements screen
- [ ] N=2/N=3 "Impossible Challenge / Learn Why" mode (exhaustive search animation)
- [ ] Pause modal

## Phase 8: Audio, Haptics & Polish (Section 16, Step 8)

- [x] Sound effects service (Web Audio API synthetic synthesis for tap, place, remove, conflict, hint, win, lose)
- [x] Haptics adapter (`navigator.vibrate`, behind settings gate)
- [x] Mute / volume controls wired to store
- [ ] Background music integration
- [ ] Particle effects & Confetti on win
- [ ] "VICTORY!" animated ribbon banner

## Phase 9: Accessibility & Responsive Pass (Section 16, Step 9)

- [x] Keyboard navigation on cells + focus outlines
- [x] ARIA labels on cells (e.g. "Row 3, Column 5, empty, attacked")
- [x] Non-color conflict indicators (bounce animation + border/glow, not red alone)
- [x] Tested responsive down to mobile viewports
- [ ] Arrow-key board traversal
- [ ] PWA manifest

## Phase 10: Documentation Pass (Section 16, Step 10)

- [x] `docs/readme.md` — Index, summary, quick start
- [x] `docs/overview.md` — Game rules, modes, features
- [x] `docs/architecture.md` — Folder structure, layering, data flow
- [x] `docs/algorithms.md` — Deep dive: backtracking, bitmask, hints, complexity
- [x] `docs/game_logic.md` — State machine, move model, scoring, stars, hints
- [x] `docs/design_system.md` — Tokens, palette, typography, button anatomy, animations
- [x] `docs/components.md` — UI primitives with props & usage
- [x] `docs/state_and_storage.md` — Zustand slices, storage adapter, schema versioning
- [x] `docs/configuration.md` — Config files, how to rebalance
- [x] `docs/testing.md` — How to run, coverage, how to add tests
- [x] `docs/contributing.md` — Standards, how to add levels/modes/themes
- [x] `docs/roadmap.md` — Phase 2 & 3 plans
- [x] `docs/decisions.md` — Decision log with reasoning
- [x] `docs/backend_spec.md` — V2 data models, API, auth, WebSocket, anti-cheat

## Phase 11: Final QA (Section 16, Step 11)

- [x] `npm test` passes (23/23 tests pass cleanly)
- [x] `npm run build` succeeds (Turbopack production build optimized)
- [x] Player can choose N and play; board adapts
- [x] Conflicts detected correctly (rows, columns, diagonals)
- [x] Win detection correct; victory modal shows score, stars, time
- [x] `core/` has zero React/Next.js/browser imports
