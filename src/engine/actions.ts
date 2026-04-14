import type { GameState, BoardPosition, PlacedCard } from './types';
import { posKey, isBoardConnected, isPlacementValid } from './board';

// Trade Hands: swap hands between two players (goals unchanged)
export function tradeHands(state: GameState, playerId: string, targetPlayerId: string): GameState {
  const players = state.players.map((p) => ({ ...p, hand: [...p.hand] }));
  const playerIdx = players.findIndex((p) => p.id === playerId);
  const targetIdx = players.findIndex((p) => p.id === targetPlayerId);

  if (playerIdx === -1 || targetIdx === -1) {
    throw new Error('Player not found');
  }

  const tempHand = players[playerIdx].hand;
  players[playerIdx] = { ...players[playerIdx], hand: players[targetIdx].hand };
  players[targetIdx] = { ...players[targetIdx], hand: tempHand };

  return { ...state, players };
}

// Trade Goals: swap goal cards between player and target (or unused goal pile by index)
export function tradeGoals(
  state: GameState,
  playerId: string,
  targetPlayerId: string | null, // null = unused goal
  unusedGoalIndex?: number
): GameState {
  const players = state.players.map((p) => ({ ...p }));
  const goals = [...state.goals];

  const playerIdx = players.findIndex((p) => p.id === playerId);
  if (playerIdx === -1) throw new Error('Player not found');

  if (targetPlayerId !== null) {
    // Swap with another player
    const targetIdx = players.findIndex((p) => p.id === targetPlayerId);
    if (targetIdx === -1) throw new Error('Target player not found');

    const tempGoalId = players[playerIdx].goalId;
    players[playerIdx] = { ...players[playerIdx], goalId: players[targetIdx].goalId };
    players[targetIdx] = { ...players[targetIdx], goalId: tempGoalId };
  } else {
    // Swap with an unused goal by its seat index in unusedGoalOrder
    const idx = unusedGoalIndex ?? 0;
    if (idx >= state.unusedGoalOrder.length) throw new Error('Invalid unused goal index');

    const unusedGoalId = state.unusedGoalOrder[idx];
    const playerGoalId = players[playerIdx].goalId;

    // Player gets the chosen unused goal
    players[playerIdx] = { ...players[playerIdx], goalId: unusedGoalId };

    // The player's old goal takes the unused seat
    const unusedGoalOrder = [...state.unusedGoalOrder];
    unusedGoalOrder[idx] = playerGoalId;

    return { ...state, players, goals, unusedGoalOrder };
  }

  return { ...state, players, goals };
}

// Rotate Goals: rotate ALL goals (players + unused) around one ring.
// Ring order: [player0, player1, ..., playerN, unusedSeat0, unusedSeat1, ...]
// "Left" = each seat gets the next seat's goal (ring shifts left by 1).
// "Right" = each seat gets the previous seat's goal (ring shifts right by 1).
export function rotateGoals(state: GameState, direction: 'left' | 'right'): GameState {
  const players = state.players.map((p) => ({ ...p }));
  const { seatOrder } = state;

  // Build ring of goals in seat order: player seat → player's goalId, null seat → next unused goal
  let unusedCursor = 0;
  const ring: string[] = seatOrder.map(seat =>
    seat !== null ? players[seat].goalId : state.unusedGoalOrder[unusedCursor++]
  );

  const n = ring.length;
  const rotated =
    direction === 'left'
      ? [...ring.slice(1), ring[0]]
      : [ring[n - 1], ...ring.slice(0, n - 1)];

  // Assign back using same seat order
  unusedCursor = 0;
  const unusedGoalOrder: string[] = [];
  seatOrder.forEach((seat, i) => {
    if (seat !== null) {
      players[seat] = { ...players[seat], goalId: rotated[i] };
    } else {
      unusedGoalOrder.push(rotated[i]);
    }
  });

  return { ...state, players, unusedGoalOrder };
}

// Move Card: pick up a card from the board, place it at new position
export function moveCard(
  state: GameState,
  fromPosKey: string,
  toPos: BoardPosition,
  toRotation?: 0 | 180
): GameState {
  const placed = state.board.get(fromPosKey);
  if (!placed) throw new Error(`No card at position ${fromPosKey}`);

  const rotation = toRotation ?? placed.rotation;
  const toPosKey = posKey(toPos.x, toPos.y);

  // Special case: moving in place (rotation change only)
  if (fromPosKey === toPosKey) {
    const newBoard = new Map(state.board);
    newBoard.set(fromPosKey, { card: placed.card, pos: toPos, rotation });
    return { ...state, board: newBoard };
  }

  // Create board without the card
  const newBoard = new Map(state.board);
  newBoard.delete(fromPosKey);

  // Check board remains connected after removal
  if (!isBoardConnected(newBoard)) {
    throw new Error('Cannot move card: would disconnect the board');
  }

  // Check placement is valid at new position
  if (!isPlacementValid(newBoard, placed.card, toPos, state.silverDragonColor, rotation)) {
    throw new Error('Invalid placement at target position');
  }

  // Place card at new position
  const newPlaced: PlacedCard = {
    card: placed.card,
    pos: toPos,
    rotation,
  };
  newBoard.set(toPosKey, newPlaced);

  // Check board is still connected after placing
  if (!isBoardConnected(newBoard)) {
    throw new Error('Cannot move card: final position disconnects the board');
  }

  return { ...state, board: newBoard };
}

// Zap Card: pick up a card from board into current player's hand
export function zapCard(state: GameState, cardPosKey: string): GameState {
  const placed = state.board.get(cardPosKey);
  if (!placed) throw new Error(`No card at position ${cardPosKey}`);

  // Create board without the card
  const newBoard = new Map(state.board);
  newBoard.delete(cardPosKey);

  // Add card to current player's hand
  const players = state.players.map((p, idx) => {
    if (idx === state.currentPlayerIndex) {
      return { ...p, hand: [...p.hand, placed.card] };
    }
    return p;
  });

  return { ...state, board: newBoard, players };
}
