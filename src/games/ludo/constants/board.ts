import { CellCoord, LudoColor } from '../types';

// ─── 15×15 Grid Constants ─────────────────────────────────────────────────────

export const GRID_SIZE = 15;
export const TOTAL_TRACK_CELLS = 52;

// Main track: 52 cells going clockwise, starting from Red's entry
// Each entry is [row, col] on the 15×15 grid
export const TRACK_CELLS: CellCoord[] = [
  // Red side - top-left going right (cells 0-5)
  { row: 6, col: 1 }, { row: 6, col: 2 }, { row: 6, col: 3 },
  { row: 6, col: 4 }, { row: 6, col: 5 },
  // Going up (cells 5-10)
  { row: 5, col: 6 }, { row: 4, col: 6 }, { row: 3, col: 6 },
  { row: 2, col: 6 }, { row: 1, col: 6 }, { row: 0, col: 6 },
  // Top middle crossing right (cell 11-12)
  { row: 0, col: 7 }, { row: 0, col: 8 },
  // Green side - going down (cells 13-17)
  { row: 1, col: 8 }, { row: 2, col: 8 }, { row: 3, col: 8 },
  { row: 4, col: 8 }, { row: 5, col: 8 },
  // Going right (cells 18-23)
  { row: 6, col: 9 }, { row: 6, col: 10 }, { row: 6, col: 11 },
  { row: 6, col: 12 }, { row: 6, col: 13 }, { row: 6, col: 14 },
  // Right middle crossing down (cell 24-25)
  { row: 7, col: 14 }, { row: 8, col: 14 },
  // Yellow side - going left (cells 26-30)
  { row: 8, col: 13 }, { row: 8, col: 12 }, { row: 8, col: 11 },
  { row: 8, col: 10 }, { row: 8, col: 9 },
  // Going down (cells 31-36)
  { row: 9, col: 8 }, { row: 10, col: 8 }, { row: 11, col: 8 },
  { row: 12, col: 8 }, { row: 13, col: 8 }, { row: 14, col: 8 },
  // Bottom middle crossing left (cell 37-38)
  { row: 14, col: 7 }, { row: 14, col: 6 },
  // Blue side - going up (cells 39-43)
  { row: 13, col: 6 }, { row: 12, col: 6 }, { row: 11, col: 6 },
  { row: 10, col: 6 }, { row: 9, col: 6 },
  // Going left (cells 44-49)
  { row: 8, col: 5 }, { row: 8, col: 4 }, { row: 8, col: 3 },
  { row: 8, col: 2 }, { row: 8, col: 1 }, { row: 8, col: 0 },
  // Left middle crossing up (cell 50-51)
  { row: 7, col: 0 }, { row: 6, col: 0 },
];

// Home column paths (the colored paths leading to center)
export const HOME_PATHS: Record<LudoColor, CellCoord[]> = {
  red: [
    { row: 7, col: 1 }, { row: 7, col: 2 }, { row: 7, col: 3 },
    { row: 7, col: 4 }, { row: 7, col: 5 }, { row: 7, col: 6 },
  ],
  green: [
    { row: 1, col: 7 }, { row: 2, col: 7 }, { row: 3, col: 7 },
    { row: 4, col: 7 }, { row: 5, col: 7 }, { row: 6, col: 7 },
  ],
  yellow: [
    { row: 7, col: 13 }, { row: 7, col: 12 }, { row: 7, col: 11 },
    { row: 7, col: 10 }, { row: 7, col: 9 }, { row: 7, col: 8 },
  ],
  blue: [
    { row: 13, col: 7 }, { row: 12, col: 7 }, { row: 11, col: 7 },
    { row: 10, col: 7 }, { row: 9, col: 7 }, { row: 8, col: 7 },
  ],
};

// Base (yard) token positions for each color
export const BASE_POSITIONS: Record<LudoColor, CellCoord[]> = {
  red: [
    { row: 2, col: 2 }, { row: 2, col: 4 },
    { row: 4, col: 2 }, { row: 4, col: 4 },
  ],
  green: [
    { row: 2, col: 10 }, { row: 2, col: 12 },
    { row: 4, col: 10 }, { row: 4, col: 12 },
  ],
  yellow: [
    { row: 10, col: 10 }, { row: 10, col: 12 },
    { row: 12, col: 10 }, { row: 12, col: 12 },
  ],
  blue: [
    { row: 10, col: 2 }, { row: 10, col: 4 },
    { row: 12, col: 2 }, { row: 12, col: 4 },
  ],
};

// Track start positions (where tokens enter the main track)
export const TRACK_START: Record<LudoColor, number> = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39,
};

// Safe positions on the track (star cells)
export const SAFE_POSITIONS = new Set([0, 8, 13, 21, 26, 34, 39, 47]);

// Star cell positions for visual markers
export const STAR_CELLS: CellCoord[] = [
  TRACK_CELLS[0],  TRACK_CELLS[8],
  TRACK_CELLS[13], TRACK_CELLS[21],
  TRACK_CELLS[26], TRACK_CELLS[34],
  TRACK_CELLS[39], TRACK_CELLS[47],
];

// Color start markers (colored star on entry)
export const COLOR_START_CELLS: Record<LudoColor, CellCoord> = {
  red: TRACK_CELLS[0],
  green: TRACK_CELLS[13],
  yellow: TRACK_CELLS[26],
  blue: TRACK_CELLS[39],
};

// Yard boundaries (for drawing the colored quadrants)
export const YARD_BOUNDS: Record<LudoColor, { x: number; y: number; w: number; h: number }> = {
  red:    { x: 0, y: 0, w: 6, h: 6 },
  green:  { x: 9, y: 0, w: 6, h: 6 },
  yellow: { x: 9, y: 9, w: 6, h: 6 },
  blue:   { x: 0, y: 9, w: 6, h: 6 },
};

// Color themes
export const COLOR_THEMES: Record<LudoColor, {
  primary: string;
  secondary: string;
  light: string;
  dark: string;
  glow: string;
  gradient: [string, string, string];
  bg: string;
  bgLight: string;
}> = {
  red: {
    primary: '#EF4444',
    secondary: '#DC2626',
    light: '#FCA5A5',
    dark: '#7F1D1D',
    glow: 'rgba(239,68,68,0.6)',
    gradient: ['#FCA5A5', '#EF4444', '#7F1D1D'],
    bg: 'rgba(239,68,68,0.15)',
    bgLight: 'rgba(239,68,68,0.08)',
  },
  green: {
    primary: '#22C55E',
    secondary: '#16A34A',
    light: '#86EFAC',
    dark: '#14532D',
    glow: 'rgba(34,197,94,0.6)',
    gradient: ['#86EFAC', '#22C55E', '#14532D'],
    bg: 'rgba(34,197,94,0.15)',
    bgLight: 'rgba(34,197,94,0.08)',
  },
  yellow: {
    primary: '#EAB308',
    secondary: '#CA8A04',
    light: '#FDE047',
    dark: '#713F12',
    glow: 'rgba(234,179,8,0.6)',
    gradient: ['#FDE047', '#EAB308', '#713F12'],
    bg: 'rgba(234,179,8,0.15)',
    bgLight: 'rgba(234,179,8,0.08)',
  },
  blue: {
    primary: '#3B82F6',
    secondary: '#2563EB',
    light: '#93C5FD',
    dark: '#1E3A5F',
    glow: 'rgba(59,130,246,0.6)',
    gradient: ['#93C5FD', '#3B82F6', '#1E3A5F'],
    bg: 'rgba(59,130,246,0.15)',
    bgLight: 'rgba(59,130,246,0.08)',
  },
};

// Get pixel position from grid coordinates
export function gridToPixel(
  coord: CellCoord,
  cellSize: number,
  padding: number = 0
): { x: number; y: number } {
  return {
    x: padding + coord.col * cellSize + cellSize / 2,
    y: padding + coord.row * cellSize + cellSize / 2,
  };
}

// Get token position on board
export function getTokenPixelPosition(
  token: { position: number; isHome: boolean; color: LudoColor; id: number },
  cellSize: number,
  padding: number = 0
): { x: number; y: number } | null {
  // Base position
  if (token.position === -1) {
    const baseSlot = BASE_POSITIONS[token.color][token.id];
    if (!baseSlot) return null;
    return gridToPixel(baseSlot, cellSize, padding);
  }

  // Home (finished)
  if (token.isHome || token.position >= 57) {
    return gridToPixel({ row: 7, col: 7 }, cellSize, padding);
  }

  // Home column (52-56)
  if (token.position >= 52) {
    const homeIdx = token.position - 52;
    const path = HOME_PATHS[token.color];
    const coord = path[Math.min(homeIdx, path.length - 1)];
    if (!coord) return null;
    return gridToPixel(coord, cellSize, padding);
  }

  // Main track (0-51)
  const absPosition = (TRACK_START[token.color] + token.position) % 52;
  const coord = TRACK_CELLS[absPosition];
  if (!coord) return null;
  return gridToPixel(coord, cellSize, padding);
}
