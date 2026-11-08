/**
 * Custom Vector Crown Logo Component for React Native.
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, {
  Path,
  Rect,
  Circle,
  Ellipse,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Line,
} from 'react-native-svg';

export interface GameLogoProps {
  size?: number;
  style?: ViewStyle;
}

export const GameLogo: React.FC<GameLogoProps> = ({ size = 36, style }) => {
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Svg viewBox="0 0 200 200" width="100%" height="100%">
        <Defs>
          <LinearGradient id="mnLogoGold" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#fff59d" />
            <Stop offset="25%" stopColor="#ffd54f" />
            <Stop offset="60%" stopColor="#f59e0b" />
            <Stop offset="85%" stopColor="#b45309" />
            <Stop offset="100%" stopColor="#78350f" />
          </LinearGradient>

          <LinearGradient id="mnLogoRim" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#92400e" />
            <Stop offset="30%" stopColor="#fde047" />
            <Stop offset="70%" stopColor="#f59e0b" />
            <Stop offset="100%" stopColor="#78350f" />
          </LinearGradient>

          <LinearGradient id="mnLogoVelvet" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#9333ea" />
            <Stop offset="60%" stopColor="#6b21a8" />
            <Stop offset="100%" stopColor="#3b0764" />
          </LinearGradient>

          <RadialGradient id="mnLogoRuby" cx="35%" cy="35%" r="65%">
            <Stop offset="0%" stopColor="#fca5a5" />
            <Stop offset="35%" stopColor="#ef4444" />
            <Stop offset="75%" stopColor="#b91c1c" />
            <Stop offset="100%" stopColor="#450a0a" />
          </RadialGradient>

          <RadialGradient id="mnLogoSapphire" cx="35%" cy="35%" r="65%">
            <Stop offset="0%" stopColor="#bae6fd" />
            <Stop offset="40%" stopColor="#0ea5e9" />
            <Stop offset="80%" stopColor="#0369a1" />
            <Stop offset="100%" stopColor="#082f49" />
          </RadialGradient>

          <RadialGradient id="mnLogoEmerald" cx="35%" cy="35%" r="65%">
            <Stop offset="0%" stopColor="#bbf7d0" />
            <Stop offset="40%" stopColor="#22c55e" />
            <Stop offset="80%" stopColor="#15803d" />
            <Stop offset="100%" stopColor="#052e16" />
          </RadialGradient>
        </Defs>

        {/* Velvet Cushion */}
        <Path
          d="M 45 130 C 45 75, 155 75, 155 130 Z"
          fill="url(#mnLogoVelvet)"
          stroke="#2e1065"
          strokeWidth={5}
        />

        {/* Crown Body */}
        <Path
          d="M 32 142 L 20 62 L 64 96 L 100 36 L 136 96 L 180 62 L 168 142 Z"
          fill="url(#mnLogoGold)"
          stroke="#451a03"
          strokeWidth={7}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Base Band */}
        <Rect
          x={24}
          y={136}
          width={152}
          height={26}
          rx={8}
          fill="url(#mnLogoRim)"
          stroke="#451a03"
          strokeWidth={6}
        />

        {/* Jewels on Peaks */}
        <Circle cx={20} cy={60} r={10} fill="#ffffff" stroke="#78350f" strokeWidth={3.5} />
        <Circle cx={17} cy={57} r={3} fill="#ffffff" />
        <Circle cx={64} cy={94} r={8} fill="url(#mnLogoSapphire)" stroke="#0c4a6e" strokeWidth={3} />
        <Circle cx={100} cy={34} r={12} fill="#ffffff" stroke="#78350f" strokeWidth={4} />
        <Circle cx={96} cy={30} r={4} fill="#ffffff" />
        <Circle cx={136} cy={94} r={8} fill="url(#mnLogoEmerald)" stroke="#064e3b" strokeWidth={3} />
        <Circle cx={180} cy={60} r={10} fill="#ffffff" stroke="#78350f" strokeWidth={3.5} />
        <Circle cx={177} cy={57} r={3} fill="#ffffff" />

        {/* Rim Gemstones */}
        <Ellipse cx={100} cy={149} rx={14} ry={9} fill="url(#mnLogoRuby)" stroke="#450a0a" strokeWidth={3} />
        <Ellipse cx={98} cy={147} rx={5} ry={3} fill="#fecaca" opacity={0.6} />
        <Ellipse cx={60} cy={149} rx={10} ry={7} fill="url(#mnLogoSapphire)" stroke="#082f49" strokeWidth={2.5} />
        <Ellipse cx={140} cy={149} rx={10} ry={7} fill="url(#mnLogoSapphire)" stroke="#082f49" strokeWidth={2.5} />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
