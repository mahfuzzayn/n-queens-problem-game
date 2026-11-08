# N-Queens Game — Goals & Progress Tracker

> Generated: 2026-11-07  
> Updated: 2026-11-08  
> Source: [requirements.md](./requirements.md)  
> This file tracks phase-by-phase progress with checkboxes.

---

## Phase 1: Web App (Next.js) — Status: COMPLETE ✅

- [x] Restructure to match required folder layout (`web-app/src/`)
- [x] Set up `tsconfig.json` path aliases (`@/*` → `./src/*`)
- [x] Install required dependencies and resolve peer dependencies for Vercel builds
- [x] Set up strict TypeScript (zero `any`)
- [x] Create design tokens (`src/styles/tokens.css` & `src/config/theme.tokens.ts`)
- [x] Create pure TypeScript core logic (`core/board.ts`, `core/validator.ts`, `core/solver.ts`, `core/scoring.ts`, `core/hints.ts`, `core/puzzle-generator.ts`, `core/achievements.ts`)
- [x] Write Vitest unit test suite covering all core algorithms (23/23 tests passing)
- [x] State management via Zustand (`src/store/index.ts`)
- [x] Persistence abstraction (`StorageAdapter`, `LocalStorageAdapter`, `MemoryStorageAdapter`, Repositories)
- [x] Web Audio synthesis and Haptic vibration adapters
- [x] Full UI primitive kit (`GameButton`, `GamePanel`, `GameModal`, `GameBadge`, `StarRating`, `ProgressBar`, `StatChip`, `IconButton`, `Toggle`, `Stepper`, `Ribbon`, `Tabs`)
- [x] Game components (`Board`, memoized `Cell`, SVG `Queen` with conflict bounce, `HUD`, `ActionBar`, `ResultModal`, `SettingsModal`, `ImpossibleModal`)
- [x] Responsive layout with mobile scroll boundaries for $N > 10$
- [x] Complete documentation in `web-app/docs/` with lowercase and underscore naming
- [x] Verified `npm test` (all 23 pass) and `npm run build` (Turbopack production build succeeds with 0 errors)

---

## Phase 2: Mobile App (React Native / Expo) — Status: COMPLETE ✅

- [x] Scaffold Expo app in `mobile-app/` with TypeScript template (Expo SDK 58, React 19.3.0, React Native 0.88.1)
- [x] Set up path aliases and symlink shared `core/`, `config/`, and `types/` directly from `web-app/` (zero code duplication)
- [x] Install essential native dependencies:
  - `expo-av` (audio feedback & synthesizers)
  - `expo-haptics` (tactile device vibrations)
  - `@react-native-async-storage/async-storage` (persistence)
  - `react-native-reanimated` & `react-native-gesture-handler` (60fps UI-thread animations)
  - `react-native-svg` (vector queen crown and jewels)
  - `react-native-safe-area-context` (notch & system bar handling)
  - `zustand` (state management, mirroring web store)
- [x] Implement mobile storage adapter (`AsyncStorageAdapter`) plugging into existing repositories
- [x] Implement mobile audio service using `expo-av` (synthesized PCM WAV tones)
- [x] Implement mobile haptics service using `expo-haptics`
- [x] Port UI primitives to native with matching "Cartoon Fantasy Strategy" aesthetics:
  - `GameButton` with physical press sink-down animation (Reanimated translateY + shrinking bevel)
  - `GamePanel` with layered borders and wooden/royal textures
  - `GameModal` with smooth Reanimated slide/scale springs
  - `StarRating`, `ProgressBar`, `GameBadge`, `StatChip`, `Toggle`, `Stepper`, `IconButton`
- [x] Port Game components:
  - Responsive `Board` dynamically calculating cell sizes based on device screen dimensions (`useWindowDimensions`) from 360dp phones to tablets
  - Memoized `Cell` component (`React.memo`)
  - Native SVG `Queen` with gold glossy gradients, gems, and conflict bounce animation
  - Top `HUD` with Queens placed ($x/N$), live timer, moves, and hints
  - Bottom `ActionBar` (Undo, Redo, Hint, Reset)
  - Victory & Defeat modals with score breakdowns and star animations
  - Settings sheet/modal (sound, haptics, attack lines, conflicts)
  - N=2 & N=3 "Impossible Challenge / Prove It" interactive proof modal
- [x] Ensure natural iOS and Android ergonomics:
  - Edge-to-edge safe area support via `SafeAreaProvider` and `SafeAreaView`
  - Android status bar translucency and navigation styling
  - Zero layout overflow, lag, or stuttering (UI thread animations via Reanimated)
- [x] Tested & verified:
  - Production Android bundle exported via Metro (1150 modules bundled into Hermes bytecode with code 0)
  - Unit test suite in Vitest passing 100% (9/9 tests passing)
- [x] Rewarded Ad Hint System (`SHOETIC_AD_CONFIG`):
  - Brand overlay for "Shoetic" artisanal footwear with dynamic mutable config
  - 10-second verification timer before claim button activates
  - Match repetition limit (max 10 ad-hints per game)
  - Full feature parity across Web and Mobile
- [x] Hint Usability & Game Balance:
  - Enforced hint blocking: player must make a move before requesting another hint
  - Prevents repeated clicks from decrementing hint budget or spamming the solver
- [x] Visual Design & Assets:
  - Bespoke vector game icons (`GameIcon`) replacing all emojis across Web and Mobile
  - Default `showAttackLines` set to `false` for cleaner initial board appearance
  - Animated Load Screen with smooth Reanimated/Framer transitions
  - Standalone Android APK build scripts and Play Store deployment guide (`playstore.md`)

---

## Phase 3: Online & Multiplayer (V2) — Status: Planned

- [ ] Backend specification defined in `docs/backend_spec.md`
- [ ] User authentication & cloud profile sync
- [ ] Global & friend leaderboards
- [ ] Asynchronous challenges & head-to-head race mode
- [ ] Server-side solution validation via shared pure `core/` functions
