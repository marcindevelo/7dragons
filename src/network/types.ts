import type { BoardPosition, DragonCard, ActionCard, PlacedCard } from '../engine/types';
import type { GameState } from '../engine/types';

// ── Serialization helpers ─────────────────────────────────────────────────────
// GameState.board is a Map — needs to be converted for JSON transport.

export type SerializedBoard = [string, PlacedCard][];

export type SerializedGameState = Omit<GameState, 'board'> & {
  board: SerializedBoard;
};

export function serializeState(state: GameState): SerializedGameState {
  return { ...state, board: Array.from(state.board.entries()) };
}

export function deserializeState(s: SerializedGameState): GameState {
  return { ...s, board: new Map(s.board) };
}

// ── Masked state sent to each client ─────────────────────────────────────────
// Other players' goals and full hands are hidden; deck is replaced by count.

export type MaskedPlayer = {
  id: string;
  name: string;
  hand: (DragonCard | ActionCard)[];  // own: full; others: []
  handCount: number;                   // always accurate
  goalId: string;                      // own: real id; others: 'hidden'
};

export type MaskedGameState = Omit<SerializedGameState, 'deck' | 'players'> & {
  deckCount: number;
  players: MaskedPlayer[];
};

// ── Room / lobby state ────────────────────────────────────────────────────────

export type LobbyPlayer = {
  id: string;
  name: string;
  isHost: boolean;
};

// ── Client → Server messages ─────────────────────────────────────────────────

export type ClientMessage =
  | { type: 'join'; name: string; clientId: string }
  | { type: 'start-game' }
  | { type: 'draw-card' }
  | { type: 'place-card'; cardId: string; pos: BoardPosition; rotation: 0 | 180 }
  | { type: 'play-action'; cardId: string; applyAction: boolean; applySilver: boolean }
  | { type: 'resolve-action'; payload: ResolvePayload }
  | { type: 'draw-instead' }
  | { type: 'restart-game' };

export type ResolvePayload = {
  targetPlayerId?: string;
  targetPosKey?: string;
  toPos?: BoardPosition;
  direction?: 'left' | 'right';
  unusedGoalIndex?: number;
};

// ── Server → Client messages ─────────────────────────────────────────────────

export type ServerMessage =
  | { type: 'joined'; playerId: string; playerIndex: number; roomId: string }
  | { type: 'lobby'; players: LobbyPlayer[] }
  | { type: 'game-state'; state: MaskedGameState; myPlayerIndex: number }
  | { type: 'error'; message: string };
