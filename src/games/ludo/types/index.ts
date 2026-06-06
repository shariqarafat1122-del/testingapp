export type LudoColor = 'red' | 'green' | 'yellow' | 'blue';
export type GamePhase = 'waiting' | 'playing' | 'finished';
export type PlayerSlot = 'player1' | 'player2';

export interface LudoToken {
  id: number;
  position: number;
  isHome: boolean;
  color: LudoColor;
}

export interface LudoPlayerState {
  uid: string;
  name: string;
  photoURL: string;
  color: LudoColor;
  tokens: LudoToken[];
  tokensHome: number;
  isOnline: boolean;
  lastSeen: any;
}

export interface LudoGame {
  id: string;
  status: GamePhase;
  entryFee: number;
  pot: number;
  player1: LudoPlayerState | null;
  player2: LudoPlayerState | null;
  activePlayer: PlayerSlot | null;
  diceValue: number | null;
  diceRolled: boolean;
  lastDiceRollBy: PlayerSlot | null;
  consecutiveSixes: number;
  winnerId: string | null;
  winnerName: string | null;
  createdBy: string;
  createdAt: any;
  updatedAt: any;
  lastActionAt: any;
}

export interface CellCoord {
  row: number;
  col: number;
}

export interface TokenRenderInfo {
  token: LudoToken;
  color: LudoColor;
  pixelX: number;
  pixelY: number;
  isMovable: boolean;
}

export interface BoardDimensions {
  cellSize: number;
  boardSize: number;
  padding: number;
}
