/**
 * Deterministic Puzzle Generator & Seeded PRNG.
 * 
 * Uses Mulberry32 PRNG for deterministic, reproducible daily puzzles and seeded challenges.
 */

import type { Position, DailyPuzzle } from '@/types';
import { solve, generateSolutions } from './solver';

/**
 * Creates a seeded 32-bit PRNG using the Mulberry32 algorithm.
 * Returns a function producing pseudo-random numbers in [0, 1).
 */
export function createSeededRng(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Converts a date string (YYYY-MM-DD) into an integer seed.
 */
export function dateStringToSeed(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Generates a deterministic daily puzzle from a date string (e.g. "2026-11-07").
 * 
 * Strategy:
 * 1. Determine board size based on weekday/seed (typically 6 to 8)
 * 2. Pick a random valid solution using the seeded PRNG
 * 3. Lock K queens (e.g., 2-3 queens) as pre-placed hints
 */
export function generateDailyPuzzle(dateStr: string): DailyPuzzle {
  const seed = dateStringToSeed(dateStr);
  const rng = createSeededRng(seed);

  // Pick board size N between 6 and 8 for a balanced daily challenge
  const sizes = [6, 7, 8];
  const sizeIndex = Math.floor(rng() * sizes.length);
  const n = sizes[sizeIndex];

  // Generate solutions for N
  const solutions = generateSolutions(n, 20);
  const selectedSolution =
    solutions.length > 0
      ? solutions[Math.floor(rng() * solutions.length)]
      : (solve(n) ?? []);

  // Determine how many queens to lock (1 to Math.floor(n / 3))
  const lockCount = Math.max(1, Math.min(3, Math.floor(n / 3)));

  // Shuffle candidate queen indices
  const indices = Array.from({ length: selectedSolution.length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const temp = indices[i];
    indices[i] = indices[j];
    indices[j] = temp;
  }

  const lockedQueens: Position[] = indices
    .slice(0, lockCount)
    .map((idx) => selectedSolution[idx]);

  return {
    date: dateStr,
    seed,
    n,
    lockedQueens,
    difficulty: n <= 6 ? 'easy' : n === 7 ? 'medium' : 'hard',
  };
}
