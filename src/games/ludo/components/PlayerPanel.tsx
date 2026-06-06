import React from 'react';
import { motion } from 'framer-motion';
import { LudoPlayerState, LudoColor } from '../types';
import { COLOR_THEMES } from '../constants/board';

interface PlayerPanelProps {
  player: LudoPlayerState | null;
  isActive: boolean;
  isMe: boolean;
  diceValue: number | null;
  position: 'left' | 'right';
}

const PlayerPanel: React.FC<PlayerPanelProps> = React.memo(({
  player,
  isActive,
  isMe,
  diceValue,
  position,
}) => {
  const color: LudoColor = player?.color || (position === 'left' ? 'red' : 'green');
  const theme = COLOR_THEMES[color];

  return (
    <motion.div
      animate={
        isActive
          ? {
              boxShadow: [
                `0 0 0 1px ${theme.primary}30, 0 4px 12px ${theme.primary}10`,
                `0 0 0 1px ${theme.primary}50, 0 4px 20px ${theme.primary}30`,
                `0 0 0 1px ${theme.primary}30, 0 4px 12px ${theme.primary}10`,
              ],
            }
          : {
              boxShadow: '0 0 0 1px rgba(255,255,255,0.06)',
            }
      }
      transition={{ duration: 1.8, repeat: isActive ? Infinity : 0 }}
      className="flex-1 flex items-center gap-2.5 px-3 py-3 rounded-2xl overflow-hidden relative"
      style={{
        background: isActive
          ? `linear-gradient(135deg, ${theme.primary}12, ${theme.primary}06)`
          : 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(12px)',
        minWidth: 0,
      }}
    >
      {/* Active indicator line at top */}
      {isActive && (
        <motion.div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{
            background: `linear-gradient(90deg, transparent, ${theme.primary}, transparent)`,
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-base"
          style={{
            background: player
              ? `linear-gradient(135deg, ${theme.primary}30, ${theme.dark}40)`
              : 'rgba(255,255,255,0.05)',
            border: `2px solid ${player ? theme.primary + '60' : 'rgba(255,255,255,0.08)'}`,
            color: player ? theme.light : 'rgba(255,255,255,0.2)',
            boxShadow: isActive ? `0 0 12px ${theme.primary}25` : 'none',
          }}
        >
          {player ? (player.name[0]?.toUpperCase() || '?') : '?'}
        </div>

        {/* Online indicator */}
        {player && (
          <div
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
            style={{
              background: player.isOnline ? '#22c55e' : '#64748b',
              borderColor: '#0a0a1e',
              boxShadow: player.isOnline ? '0 0 6px rgba(34,197,94,0.5)' : 'none',
            }}
          />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          {isActive && (
            <motion.div
              animate={{ opacity: [1, 0.3, 1], scale: [1, 0.8, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: theme.primary }}
            />
          )}
          <span className="text-white font-bold text-xs truncate">
            {player ? (isMe ? 'You' : player.name) : 'Waiting...'}
          </span>
          {isMe && (
            <span
              className="text-[8px] px-1.5 py-0.5 rounded-md font-bold flex-shrink-0"
              style={{
                background: 'rgba(124,58,237,0.15)',
                color: '#a78bfa',
                border: '1px solid rgba(124,58,237,0.2)',
              }}
            >
              YOU
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-1">
          {/* Color badge */}
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
            style={{
              background: theme.primary + '18',
              color: theme.light,
              border: `1px solid ${theme.primary}25`,
            }}
          >
            {color === 'red' ? '🔴' : color === 'green' ? '🟢' : color === 'yellow' ? '🟡' : '🔵'}{' '}
            {color.charAt(0).toUpperCase() + color.slice(1)}
          </span>

          {/* Tokens home indicator */}
          {player && (
            <div className="flex gap-0.5">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: i < player.tokensHome
                      ? theme.primary
                      : 'rgba(255,255,255,0.08)',
                    boxShadow: i < player.tokensHome
                      ? `0 0 4px ${theme.primary}40`
                      : 'none',
                  }}
                  animate={
                    i < player.tokensHome
                      ? { scale: [1, 1.2, 1] }
                      : {}
                  }
                  transition={{ delay: i * 0.1, duration: 2, repeat: Infinity }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mini dice preview */}
      {isActive && diceValue && (
        <div
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
          style={{
            background: diceValue === 6
              ? 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(245,158,11,0.1))'
              : 'rgba(255,255,255,0.06)',
            border: `1px solid ${diceValue === 6 ? 'rgba(251,191,36,0.3)' : 'rgba(255,255,255,0.08)'}`,
            color: diceValue === 6 ? '#fbbf24' : '#94a3b8',
          }}
        >
          {diceValue}
        </div>
      )}
    </motion.div>
  );
});

PlayerPanel.displayName = 'PlayerPanel';
export default PlayerPanel;
