import type { GameState, BoardPosition, Player, PlacedCard, ActionCard } from './types';
import { buildMainDeck, dealInitialHands, goalCards, shuffleDeck } from './deck';
import { posKey, isPlacementValid } from './board';
import { checkWin, largestGroup } from './win';
import { updateSilverColor } from './silver';
import { tradeHands, tradeGoals, rotateGoals, moveCard, zapCard } from './actions';
import { countNewColorConnections, bonusDrawCount } from './connections';

// Initialize a new game
export function createGame(playerNames: string[], _seed?: number): GameState {
  const deck = buildMainDeck();
  const { hands, remainingDeck } = dealInitialHands(deck, playerNames.length);

  // Assign goals - shuffled so each game players get random goals
  const shuffledGoals = shuffleDeck([...goalCards]);
  const players: Player[] = playerNames.map((name, i) => ({
    id: `player_${i}`,
    name,
    isAI: i > 0,
    hand: hands[i],
    goalId: shuffledGoals[i].id,
  }));

  const heldGoalIds = new Set(players.map(p => p.goalId));
  const unusedGoalOrder = [...goalCards]
    .filter(g => !heldGoalIds.has(g.id))
    .map(g => g.id);

  return {
    board: new Map<string, PlacedCard>(),
    deck: remainingDeck,
    discardPile: [],
    silverDragonColor: 'all',
    players,
    goals: [...goalCards],
    unusedGoalOrder,
    currentPlayerIndex: 0,
    phase: 'draw',
    pendingAction: null,
    winner: null,
    applyActionEffect: false,
    applySilverChange: false,
  };
}

// When deck is empty and all hands are empty → closest-to-7 wins
function computeClosestWinner(state: GameState): GameState {
  let bestPlayerId: string | null = null;
  let bestCount = -1;
  for (const player of state.players) {
    const goal = state.goals.find(g => g.id === player.goalId);
    if (!goal) continue;
    const count = largestGroup(state.board, goal.color, state.silverDragonColor);
    if (count > bestCount) {
      bestCount = count;
      bestPlayerId = player.id;
    }
  }
  return { ...state, winner: bestPlayerId, phase: 'ended' };
}

// When deck is empty and current player has no cards, advance past empty-handed players.
// If all hands empty → closest-to-7 win.
function advancePastEmptyHands(state: GameState): GameState {
  const n = state.players.length;
  for (let i = 1; i < n; i++) {
    const nextIdx = (state.currentPlayerIndex + i) % n;
    if (state.players[nextIdx].hand.length > 0) {
      // Found a player with cards — move to their play phase (no draw since deck empty)
      return {
        ...state,
        currentPlayerIndex: nextIdx,
        phase: 'play',
        pendingAction: null,
        applyActionEffect: false,
        applySilverChange: false,
      };
    }
  }
  return computeClosestWinner(state);
}

// Draw a card (start of turn)
export function drawCard(state: GameState): GameState {
  if (state.phase !== 'draw') throw new Error('Not in draw phase');

  if (state.deck.length === 0) {
    // Deck exhausted — skip draw step
    const currentPlayer = state.players[state.currentPlayerIndex];
    if (currentPlayer.hand.length === 0) {
      // This player has nothing to play either — advance past empty hands
      return advancePastEmptyHands(state);
    }
    // Player still has cards — just move to play phase without drawing
    return { ...state, phase: 'play' };
  }

  const newDeck = [...state.deck];
  const drawnCard = newDeck.shift()!;

  const players = state.players.map((p, idx) => {
    if (idx === state.currentPlayerIndex) {
      return { ...p, hand: [...p.hand, drawnCard] };
    }
    return p;
  });

  return { ...state, deck: newDeck, players, phase: 'play' };
}

// Play a dragon card to the board
export function playDragonCard(state: GameState, cardId: string, pos: BoardPosition, rotation: 0 | 180 = 0): GameState {
  if (state.phase !== 'play') throw new Error('Not in play phase');

  const currentPlayer = state.players[state.currentPlayerIndex];
  const cardIndex = currentPlayer.hand.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) throw new Error('Card not in hand');

  const card = currentPlayer.hand[cardIndex];
  if (card.type !== 'dragon') throw new Error('Card is not a dragon card');

  // Validate placement
  if (!isPlacementValid(state.board, card, pos, state.silverDragonColor, rotation)) {
    throw new Error('Invalid placement position');
  }

  // Remove card from hand
  const newHand = [...currentPlayer.hand];
  newHand.splice(cardIndex, 1);

  // Place card on board
  const newBoard = new Map(state.board);
  const placed: PlacedCard = { card, pos, rotation };
  newBoard.set(posKey(pos.x, pos.y), placed);

  // Count bonus draws
  const newConnections = countNewColorConnections(state.board, card, pos, state.silverDragonColor, rotation);
  const bonus = bonusDrawCount(newConnections.size);

  // Draw bonus cards
  const newDeck = [...state.deck];
  const bonusCards = newDeck.splice(0, Math.min(bonus, newDeck.length));
  const updatedHand = [...newHand, ...bonusCards];

  const players = state.players.map((p, idx) => {
    if (idx === state.currentPlayerIndex) {
      return { ...p, hand: updatedHand };
    }
    return p;
  });

  // Check win condition for ALL players (win can be triggered on any player's turn)
  let winner = state.winner;
  let phase: import('./types').GamePhase = state.phase;

  for (const player of state.players) {
    const goal = state.goals.find((g) => g.id === player.goalId);
    if (goal && checkWin(newBoard, goal.color, state.silverDragonColor)) {
      winner = player.id;
      phase = 'ended';
      break;
    }
  }

  return {
    ...state,
    board: newBoard,
    deck: newDeck,
    players,
    winner,
    phase,
  };
}

// Play an action card
export function playActionCard(
  state: GameState,
  cardId: string,
  applyAction: boolean,
  applySilver: boolean
): GameState {
  if (state.phase !== 'play') throw new Error('Not in play phase');

  const currentPlayer = state.players[state.currentPlayerIndex];
  const cardIndex = currentPlayer.hand.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) throw new Error('Card not in hand');

  const card = currentPlayer.hand[cardIndex];
  if (card.type !== 'action') throw new Error('Card is not an action card');

  // Remove card from hand
  const newHand = [...currentPlayer.hand];
  newHand.splice(cardIndex, 1);

  const players = state.players.map((p, idx) => {
    if (idx === state.currentPlayerIndex) {
      return { ...p, hand: newHand };
    }
    return p;
  });

  // Update Silver Dragon color if player chooses
  let silverDragonColor = state.silverDragonColor;
  if (applySilver) {
    silverDragonColor = updateSilverColor(card as ActionCard);
  }

  // Discard the action card
  const discardPile = [...state.discardPile, card as ActionCard];

  let newState: GameState = {
    ...state,
    players,
    discardPile,
    silverDragonColor,
    applyActionEffect: applyAction,
    applySilverChange: applySilver,
  };

  if (!applyAction) {
    // Player skips action effect — just end with silver change applied
    return newState;
  }

  // Set up pending action based on action type
  const actionType = (card as ActionCard).action;

  if (actionType === 'trade-hands') {
    return { ...newState, pendingAction: { type: 'trade-hands', targetPlayerId: null }, phase: 'action-targeting' };
  }
  if (actionType === 'trade-goals') {
    return { ...newState, pendingAction: { type: 'trade-goals', targetPlayerId: null }, phase: 'action-targeting' };
  }
  if (actionType === 'rotate-goals') {
    return { ...newState, pendingAction: { type: 'rotate-goals', direction: null }, phase: 'action-targeting' };
  }
  if (actionType === 'move-card') {
    return { ...newState, pendingAction: { type: 'move-card', cardPosKey: null }, phase: 'action-targeting' };
  }
  if (actionType === 'zap-card') {
    return { ...newState, pendingAction: { type: 'zap-card', cardPosKey: null }, phase: 'action-targeting' };
  }

  return newState;
}

// Resolve pending action (after player picks target)
export function resolvePendingAction(
  state: GameState,
  payload: {
    targetPlayerId?: string;
    targetPosKey?: string;
    toPos?: BoardPosition;
    direction?: 'left' | 'right';
    unusedGoalIndex?: number;
  }
): GameState {
  if (!state.pendingAction) throw new Error('No pending action');

  const currentPlayer = state.players[state.currentPlayerIndex];
  let newState: GameState;

  switch (state.pendingAction.type) {
    case 'trade-hands': {
      if (!payload.targetPlayerId) throw new Error('targetPlayerId required');
      newState = tradeHands(state, currentPlayer.id, payload.targetPlayerId);
      break;
    }
    case 'trade-goals': {
      newState = tradeGoals(
        state,
        currentPlayer.id,
        payload.targetPlayerId ?? null,
        payload.unusedGoalIndex
      );
      break;
    }
    case 'rotate-goals': {
      if (!payload.direction) throw new Error('direction required');
      newState = rotateGoals(state, payload.direction);
      break;
    }
    case 'move-card': {
      if (!payload.targetPosKey) throw new Error('targetPosKey required');
      if (!payload.toPos) throw new Error('toPos required');
      newState = moveCard(state, payload.targetPosKey, payload.toPos);
      break;
    }
    case 'zap-card': {
      if (!payload.targetPosKey) throw new Error('targetPosKey required');
      newState = zapCard(state, payload.targetPosKey);
      break;
    }
    default:
      throw new Error('Unknown pending action type');
  }

  return { ...newState, pendingAction: null, phase: 'play' };
}

// Advance to next player's turn
export function endTurn(state: GameState): GameState {
  if (state.phase === 'ended') return state;

  const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;

  return {
    ...state,
    currentPlayerIndex: nextPlayerIndex,
    phase: 'draw',
    pendingAction: null,
    applyActionEffect: false,
    applySilverChange: false,
  };
}
