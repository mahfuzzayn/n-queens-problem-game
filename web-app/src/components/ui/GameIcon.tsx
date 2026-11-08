import React from 'react';

export type IconName =
  | 'calendar'
  | 'settings'
  | 'undo'
  | 'redo'
  | 'hint'
  | 'adGift'
  | 'reset'
  | 'skull'
  | 'coin'
  | 'shield'
  | 'rock'
  | 'lock'
  | 'trophy'
  | 'swords'
  | 'check'
  | 'shoetic'
  | 'crown'
  | 'clock'
  | 'target'
  | 'sparkles'
  | 'star'
  | 'sound'
  | 'soundOff'
  | 'vibrate'
  | 'eye'
  | 'fire';

export interface GameIconProps {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
}

export const GameIcon: React.FC<GameIconProps> = ({
  name,
  size = 18,
  color = 'currentColor',
  className = '',
}) => {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: `inline-block select-none shrink-0 ${className}`,
  };

  switch (name) {
    case 'calendar':
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="18" rx="3" strokeWidth="2.2" />
          <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2.5" />
          <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2.5" />
          <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
          <circle cx="8" cy="14" r="1" fill={color} />
          <circle cx="12" cy="14" r="1" fill={color} />
          <circle cx="16" cy="14" r="1" fill={color} />
          <circle cx="8" cy="18" r="1" fill={color} />
          <circle cx="12" cy="18" r="1" fill={color} />
        </svg>
      );

    case 'settings':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="3.2" strokeWidth="2" />
          <path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
            strokeWidth="2"
          />
        </svg>
      );

    case 'undo':
      return (
        <svg {...props}>
          <path d="M9 14L4 9l5-5" strokeWidth="2.5" />
          <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v1a5.5 5.5 0 0 1-5.5 5.5H11" strokeWidth="2.5" />
        </svg>
      );

    case 'redo':
      return (
        <svg {...props}>
          <path d="M15 14l5-5-5-5" strokeWidth="2.5" />
          <path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v1A5.5 5.5 0 0 0 9.5 21H13" strokeWidth="2.5" />
        </svg>
      );

    case 'hint':
      return (
        <svg {...props}>
          <path
            d="M9 18h6m-4 3h2M12 2a7 7 0 0 0-7 7c0 2.5 1.3 4.7 3.2 6 .5.3.8.8.8 1.4V17c0 .6.4 1 1 1h4c.6 0 1-.4 1-1v-.6c0-.6.3-1.1.8-1.4 1.9-1.3 3.2-3.5 3.2-6a7 7 0 0 0-7-7z"
            strokeWidth="2.2"
            fill={color === 'currentColor' ? 'none' : color}
            fillOpacity={0.2}
          />
          <line x1="12" y1="6" x2="12" y2="10" strokeWidth="2" />
        </svg>
      );

    case 'adGift':
      return (
        <svg {...props}>
          <rect x="3" y="8" width="18" height="13" rx="2" strokeWidth="2.2" />
          <path d="M12 8v13" strokeWidth="2" />
          <path d="M3 13h18" strokeWidth="2" />
          <path d="M7.5 8a2.5 2.5 0 0 1 0-5C9 3 12 8 12 8s3-5 4.5-5a2.5 2.5 0 0 1 0 5" strokeWidth="2" />
        </svg>
      );

    case 'reset':
      return (
        <svg {...props}>
          <path d="M3 12a9 9 0 1 0 2.8-6.4L3 8" strokeWidth="2.4" />
          <path d="M3 3v5h5" strokeWidth="2.4" />
        </svg>
      );

    case 'skull':
      return (
        <svg {...props}>
          <circle cx="12" cy="11" r="7" strokeWidth="2" />
          <path d="M9 18v2h6v-2" strokeWidth="2" />
          <circle cx="9.5" cy="10.5" r="1.5" fill={color} />
          <circle cx="14.5" cy="10.5" r="1.5" fill={color} />
          <line x1="12" y1="13" x2="12" y2="15" strokeWidth="1.5" />
        </svg>
      );

    case 'coin':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" strokeWidth="2.2" fill="#fbbf24" fillOpacity={0.25} />
          <circle cx="12" cy="12" r="6" strokeWidth="1.5" />
          <path d="M12 8.5v7M10 10.5h3.5a1 1 0 0 1 0 2H10.5a1 1 0 0 0 0 2H14" strokeWidth="1.8" />
        </svg>
      );

    case 'shield':
      return (
        <svg {...props}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2.2" />
          <path d="M12 6v12" strokeWidth="1.5" opacity="0.6" />
        </svg>
      );

    case 'rock':
      return (
        <svg {...props}>
          <path
            d="M4 18l3-10 6-4 7 4 2 10-6 3H8l-4-3z"
            strokeWidth="2.2"
            fill="#78716c"
            fillOpacity={0.3}
          />
          <path d="M10 8l4 4-2 6" strokeWidth="1.5" opacity="0.5" />
        </svg>
      );

    case 'lock':
      return (
        <svg {...props}>
          <rect x="5" y="11" width="14" height="10" rx="2" strokeWidth="2.2" fill={color} fillOpacity={0.2} />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" strokeWidth="2.2" />
          <circle cx="12" cy="16" r="1" fill={color} />
        </svg>
      );

    case 'trophy':
      return (
        <svg {...props}>
          <path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2m12 6h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" strokeWidth="2" />
          <path d="M6 3h12v7a6 6 0 0 1-12 0V3z" strokeWidth="2.2" fill="#eab308" fillOpacity={0.2} />
          <path d="M12 16v3m-4 3h8" strokeWidth="2.5" />
        </svg>
      );

    case 'swords':
      return (
        <svg {...props}>
          <path d="M14.5 17.5L3 6V3h3l11.5 11.5" strokeWidth="2" />
          <path d="M13 19l2 2m-4-4l-2 2" strokeWidth="2" />
          <path d="M9.5 17.5L21 6V3h-3L6.5 14.5" strokeWidth="2" />
          <path d="M11 19l-2 2m4-4l2 2" strokeWidth="2" />
        </svg>
      );

    case 'check':
      return (
        <svg {...props}>
          <path d="M20 6L9 17l-5-5" strokeWidth="3" />
        </svg>
      );

    case 'shoetic':
      return (
        <svg viewBox="0 0 64 36" width={size * 1.8} height={size} fill="none" className={className}>
          <path
            d="M 4 28 C 6 28, 12 28, 16 28 C 24 28, 30 24, 38 18 C 42 15, 48 10, 52 8 C 56 6, 60 8, 60 12 L 58 24 C 58 26, 54 28, 48 28 L 4 28 Z"
            fill="url(#shoeticGrad)"
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M 16 28 C 16 32, 28 32, 48 32 L 60 32 L 60 28" fill="#d97706" />
          <line x1="36" y1="18" x2="42" y2="24" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          <line x1="42" y1="14" x2="48" y2="20" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          <defs>
            <linearGradient id="shoeticGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="60%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'crown':
      return (
        <svg {...props}>
          <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" strokeWidth="2.2" strokeLinejoin="round" fill={color === 'currentColor' ? 'none' : color} fillOpacity={0.25} />
          <circle cx="2" cy="4" r="1.2" fill={color} />
          <circle cx="22" cy="4" r="1.2" fill={color} />
          <circle cx="12" cy="4" r="1.2" fill={color} />
        </svg>
      );

    case 'clock':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" strokeWidth="2.2" />
          <polyline points="12 6 12 12 16 14" strokeWidth="2.2" />
        </svg>
      );

    case 'target':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" strokeWidth="2" />
          <circle cx="12" cy="12" r="5" strokeWidth="2" />
          <circle cx="12" cy="12" r="1.5" fill={color} />
        </svg>
      );

    case 'sparkles':
      return (
        <svg {...props}>
          <path d="M12 2l2.4 5.6L20 10l-5.6 2.4L12 18l-2.4-5.6L4 10l5.6-2.4L12 2z" strokeWidth="2" fill={color === 'currentColor' ? 'none' : color} fillOpacity={0.3} />
        </svg>
      );

    case 'star':
      return (
        <svg {...props}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeWidth="2" strokeLinejoin="round" fill={color} />
        </svg>
      );

    default:
      return null;
  }
};
