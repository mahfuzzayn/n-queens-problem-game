/**
 * Star Rating Display (0-3 Stars).
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GameIcon } from './GameIcon';

export interface StarRatingProps {
  stars: 0 | 1 | 2 | 3;
  size?: 'sm' | 'md' | 'lg';
}

export const StarRating: React.FC<StarRatingProps> = ({ stars, size = 'md' }) => {
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 32 : 22;

  return (
    <View style={styles.container}>
      {[1, 2, 3].map((starIndex) => {
        const isEarned = starIndex <= stars;
        return (
          <View
            key={starIndex}
            style={[
              styles.starWrapper,
              {
                opacity: isEarned ? 1 : 0.25,
                transform: [{ scale: isEarned ? 1.08 : 0.92 }],
              },
            ]}
          >
            <GameIcon
              name="star"
              size={iconSize}
              color={isEarned ? '#facc15' : '#71717a'}
            />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  starWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
});
