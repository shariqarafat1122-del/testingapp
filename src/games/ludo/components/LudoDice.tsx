import React, { useId, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LudoDiceProps {
  value: number;
  size?: number;
  rolling?: boolean;
  canRoll?: boolean;
  disabled?: boolean;
  onRoll?: () => void;
}

// Dot positions for each face value
const DOT_LAYOUTS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[30, 30], [70, 70]],
  3: [[30, 30], [50, 50], [70, 70]],
  4: [[30, 30], [70, 30], [30, 70], [70, 70]],
  5: [[30, 30], [70, 30], [50, 50], [30, 70], [70, 70]],
  6: [[30, 26], [70, 26], [30, 50], [70, 50], [30, 74], [70, 74]],
};

const LudoDice: React.FC<LudoDiceProps> = React.memo(({
  value,
  size = 64,
  rolling = false,
  canRoll = false,
  disabled = false,
  onRoll,
}) => {
  const uniqueId = useId();
  const dots = DOT_LAYOUTS[value] || DOT_LAYOUTS[1];
  const isGolden = value === 6;

  const handleClick = useCallback(() => {
    if (canRoll && !rolling && !disabled && onRoll) {
      onRoll();
    }
  }, [canRoll, rolling, disabled, onRoll]);

  const faceGradId = `dice-face-${uniqueId}`;
  const dotGradId = `dice-dot-${uniqueId}`;
  const shadowFilterId = `dice-shadow-${uniqueId}`;
  const innerGlowId = `dice-glow-${uniqueId}`;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Dice container with tap area */}
      <motion.div
        onClick={handleClick}
        animate={
          rolling
            ? {
                rotateX: [0, 360, 720, 1080],
                rotateY: [0, 180, 360, 540],
                rotateZ: [0, 90, 180, 270],
                scale: [1, 1.3, 0.9, 1.15, 1],
                y: [0, -25, 5, -15, 0],
              }
            : canRoll
              ? {
                  scale: [1, 1.06, 1],
                  rotateZ: [0, 2, -2, 0],
                }
              : {}
        }
        transition={
          rolling
            ? { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }
            : canRoll
              ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
              : {}
        }
        whileTap={canRoll ? { scale: 0.85, rotateZ: 15 } : {}}
        style={{
          cursor: canRoll ? 'pointer' : 'default',
          perspective: 800,
          transformStyle: 'preserve-3d',
          filter: canRoll
            ? `drop-shadow(0 0 ${rolling ? 20 : 12}px ${
                isGolden ? 'rgba(251,191,36,0.7)' : 'rgba(255,255,255,0.3)'
              })`
            : 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))',
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          style={{
            filter: rolling ? 'blur(0.5px)' : 'none',
            transition: 'filter 0.2s',
          }}
        >
          <defs>
            {/* Face gradient */}
            <linearGradient id={faceGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              {disabled ? (
                <>
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </>
              ) : isGolden ? (
                <>
                  <stop offset="0%" stopColor="#fef9c3" />
                  <stop offset="30%" stopColor="#fde047" />
                  <stop offset="70%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#a16207" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="30%" stopColor="#e2e8f0" />
                  <stop offset="70%" stopColor="#cbd5e1" />
                  <stop offset="100%" stopColor="#94a3b8" />
                </>
              )}
            </linearGradient>

            {/* Dot gradient */}
            <radialGradient id={dotGradId} cx="40%" cy="35%" r="60%">
              {disabled ? (
                <>
                  <stop offset="0%" stopColor="#475569" />
                  <stop offset="100%" stopColor="#1e293b" />
                </>
              ) : isGolden ? (
                <>
                  <stop offset="0%" stopColor="#92400e" />
                  <stop offset="100%" stopColor="#451a03" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#334155" />
                  <stop offset="100%" stopColor="#0f172a" />
                </>
              )}
            </radialGradient>

            {/* Shadow filter */}
            <filter id={shadowFilterId} x="-20%" y="-10%" width="140%" height="150%">
              <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#000" floodOpacity="0.5" />
            </filter>

            {/* Inner glow for golden */}
            {isGolden && (
              <filter id={innerGlowId}>
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
                <feColorMatrix type="matrix"
                  values="0 0 0 0 0.92
                          0 0 0 0 0.7
                          0 0 0 0 0.05
                          0 0 0 0.3 0" />
              </filter>
            )}
          </defs>

          {/* 3D side faces (visible edges for depth) */}
          {/* Right side */}
          <path
            d="M 90,14 L 96,20 L 96,88 L 90,94 L 90,14 Z"
            fill={disabled ? '#0a0f1a' : isGolden ? '#92400e' : '#64748b'}
            opacity="0.6"
          />
          {/* Bottom side */}
          <path
            d="M 10,90 L 16,96 L 90,96 L 90,90 L 10,90 Z"
            fill={disabled ? '#060a12' : isGolden ? '#78350f' : '#475569'}
            opacity="0.5"
          />

          {/* Main face */}
          <rect
            x="6" y="6" width="84" height="84" rx="16"
            fill={`url(#${faceGradId})`}
            filter={`url(#${shadowFilterId})`}
          />

          {/* Top highlight shine */}
          <rect
            x="10" y="10" width="76" height="36" rx="12"
            fill="rgba(255,255,255,0.45)"
          />

          {/* Secondary highlight */}
          <rect
            x="14" y="14" width="40" height="20" rx="8"
            fill="rgba(255,255,255,0.2)"
          />

          {/* Edge border */}
          <rect
            x="6" y="6" width="84" height="84" rx="16"
            fill="none"
            stroke={
              disabled
                ? 'rgba(71,85,105,0.3)'
                : isGolden
                  ? 'rgba(161,98,7,0.5)'
                  : 'rgba(148,163,184,0.4)'
            }
            strokeWidth="1.5"
          />

          {/* Bottom edge shadow */}
          <rect
            x="6" y="68" width="84" height="22" rx="10"
            fill="rgba(0,0,0,0.1)"
          />

          {/* Inner golden glow */}
          {isGolden && !disabled && (
            <rect
              x="12" y="12" width="72" height="72" rx="12"
              fill="none"
              stroke="rgba(251,191,36,0.3)"
              strokeWidth="2"
              filter={`url(#${innerGlowId})`}
            />
          )}

          {/* Dots */}
          {dots.map(([cx, cy], i) => (
            <g key={i}>
              {/* Dot indentation */}
              <circle
                cx={cx} cy={cy} r="9.5"
                fill="rgba(0,0,0,0.08)"
              />
              {/* Main dot */}
              <circle
                cx={cx} cy={cy} r="8"
                fill={`url(#${dotGradId})`}
              />
              {/* Dot highlight */}
              <circle
                cx={cx - 2.5} cy={cy - 2.5} r="3.5"
                fill="rgba(255,255,255,0.35)"
              />
              {/* Dot micro shine */}
              <circle
                cx={cx - 1} cy={cy - 1} r="1.5"
                fill="rgba(255,255,255,0.2)"
              />
            </g>
          ))}
        </svg>
      </motion.div>

      {/* Roll button */}
      <AnimatePresence>
        {canRoll && !rolling && (
          <motion.button
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.9 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleClick}
            className="px-6 py-2.5 rounded-2xl font-black text-sm text-white relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706, #b45309)',
              boxShadow: '0 4px 20px rgba(245,158,11,0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
              border: '1px solid rgba(251,191,36,0.3)',
            }}
          >
            {/* Shimmer effect */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                animation: 'shimmer 2s infinite',
              }}
            />
            <span className="relative z-10">🎲 Roll Dice</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Rolling text */}
      <AnimatePresence>
        {rolling && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="text-amber-400 text-xs font-bold"
          >
            Rolling...
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

LudoDice.displayName = 'LudoDice';
export default LudoDice;
