# N-Queens Game — Works Log (Bug Fixes & Guardrails)

> **Purpose:** This file is the living record of bug fixes, personal updates, and guardrails/rules for AI agents working on this project. When starting a **new chat session**, read this file first to stay connected to the project state.

---

## 🔒 Guardrails & Rules for AI Agents

### Architecture Rules
1. **`src/core/` is PURE TypeScript.** Zero imports from React, Next.js, or browser APIs (`window`, `document`, `localStorage`). This module will be shared with React Native in Phase 2.
2. **Game logic NEVER goes in React components.** Components call store actions → actions call `core/` functions.
3. **All persistence goes through `StorageAdapter` and Repository interfaces.** No direct `localStorage` calls in components or core.
4. **All tunable values live in `src/config/`.** A designer should rebalance the game by editing config only.
5. **User-facing strings live in `src/core/strings.ts`.** No hardcoded text in components (for i18n readiness).
6. **Sound, haptics, and storage are adapters** — not direct browser calls inside components.

### Code Quality Rules
7. **Strict TypeScript.** No `any` unless justified with a comment explaining why.
8. **No `TODO: implement` placeholders** in delivered features. Deferred items go in `docs/ROADMAP.md`.
9. **JSDoc on all `core/` functions.**
10. **Small focused files, descriptive names.**
11. **Preserve all existing comments and docstrings** unrelated to your changes.
12. **Write docs as you build**, not only at the end.

### Testing Rules
13. **Test algorithms BEFORE building UI on top of them.**
14. **Vitest** for unit tests. Target >90% coverage on `core/`.
15. **Run tests after every core change** — never commit broken tests.

### Decision Making Rules
16. **Do not ask design questions.** Make strong, opinionated choices and log them in `docs/DECISIONS.md`.
17. **Prioritize game feel** over more features. Polish the core first.
18. **Follow the build order in Section 16** of requirements.md.

### File Structure
19. **Web app root:** `/home/mahfuzzayn/Documents/Development/Exercises/n-queens-problem-game/web-app/n-queens-problem-game/`
20. **Source code:** `src/` (App Router in `src/app/`)
21. **Documentation:** `docs/`
22. **Mobile app placeholder:** `../../mobile-app/`

---

## 🐛 Bug Fixes Log

| # | Date | File(s) | Description | Fix | Status |
|---|------|---------|-------------|-----|--------|
| 1 | 2026-11-07 | `vitest.config.ts`, `tests/core.test.ts` | Vitest path alias `@/*` resolution failed | Added `vite` dependency and configured `resolve.alias` in `vitest.config.ts` | Resolved |
| 2 | 2026-11-07 | `src/store/index.ts` | Missing `buildGameResult` export from `@/core` & status narrowing | Exported `buildGameResult` from `scoring.ts` & typed `status` as `GameStatus` | Resolved |
| 3 | 2026-11-07 | `src/app/layout.tsx` | Turbopack build failed offline/sandboxed fetching Google Fonts | Bypassed sandbox for font download; build compiled and cached successfully | Resolved |

---

## 📝 Personal Updates / Notes

| Date | Note |
|------|------|
| 2026-11-07 | Project scaffolded and restructured to `src/app/`. |
| 2026-11-07 | Complete pure TypeScript `src/core/` algorithms implemented (validator, backtracking bitmask solver, scoring, hint engine, daily puzzle generator, achievements). |
| 2026-11-07 | All 23 core algorithm unit tests passing in Vitest. |
| 2026-11-07 | Zustand state store, repository abstraction, Web Audio synthesizer & haptics service created. |
| 2026-11-07 | Game UI components built: Board, memoized Cell, SVG Queen, HUD, ActionBar, ResultModal, GameButton, GamePanel, GameModal. |
| 2026-11-07 | Playable game wired up in `src/app/page.tsx` with responsive sizes (4×4 to 12×12), conflicts, scoring, hints, and victory modal. |
| 2026-11-07 | Next.js production build (`npm run build`) succeeded without warnings/errors. |

---

## 🔄 Session Handoff Checklist

When starting a new chat, read these files in order:
1. **`docs/works.md`** (this file) — Current state, guardrails, bugs
2. **`docs/goals.md`** — Phase progress with checkboxes
3. **`docs/requirements.md`** — Full requirements (401 lines)
4. **`docs/DECISIONS.md`** — Design/tech decisions made so far
5. **`docs/summary-chat.md`** — Summary of previous chat sessions
