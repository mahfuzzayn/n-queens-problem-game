# N-Queens Game — Works Log (Bug Fixes & Guardrails)

> **Purpose:** This file is the living record of bug fixes, personal updates, and guardrails/rules for AI agents working on this project. When starting a **new chat session**, read this file first to stay connected to the project state.

---

## 🔒 Guardrails & Rules for AI Agents

### Architecture Rules
1. **`src/core/` is PURE TypeScript.** Zero imports from React, Next.js, React Native, or browser APIs (`window`, `document`, `localStorage`). This module is strictly shared between `web-app/` and `mobile-app/`.
2. **Game logic NEVER goes in UI components.** Components call store actions → actions call `core/` functions.
3. **All persistence goes through `StorageAdapter` and Repository interfaces.** 
   - Web uses `LocalStorageAdapter`.
   - Mobile uses `AsyncStorageAdapter`.
4. **All tunable values live in `src/config/`.** A designer should rebalance the game by editing config only.
5. **User-facing strings live in `src/core/strings.ts`.** No hardcoded text in components (for i18n readiness).
6. **Sound, haptics, and storage are adapters** — never direct browser or native device calls inside components.

### Code Quality Rules
7. **Strict TypeScript.** No `any` unless justified with a comment explaining why.
8. **No `TODO: implement` placeholders** in delivered features. Deferred items go in `docs/roadmap.md`.
9. **JSDoc on all `core/` functions.**
10. **Small focused files, descriptive names.**
11. **Preserve all existing comments and docstrings** unrelated to your changes.
12. **Write docs as you build**, not only at the end.
13. **Doc naming convention:** Lowercase with underscores (`docs/*.md`, e.g. `architecture.md`, `game_logic.md`, `backend_spec.md`).

### Mobile App (React Native) Specific Guardrails
14. **Native Responsiveness & Performance:**
    - Use `react-native-safe-area-context` for notch, dynamic island, and navigation bar insets.
    - Zero horizontal overflow. All screens must fit naturally on any phone width (from iPhone SE / 360dp Android to tablets).
    - Board must scale adaptively based on screen width (`Dimensions.get('window').width` or `useWindowDimensions`).
    - Use `react-native-reanimated` (runs on UI thread) for 60fps micro-animations, button press sink-down, and victory modal transitions.
    - Memoize board cells (`React.memo`) to avoid unnecessary re-renders when placing/removing queens.
15. **Visual Parity with Web App:**
    - Replicate the exact cartoon fantasy game aesthetic: thick borders, layered 3D buttons (outline + face + shine + darker bottom edge that translates on press), deep purple/navy background, and gold accents.
    - SVG Queens using `react-native-svg`.

### Testing Rules
16. **Test algorithms BEFORE building UI on top of them.**
17. **Vitest** for unit tests. Target >90% coverage on `core/`.
18. **Run tests after every core change** — never commit broken tests.

### Decision Making Rules
19. **Do not ask design questions.** Make strong, opinionated choices and log them in `docs/decisions.md`.
20. **Prioritize game feel** over more features. Polish the core first.
21. **Follow the build order in Section 16** of requirements.md.

### File Structure
22. **Project Root:** `/home/mahfuzzayn/Documents/Development/Exercises/n-queens-problem-game/`
23. **Web app:** `web-app/`
24. **Mobile app:** `mobile-app/`
25. **Documentation:** `web-app/docs/`

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
| 7 | 2026-11-08 | `mobile-app/App.tsx` | TS2322: `backgroundColor` is not on `StatusBarProps` for `expo-status-bar` | Removed redundant `backgroundColor` prop and kept `style="light"`, delegating background to SafeAreaView | Resolved |
| 8 | 2026-11-08 | `mobile-app/src/components/game/Queen.tsx` | TS2740: `react-native-svg` `LinearGradient` does not accept React Fragments (`<>...</>`) | Replaced Fragment wrapping with explicit `ReactElement[]` arrays of `<Stop>` elements with keys | Resolved |
| 9 | 2026-11-08 | `mobile-app/src/components/ui/GameModal.tsx`, `ProgressBar.tsx` | TS2551: `StyleSheet.absoluteFillObject` does not exist in React Native 0.88 TS declarations | Changed to `...StyleSheet.absoluteFill` | Resolved |
| 10 | 2026-11-08 | `mobile-app/src/services/audio.ts` | `Cannot find native module 'ExponentAV'`: `expo-av` was deprecated and its native module removed in Expo SDK 54+ / Expo Go | Migrated to `expo-audio` with defensive dynamic loading and graceful silent fallback, ensuring zero crashes on any device/Expo Go client | Resolved |
| 11 | 2026-11-08 | `mobile-app/src/components/ui/GameButton.tsx`, `GameBadge.tsx` | `Text strings must be rendered within a <Text> component`: checking only `typeof children === 'string'` failed when children was an array (e.g. `['Next (N=', 5, ')']`) or number | Replaced check with `React.isValidElement(children) ? children : <Text ...>{children}</Text>` to safely wrap all non-element primitives in `<Text>` | Resolved |
| 12 | 2026-11-08 | `mobile-app/src/components/game/ResultModal.tsx` | Next button text was empty after winning a stage due to array child rendering outside `<Text>` | Resolved by Bug #11 fix | Resolved |
| 13 | 2026-11-08 | `web-app/src/components/game/SplashScreen.tsx`, `page.tsx` | Web app infinite loading loop: inline `onFinish` prop inside `SplashScreen`'s `useEffect` dependency array caused re-triggering every render cycle | Stored `onFinish` in `useRef` and added safety fallback timer (1400ms) | Resolved |
| 14 | 2026-11-08 | `src/store/index.ts`, `ActionBar.tsx` | Repeated clicks on Hint decreased hint count and recomputed identical hint without requiring user to make a move first | Enforced hint blocking: `requestHint` returns early when `currentHint !== null`, ActionBar disables Hint button and displays "Active" until a move is made | Resolved |
| 15 | 2026-11-08 | `src/services/repositories/index.ts`, `Cell.tsx` | `showAttackLines` stayed active on reload due to unmigrated cached settings and `Cell.tsx` default prop fallback | Upgraded to schema v2 with auto-migration to `showAttackLines: false` on first launch/upgrade, fixed `Cell.tsx` default prop to `false`, and ensured `saveSettings` writes `SCHEMA_VERSION` so user toggles persist across app reopens | Resolved |
| 16 | 2026-11-08 | `mobile-app/App.tsx` | Top header score/coin badge text was invisible on mobile: `goldBadgeText` was styled with `color: '#78350f'`, matching the dark brown background (`#78350f`) | Changed text color to `#fef08a` (bright yellow/gold) matching web, and enlarged coin icon to 13dp | Resolved |

---

## 📝 Personal Updates / Notes

| Date | Note |
|------|------|
| 2026-11-07 | Web app created and restructured directly inside `web-app/`. |
| 2026-11-07 | All 23 core algorithm unit tests pass in Vitest (`npm test`). |
| 2026-11-08 | Next.js production build (`npm run build`) succeeds cleanly with Turbopack and 0 errors. |
| 2026-11-08 | Phase 1 (Web App) complete. |
| 2026-11-08 | Phase 2 (Mobile App: React Native / Expo SDK 58) scaffolded and fully implemented in `mobile-app/`. |
| 2026-11-08 | Zero code duplication achieved: `core/`, `config/`, and `types/` are directly shared and symlinked from `web-app/`. |
| 2026-11-08 | Native adapters built: `AsyncStorageAdapter`, `NativeAudioService` (PCM WAV tones), `NativeHapticsService` (`expo-haptics`). |
| 2026-11-08 | All UI primitives ported to React Native (`GameButton` with Reanimated 3D sink-down, `GamePanel`, `GameModal`, `StarRating`, `ProgressBar`, `GameBadge`, `StatChip`, `Toggle`, `Stepper`, `IconButton`). |
| 2026-11-08 | Board and game components ported with dynamic responsiveness (`useWindowDimensions`), memoized cells, and conflict-bouncing SVG Queen. |
| 2026-11-08 | Android bundle successfully exported via Metro (1150 modules bundled). 7/7 mobile unit tests pass in Vitest. |
| 2026-11-08 | Fixed Text string component error and ResultModal Next button empty text by wrapping non-element children in `<Text>`. |
| 2026-11-08 | Designed custom vector Royal Crown Logo (`GameLogo`), generated all 8 PNG assets via sharp (app icons, adaptive foreground/background, splash icon, OG image, apple-touch-icon, favicons). |
| 2026-11-08 | Added animated Load Screen with Reanimated (mobile) and Framer Motion (web). |
| 2026-11-08 | Configured Android prebuild (`mobile-app/android`), created `eas.json` for APK cloud builds, and wrote `playstore.md` deployment guide. |
| 2026-11-08 | Built Rewarded Ad module (`SHOETIC_AD_CONFIG`) featuring "Shoetic" artisanal footwear with a 10s view countdown timer, interactive claim button, and max 10 ad-hints per match on both Web and Mobile. |
| 2026-11-08 | Replaced all UI emojis across both Web and Mobile with bespoke crisp vector icons (`GameIcon`: crown, clock, target, hint, undo, redo, reset, adGift, coin, shield, rock, lock, trophy, swords, skull, star, sparkles). |
| 2026-11-08 | Changed default `showAttackLines` setting to `false` in both Web and Mobile repositories. |
| 2026-11-08 | Added unit tests for hint blocking, rewarded ad claiming, and default settings in `mobile.test.ts`. 9/9 mobile tests and 23/23 web tests passing. 0 TypeScript errors. |
| 2026-11-08 | Resolved attack lines default & persistence: schema v2 auto-migration enforces `showAttackLines: false` by default, `Cell.tsx` default prop aligned to `false`, and user toggles properly persist and reload across app restarts. |
| 2026-11-08 | Integrated real-time live Score in top HUD on both Mobile and Web with trophy icon, and added defeat score card in `ResultModal.tsx`. |

---

## 🔄 Session Handoff Checklist

When starting a new chat, read these files in order:
1. **`docs/works.md`** (this file) — Current state, guardrails, bugs
2. **`docs/goals.md`** — Phase progress with checkboxes
3. **`docs/requirements.md`** — Full requirements
4. **`docs/decisions.md`** — Design/tech decisions made so far
5. **`docs/summary_chat.md`** — Summary of previous chat sessions
