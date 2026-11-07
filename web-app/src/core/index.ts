/**
 * N-Queens Game — Core Logic
 *
 * This module contains all game logic as pure TypeScript functions.
 * It has ZERO dependencies on React, Next.js, or browser APIs.
 *
 * This enables:
 * - Easy unit testing
 * - Code sharing with React Native (Phase 2)
 * - Server-side validation (Phase 3)
 *
 * @module core
 */

export { findConflicts, isSolved, getAttackedCells, isValidPosition } from './validator';
export { solve, countSolutions, generateSolutions, solvePartial } from './solver';
export { calculateScore, calculateStars, buildGameResult } from './scoring';
export { getHint } from './hints';
export { generateDailyPuzzle, createSeededRng } from './puzzle-generator';
export { boardToSolver, solverToBoard, positionToKey, keyToPosition } from './board';
