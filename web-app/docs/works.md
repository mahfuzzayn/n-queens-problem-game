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
8. **No `TODO: implement` placeholders** in delivered features. Deferred items go in `docs/roadmap.md`.
9. **JSDoc on all `core/` functions.**
10. **Small focused files, descriptive names.**
11. **Preserve all existing comments and docstrings** unrelated to your changes.
12. **Write docs as you build**, not only at the end.
13. **Doc naming convention:** Lowercase with underscores (`docs/*.md`, e.g. `architecture.md`, `game_logic.md`, `backend_spec.md`).

### Testing Rules
14. **Test algorithms BEFORE building UI on top of them.**
15. **Vitest** for unit tests. Target >90% coverage on `core/`.
16. **Run tests after every core change** — never commit broken tests.

### Decision Making Rules
17. **Do not ask design questions.** Make strong, opinionated choices and log them in `docs/decisions.md`.
18. **Prioritize game feel** over more features. Polish the core first.
19. **Follow the build order in Section 16** of requirements.md.

### File Structure
20. **Web app root:** `/home/mahfuzzayn/Documents/Development/Exercises/n-queens-problem-game/web-app/`
21. **Source code:** `web-app/src/` (App Router in `web-app/src/app/`)
22. **Documentation:** `web-app/docs/`
23. **Mobile app placeholder:** `mobile-app/`

---

## 🐛 Bug Fixes Log

| # | Date | File(s) | Description | Fix | Status |
|---|------|---------|-------------|-----|--------|
| 1 | 2026-11-07 | `vitest.config.ts`, `tests/core.test.ts` | Vitest path alias `@/*` resolution failed | Added `vite` dependency and configured `resolve.alias` in `vitest.config.ts` | Resolved |
| 2 | 2026-11-07 | `src/store/index.ts` | Missing `buildGameResult` export from `@/core` & status narrowing | Exported `buildGameResult` from `scoring.ts` & typed `status` as `GameStatus` | Resolved |
| 3 | 2026-11-07 | `src/app/layout.tsx` | Turbopack build failed offline/sandboxed fetching Google Fonts | Bypassed sandbox for font download; build compiled and cached successfully | Resolved |
| 4 | 2026-11-07 | File tree & `docs/` | Web app files were nested inside `web-app/n-queens-problem-game/` | Flattened app directly into `web-app/`, renamed all `docs/*.md` to lowercase with underscores, updated path cross-references | Resolved |
| 5 | 2026-11-07 | `src/components/game/Board.tsx` | Mobile responsiveness on large board sizes ($N > 10$) | Added responsive touch boundaries, adaptive min-widths, and horizontal viewport scrolling | Resolved |
| 6 | 2026-11-08 | `web-app/package.json` | Vercel build failed on `npm install`: `@types/node` was pinned to `^20`, while `vitest@5.1.0` required `@types/node@"^22.0.0 || >=24.0.0"` as peer dependency | Bumped `@types/node` to `^22` in `devDependencies`, aligned Framer Motion sub-dependencies (`motion-dom`, `motion-utils`), and verified clean `npm install` and `npm run build` | Resolved |

---

## 📝 Personal Updates / Notes

| Date | Note |
|------|------|
| 2026-11-07 | Project restructured directly inside `web-app/`. |
| 2026-11-07 | All documentation filenames converted to lowercase with underscores (`algorithms.md`, `architecture.md`, `game_logic.md`, etc.). |
| 2026-11-07 | All 23 core algorithm unit tests pass in Vitest (`npm test`). |
| 2026-11-08 | Upgraded `@types/node` to `^22` resolving the upstream Vercel `npm install` peer conflict. |
| 2026-11-08 | Next.js production build (`npm run build`) succeeds cleanly with Turbopack. |

---

## 🔄 Session Handoff Checklist

When starting a new chat, read these files in order:
1. **`docs/works.md`** (this file) — Current state, guardrails, bugs
2. **`docs/goals.md`** — Phase progress with checkboxes
3. **`docs/requirements.md`** — Full requirements
4. **`docs/decisions.md`** — Design/tech decisions made so far
5. **`docs/summary_chat.md`** — Summary of previous chat sessions
