# Design System

> [!NOTE]
> This document describes the visual design philosophy, tokens, color palette, typography, button anatomy, animation guidelines, and theming system for the N-Queens Puzzle Game.

---

## Table of Contents

- [Design Philosophy](#design-philosophy)
- [Design Tokens](#design-tokens)
- [Color Palette](#color-palette)
- [Typography](#typography)
- [Button Anatomy](#button-anatomy)
- [Animation Guidelines](#animation-guidelines)
- [Creating a New Theme](#creating-a-new-theme)

---

## Design Philosophy

The N-Queens Puzzle Game follows a **"Cartoon Fantasy Strategy Game"** aesthetic inspired by games like Clash of Clans, Clash Royale, and similar mobile strategy titles. The design should feel:

- **Playful and inviting** — rounded corners, bouncy animations, vibrant colors
- **Rewarding** — gold/amber accents for achievements, satisfying win celebrations
- **Premium** — polished surfaces with subtle gradients, shadows, and highlights
- **Readable** — high contrast text, large touch targets, clear visual hierarchy

**Key principles:**

1. **Beveled and embossed:** Buttons and panels have a 3D "raised" appearance with a visible bottom edge and inner highlight/shine.
2. **Cartoon outlines:** Key UI elements have a subtle dark outline (2–3px) to separate them from backgrounds.
3. **Fantasy palette:** Deep purples, royal blues, and golds evoke a "royal court" theme befitting a queens puzzle.
4. **Generous spacing:** Touch targets are at minimum 44×44px. Spacing between elements is generous to avoid accidental taps.

---

## Design Tokens

Design tokens are defined in `config/theme.tokens.ts` and consumed by Tailwind CSS via the `tailwind.config.ts` extension. All values below are the **default theme** tokens.

```typescript
// config/theme.tokens.ts (structure overview)
export const themeTokens = {
  colors: { /* see Color Palette section */ },
  typography: { /* see Typography section */ },
  spacing: { /* 4px base unit system */ },
  borderRadius: { /* sm: 4px, md: 8px, lg: 12px, xl: 16px, full: 9999px */ },
  shadows: { /* sm, md, lg, button, panel, modal */ },
  animation: { /* durations, easings */ },
} as const;
```

---

## Color Palette

### Primary Colors (Deep Purple / Navy)

| Name | Hex | Usage |
|------|-----|-------|
| `primary-50` | `#F5F3FF` | Lightest tint, hover backgrounds |
| `primary-100` | `#EDE9FE` | Light tint, selected states |
| `primary-200` | `#DDD6FE` | Borders, dividers |
| `primary-300` | `#C4B5FD` | Disabled text |
| `primary-400` | `#A78BFA` | Secondary text |
| `primary-500` | `#8B5CF6` | Primary accent |
| `primary-600` | `#7C3AED` | Primary buttons, links |
| `primary-700` | `#6D28D9` | Button hover |
| `primary-800` | `#5B21B6` | Dark accents |
| `primary-900` | `#4C1D95` | Deepest purple, backgrounds |

### Background Colors (Navy)

| Name | Hex | Usage |
|------|-----|-------|
| `bg-dark` | `#0F0A1E` | App background (darkest) |
| `bg-surface` | `#1A1333` | Card/panel backgrounds |
| `bg-elevated` | `#251D47` | Elevated surfaces, modals |
| `bg-board` | `#2D2154` | Board background |

### Accent Colors

| Name | Hex | Usage |
|------|-----|-------|
| `gold-400` | `#FBBF24` | Coins, rewards, star fill |
| `gold-500` | `#F59E0B` | Star outlines, achievement badges |
| `gold-600` | `#D97706` | Gold button accents |
| `green-400` | `#4ADE80` | Success states, valid placement |
| `green-500` | `#22C55E` | Confirm buttons |
| `red-400` | `#F87171` | Conflict highlighting |
| `red-500` | `#EF4444` | Error states, danger buttons |
| `cyan-400` | `#22D3EE` | Hint highlighting |
| `cyan-500` | `#06B6D4` | Info accents |

### Neutral Colors

| Name | Hex | Usage |
|------|-----|-------|
| `neutral-50` | `#FAFAFA` | Primary text (on dark bg) |
| `neutral-100` | `#F5F5F5` | Secondary text |
| `neutral-200` | `#E5E5E5` | Tertiary text, borders |
| `neutral-400` | `#A3A3A3` | Placeholder text |
| `neutral-600` | `#525252` | Disabled text |
| `neutral-800` | `#262626` | Dark text (on light bg) |

---

## Typography

### Font Families

| Role | Font | Weight(s) | Usage |
|------|------|-----------|-------|
| **Display** | [Lilita One](https://fonts.google.com/specimen/Lilita+One) | 400 (Regular) | Headings, level numbers, score display, button labels |
| **Body** | [Nunito](https://fonts.google.com/specimen/Nunito) | 400, 600, 700, 800 | Body text, descriptions, UI labels, paragraphs |

**Why these fonts:**

- **Lilita One** has excellent readability at game-sized headings while maintaining a playful, bold, cartoon feel. It works well at large sizes for scores and level numbers.
- **Nunito** is highly legible at small sizes, has a friendly rounded aesthetic that pairs well with Lilita One, and offers multiple weights for visual hierarchy.

### Type Scale

| Token | Size | Line Height | Font | Usage |
|-------|------|-------------|------|-------|
| `display-xl` | 48px | 1.1 | Lilita One | Win screen score |
| `display-lg` | 36px | 1.1 | Lilita One | Level numbers, timers |
| `display-md` | 28px | 1.2 | Lilita One | Section headings |
| `display-sm` | 22px | 1.2 | Lilita One | Button labels, card titles |
| `body-lg` | 18px | 1.5 | Nunito | Lead paragraphs |
| `body-md` | 16px | 1.5 | Nunito | Body text |
| `body-sm` | 14px | 1.4 | Nunito | Captions, help text |
| `body-xs` | 12px | 1.4 | Nunito | Fine print, labels |

---

## Button Anatomy

Buttons in the game follow a **3D beveled** style with four visual layers:

```
  ┌─────────────────────────────┐  ← Outline (2px, dark border)
  │  ┌───────────────────────┐  │
  │  │   ✦ Shine (gradient)  │  │  ← Shine layer (top highlight)
  │  │                       │  │
  │  │     BUTTON LABEL      │  │  ← Face (main background color)
  │  │                       │  │
  │  └───────────────────────┘  │
  │  ████████████████████████   │  ← Bottom edge (darker shade, 4px)
  └─────────────────────────────┘
```

### Layers

1. **Outline:** A 2–3px dark border (`primary-900` or `neutral-800`) that gives the button a cartoon "cutout" look.
2. **Face:** The main button surface with a subtle vertical gradient (lighter at top, slightly darker at bottom).
3. **Shine:** A semi-transparent white gradient at the top ~30% of the button face, simulating a glossy highlight.
4. **Bottom Edge:** A 3–4px strip at the bottom in a darker shade of the face color, creating a 3D "raised" effect.

### States

| State | Visual Change |
|-------|---------------|
| Default | Full 3D appearance with shine |
| Hover | Face brightens slightly, subtle scale(1.02) |
| Active/Pressed | Bottom edge shrinks to 1px, button visually "pushes down", translateY(2px) |
| Disabled | Desaturated colors, no shine, 50% opacity |
| Focus | Bright cyan outline ring (accessibility) |

### Variants

| Variant | Face Color | Usage |
|---------|-----------|-------|
| `primary` | `primary-600` → `primary-700` | Main CTAs (Play, Start, Confirm) |
| `secondary` | `bg-elevated` → `bg-surface` | Secondary actions (Settings, Back) |
| `success` | `green-500` → `green-600` | Positive actions (Submit, Claim) |
| `danger` | `red-500` → `red-600` | Destructive actions (Reset, Quit) |
| `gold` | `gold-500` → `gold-600` | Reward/purchase actions (Buy Hint) |
| `ghost` | Transparent | Tertiary actions, icon buttons |

---

## Animation Guidelines

All animations use **Framer Motion** and follow these guidelines:

### Timing

| Category | Duration | Easing |
|----------|----------|--------|
| Micro-interactions (button press, toggle) | 100–150ms | `easeOut` |
| State transitions (panel slide, fade) | 200–300ms | `easeInOut` |
| Celebrations (star fill, confetti) | 400–800ms | `spring` (stiffness: 300, damping: 20) |
| Queen placement | 200ms | `spring` (stiffness: 400, damping: 25) |
| Conflict shake | 300ms | Custom `[0, -4, 4, -4, 4, 0]` keyframes |

### Standard Animations

| Animation | Trigger | Description |
|-----------|---------|-------------|
| `fadeIn` | Component mount | Opacity 0 → 1, translateY(8px) → 0 |
| `scaleIn` | Modal/popup open | Scale 0.9 → 1, opacity 0 → 1 |
| `slideUp` | Panel open | TranslateY(100%) → 0 |
| `queenPlace` | Queen placed on board | Scale 0 → 1.1 → 1 with spring |
| `queenRemove` | Queen removed | Scale 1 → 0 with fade |
| `conflictShake` | Conflict detected | Horizontal shake keyframes |
| `starFill` | Star earned | Scale + gold fill animation with delay stagger |
| `confetti` | Win state | Particle burst from center |

### Accessibility

- All animations respect `prefers-reduced-motion`. When reduced motion is preferred, animations are replaced with instant transitions (opacity only, no transforms).
- Animation durations are defined as tokens in `config/theme.tokens.ts` for easy adjustment.

---

## Creating a New Theme

To create a new board/UI theme:

1. **Create a new token set** in `config/theme.tokens.ts`:
   ```typescript
   export const forestTheme = {
     colors: {
       primary: { /* green-based palette */ },
       bg: { /* dark green backgrounds */ },
       // ... override any color tokens
     },
     // Typography and spacing are typically shared across themes
   } satisfies ThemeTokens;
   ```

2. **Register the theme** in `config/game.config.ts`:
   ```typescript
   export const THEMES = ['default', 'forest', 'ocean', 'sunset'] as const;
   ```

3. **Add a preview image** for the theme selector UI (placed in `public/themes/`).

4. **Test the theme** across all game screens to ensure sufficient contrast and readability.

> [!TIP]
> Themes only override **color tokens**. Typography, spacing, border radius, and animation tokens are shared across all themes to maintain consistent UX. If a theme needs different typography (e.g., a "retro pixel" theme), create a full theme variant instead.
