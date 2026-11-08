# Architecture Decision Records

> [!NOTE]
> This document records significant architecture and technology decisions made during the development of the N-Queens Puzzle Game. Each decision includes the alternatives considered and the reasoning behind the choice.

---

## Table of Contents

- [Decision Log](#decision-log)
- [How to Add a Decision](#how-to-add-a-decision)

---

## Decision Log

| # | Date | Decision | Alternatives Considered | Reasoning |
|---|------|----------|------------------------|-----------|
| 1 | 2026-11-07 | Use `src/` directory structure | Flat structure | Standard Next.js convention, cleaner separation of concerns |
| 2 | 2026-11-07 | Lilita One (display) + Nunito (body) | Bangers, Luckiest Guy | Lilita One has best readability at game sizes while maintaining playful feel; Nunito is highly legible |
| 3 | 2026-11-07 | Deep purple/navy primary palette | Blue/teal, dark green | Most evocative of "royal" fantasy game feel, high contrast with gold rewards |
| 4 | 2026-11-07 | CVA for component variants | Styled-components, CSS modules | Same pattern as shadcn/ui (familiar to devs), works great with Tailwind, zero runtime |
| 5 | 2026-11-07 | Zustand over Redux | Redux Toolkit, Jotai, Context | Minimal boilerplate, built-in persist middleware, easy slicing, works with React 19 |
| 6 | 2026-11-07 | Vitest over Jest | Jest, Testing Library | Vite-native, faster, ESM support, compatible with TypeScript out of the box |
| 7 | 2026-11-07 | Bitmask solver as primary | Simple array solver | O(1) conflict checking per placement, critical for N>12 performance |
| 8 | 2026-11-07 | `--legacy-peer-deps` for Vitest install | Upgrade @types/node | Vitest 5.x wants @types/node ≥22, but Next.js 16.x pin keeps ^20; peer dep is optional so this is safe |
| 9 | 2026-11-08 | Expo SDK 58 for Mobile App | Bare React Native, Expo SDK 51 | Aligns React 19.3.0 across both web and mobile, modern Hermes engine, zero native build overhead |
| 10 | 2026-11-08 | Direct Symlinking of `core/`, `config/`, and `types/` | Code duplication, npm package publish | 100% zero code duplication; edits in web-app immediately take effect in mobile-app with Metro `unstable_enableSymlinks` |
| 11 | 2026-11-08 | In-memory PCM WAV synthesis for native audio | Bundling raw mp3 files | Zero-asset dependency, offline readiness, deterministic tone pitches matching web synthesizer |
| 12 | 2026-11-08 | `react-native-reanimated` for 3D buttons & modals | React Native Animated, CSS animations | Runs purely on the native UI thread, guaranteeing 60fps zero-stutter press sink-down and spring transitions |

---

## How to Add a Decision

When making a significant architectural or technology decision, add a new row to the table above:

1. **Increment the `#` column** by 1.
2. **Set the date** to the current date (YYYY-MM-DD format).
3. **Describe the decision** concisely (what was decided).
4. **List alternatives** that were considered (what other options were evaluated).
5. **Explain the reasoning** (why this option was chosen over the alternatives).

### What constitutes an ADR?

Record a decision when:

- Choosing between competing **libraries or frameworks** (e.g., Zustand vs Redux)
- Deciding on a **code architecture pattern** (e.g., pure core vs mixed)
- Making a **design system choice** (e.g., font selection, color palette)
- Choosing a **data structure or algorithm** (e.g., bitmask vs array solver)
- Making a **trade-off** with long-term consequences (e.g., peer dep workaround)

Do **not** record trivial decisions (e.g., variable naming, import ordering).

### Template

```markdown
| N | YYYY-MM-DD | [Decision description] | [Alternative 1], [Alternative 2] | [Reasoning explanation] |
```
