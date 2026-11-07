import React from 'react';

export interface StarRatingProps {
  stars: 0 | 1 | 2 | 3;
  size?: 'sm' | 'md' | 'lg';
}

export const StarRating: React.FC<StarRatingProps> = ({ stars, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-lg gap-1',
    md: 'text-2xl gap-2',
    lg: 'text-4xl gap-3',
  }[size];

  return (
    <div className={`flex items-center justify-center ${sizeClasses}`}>
      {[1, 2, 3].map((starNum) => {
        const isFilled = starNum <= stars;
        return (
          <span
            key={starNum}
            className={`transition-all duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] ${
              isFilled ? 'text-yellow-400 scale-110' : 'text-gray-600 scale-95 opacity-50'
            }`}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};
