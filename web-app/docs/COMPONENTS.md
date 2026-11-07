# Components

> [!NOTE]
> This document catalogs all React UI components in the N-Queens Puzzle Game, including their props, variants, and usage examples. Components are built with React 19, Tailwind CSS, CVA (Class Variance Authority), and Framer Motion.

---

## Table of Contents

- [Overview](#overview)
- [Component List](#component-list)
  - [GameButton](#gamebutton)
  - [GamePanel](#gamepanel)
  - [GameModal](#gamemodal)
  - [GameCard](#gamecard)
  - [Board](#board)
  - [Cell](#cell)
  - [Queen](#queen)
  - [Timer](#timer)
  - [ScoreDisplay](#scoredisplay)
  - [StarRating](#starrating)
  - [CoinDisplay](#coindisplay)
  - [HintButton](#hintbutton)
  - [UndoRedoControls](#undoredocontrols)
  - [LevelSelector](#levelselector)
  - [SettingsPanel](#settingspanel)

---

## Overview

All components follow these conventions:

- **CVA for variants:** Component variants are defined using `class-variance-authority` (CVA), consistent with the shadcn/ui pattern.
- **Framer Motion:** Animations are handled via `framer-motion` layout animations and variants.
- **Strict TypeScript:** All props are strictly typed with no `any` types.
- **Accessibility:** All interactive components include appropriate ARIA attributes, keyboard handlers, and focus management.
- **Composition:** Components are composable — larger screens are assembled from smaller primitives.

---

## Component List

### GameButton

The primary interactive button component with the 3D beveled style described in [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md#button-anatomy).

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'success' \| 'danger' \| 'gold' \| 'ghost'` | `'primary'` | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `disabled` | `boolean` | `false` | Whether the button is disabled |
| `loading` | `boolean` | `false` | Show loading spinner and disable interaction |
| `icon` | `ReactNode` | — | Optional icon displayed before the label |
| `fullWidth` | `boolean` | `false` | Whether the button spans full container width |
| `children` | `ReactNode` | — | Button label content |
| `onClick` | `() => void` | — | Click handler |

**Variants:**

- `primary` — Deep purple face, used for main CTAs (Play, Start, Confirm)
- `secondary` — Dark surface face, used for secondary actions (Settings, Back)
- `success` — Green face, used for positive confirmations
- `danger` — Red face, used for destructive actions (Reset, Quit)
- `gold` — Gold face, used for purchase/reward actions (Buy Hint)
- `ghost` — Transparent, no bevel, used for icon-only or tertiary actions

**Usage Example:**

```tsx
<!-- Placeholder: actual import path TBD -->
<GameButton variant="primary" size="lg" onClick={handleStart}>
  Start Game
</GameButton>

<GameButton variant="gold" icon={<CoinIcon />} onClick={handleBuyHint}>
  Use Hint (5 coins)
</GameButton>

<GameButton variant="danger" size="sm" onClick={handleReset}>
  Reset Board
</GameButton>
```

---

### GamePanel

A container component with the beveled panel style — rounded corners, dark background, subtle border, and inner shadow.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'elevated' \| 'outlined'` | `'default'` | Panel style variant |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Inner padding |
| `className` | `string` | — | Additional CSS classes |
| `children` | `ReactNode` | — | Panel content |

**Usage Example:**

```tsx
<GamePanel variant="elevated" padding="lg">
  <h2>Level Select</h2>
  <p>Choose your challenge size.</p>
</GamePanel>
```

---

### GameModal

A dialog overlay component with backdrop blur, entrance animation, and focus trapping.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | — | Whether the modal is visible |
| `onClose` | `() => void` | — | Handler called when the modal should close |
| `title` | `string` | — | Modal heading text |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Modal width |
| `closable` | `boolean` | `true` | Whether the close button and backdrop click are enabled |
| `children` | `ReactNode` | — | Modal body content |
| `footer` | `ReactNode` | — | Optional footer with action buttons |

**Usage Example:**

```tsx
<GameModal
  isOpen={showWinModal}
  onClose={handleClose}
  title="🎉 Puzzle Complete!"
  footer={
    <>
      <GameButton variant="primary" onClick={handleNext}>Next Level</GameButton>
      <GameButton variant="secondary" onClick={handleHome}>Home</GameButton>
    </>
  }
>
  <ScoreDisplay score={1713} />
  <StarRating stars={2} maxStars={3} />
</GameModal>
```

---

### GameCard

A clickable card component used for mode selection, level selection, and achievement display.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'locked' \| 'completed'` | `'default'` | Card state variant |
| `onClick` | `() => void` | — | Click handler |
| `disabled` | `boolean` | `false` | Whether the card is interactive |
| `children` | `ReactNode` | — | Card content |

**Usage Example:**

```tsx
<!-- Placeholder: actual component structure TBD -->
<GameCard variant="completed" onClick={() => selectMode('classic')}>
  <h3>Classic Mode</h3>
  <p>Solve at your own pace</p>
  <StarRating stars={bestStars} maxStars={3} />
</GameCard>
```

---

### Board

The main N×N game board component. Renders a grid of `Cell` components.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number` | — | Board dimension N (renders N×N grid) |
| `queens` | `ReadonlyArray<number>` | — | Queen positions: `queens[row] = col` (-1 if empty) |
| `conflicts` | `ReadonlySet<string>` | — | Set of conflict cell keys (`"row,col"`) |
| `hintCells` | `ReadonlySet<string>` | — | Set of highlighted hint cell keys |
| `onCellClick` | `(row: number, col: number) => void` | — | Handler for cell clicks |
| `disabled` | `boolean` | `false` | Whether board interaction is disabled (e.g., paused, won) |

**Usage Example:**

```tsx
<!-- Placeholder: actual implementation TBD -->
<Board
  size={8}
  queens={gameState.queens}
  conflicts={gameState.conflicts}
  hintCells={hintHighlights}
  onCellClick={handleCellClick}
  disabled={gameStatus !== 'playing'}
/>
```

---

### Cell

A single cell within the game board. Handles visual states (empty, queen, conflict, hint).

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `row` | `number` | — | Row index |
| `col` | `number` | — | Column index |
| `hasQueen` | `boolean` | `false` | Whether this cell contains a queen |
| `isConflict` | `boolean` | `false` | Whether this cell is part of a conflict |
| `isHint` | `boolean` | `false` | Whether this cell is highlighted as a hint |
| `isDark` | `boolean` | — | Whether this is a "dark" checkerboard square |
| `onClick` | `() => void` | — | Click handler |
| `disabled` | `boolean` | `false` | Whether the cell is interactive |

---

### Queen

The queen piece SVG/icon component rendered inside a Cell.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isConflict` | `boolean` | `false` | Whether the queen is in conflict (changes color to red) |
| `animate` | `'place' \| 'remove' \| 'idle'` | `'idle'` | Animation state |

---

### Timer

Displays the game timer (count-up or countdown).

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `seconds` | `number` | — | Current time in seconds |
| `mode` | `'countUp' \| 'countdown'` | `'countUp'` | Timer direction |
| `isWarning` | `boolean` | `false` | Whether to show warning styling (low time) |

---

### ScoreDisplay

Displays the player's current or final score with animated counter.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `score` | `number` | — | Score value to display |
| `animate` | `boolean` | `true` | Whether to animate the count-up |

---

### StarRating

Displays 1–3 stars with fill animation.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `stars` | `number` | — | Number of filled stars (0–3) |
| `maxStars` | `number` | `3` | Total number of stars |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Star size |
| `animate` | `boolean` | `true` | Whether to animate the star fill |

---

### CoinDisplay

Shows the player's current coin balance.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `coins` | `number` | — | Current coin count |
| `animate` | `boolean` | `true` | Whether to animate changes |

---

### HintButton

Button for requesting hints, with coin cost display and tier indicator.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tier` | `1 \| 2 \| 3` | — | Current hint tier to be dispensed |
| `cost` | `number` | — | Coin cost for this hint |
| `canAfford` | `boolean` | — | Whether the player has enough coins |
| `onClick` | `() => void` | — | Click handler |
| `disabled` | `boolean` | `false` | Whether hints are disabled |

---

### UndoRedoControls

Undo and redo buttons with disabled state management.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `canUndo` | `boolean` | — | Whether undo is available |
| `canRedo` | `boolean` | — | Whether redo is available |
| `onUndo` | `() => void` | — | Undo click handler |
| `onRedo` | `() => void` | — | Redo click handler |

---

### LevelSelector

Grid or list of selectable levels for campaign or classic mode.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `levels` | `ReadonlyArray<LevelConfig>` | — | Available levels with lock/completion state |
| `onSelect` | `(levelId: string) => void` | — | Handler when a level is selected |

> [!NOTE]
> Placeholder — the full `LevelConfig` type and detailed level selector design will be defined during implementation.

---

### SettingsPanel

Panel containing all game settings toggles and selectors.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `settings` | `GameSettings` | — | Current settings object |
| `onUpdate` | `(patch: Partial<GameSettings>) => void` | — | Handler for settings changes |

> [!NOTE]
> Placeholder — individual setting controls (sound toggle, theme picker, etc.) will be documented during implementation.
