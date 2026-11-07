# Overview

> [!NOTE]
> This document describes what the N-Queens Puzzle Game is, its game modes, supported board sizes, and full feature list.

---

## Table of Contents

- [What is N-Queens?](#what-is-n-queens)
- [Game Rules](#game-rules)
- [Game Modes](#game-modes)
  - [Classic Mode](#classic-mode)
  - [Time Attack Mode](#time-attack-mode)
  - [Campaign Mode](#campaign-mode)
  - [Daily Challenge](#daily-challenge)
  - [Practice Mode](#practice-mode)
- [Board Sizes](#board-sizes)
- [Feature List](#feature-list)
- [Screenshots](#screenshots)

---

## What is N-Queens?

The **N-Queens Problem** is a classic combinatorial puzzle originating from the 8-Queens problem posed by chess composer Max Bezzel in 1848. The challenge is to place **N queens** on an **N×N chessboard** such that no two queens threaten each other. This means no two queens may share the same **row**, **column**, or **diagonal**.

The problem is a foundational exercise in constraint satisfaction, backtracking algorithms, and combinatorial optimization. Our game transforms this mathematical puzzle into an engaging, visually rich experience with progression, scoring, and multiple game modes.

---

## Game Rules

1. **Objective:** Place exactly N queens on the N×N board so that no two queens attack each other.
2. **Placement:** Tap/click an empty cell to place a queen. Tap/click an occupied cell to remove it.
3. **Conflict Feedback:** When two or more queens conflict, the conflicting queens and their attack lines are highlighted in real-time.
4. **Win Condition:** All N queens are placed with zero conflicts.
5. **Lose Condition (Time Attack only):** The countdown timer reaches zero before a valid solution is found.
6. **Scoring:** Points are awarded based on board size, time taken, number of hints used, and number of moves made. See [game_logic.md](./game_logic.md) for the full scoring formula.

---

## Game Modes

### Classic Mode

The standard N-Queens experience. The player selects a board size and solves at their own pace with a count-up timer. No time pressure. Stars are awarded based on performance (time, hints, moves).

### Time Attack Mode

A countdown timer adds urgency. The player must solve the puzzle before time runs out. Bonus points are awarded for remaining time. Timer duration scales with board size.

### Campaign Mode

A structured sequence of levels with increasing difficulty. Each level introduces a new board size or constraint. Completing levels unlocks the next one. Stars earned unlock later campaign chapters. Campaign levels may have pre-placed queens that the player cannot move.

### Daily Challenge

A single puzzle generated each day from a **seeded random generator** so every player worldwide gets the same puzzle. Players can compare scores on a local leaderboard (V1) or global leaderboard (V2). A streak counter tracks consecutive days played.

### Practice Mode

An unrestricted sandbox for experimentation. All board sizes are available. Unlimited hints with no scoring penalty. Useful for learning strategies before attempting scored modes.

---

## Board Sizes

The game supports board sizes from **1×1** to **16×16**. Each size has unique characteristics:

| Size | Solutions | Notes |
|------|-----------|-------|
| 1×1 | 1 | Trivial — single queen, instant solve. Tutorial intro. |
| 2×2 | 0 | **Impossible** — no valid placement exists. Used to teach conflict rules. |
| 3×3 | 0 | **Impossible** — no valid placement exists. Used to teach conflict rules. |
| 4×4 | 2 | First non-trivial solvable size. Tutorial level. |
| 5×5 | 10 | Introductory difficulty. |
| 6×6 | 4 | Moderate difficulty. |
| 7×7 | 40 | Moderate difficulty. |
| 8×8 | 92 | The classic 8-Queens problem. |
| 9×9 | 352 | Challenging. |
| 10×10 | 724 | Hard. |
| 11×11 | 2,680 | Hard. |
| 12×12 | 14,200 | Very hard. |
| 13×13 | 73,712 | Expert. |
| 14×14 | 365,596 | Expert. Bitmask solver recommended. |
| 15×15 | 2,279,184 | Master. Bitmask solver required. |
| 16×16 | 14,772,512 | Master. Bitmask solver required. |

> [!IMPORTANT]
> Board sizes 2×2 and 3×3 have **zero** solutions. The game handles these as special "impossible puzzle" levels that teach the player about queen conflicts.

---

## Feature List

- **Core Gameplay:** Place/remove queens, real-time conflict highlighting, win detection
- **Multiple Game Modes:** Classic, Time Attack, Campaign, Daily Challenge, Practice
- **Board Sizes 1–16:** With appropriate handling of edge cases (1, 2, 3)
- **Scoring System:** Points based on board size, time, hints, and moves
- **Star Ratings:** 1–3 stars per level based on performance thresholds
- **Undo/Redo:** Full move history with unlimited undo/redo
- **Hint System:** Tiered hints (highlight a safe row → reveal a queen position) with coin cost
- **Coins & XP Economy:** Earn coins and XP from completing puzzles; spend coins on hints
- **Campaign Progression:** Unlock levels and chapters via star accumulation
- **Daily Challenges:** Seeded puzzles with streak tracking
- **Settings:** Sound toggle, vibration toggle, theme selection, board style
- **Persistence:** Auto-save game state, progress, and settings to local storage
- **Animations:** Framer Motion powered queen placement, conflict shake, win celebration
- **Responsive Design:** Playable on desktop and mobile browsers
- **Accessibility:** Keyboard navigation, ARIA labels, high-contrast support

---

## Screenshots

> [!NOTE]
> Screenshots will be added once the UI is implemented. Planned screenshots include:
>
> - Home screen / mode selection
> - Classic mode gameplay (mid-solve)
> - Conflict highlighting in action
> - Win celebration screen with star rating
> - Campaign level selection map
> - Daily challenge with streak counter
> - Settings panel
> - Hint system in action
