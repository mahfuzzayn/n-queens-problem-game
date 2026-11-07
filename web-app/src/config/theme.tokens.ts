/**
 * Design tokens that mirror CSS variables in styles/tokens.css.
 * Used in TypeScript when CSS variables aren't accessible (e.g., canvas, SVG generation).
 */
export const THEME_TOKENS = {
  colors: {
    // Backgrounds
    bgPrimary: '#1a1040',      // Deep royal purple
    bgSecondary: '#2d1b69',    // Lighter purple
    bgTertiary: '#3d2b7a',     // Panel background
    bgSurface: '#4a3a8a',      // Card/surface background

    // Board
    boardLight: '#e8d5b0',     // Light tile (parchment)
    boardDark: '#b8956a',      // Dark tile (wood)
    boardFrame: '#5c3d1e',     // Board frame (dark wood)
    boardFrameHighlight: '#8b6914', // Frame gold accent

    // Actions
    primary: '#4CAF50',        // Green (primary action)
    primaryHover: '#45a049',
    secondary: '#2196F3',      // Blue (info)
    secondaryHover: '#1e88e5',
    danger: '#f44336',         // Red (danger/conflicts)
    dangerHover: '#e53935',
    warning: '#FF9800',        // Orange (hints)
    warningHover: '#f57c00',

    // Rewards
    gold: '#FFD700',           // Gold (rewards, coins)
    goldDark: '#B8860B',       // Dark gold
    goldLight: '#FFF176',      // Light gold shimmer

    // Text
    textPrimary: '#FFFFFF',
    textSecondary: '#c4b5e3',
    textDark: '#1a1040',
    textMuted: '#8b7db5',

    // Status
    success: '#4CAF50',
    error: '#f44336',
    info: '#2196F3',

    // Queen
    queenGold: '#FFD700',
    queenOutline: '#8B6914',
    queenConflict: '#ff4444',

    // UI
    overlay: 'rgba(0, 0, 0, 0.7)',
    shimmer: 'rgba(255, 255, 255, 0.15)',
  },
  fonts: {
    display: "'Lilita One', cursive",
    body: "'Nunito', sans-serif",
  },
  radii: {
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '28px',
    full: '9999px',
  },
  shadows: {
    button: '0 4px 0 0 rgba(0,0,0,0.3)',
    buttonPressed: '0 2px 0 0 rgba(0,0,0,0.3)',
    panel: '0 8px 32px rgba(0,0,0,0.4)',
    glow: '0 0 20px rgba(255,215,0,0.5)',
    text: '2px 2px 0 rgba(0,0,0,0.5)',
  },
  borders: {
    thick: '3px solid',
    medium: '2px solid',
  },
} as const;
