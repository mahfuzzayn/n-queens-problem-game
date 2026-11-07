/**
 * All user-facing strings, centralized for i18n readiness.
 * To add a new language, create a copy of this file and translate all values.
 */
export const STRINGS = {
  // App
  appName: 'N-Queens',
  appTagline: 'The Classic Puzzle Game',

  // Navigation
  play: 'Play',
  campaign: 'Campaign',
  daily: 'Daily Puzzle',
  timeAttack: 'Time Attack',
  practice: 'Practice',
  settings: 'Settings',
  howToPlay: 'How to Play',
  stats: 'Stats & Achievements',
  home: 'Home',
  back: 'Back',

  // Game modes
  modes: {
    classic: 'Classic',
    classicDesc: 'Pick a board size and solve at your own pace.',
    timeAttack: 'Time Attack',
    timeAttackDesc: 'Beat the clock! Timer scales with board size.',
    campaign: 'Campaign',
    campaignDesc: 'A journey through increasingly challenging puzzles.',
    daily: 'Daily Puzzle',
    dailyDesc: 'A new puzzle every day. Build your streak!',
    practice: 'Free Play',
    practiceDesc: 'No timer, no pressure. Just puzzles.',
  },

  // Game HUD
  hud: {
    queens: 'Queens',
    moves: 'Moves',
    time: 'Time',
    score: 'Score',
    hints: 'Hints',
    level: 'Level',
  },

  // Actions
  actions: {
    hint: 'Hint',
    undo: 'Undo',
    redo: 'Redo',
    reset: 'Reset',
    pause: 'Pause',
    resume: 'Resume',
    autoSolve: 'Auto-Solve',
    nextLevel: 'Next Level',
    replay: 'Replay',
    quit: 'Quit',
    confirm: 'Confirm',
    cancel: 'Cancel',
    continue: 'Continue',
  },

  // Results
  results: {
    victory: 'VICTORY!',
    defeat: 'Time\'s Up!',
    newRecord: 'New Record!',
    score: 'Score',
    time: 'Time',
    moves: 'Moves',
    hintsUsed: 'Hints Used',
    stars: 'Stars',
    perfect: 'Perfect!',
  },

  // Hints
  hints: {
    nudge: 'Look at the highlighted queen — it\'s in conflict!',
    safeCell: 'The highlighted cell is safe and leads to a solution.',
    reveal: 'A queen has been placed for you.',
    deadEnd: 'Dead end! Your current layout can\'t be completed. Try undoing.',
    thinking: 'Thinking...',
    noHintsLeft: 'No hints remaining!',
    cooldown: 'Hint cooling down...',
  },

  // Board sizes
  boardSize: {
    tutorial: 'Tutorial',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    expert: 'Expert',
    master: 'Master',
    impossible: 'Impossible!',
    custom: 'Custom',
    solutions: 'solutions',
    noSolution: 'No solution exists!',
  },

  // Settings
  settings_labels: {
    sound: 'Sound Effects',
    music: 'Background Music',
    haptics: 'Haptic Feedback',
    showAttackLines: 'Show Attack Lines',
    showConflicts: 'Show Conflicts',
    reduceMotion: 'Reduce Motion',
    theme: 'Board Theme',
    volume: 'Volume',
    resetProgress: 'Reset All Progress',
    resetConfirm: 'Are you sure? This will delete all your progress, achievements, and settings. This cannot be undone.',
  },

  // Impossible challenge
  impossible: {
    title: 'Impossible Challenge',
    subtitle: 'Can you place {n} queens on a {n}×{n} board?',
    tryIt: 'Try It!',
    proveIt: 'Prove It!',
    explanation: 'It\'s mathematically impossible to place {n} non-attacking queens on a {n}×{n} board. Watch the solver try every possible arrangement!',
    exhausted: 'All {count} arrangements checked — none work!',
  },

  // Tutorial / How to Play
  tutorial: {
    title: 'How to Play',
    step1Title: 'Place Queens',
    step1: 'Tap any cell to place a queen. Tap again to remove it.',
    step2Title: 'No Conflicts',
    step2: 'Queens attack along rows, columns, and diagonals. No two queens can share any of these.',
    step3Title: 'Fill the Board',
    step3: 'Place exactly N queens on an N×N board with zero conflicts to win!',
    step4Title: 'Use Hints',
    step4: 'Stuck? Use hints! They get more specific (and costly) with each tier.',
    gotIt: 'Got It!',
    tryNow: 'Try It Now!',
  },

  // Stats
  stats_labels: {
    gamesPlayed: 'Games Played',
    gamesWon: 'Games Won',
    winRate: 'Win Rate',
    bestTime: 'Best Time',
    currentStreak: 'Current Streak',
    longestStreak: 'Longest Streak',
    totalStars: 'Total Stars',
    playerLevel: 'Player Level',
    totalXP: 'Total XP',
    totalCoins: 'Total Coins',
  },

  // Achievements
  achievements: {
    title: 'Achievements',
    unlocked: 'Unlocked!',
    locked: 'Locked',
    progress: '{current}/{total}',
  },

  // Errors
  errors: {
    solverTimeout: 'The solver took too long. Try a smaller board size.',
    storageFull: 'Storage is full. Some progress may not be saved.',
    storageUnavailable: 'Storage is unavailable. Progress won\'t be saved.',
    generic: 'Something went wrong. Please try again.',
  },

  // Misc
  difficulty: {
    1: 'Tutorial',
    2: 'Impossible',
    3: 'Impossible',
    4: 'Easy',
    5: 'Easy',
    6: 'Medium',
    7: 'Medium',
    8: 'Medium',
    9: 'Hard',
    10: 'Hard',
    11: 'Expert',
    12: 'Expert',
    13: 'Master',
    14: 'Master',
    15: 'Master',
    16: 'Master',
  } as Record<number, string>,
} as const;
