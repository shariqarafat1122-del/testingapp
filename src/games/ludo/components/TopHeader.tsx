import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface TopHeaderProps {
  gameId: string;
  prize: number;
  playerName: string;
  isOnline: boolean;
  onLeave: () => void;
}

const TopHeader: React.FC<TopHeaderProps> = React.memo(({
  gameId,
  prize,
  playerName,
  isOnline,
  onLeave,
}) => {
  const [soundOn, setSoundOn] = useState(true);

  const toggleSound = useCallback(() => {
    setSoundOn(prev => !prev);
  }, []);

  return (
    <div
      className="flex items-center gap-2 px-3 py-2.5 rounded-2xl mb-2"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Leave button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onLeave}
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.2)',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="#f87171" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </motion.button>

      {/* Game info */}
      <div className="flex-1 min-w-0 text-center">
        <div className="flex items-center justify-center gap-1.5">
          <span className="text-lg">🎲</span>
          <h1 className="text-white font-black text-sm tracking-wider">
            LUDO ROYALE
          </h1>
        </div>
        <div className="flex items-center justify-center gap-2 mt-0.5">
          <span className="text-slate-600 text-[9px] font-mono">
            #{gameId.slice(0, 8)}
          </span>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-1">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: isOnline ? '#22c55e' : '#ef4444',
                boxShadow: isOnline
                  ? '0 0 6px rgba(34,197,94,0.5)'
                  : '0 0 6px rgba(239,68,68,0.5)',
              }}
            />
            <span className="text-slate-500 text-[9px]">
              {playerName}
            </span>
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Sound toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleSound}
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <span className="text-sm">{soundOn ? '🔊' : '🔇'}</span>
        </motion.button>

        {/* Prize badge */}
        {prize > 0 && (
          <div
            className="px-3 py-1.5 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(251,191,36,0.12), rgba(245,158,11,0.08))',
              border: '1px solid rgba(251,191,36,0.2)',
              boxShadow: '0 2px 8px rgba(251,191,36,0.1)',
            }}
          >
            <p className="text-[9px] text-slate-500 leading-none mb-0.5">Prize</p>
            <p className="text-amber-400 font-black text-sm leading-none">
              ₹{prize}
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

TopHeader.displayName = 'TopHeader';
export default TopHeader;
