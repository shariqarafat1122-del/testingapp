import React, { useMemo, useId } from 'react';
import { motion } from 'framer-motion';
import { LudoGame, LudoToken as LudoTokenType, LudoColor } from '../types';
import {
  GRID_SIZE, TRACK_CELLS, HOME_PATHS, BASE_POSITIONS,
  YARD_BOUNDS, COLOR_THEMES, SAFE_POSITIONS, STAR_CELLS,
  COLOR_START_CELLS, getTokenPixelPosition, TRACK_START,
} from '../constants/board';
import LudoToken from './LudoToken';

interface LudoBoardProps {
  game: LudoGame;
  myColor: LudoColor | null;
  movableIds: number[];
  boardSize: number;
  onTokenClick: (color: LudoColor, tokenId: number) => void;
}

const LudoBoard: React.FC<LudoBoardProps> = React.memo(({
  game,
  myColor,
  movableIds,
  boardSize,
  onTokenClick,
}) => {
  const uniqueId = useId();
  const cs = boardSize / GRID_SIZE; // cell size
  const padding = 0;

  // ─── Build token render list ──────────────────────────────────────────
  const tokenRenders = useMemo(() => {
    const renders: Array<{
      token: LudoTokenType;
      color: LudoColor;
      x: number;
      y: number;
      isMovable: boolean;
      key: string;
    }> = [];

    const processPlayer = (player: typeof game.player1, color: LudoColor) => {
      if (!player) return;
      player.tokens.forEach((token) => {
        const pos = getTokenPixelPosition(
          { ...token, color },
          cs,
          padding
        );
        if (!pos) return;

        renders.push({
          token,
          color,
          x: pos.x,
          y: pos.y,
          isMovable: myColor === color && movableIds.includes(token.id),
          key: `${color}-${token.id}`,
        });
      });
    };

    processPlayer(game.player1, game.player1?.color || 'red');
    processPlayer(game.player2, game.player2?.color || 'green');

    return renders;
  }, [game.player1, game.player2, myColor, movableIds, cs]);

  // ─── SVG Definitions ─────────────────────────────────────────────────
  const yardGradients = useMemo(() => {
    return (['red', 'green', 'yellow', 'blue'] as LudoColor[]).map((color) => {
      const t = COLOR_THEMES[color];
      return { color, primary: t.primary, light: t.light, dark: t.dark, bg: t.bg };
    });
  }, []);

  return (
    <div
      style={{
        width: boardSize,
        height: boardSize,
        position: 'relative',
        borderRadius: 16,
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* SVG Board */}
      <svg
        width={boardSize}
        height={boardSize}
        viewBox={`0 0 ${boardSize} ${boardSize}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          borderRadius: 16,
        }}
      >
        <defs>
          {/* Board background gradient */}
          <radialGradient id={`board-bg-${uniqueId}`} cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#141428" />
            <stop offset="60%" stopColor="#0c0c1e" />
            <stop offset="100%" stopColor="#080816" />
          </radialGradient>

          {/* Yard gradients */}
          {yardGradients.map(({ color, primary, light, dark }) => (
            <React.Fragment key={color}>
              <linearGradient
                id={`yard-${color}-${uniqueId}`}
                x1="0%" y1="0%"
                x2="100%" y2="100%"
              >
                <stop offset="0%" stopColor={primary} stopOpacity="0.2" />
                <stop offset="50%" stopColor={primary} stopOpacity="0.1" />
                <stop offset="100%" stopColor={dark} stopOpacity="0.15" />
              </linearGradient>
              <radialGradient
                id={`yard-inner-${color}-${uniqueId}`}
                cx="50%" cy="50%" r="45%"
              >
                <stop offset="0%" stopColor={primary} stopOpacity="0.12" />
                <stop offset="100%" stopColor={dark} stopOpacity="0.06" />
              </radialGradient>
              {/* Home path gradient */}
              <linearGradient
                id={`home-${color}-${uniqueId}`}
                x1="0%" y1="0%"
                x2="100%" y2="0%"
              >
                <stop offset="0%" stopColor={primary} stopOpacity="0.35" />
                <stop offset="100%" stopColor={primary} stopOpacity="0.15" />
              </linearGradient>
            </React.Fragment>
          ))}

          {/* Center glow */}
          <radialGradient id={`center-glow-${uniqueId}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(251,191,36,0.25)" />
            <stop offset="40%" stopColor="rgba(251,191,36,0.1)" />
            <stop offset="100%" stopColor="rgba(251,191,36,0)" />
          </radialGradient>

          {/* Star glow filter */}
          <filter id={`star-glow-${uniqueId}`}>
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Cell inner shadow */}
          <filter id={`cell-shadow-${uniqueId}`}>
            <feDropShadow dx="0" dy="0.5" stdDeviation="0.5"
              floodColor="#000" floodOpacity="0.15" />
          </filter>

          {/* Board outer shadow */}
          <filter id={`board-shadow-${uniqueId}`} x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="0" dy="8" stdDeviation="20"
              floodColor="#000" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* ─── Board Background ──────────────────────────────────── */}
        <rect
          x="0" y="0"
          width={boardSize} height={boardSize}
          rx="16"
          fill={`url(#board-bg-${uniqueId})`}
          filter={`url(#board-shadow-${uniqueId})`}
        />

        {/* Board border */}
        <rect
          x="1" y="1"
          width={boardSize - 2} height={boardSize - 2}
          rx="15"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1.5"
        />

        {/* ─── Colored Yards (4 quadrants) ───────────────────────── */}
        {(['red', 'green', 'yellow', 'blue'] as LudoColor[]).map((color) => {
          const yard = YARD_BOUNDS[color];
          const t = COLOR_THEMES[color];
          const x = yard.x * cs;
          const y = yard.y * cs;
          const w = yard.w * cs;
          const h = yard.h * cs;
          const innerPad = cs * 0.6;

          return (
            <g key={`yard-${color}`}>
              {/* Outer yard bg */}
              <rect
                x={x + 2} y={y + 2}
                width={w - 4} height={h - 4}
                rx="12"
                fill={`url(#yard-${color}-${uniqueId})`}
                stroke={t.primary}
                strokeWidth="1.5"
                strokeOpacity="0.25"
              />

              {/* Inner yard circle area */}
              <rect
                x={x + innerPad} y={y + innerPad}
                width={w - innerPad * 2} height={h - innerPad * 2}
                rx="10"
                fill={`url(#yard-inner-${color}-${uniqueId})`}
                stroke={t.primary}
                strokeWidth="1"
                strokeOpacity="0.2"
              />

              {/* Base slot circles */}
              {BASE_POSITIONS[color].map((pos, idx) => {
                const cx = pos.col * cs + cs / 2;
                const cy = pos.row * cs + cs / 2;
                const hasToken = color === 'red'
                  ? game.player1?.tokens.some(tk => tk.id === idx && tk.position === -1)
                  : color === 'green'
                    ? game.player2?.tokens.some(tk => tk.id === idx && tk.position === -1)
                    : false;

                return (
                  <g key={`base-${color}-${idx}`}>
                    {/* Slot ring */}
                    <circle
                      cx={cx} cy={cy}
                      r={cs * 0.32}
                      fill={hasToken ? 'transparent' : 'rgba(0,0,0,0.3)'}
                      stroke={t.primary}
                      strokeWidth="1.5"
                      strokeOpacity={hasToken ? 0 : 0.3}
                      strokeDasharray={hasToken ? 'none' : '3 2'}
                    />
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* ─── Track Cells ───────────────────────────────────────── */}
        {TRACK_CELLS.map((cell, idx) => {
          const x = cell.col * cs;
          const y = cell.row * cs;
          const isSafe = SAFE_POSITIONS.has(idx);

          // Determine cell color based on which color's start it is
          let cellColor: string = 'rgba(255,255,255,0.04)';
          let cellBorder: string = 'rgba(255,255,255,0.06)';

          // Color the start cells
          for (const [col, startIdx] of Object.entries({
            red: 0, green: 13, yellow: 26, blue: 39,
          })) {
            if (idx === startIdx) {
              const ct = COLOR_THEMES[col as LudoColor];
              cellColor = ct.bg;
              cellBorder = ct.primary + '40';
            }
          }

          if (isSafe && !Object.values({ red: 0, green: 13, yellow: 26, blue: 39 }).includes(idx)) {
            cellColor = 'rgba(251,191,36,0.08)';
            cellBorder = 'rgba(251,191,36,0.15)';
          }

          return (
            <g key={`track-${idx}`}>
              <rect
                x={x + 0.5} y={y + 0.5}
                width={cs - 1} height={cs - 1}
                rx="3"
                fill={cellColor}
                stroke={cellBorder}
                strokeWidth="0.5"
              />

              {/* Safe star marker */}
              {isSafe && (
                <text
                  x={x + cs / 2}
                  y={y + cs / 2 + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={cs * 0.45}
                  fill="rgba(251,191,36,0.5)"
                  filter={`url(#star-glow-${uniqueId})`}
                  style={{ userSelect: 'none' }}
                >
                  ★
                </text>
              )}

              {/* Colored arrow on start cells */}
              {idx === 0 && (
                <text
                  x={x + cs / 2} y={y + cs / 2}
                  textAnchor="middle" dominantBaseline="central"
                  fontSize={cs * 0.5} fill={COLOR_THEMES.red.primary}
                  opacity="0.7"
                >→</text>
              )}
              {idx === 13 && (
                <text
                  x={x + cs / 2} y={y + cs / 2}
                  textAnchor="middle" dominantBaseline="central"
                  fontSize={cs * 0.5} fill={COLOR_THEMES.green.primary}
                  opacity="0.7"
                >↓</text>
              )}
              {idx === 26 && (
                <text
                  x={x + cs / 2} y={y + cs / 2}
                  textAnchor="middle" dominantBaseline="central"
                  fontSize={cs * 0.5} fill={COLOR_THEMES.yellow.primary}
                  opacity="0.7"
                >←</text>
              )}
              {idx === 39 && (
                <text
                  x={x + cs / 2} y={y + cs / 2}
                  textAnchor="middle" dominantBaseline="central"
                  fontSize={cs * 0.5} fill={COLOR_THEMES.blue.primary}
                  opacity="0.7"
                >↑</text>
              )}
            </g>
          );
        })}

        {/* ─── Home Column Paths ──────────────────────────────────── */}
        {(['red', 'green', 'yellow', 'blue'] as LudoColor[]).map((color) => {
          const t = COLOR_THEMES[color];
          return HOME_PATHS[color].map((cell, idx) => {
            const x = cell.col * cs;
            const y = cell.row * cs;

            return (
              <rect
                key={`home-path-${color}-${idx}`}
                x={x + 0.5} y={y + 0.5}
                width={cs - 1} height={cs - 1}
                rx="3"
                fill={t.primary}
                fillOpacity={0.12 + idx * 0.04}
                stroke={t.primary}
                strokeWidth="0.5"
                strokeOpacity="0.25"
              />
            );
          });
        })}

        {/* ─── Center Home (3×3) ──────────────────────────────────── */}
        <g>
          {/* Glow circle */}
          <circle
            cx={7.5 * cs} cy={7.5 * cs}
            r={cs * 1.8}
            fill={`url(#center-glow-${uniqueId})`}
          />

          {/* Center square */}
          <rect
            x={6 * cs} y={6 * cs}
            width={3 * cs} height={3 * cs}
            rx="8"
            fill="rgba(10,10,30,0.9)"
            stroke="rgba(251,191,36,0.2)"
            strokeWidth="1.5"
          />

          {/* Four colored triangles pointing inward */}
          {/* Red (left) */}
          <polygon
            points={`
              ${6 * cs},${6 * cs}
              ${7.5 * cs},${7.5 * cs}
              ${6 * cs},${9 * cs}
            `}
            fill={COLOR_THEMES.red.primary}
            fillOpacity="0.25"
            stroke={COLOR_THEMES.red.primary}
            strokeWidth="0.5"
            strokeOpacity="0.3"
          />
          {/* Green (top) */}
          <polygon
            points={`
              ${6 * cs},${6 * cs}
              ${7.5 * cs},${7.5 * cs}
              ${9 * cs},${6 * cs}
            `}
            fill={COLOR_THEMES.green.primary}
            fillOpacity="0.25"
            stroke={COLOR_THEMES.green.primary}
            strokeWidth="0.5"
            strokeOpacity="0.3"
          />
          {/* Yellow (right) */}
          <polygon
            points={`
              ${9 * cs},${6 * cs}
              ${7.5 * cs},${7.5 * cs}
              ${9 * cs},${9 * cs}
            `}
            fill={COLOR_THEMES.yellow.primary}
            fillOpacity="0.25"
            stroke={COLOR_THEMES.yellow.primary}
            strokeWidth="0.5"
            strokeOpacity="0.3"
          />
          {/* Blue (bottom) */}
          <polygon
            points={`
              ${6 * cs},${9 * cs}
              ${7.5 * cs},${7.5 * cs}
              ${9 * cs},${9 * cs}
            `}
            fill={COLOR_THEMES.blue.primary}
            fillOpacity="0.25"
            stroke={COLOR_THEMES.blue.primary}
            strokeWidth="0.5"
            strokeOpacity="0.3"
          />

          {/* Center golden star */}
          <g transform={`translate(${7.5 * cs}, ${7.5 * cs})`}>
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            >
              {/* Star shape */}
              <polygon
                points="0,-18 5,-7 17,-6 8,3 10,15 0,9 -10,15 -8,3 -17,-6 -5,-7"
                fill="rgba(251,191,36,0.15)"
                stroke="rgba(251,191,36,0.3)"
                strokeWidth="0.8"
              />
            </motion.g>

            {/* Home icon */}
            <text
              x="0" y="2"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="14"
              fill="rgba(251,191,36,0.4)"
              style={{ userSelect: 'none' }}
            >
              🏠
            </text>
          </g>

          {/* Pulsing ring */}
          <motion.circle
            cx={7.5 * cs} cy={7.5 * cs}
            r={cs * 1.2}
            fill="none"
            stroke="rgba(251,191,36,0.15)"
            strokeWidth="1"
            animate={{
              r: [cs * 1.2, cs * 1.5, cs * 1.2],
              opacity: [0.15, 0.05, 0.15],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </g>

        {/* ─── Track path outline (subtle) ────────────────────────── */}
        {/* We draw thin lines connecting track cells for visual flow */}
        {TRACK_CELLS.map((cell, idx) => {
          const next = TRACK_CELLS[(idx + 1) % TRACK_CELLS.length];
          const x1 = cell.col * cs + cs / 2;
          const y1 = cell.row * cs + cs / 2;
          const x2 = next.col * cs + cs / 2;
          const y2 = next.row * cs + cs / 2;

          return (
            <line
              key={`track-line-${idx}`}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="0.5"
            />
          );
        })}
      </svg>

      {/* ─── Tokens (rendered as HTML overlay for animation) ──── */}
      {tokenRenders.map((tr) => (
        <LudoToken
          key={tr.key}
          color={tr.color}
          size={Math.min(cs * 0.85, 34)}
          isMovable={tr.isMovable}
          pixelX={tr.x}
          pixelY={tr.y}
          animate
          onClick={
            tr.isMovable
              ? () => onTokenClick(tr.color, tr.token.id)
              : undefined
          }
        />
      ))}
    </div>
  );
});

LudoBoard.displayName = 'LudoBoard';
export default LudoBoard;
