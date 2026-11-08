/**
 * Clean vector game icons using react-native-svg (replacing emojis).
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, {
  Path,
  Rect,
  Circle,
  Line,
  Polyline,
  Polygon,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

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
  | 'star';

export interface GameIconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export const GameIcon: React.FC<GameIconProps> = ({
  name,
  size = 18,
  color = '#ffffff',
  style,
}) => {
  const containerStyle = [styles.container, { width: size, height: size }, style];

  switch (name) {
    case 'calendar':
      return (
        <View style={containerStyle}>
          <Svg viewBox="0 0 24 24" width="100%" height="100%">
            <Rect x="3" y="4" width="18" height="18" rx="3" stroke={color} strokeWidth="2.2" fill="none" />
            <Line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth="2.5" />
            <Line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth="2.5" />
            <Line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth="2" />
            <Circle cx="8" cy="14" r="1.2" fill={color} />
            <Circle cx="12" cy="14" r="1.2" fill={color} />
            <Circle cx="16" cy="14" r="1.2" fill={color} />
            <Circle cx="8" cy="18" r="1.2" fill={color} />
            <Circle cx="12" cy="18" r="1.2" fill={color} />
          </Svg>
        </View>
      );

    case 'settings':
      return (
        <View style={containerStyle}>
          <Svg viewBox="0 0 24 24" width="100%" height="100%">
            <Circle cx="12" cy="12" r="3.2" stroke={color} strokeWidth="2" fill="none" />
            <Path
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
              stroke={color}
              strokeWidth="2"
              fill="none"
            />
          </Svg>
        </View>
      );

    case 'undo':
      return (
        <View style={containerStyle}>
          <Svg viewBox="0 0 24 24" width="100%" height="100%">
            <Path d="M9 14L4 9l5-5" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v1a5.5 5.5 0 0 1-5.5 5.5H11" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </Svg>
        </View>
      );

    case 'redo':
      return (
        <View style={containerStyle}>
          <Svg viewBox="0 0 24 24" width="100%" height="100%">
            <Path d="M15 14l5-5-5-5" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v1A5.5 5.5 0 0 0 9.5 21H13" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </Svg>
        </View>
      );

    case 'hint':
      return (
        <View style={containerStyle}>
          <Svg viewBox="0 0 24 24" width="100%" height="100%">
            <Path
              d="M9 18h6m-4 3h2M12 2a7 7 0 0 0-7 7c0 2.5 1.3 4.7 3.2 6 .5.3.8.8.8 1.4V17c0 .6.4 1 1 1h4c.6 0 1-.4 1-1v-.6c0-.6.3-1.1.8-1.4 1.9-1.3 3.2-3.5 3.2-6a7 7 0 0 0-7-7z"
              stroke={color}
              strokeWidth="2.2"
              fill={color}
              fillOpacity={0.25}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Line x1="12" y1="6" x2="12" y2="10" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </Svg>
        </View>
      );

    case 'adGift':
      return (
        <View style={containerStyle}>
          <Svg viewBox="0 0 24 24" width="100%" height="100%">
            <Rect x="3" y="8" width="18" height="13" rx="2" stroke={color} strokeWidth="2.2" fill="none" />
            <Path d="M12 8v13" stroke={color} strokeWidth="2" />
            <Path d="M3 13h18" stroke={color} strokeWidth="2" />
            <Path d="M7.5 8a2.5 2.5 0 0 1 0-5C9 3 12 8 12 8s3-5 4.5-5a2.5 2.5 0 0 1 0 5" stroke={color} strokeWidth="2" fill="none" />
          </Svg>
        </View>
      );

    case 'reset':
      return (
        <View style={containerStyle}>
          <Svg viewBox="0 0 24 24" width="100%" height="100%">
            <Path d="M3 12a9 9 0 1 0 2.8-6.4L3 8" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Path d="M3 3v5h5" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </Svg>
        </View>
      );

    case 'skull':
      return (
        <View style={containerStyle}>
          <Svg viewBox="0 0 24 24" width="100%" height="100%">
            <Circle cx="12" cy="11" r="7" stroke={color} strokeWidth="2" fill="none" />
            <Path d="M9 18v2h6v-2" stroke={color} strokeWidth="2" fill="none" />
            <Circle cx="9.5" cy="10.5" r="1.5" fill={color} />
            <Circle cx="14.5" cy="10.5" r="1.5" fill={color} />
            <Line x1="12" y1="13" x2="12" y2="15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          </Svg>
        </View>
      );

    case 'coin':
      return (
        <View style={containerStyle}>
          <Svg viewBox="0 0 24 24" width="100%" height="100%">
            <Circle cx="12" cy="12" r="9" stroke="#f59e0b" strokeWidth="2.2" fill="#fbbf24" fillOpacity={0.35} />
            <Circle cx="12" cy="12" r="6" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
            <Path d="M12 8.5v7M10 10.5h3.5a1 1 0 0 1 0 2H10.5a1 1 0 0 0 0 2H14" stroke="#fef08a" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </Svg>
        </View>
      );

    case 'shield':
      return (
        <View style={containerStyle}>
          <Svg viewBox="0 0 24 24" width="100%" height="100%">
            <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={color} strokeWidth="2.2" fill="none" />
            <Path d="M12 6v12" stroke={color} strokeWidth="1.5" opacity={0.6} />
          </Svg>
        </View>
      );

    case 'rock':
      return (
        <View style={containerStyle}>
          <Svg viewBox="0 0 24 24" width="100%" height="100%">
            <Path
              d="M4 18l3-10 6-4 7 4 2 10-6 3H8l-4-3z"
              stroke="#a8a29e"
              strokeWidth="2.2"
              fill="#78716c"
              fillOpacity={0.4}
              strokeLinejoin="round"
            />
            <Path d="M10 8l4 4-2 6" stroke="#e7e5e4" strokeWidth="1.5" opacity={0.6} fill="none" />
          </Svg>
        </View>
      );

    case 'lock':
      return (
        <View style={containerStyle}>
          <Svg viewBox="0 0 24 24" width="100%" height="100%">
            <Rect x="5" y="11" width="14" height="10" rx="2" stroke={color} strokeWidth="2.2" fill={color} fillOpacity={0.25} />
            <Path d="M8 11V7a4 4 0 0 1 8 0v4" stroke={color} strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <Circle cx="12" cy="16" r="1.2" fill={color} />
          </Svg>
        </View>
      );

    case 'trophy':
      return (
        <View style={containerStyle}>
          <Svg viewBox="0 0 24 24" width="100%" height="100%">
            <Path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2m12 6h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" stroke={color} strokeWidth="2" fill="none" />
            <Path d="M6 3h12v7a6 6 0 0 1-12 0V3z" stroke={color} strokeWidth="2.2" fill="#eab308" fillOpacity={0.3} />
            <Path d="M12 16v3m-4 3h8" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </Svg>
        </View>
      );

    case 'swords':
      return (
        <View style={containerStyle}>
          <Svg viewBox="0 0 24 24" width="100%" height="100%">
            <Path d="M14.5 17.5L3 6V3h3l11.5 11.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Path d="M13 19l2 2m-4-4l-2 2" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
            <Path d="M9.5 17.5L21 6V3h-3L6.5 14.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <Path d="M11 19l-2 2m4-4l2 2" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
          </Svg>
        </View>
      );

    case 'check':
      return (
        <View style={containerStyle}>
          <Svg viewBox="0 0 24 24" width="100%" height="100%">
            <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </Svg>
        </View>
      );

    case 'shoetic':
      return (
        <View style={containerStyle}>
          <Svg viewBox="0 0 64 36" width="100%" height="100%">
            <Defs>
              <LinearGradient id="rnShoeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#fbbf24" />
                <Stop offset="60%" stopColor="#d97706" />
                <Stop offset="100%" stopColor="#78350f" />
              </LinearGradient>
            </Defs>
            <Path
              d="M 4 28 C 6 28, 12 28, 16 28 C 24 28, 30 24, 38 18 C 42 15, 48 10, 52 8 C 56 6, 60 8, 60 12 L 58 24 C 58 26, 54 28, 48 28 L 4 28 Z"
              fill="url(#rnShoeGrad)"
              stroke="#f59e0b"
              strokeWidth="2.5"
            />
            <Path d="M 16 28 C 16 32, 28 32, 48 32 L 60 32 L 60 28" fill="#d97706" />
            <Line x1="36" y1="18" x2="42" y2="24" stroke="#ffffff" strokeWidth="2" />
            <Line x1="42" y1="14" x2="48" y2="20" stroke="#ffffff" strokeWidth="2" />
          </Svg>
        </View>
      );

    case 'crown':
      return (
        <View style={containerStyle}>
          <Svg viewBox="0 0 24 24" width="100%" height="100%">
            <Path
              d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"
              stroke={color}
              strokeWidth="2.2"
              strokeLinejoin="round"
              fill={color}
              fillOpacity={0.25}
            />
            <Circle cx="2" cy="4" r="1.2" fill={color} />
            <Circle cx="22" cy="4" r="1.2" fill={color} />
            <Circle cx="12" cy="4" r="1.2" fill={color} />
          </Svg>
        </View>
      );

    case 'clock':
      return (
        <View style={containerStyle}>
          <Svg viewBox="0 0 24 24" width="100%" height="100%">
            <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2.2" fill="none" />
            <Polyline points="12,6 12,12 16,14" stroke={color} strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </Svg>
        </View>
      );

    case 'target':
      return (
        <View style={containerStyle}>
          <Svg viewBox="0 0 24 24" width="100%" height="100%">
            <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" fill="none" />
            <Circle cx="12" cy="12" r="5" stroke={color} strokeWidth="2" fill="none" />
            <Circle cx="12" cy="12" r="1.5" fill={color} />
          </Svg>
        </View>
      );

    case 'sparkles':
      return (
        <View style={containerStyle}>
          <Svg viewBox="0 0 24 24" width="100%" height="100%">
            <Path
              d="M12 2l2.4 5.6L20 10l-5.6 2.4L12 18l-2.4-5.6L4 10l5.6-2.4L12 2z"
              stroke={color}
              strokeWidth="2"
              fill={color}
              fillOpacity={0.3}
              strokeLinejoin="round"
            />
          </Svg>
        </View>
      );

    case 'star':
      return (
        <View style={containerStyle}>
          <Svg viewBox="0 0 24 24" width="100%" height="100%">
            <Polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
              stroke={color}
              strokeWidth="2"
              strokeLinejoin="round"
              fill={color}
            />
          </Svg>
        </View>
      );

    default:
      return null;
  }
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
