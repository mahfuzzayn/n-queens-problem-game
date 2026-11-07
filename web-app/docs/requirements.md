# N-Queens Game: Master Requirements and Build Prompt

> **How to use this file:** Paste this whole document into Antigravity as the project brief. You (the AI agent) are the lead engineer and designer. Read it fully, then build **Phase 1 (Web App)** exactly as specified. Follow the build order in Section 16, and do not skip the docs (Section 12). Where this document leaves a decision open, make the best decision yourself and record it in `docs/decisions.md`.

---

## 1. Project Overview

Build a **game-centric N-Queens puzzle game**. The player sees an N×N chessboard and must place N queens so that **no two queens attack each other**: no two share a row, a column, or a diagonal.

This is not a plain tool or a demo. It must **feel like a real mobile-style game**: chunky, glossy, rounded, tactile, rewarding, and fun, with a visual vibe in the spirit of *Clash of Clans* (bold UI, textured buttons, thick outlines, bevels, shine, playful typography, juicy animations).

### Delivery roadmap

| Version | Scope | Status |
|---|---|---|
| **V1 (Phase 1)** | Static, offline, local-storage web game built with **Next.js** | **Build now** |
| **V1.5 (Phase 2)** | Mobile app built with **React Native (Expo)** reusing shared game logic | Later (structure the repo for it now) |
| **V2 (Phase 3)** | Dynamic/online: accounts, global rankings, challenges between players, multiplayer | Later (design extension points now) |

**Important:** Build V1 so that V1.5 and V2 are *easy*. Concretely, game logic must be pure TypeScript with zero UI or browser dependencies, and storage must sit behind an interface (see Sections 9 and 15).

---

## 2. Repository Structure

Create everything inside a root folder named **`n-queens-game/`**:

```
n-queens-game/
├── readme.md                 # Root overview + how to run each app
├── web-app/                  # Next.js application (Phase 1, build now)
│   ├── docs/                 # All documentation lives HERE (see Section 12)
│   ├── src/
│   │   ├── app/              # Next.js App Router pages
│   │   ├── components/
│   │   │   ├── ui/           # Reusable game-styled UI primitives (buttons, panels, modals...)
│   │   │   └── game/         # Board, Cell, Queen, HUD, etc.
│   │   ├── core/             # PURE TypeScript game logic (no React, no DOM)
│   │   ├── hooks/            # React hooks wrapping core logic
│   │   ├── services/         # Storage, audio, haptics adapters
│   │   ├── store/            # State management
│   │   ├── styles/           # Design tokens, global CSS
│   │   └── types/
│   ├── public/               # Assets (sounds, images, fonts)
│   └── package.json
└── mobile-app/               # React Native app (Phase 2). Create only a placeholder README now.
    └── readme.md             # States the plan: reuse core/ logic, Expo, same design language
```

**Rule:** `web-app/src/core/` must be portable. It will later be copied or shared with `mobile-app/`. It must not import from React, Next.js, or the browser (`window`, `document`, `localStorage`).

---

## 3. Tech Stack (Web App)

- **Next.js** (latest stable, App Router) + **TypeScript** (strict mode)
- **Tailwind CSS** for styling, plus a **custom design-token layer** (CSS variables) for the game theme
- **shadcn/ui-style approach:** build a **component library in `components/ui/`** using the same pattern (variants via `class-variance-authority`, composable primitives, accessible via Radix primitives where useful), but **completely re-skinned** into the game aesthetic in Section 5. No default shadcn look should be visible anywhere.
- **Framer Motion** for animation
- **Zustand** for state management (with persist middleware pointing at our storage adapter)
- **Web Audio / Howler.js** for sound effects
- **Vitest** for unit tests on `core/`
- **ESLint + Prettier**, strict TypeScript, no `any` unless justified in a comment
- **Web Workers** for heavy solver work (see Section 8) so the UI never freezes

---

## 4. Game Rules and Modes

### 4.1 Core rules
- Board is **N×N**, with a **configurable N**.
- The player places queens by tapping or clicking cells. Tapping a cell with a queen removes it.
- A queen **attacks** every cell in its row, column, and both diagonals.
- **Win condition:** exactly N queens on the board with zero conflicts.
- Conflicting queens must be **visibly highlighted** in real time (red glow or shake), and attack lines optionally visualized (toggle in settings).

### 4.2 Board size
- Supported range: **N = 1 to 16** via a size selector. Presets shown prominently: **4, 5, 6, 7, 8, 9, 10, 12**, plus a **Custom** option.
- **Edge cases the agent must handle gracefully:**
  - **N = 1:** trivial, auto-solvable. Mark as a tutorial level.
  - **N = 2 and N = 3:** **mathematically no solution.** Do not hide this. Offer them as an **"Impossible Challenge / Learn Why"** mode: the player tries, and a "Prove it" button animates *why* it is impossible (show the solver exhausting every branch). This is a fun educational hook.
  - **N = 4 and above:** solvable.
- **N > 12:** solver-based features run in a Web Worker with a loading indicator. Warn that it may take a moment.

### 4.3 Game modes (V1)
1. **Classic:** pick N, solve at your own pace. Timer counts up.
2. **Time Attack:** beat a countdown that scales with N. Run out and the run fails.
3. **Campaign (Level Map):** a progression map of levels with increasing N and constraints, with stars per level (see Section 6). This is the main "game feel" mode.
4. **Daily Puzzle:** one deterministic puzzle per day (seeded from the date), for example a board with some **pre-placed locked queens** the player must build around. Streak tracking.
5. **Practice / Free Play:** no timer, no scoring pressure, unlimited hints disabled for scoring.

### 4.4 Optional puzzle variants (include if time allows; architect so they are easy to add)
- **Pre-placed locked queens** (some queens are fixed and cannot be removed)
- **Blocked cells** (obstacles where a queen cannot be placed)
- Define variants via a `LevelConfig` type so new variants need only config, not new logic.

---

## 5. UI / UX and Visual Design Direction

**Vibe: "Cartoon fantasy strategy game."** Think Clash of Clans, Brawl Stars, and Royal Match menus. Everything feels *physical*: thick, glossy, squishy, rewarding.

### 5.1 Design language (you decide the final palette within these rules)
- **Chunky rounded shapes:** large border radii (16–28px), thick outlines.
- **Layered buttons:** each button has (a) a thick dark outline, (b) a colored gradient face, (c) a lighter top-highlight "shine" strip, and (d) a **darker bottom edge** that gives a 3D bevel. On press, the button **sinks down** (translateY + reduced bottom edge) with a satisfying bounce.
- **Textures and depth:** subtle noise, parchment, wood, or stone textures on panels. Inner shadows, drop shadows, and soft glows. Use CSS gradients and SVG; avoid heavy images.
- **Typography:** a bold playful display font with outlined and shadowed text for titles and numbers (for example *Lilita One*, *Luckiest Guy*, or *Bangers* from Google Fonts), paired with a clean readable font (for example *Nunito*) for body text. Game titles and score numbers get a **thick stroke + drop shadow** effect.
- **Color:** a rich saturated palette. Suggested direction: deep royal purple/navy backgrounds, gold for rewards, green for primary actions, red for danger/conflicts, blue for info, orange for hints. Define all colors as **design tokens** in `styles/tokens.css` so the whole theme can be swapped.
- **Themes (stretch goal):** support swappable board themes (Classic Wood, Royal Stone, Neon Night). Tokens must make this a config change.

### 5.2 The board
- Cells in a **chessboard pattern** with textured light/dark tiles inside an ornate **thick frame** (carved wood or stone feel).
- **Queens are illustrated SVG** characters or icons (a crown-topped queen with a glossy gold/metal look), not plain text glyphs. Placement animation: drop-in with bounce, small particle poof, and a sound.
- **Hover/tap feedback:** highlight cell; optionally preview the attack lines that a queen *would* create before placing.
- **Conflict feedback:** attacked cells tinted, conflicting queens pulse red and shake.
- **Win animation:** confetti, gold shimmer across the board, stars flying to the HUD, a big "VICTORY!" banner.
- Board must be **responsive** and always square, from 320px phones to large desktops, and cells must stay tappable (min ~40px touch target where possible; for large N, allow board zoom or scroll).

### 5.3 Screens
1. **Splash / Home:** logo, big **PLAY** button, secondary buttons (Campaign, Daily, Time Attack, Settings, How to Play, Stats).
2. **Mode & Size Select:** a size picker with a playful stepper or slider and preset chips. Show the **difficulty label**, **solution count** (known values for N), and best score.
3. **Game Screen:** board center; **HUD** top (timer, score, moves, queens placed `x/N`, stars preview); bottom action bar (Hint, Undo, Redo, Reset, Pause, Auto-Solve if enabled).
4. **Campaign Map:** a winding path of level nodes with star ratings and lock states.
5. **Result Modal:** Victory/Defeat with stars, score breakdown, time, new-record badge, and buttons: Next Level, Replay, Home.
6. **Pause Modal**
7. **Settings:** sound, music, haptics, theme, show-attack-lines toggle, show-conflicts toggle, reduce-motion, reset-progress (with confirm).
8. **How to Play:** an interactive mini-tutorial using a 4×4 board that teaches the rules step by step.
9. **Stats & Achievements:** games played, win rate, best times per N, streaks, achievement gallery.
10. **Learn Page (optional but nice):** short explainer of the N-Queens problem and a link into `docs/`.

### 5.4 Reusable UI primitives to build in `components/ui/` (game-themed)
`GameButton` (variants: primary, secondary, danger, gold, ghost; sizes; icon support; loading), `GamePanel`, `GameModal`, `GameBadge`, `StarRating`, `ProgressBar`, `StatChip`, `IconButton`, `Toggle`, `Stepper`, `Toast`, `Tabs`, `Tooltip`, `Ribbon` (banner), `Tile`. Each documented with props and an example in `docs/components.md`. Include a hidden **`/styleguide`** route that renders every component and variant for visual QA.

### 5.5 Feel and polish
- **Sound effects:** tap, place queen, remove queen, conflict, hint, win, lose, button click, star earned. Optional background music. Mute toggles persist.
- **Haptics:** use `navigator.vibrate` where supported, behind a setting and an adapter (so it maps to native haptics on mobile later).
- **Micro-animations** everywhere (buttons, modals popping in with overshoot, numbers counting up).
- **Respect `prefers-reduced-motion`.**
- Accessibility: keyboard play (arrow keys to move the cursor, Enter/Space to place), visible focus states, ARIA labels on cells (e.g. "Row 3, Column 5, empty, attacked"), sufficient color contrast, and **non-color indicators** for conflicts (icon or shake, not red alone).

---

## 6. Gamification Systems

### 6.1 Timer
- **Classic:** count-up timer. **Time Attack:** countdown, with the budget derived from N (for example `base + N * perQueenSeconds`), tunable in a config file.
- Pausing stops the timer (and hides the board in Time Attack to prevent pause-cheating; configurable).
- Format `mm:ss`; low-time warning pulse in the last 10 seconds.

### 6.2 Scoring
Implement as a **pure function** in `core/scoring.ts`, fully unit-tested and documented, with all weights in a config object. Suggested formula (tune as you see fit and document):

```
baseScore      = N * 100
timeBonus      = max(0, parTime(N) - elapsedSeconds) * timeMultiplier
efficiencyBonus= max(0, (parMoves(N) - moves)) * 5
hintPenalty    = hintsUsed * 75
undoPenalty    = max(0, undos - freeUndos) * 10
perfectBonus   = (no hints && no conflicts made) ? N * 50 : 0

finalScore = max(0, baseScore + timeBonus + efficiencyBonus + perfectBonus - hintPenalty - undoPenalty)
```

### 6.3 Stars (1–3 per level)
- ★ solved. ★★ solved under par time or with ≤ 1 hint. ★★★ solved under par time with **no hints**.
- Thresholds defined per level in config.

### 6.4 Hints (a core feature)
Provide **tiered hints**, so they feel smart and scale in cost:
1. **Tier 1, "Nudge":** highlights a *conflicting queen* or tells the player their current layout has no possible completion ("Dead end! Undo recommended").
2. **Tier 2, "Safe Cell":** highlights a cell that is **safe and still leads to a valid solution**.
3. **Tier 3, "Reveal":** places one correct queen for the player.

Rules:
- Hints are computed with the solver (Section 8), based on the **current board state**, so they remain valid even after the player has made several moves.
- Limited hints per level (default 3), displayed as a counter on the hint button. Each hint reduces score and may cap stars.
- Hint cooldown animation (a short glowing "thinking" state).
- Optionally allow earning hint tokens through coins or daily streaks.

### 6.5 Other gamification
- **Undo / Redo** (stack-based, unlimited, with the score penalty above beyond free undos).
- **Coins / Gems:** earned from wins, spent on hints, themes, and cosmetic queen skins (V1: local economy only).
- **XP and Player Level:** XP from each win, a level-up celebration, and a profile badge.
- **Achievements:** a data-driven list in `core/achievements.ts`, for example *First Win*, *No Hints Hero*, *Speed Demon (8×8 under 60s)*, *Size Master (solve every N from 4–12)*, *7-Day Streak*, *Impossible Learner (view the N=3 proof)*. Toast popups on unlock.
- **Streaks:** daily play streak and win streak.
- **Personal bests** per N and per mode.
- **Daily challenge** with a seeded generator (deterministic from the date string).

---

## 7. State Management

Use Zustand with clear slices:
- `gameSlice`: board, queens, locked cells, status (`idle | playing | paused | won | lost`), timer, moves, hints, undo/redo history.
- `progressSlice`: campaign stars, unlocked levels, personal bests, XP, coins, achievements, streaks.
- `settingsSlice`: audio, haptics, theme, accessibility flags.

Game logic is **never** inside components. Components call actions; actions call `core/`.

---

## 8. Algorithms (Heart of the Project)

All in `src/core/`, pure TypeScript, unit-tested, and **thoroughly explained in `docs/algorithms.md`**.

### 8.1 Board representation
- `queens: number[]`, where `queens[row] = col` or `-1` if empty (a compact one-queen-per-row model for the solver).
- For the UI, also support a general `Set<"r,c">` or 2D model, since the player can place queens freely (more than one per row, etc.) and the validator must detect those conflicts.
- Provide conversion helpers.

### 8.2 Conflict detection / validation
- `findConflicts(queens, N)` returns the list of conflicting pairs and the set of attacked cells.
- O(Q) using counters: `rowCount[]`, `colCount[]`, `diag1Count[r+c]`, `diag2Count[r-c+N-1]`. A queen conflicts if any of its four counters is greater than 1.
- `isSolved(queens, N)`: N queens present and zero conflicts.
- `getAttackedCells(queens, N)` for visualizing danger zones.

### 8.3 Solver (backtracking)
- Classic **backtracking** that places one queen per row and prunes with column and diagonal sets.
- **Bitmask optimization:** use integer bitmasks (`cols`, `diag1`, `diag2`) and `lowestSetBit` tricks for speed. This is the main solver for hints and auto-solve.
- Support **partial boards:** `solve(N, initialQueens)` must respect already-placed queens (and locked queens and blocked cells), returning the first solution, or `null` if none exists.
- `countSolutions(N)`: count all solutions (use symmetry optimization if feasible). Include a lookup table of known counts (N=1..16) to display instantly and to cross-check tests.
- `generateSolutions(N, limit)`: a generator or iterator, for variety.
- Run heavy calls in a **Web Worker** with a typed message protocol, a cancellation token, and a timeout.

### 8.4 Hint engine (`core/hints.ts`)
- `getHint(state, tier)` builds on the solver with the player's current *non-conflicting* placements as constraints.
- If the current partial board cannot be completed, return a `DEAD_END` result so the UI can suggest undo.
- Document the exact decision tree.

### 8.5 Puzzle generation
- Seeded PRNG (for example mulberry32) for **deterministic daily puzzles**.
- Generator picks a random valid solution, then reveals K queens as locked. Optionally verify the puzzle has a unique or small solution set for the target difficulty.

### 8.6 Required test cases
- Known solution counts (N=4 → 2, N=5 → 10, N=6 → 4, N=7 → 40, N=8 → 92, N=9 → 352, N=10 → 724).
- N=2 and N=3 return no solution.
- Validator correctly flags row, column, diagonal-up, and diagonal-down conflicts.
- Hints never suggest a cell that breaks solvability.
- Scoring edge cases (zero time, max hints, negative clamp).
- Daily generator is deterministic for the same date.

---

## 9. Persistence (V1: Local Storage), Built for a Future Backend

Create a `StorageAdapter` interface in `services/storage.ts`:

```ts
interface StorageAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
}
```

- V1 implementation: `LocalStorageAdapter` (browser `localStorage`). On mobile later: an `AsyncStorage` adapter.
- Version the saved data (`schemaVersion`) and write **migration functions** so future updates never wipe progress.
- Wrap in try/catch (private mode or quota errors) and fall back to in-memory.
- **Auto-save** an in-progress game so a refresh restores it.
- Create a **Repository layer** (`services/repositories/`: `ProgressRepository`, `SettingsRepository`, `ScoreRepository`) so V2 can swap local implementations for API implementations **without touching UI or core code.**

---

## 10. Non-Functional Requirements

- **Performance:** 60fps animations; board re-renders only changed cells (memoize `Cell`); solver never blocks the main thread.
- **Responsive and PWA-ready:** mobile-first layout, installable manifest (stretch goal), works fully offline after first load.
- **SEO and metadata:** proper title, description, and Open Graph tags; a good favicon.
- **Quality bar:** strict TypeScript, ESLint clean, no console errors, meaningful commit-style comments, small focused files, descriptive names, and JSDoc on all `core/` functions.
- **Testing:** Vitest unit tests for all of `core/` (target >90% coverage there) plus a few component smoke tests.
- **Internationalization-ready:** keep user-facing strings in a single `strings.ts` so translation is easy later.

---

## 11. Config-Driven Design

Put all tunable values in `src/config/`:
- `game.config.ts`: min and max N, default N, hint count, free undos, time-attack formula.
- `scoring.config.ts`: all weights and par tables.
- `levels.config.ts`: campaign levels (N, par time, par moves, variant, star thresholds).
- `achievements.config.ts`
- `theme.tokens.ts`: mirrored to CSS variables.

A designer or developer should be able to rebalance the game by editing config only.

---

## 12. Documentation Requirements (Mandatory, in `web-app/docs/`)

The docs must let a **new developer fully understand and safely modify** the project. Write them clearly, with code snippets and diagrams (ASCII or Mermaid). Create:

| File | Contents |
|---|---|
| `docs/readme.md` | Index of all docs; one-paragraph project summary; quick start |
| `docs/overview.md` | What the game is, rules, modes, feature list, screenshots placeholder |
| `docs/architecture.md` | Folder structure, layering (UI → hooks → store → core → services), data flow diagram, why `core/` is pure, how Phase 2 (mobile) and Phase 3 (online) plug in |
| `docs/algorithms.md` | **Deep dive:** the N-Queens problem, backtracking walkthrough on a 4×4 with step-by-step diagrams, conflict-detection counters (diagonal index math: `r+c` and `r-c+N-1`), bitmask solver explained line by line, solution counting, hint engine decision tree, daily puzzle seeding, complexity analysis, and "how to change or extend the solver" |
| `docs/game_logic.md` | State machine of a game (`idle → playing → paused → won/lost`), move/undo/redo model, timer behavior, scoring formula with worked examples, star rules, hint tiers |
| `docs/design_system.md` | Design philosophy, tokens, color palette, typography, button anatomy (outline + face + shine + bottom edge), animation guidelines, how to create a new theme |
| `docs/components.md` | Every UI primitive: props, variants, usage example |
| `docs/state_and_storage.md` | Zustand slices, storage adapter, repositories, schema versioning and migrations |
| `docs/configuration.md` | Every config file and what each value changes (a "how to rebalance the game" guide) |
| `docs/testing.md` | How to run tests, what is covered, how to add tests |
| `docs/contributing.md` | Coding standards, how to add a new level, game mode, achievement, theme, or board variant (step by step) |
| `docs/roadmap.md` | Phase 2 (React Native) and Phase 3 (online) plans, risks, and open questions |
| `docs/decisions.md` | A log of every design and tech decision the agent made, with reasoning |
| `docs/backend_spec.md` | **Forward-looking spec** for V2: proposed data models (User, Score, Match, Challenge), API endpoints, auth approach, realtime strategy (WebSocket), anti-cheat notes (server-side solution validation, time sanity checks) |

Also add a top-level `n-queens-game/readme.md` with: what this is, repo layout, how to run the web app (`npm install`, `npm run dev`, `npm test`), and links to `web-app/docs/`.

---

## 13. Phase 2 Preview: Mobile App (do NOT build now)

Only create `mobile-app/readme.md` describing the plan:
- **React Native with Expo + TypeScript.**
- Reuse `core/` and `config/` unchanged (consider a shared package, or copy with a sync script, and document the chosen approach in `decisions.md`).
- Replace Web Audio with `expo-av`, vibration with `expo-haptics`, `localStorage` with `AsyncStorage`, Framer Motion with `react-native-reanimated`.
- Recreate the same design language with native components (Skia or SVG for queens and bevels).

---

## 14. Phase 3 Preview: Online / Dynamic Version (do NOT build now, but prepare)

Future features: user accounts, global and friends leaderboards, daily-puzzle rankings, **head-to-head challenges** (same board, race to solve; or async "beat my time" links), spectating, and anti-cheat.

**Prepare now by:**
- Repository interfaces (Section 9) so a network implementation can be dropped in.
- Keeping `GameResult` a serializable, self-contained type: `{ n, mode, queens[], timeMs, moves, hintsUsed, score, date, levelId?, seed? }`.
- Making puzzles reproducible from a **`seed` + `config`** so two players can get the identical board.
- Documenting everything in `docs/backend_spec.md`.

---

## 15. Extension Points Checklist (so V2 is painless)

- [ ] `core/` has zero framework imports
- [ ] All persistence goes through repositories and the storage adapter
- [ ] All tunables live in `config/`
- [ ] Puzzles are seed-reproducible
- [ ] `GameResult` is serializable and validated by a pure `verifyResult()` function (reusable server-side later)
- [ ] Sound, haptics, and storage are adapters, not direct browser calls inside components
- [ ] User-facing text lives in `strings.ts`

---

## 16. Recommended Build Order (Follow This)

1. **Scaffold:** monorepo folders, Next.js + TS + Tailwind, linting, base docs skeleton.
2. **Core logic:** types, validator, backtracking and bitmask solver, scoring, hints, seeded generator, **with tests passing**.
3. **Design system:** tokens, fonts, `GameButton`, `GamePanel`, `GameModal`, and the rest of `components/ui/`, plus `/styleguide`.
4. **Board and gameplay:** Board, Cell, Queen, conflict highlighting, placement animations, HUD, timer.
5. **State and persistence:** Zustand slices, storage adapter, repositories, auto-save.
6. **Game features:** hints, undo/redo, scoring, stars, results modal.
7. **Modes and screens:** Home, size select, Classic, Time Attack, Campaign map, Daily, Settings, How to Play, Stats and Achievements, the N=2/3 "Learn Why" mode.
8. **Audio, haptics, particle and confetti polish.**
9. **Accessibility pass and responsive pass** (test 320px to desktop).
10. **Documentation pass:** complete every file in Section 12 so it matches the final code exactly.
11. **Final QA** against the acceptance criteria below.

Work in small steps, run tests as you go, and keep the app runnable at every stage.

---

## 17. Acceptance Criteria (Definition of Done for V1)

- [ ] `npm install && npm run dev` starts the app with no errors; `npm test` passes; `npm run build` succeeds.
- [ ] Player can choose any N from 1–16 and play; the board adapts and stays usable on mobile.
- [ ] Conflicts are detected and highlighted correctly for rows, columns, and both diagonals.
- [ ] Winning is detected correctly; the victory screen shows score, stars, and time.
- [ ] N=2 and N=3 are handled with the educational "no solution" experience (no crash, no infinite loop).
- [ ] Timer works (count-up and countdown), including pause and resume.
- [ ] Hints (3 tiers) work from any partial board and never give an unsolvable suggestion; dead ends are detected.
- [ ] Undo, redo, and reset work reliably.
- [ ] Scoring, stars, XP, coins, achievements, and streaks work and persist after refresh.
- [ ] Campaign map shows progress, stars, and locks.
- [ ] Daily puzzle is deterministic per date.
- [ ] Settings (sound, haptics, theme, effects) persist.
- [ ] UI clearly has a **game-style identity** (bevelled, textured, rounded buttons; ornate board; juicy animations); **no default-looking components**.
- [ ] Solver never freezes the UI at N=12–16 (Web Worker with loading state).
- [ ] Keyboard navigation and ARIA labels work.
- [ ] All docs in Section 12 exist, are accurate, and are understandable by a new developer.
- [ ] `core/` contains no React, Next.js, or browser API imports.

---

## 18. Instructions to the Agent: Behavior and Rules

1. **Do not ask me design questions.** Make strong, opinionated choices and log them in `docs/decisions.md`.
2. **Prioritize the game feel.** If forced to choose between more features and a polished core experience, polish the core.
3. **Keep code clean and commented.** Prefer clarity over cleverness (except in the bitmask solver, where you must explain the cleverness in comments and docs).
4. **Do not leave placeholders** like "TODO: implement" in delivered features. If something is intentionally deferred, list it in `docs/roadmap.md`.
5. **Write the docs as you build,** not only at the end, and keep them in sync with the final code.
6. **Test the algorithms** before building UI on top of them.
7. **Never put game logic in React components.**
8. When finished, produce a short **final report** listing what was built, how to run it, known limitations, and recommended next steps for Phase 2.

---

*End of requirements. Begin with Step 1 of Section 16.*
