import React, { useId } from 'react';
import { motion } from 'framer-motion';
import { LudoColor } from '../types';
import { COLOR_THEMES } from '../constants/board';

interface LudoTokenProps {
  color: LudoColor;
  size: number;
  isMovable: boolean;
  isActive?: boolean;
  count?: number;
  onClick?: () => void;
  pixelX?: number;
  pixelY?: number;
  animate?: boolean;
}

const LudoToken: React.FC<LudoTokenProps> = React.memo(({
  color,
  size,
  isMovable,
  isActive = false,
  count = 1,
  onClick,
  pixelX,
  pixelY,
  animate = true,
}) => {
  const uniqueId = useId();
  const theme = COLOR_THEMES[color];
  const gradId = `tok-grad-${uniqueId}`;
  const glossId = `tok-gloss-${uniqueId}`;
  const shadowId = `tok-shadow-${uniqueId}`;
  const ringGradId = `tok-ring-${uniqueId}`;
  const innerShadowId = `tok-inner-${uniqueId}`;

  const tokenContent = (
    <motion.div
      onClick={isMovable ? onClick : undefined}
      animate={
        isMovable
          ? {
              scale: [1, 1.15, 1],
              filter: [
                `drop-shadow(0 0 4px ${theme.glow})`,
                `drop-shadow(0 0 14px ${theme.glow})`,
                `drop-shadow(0 0 4px ${theme.glow})`,
              ],
            }
          : isActive
            ? { filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.5))` }
            : {}
      }
      transition={
        isMovable
          ? { duration: 0.85, repeat: Infinity, ease: 'easeInOut' }
          : {}
      }
      whileTap={isMovable ? { scale: 0.8 } : {}}
      style={{
        cursor: isMovable ? 'pointer' : 'default',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: isMovable ? 50 : 20,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 60 60"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Main body gradient - realistic glossy plastic */}
          <radialGradient id={gradId} cx="35%" cy="28%" r="65%" fx="35%" fy="28%">
            <stop offset="0%" stopColor={theme.light} stopOpacity="1" />
            <stop offset="35%" stopColor={theme.primary} stopOpacity="1" />
            <stop offset="70%" stopColor={theme.secondary} stopOpacity="1" />
            <stop offset="100%" stopColor={theme.dark} stopOpacity="1" />
          </radialGradient>

          {/* Top gloss reflection */}
          <radialGradient id={glossId} cx="40%" cy="25%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.7" />
            <stop offset="40%" stopColor="white" stopOpacity="0.2" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>

          {/* Ring gradient */}
          <linearGradient id={ringGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.light} stopOpacity="0.8" />
            <stop offset="50%" stopColor={theme.primary} stopOpacity="0.4" />
            <stop offset="100%" stopColor={theme.dark} stopOpacity="0.8" />
          </linearGradient>

          {/* Drop shadow */}
          <filter id={shadowId} x="-30%" y="-10%" width="160%" height="160%">
            <feDropShadow
              dx="0" dy="3" stdDeviation="3"
              floodColor={theme.dark} floodOpacity="0.7"
            />
          </filter>

          {/* Inner shadow for depth */}
          <filter id={innerShadowId}>
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
            <feOffset dx="0" dy="1" result="offsetBlur" />
            <feComposite in="SourceGraphic" in2="offsetBlur" operator="over" />
          </filter>
        </defs>

        {/* Pulsing glow ring for movable tokens */}
        {isMovable && (
          <>
            <motion.circle
              cx="30" cy="30" r="27"
              fill="none"
              stroke={theme.primary}
              strokeWidth="2"
              opacity={0.6}
              animate={{
                r: [27, 29, 27],
                opacity: [0.6, 0.2, 0.6],
                strokeWidth: [2, 1, 2],
              }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <motion.circle
              cx="30" cy="30" r="25"
              fill="none"
              stroke={theme.light}
              strokeWidth="1"
              strokeDasharray="4 3"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '30px 30px' }}
            />
          </>
        )}

        {/* Base shadow ellipse */}
        <ellipse
          cx="30" cy="48" rx="14" ry="4"
          fill="rgba(0,0,0,0.35)"
          filter="url(#blur)"
        />

        {/* Token base (wider bottom for 3D pawn look) */}
        <ellipse
          cx="30" cy="42" rx="16" ry="6"
          fill={theme.secondary}
          opacity="0.8"
        />

        {/* Token body - pawn shape */}
        <path
          d={`
            M 16,40
            Q 16,30 20,24
            Q 22,20 24,18
            Q 26,14 30,12
            Q 34,14 36,18
            Q 38,20 40,24
            Q 44,30 44,40
            Q 44,44 30,44
            Q 16,44 16,40
            Z
          `}
          fill={`url(#${gradId})`}
          filter={`url(#${shadowId})`}
          stroke={theme.dark}
          strokeWidth="0.5"
          strokeOpacity="0.3"
        />

        {/* Top sphere (head of pawn) */}
        <circle
          cx="30" cy="18" r="9"
          fill={`url(#${gradId})`}
          stroke={theme.dark}
          strokeWidth="0.5"
          strokeOpacity="0.3"
        />

        {/* Glossy top reflection on sphere */}
        <ellipse
          cx="27" cy="14" rx="5" ry="4"
          fill={`url(#${glossId})`}
        />

        {/* Body gloss reflection */}
        <path
          d={`
            M 20,38
            Q 20,28 24,23
            Q 27,20 30,19
            Q 26,22 24,28
            Q 22,34 22,40
            Z
          `}
          fill="rgba(255,255,255,0.15)"
        />

        {/* Neck ring */}
        <ellipse
          cx="30" cy="24" rx="8" ry="2.5"
          fill="none"
          stroke={`url(#${ringGradId})`}
          strokeWidth="1.5"
        />

        {/* Base ring detail */}
        <ellipse
          cx="30" cy="40" rx="14" ry="4"
          fill="none"
          stroke={`url(#${ringGradId})`}
          strokeWidth="1"
        />

        {/* Tiny highlight dot on head */}
        <circle
          cx="26" cy="14" r="2"
          fill="rgba(255,255,255,0.5)"
        />

        {/* Color indicator dot */}
        <circle
          cx="30" cy="30" r="3.5"
          fill={theme.dark}
          opacity="0.4"
        />
        <circle
          cx="30" cy="30" r="2"
          fill={theme.light}
          opacity="0.6"
        />

        {/* Stack count badge */}
        {count > 1 && (
          <g>
            <circle
              cx="46" cy="12" r="9"
              fill="#0f172a"
              stroke={theme.primary}
              strokeWidth="1.5"
            />
            <text
              x="46" y="16"
              textAnchor="middle"
              fontSize="10"
              fontWeight="900"
              fill={theme.light}
              fontFamily="system-ui"
            >
              {count}
            </text>
          </g>
        )}
      </svg>
    </motion.div>
  );

  // If positioned absolutely on board
  if (pixelX !== undefined && pixelY !== undefined) {
    return (
      <motion.div
        initial={animate ? { x: pixelX - size / 2, y: pixelY - size / 2 } : false}
        animate={{ x: pixelX - size / 2, y: pixelY - size / 2 }}
        transition={animate ? {
          type: 'spring',
          stiffness: 250,
          damping: 22,
          mass: 0.8,
        } : { duration: 0 }}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          zIndex: isMovable ? 50 : 20,
          pointerEvents: isMovable ? 'auto' : 'none',
        }}
      >
        {tokenContent}
      </motion.div>
    );
  }

  return tokenContent;
});

LudoToken.displayName = 'LudoToken';
export default LudoToken;
