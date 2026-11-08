'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameLogo } from '../ui/GameLogo';

export interface SplashScreenProps {
  onFinish?: () => void;
  minDurationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  minDurationMs = 1100,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / minDurationMs) * 100));
      setProgress(pct);

      if (elapsed >= minDurationMs) {
        clearInterval(interval);
        setTimeout(() => {
          setIsVisible(false);
          onFinishRef.current?.();
        }, 120);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [minDurationMs]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#160c2b] select-none overflow-hidden"
        >
          {/* Ambient Lighting Circles */}
          <div className="absolute w-[500px] h-[500px] rounded-full bg-purple-900/20 blur-3xl pointer-events-none" />
          <div className="absolute w-[260px] h-[260px] rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

          {/* Logo with bounce & glow */}
          <motion.div
            initial={{ scale: 0.6, y: 20 }}
            animate={{ scale: [1, 1.06, 1], y: [0, -6, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative mb-6"
          >
            <GameLogo size={108} />
          </motion.div>

          {/* Game Title with Cartoon Fantasy Bevel */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-amber-400 to-amber-600 tracking-wider drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)]"
          >
            N-QUEENS
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-xs uppercase font-extrabold tracking-widest text-purple-300 mt-1 mb-8"
          >
            Tactical Chess Puzzle
          </motion.p>

          {/* Progress Bar Container */}
          <motion.div
            initial={{ opacity: 0, width: '60%' }}
            animate={{ opacity: 1, width: '240px' }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-full h-4 bg-[#100720] border-2 border-[#45237e] rounded-full overflow-hidden p-0.5 shadow-inner relative">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-yellow-300 rounded-full relative overflow-hidden transition-all duration-75"
                style={{ width: `${progress}%` }}
              >
                {/* Glossy Top Shimmer */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/40 rounded-full" />
              </div>
            </div>

            <div className="flex justify-between w-full text-[11px] font-extrabold text-purple-300/80 uppercase tracking-wider px-1">
              <span>Summoning Queens...</span>
              <span className="text-amber-400">{progress}%</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
