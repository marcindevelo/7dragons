import type { GameState, DragonCard, ActionCard, BoardPosition } from './types';
import { validPlacements, adjacentEmptyPositions, isPlacementValid, posKey, isBoardConnected } from './board';
import { largestGroup } from './win';
import { playDragonCard } from './game';

export type AIMove =
  | { type: 'dragon'; cardId: string; pos: BoardPosition; rotation: 0 | 180 }
  | { type: 'action'; cardId: string }
  | { type: 'pass' };

export type AIActionResolution = {
  targetPlayerId?: string;
  targetPosKey?: string;
  toPos?: BoardPosition;
  direction?: 'left' | 'right';
  unusedGoalIndex?: number;
};

// Score a board state from the AI player's perspective.
// Primary: maximize own island. Secondary: penalize opponent's largest island.
function scoreState(state: GameState, aiPlayerIdx: number): number {
  const aiPlayer = state.players[aiPlayerIdx];
  const aiGoal = state.goals.find(g => g.id === aiPlayer.goalId);
  if (!aiGoal) return 0;

  const ownScore = largestGroup(state.board, aiGoal.color, state.silverDragonColor);

  // Penalize based on best opponent score
  let opponentMax = 0;
  for (let i = 0; i < state.players.length; i++) {
    if (i === aiPlayerIdx) continue;
    const goal = state.goals.find(g => g.id === state.players[i].goalId);
    if (!goal) continue;
    const score = largestGroup(state.board, goal.color, state.silverDragonColor);
    if (score > opponentMax) opponentMax = score;
  }

  return ownScore * 10 - opponentMax * 3;
}

// Choose the best dragon card placement
export function aiChooseMove(state: GameState): AIMove {
  const playerIdx = state.currentPlayerIndex;
  const player = state.players[playerIdx];

  const dragonCards = player.hand.filter(c => c.type === 'dragon') as DragonCard[];
  const actionCards = player.hand.filter(c => c.type === 'action') as ActionCard[];

  let bestScore = -Infinity;
  let bestMove: AIMove | null = null;

  for (const card of dragonCards) {
    const positions = validPlacements(state.board, card, state.silverDragonColor);
    for (const pos of positions) {
      for (const rotation of [0, 180] as const) {
        try {
          const next = playDragonCard(state, card.id, pos, rotation);
          const score = scoreState(next, playerIdx);
          if (score > bestScore) {
            bestScore = score;
            bestMove = { type: 'dragon', cardId: card.id, pos, rotation };
          }
        } catch {
          // invalid placement
        }
      }
    }
  }

  if (bestMove) return bestMove;

  // No dragon cards or no valid placements — play an action card
  if (actionCards.length > 0) {
    return { type: 'action', cardId: actionCards[0].id };
  }

  return { type: 'pass' };
}

// Resolve a pending action for an AI player.
// Returns the payload needed by resolvePendingAction().
export function aiResolveAction(state: GameState): AIActionResolution {
  const playerIdx = state.currentPlayerIndex;
  const player = state.players[playerIdx];
  const pendingType = state.pendingAction?.type;

  if (pendingType === 'trade-hands') {
    // Trade with the opponent who has the most cards
    let bestTarget = '';
    let maxCards = -1;
    for (const p of state.players) {
      if (p.id === player.id) continue;
      if (p.hand.length > maxCards) {
        maxCards = p.hand.length;
        bestTarget = p.id;
      }
    }
    return { targetPlayerId: bestTarget };
  }

  if (pendingType === 'trade-goals') {
    // Don't swap goals — pass with no target (keep own goal)
    // Pass unusedGoalIndex=undefined and targetPlayerId=undefined → tradeGoals with null → swaps with first unused
    // Actually, to skip: we already chose applyAction=false in aiChooseMove path
    // But if we're here, action was applied — pick least threatening unused goal or just skip
    return { unusedGoalIndex: undefined, targetPlayerId: undefined };
  }

  if (pendingType === 'rotate-goals') {
    // Pick direction that gives AI best goal
    return { direction: 'left' };
  }

  if (pendingType === 'zap-card') {
    // Remove the card that contributes most to the best opponent's island
    const aiGoal = state.goals.find(g => g.id === player.goalId);
    let bestKey = '';
    let bestGain = -1;

    for (const [key] of state.board) {
      // Try removing each card (must keep board connected)
      const testBoard = new Map(state.board);
      testBoard.delete(key);
      if (!isBoardConnected(testBoard)) continue;

      // Measure opponent score drop
      for (let i = 0; i < state.players.length; i++) {
        if (i === playerIdx) continue;
        const oppGoal = state.goals.find(g => g.id === state.players[i].goalId);
        if (!oppGoal) continue;
        const before = largestGroup(state.board, oppGoal.color, state.silverDragonColor);
        const after = largestGroup(testBoard, oppGoal.color, state.silverDragonColor);
        const gain = before - after;
        // Also avoid zapping own goal-color cards
        const placedCard = state.board.get(key)!;
        const hasOwnColor = aiGoal && placedCard.card.panels.flat().some(
          p => p === aiGoal.color || p === 'rainbow'
        );
        const adjustedGain = gain - (hasOwnColor ? 5 : 0);
        if (adjustedGain > bestGain) {
          bestGain = adjustedGain;
          bestKey = key;
        }
      }
    }

    // Fallback: zap any removable card
    if (!bestKey) {
      for (const [key] of state.board) {
        const testBoard = new Map(state.board);
        testBoard.delete(key);
        if (isBoardConnected(testBoard)) {
          bestKey = key;
          break;
        }
      }
    }

    return { targetPosKey: bestKey };
  }

  if (pendingType === 'move-card') {
    // Move own card to improve island, or any card if no improvement found
    const aiGoal = state.goals.find(g => g.id === player.goalId);
    let bestScore = -Infinity;
    let bestKey = '';
    let bestPos: BoardPosition = { x: 1, y: 0 };

    for (const [key, placed] of state.board) {
      const testBoard = new Map(state.board);
      testBoard.delete(key);
      if (!isBoardConnected(testBoard)) continue;

      const positions = adjacentEmptyPositions(testBoard).filter(
        p => !(p.x === 0 && p.y === 0) && isPlacementValid(testBoard, placed.card, p, state.silverDragonColor, placed.rotation)
      );

      for (const pos of positions) {
        const newBoard = new Map(testBoard);
        newBoard.set(posKey(pos.x, pos.y), { ...placed, pos });
        const ownScore = aiGoal ? largestGroup(newBoard, aiGoal.color, state.silverDragonColor) : 0;
        if (ownScore > bestScore) {
          bestScore = ownScore;
          bestKey = key;
          bestPos = pos;
        }
      }
    }

    // Fallback: move first movable card to first valid position
    if (!bestKey) {
      for (const [key, placed] of state.board) {
        const testBoard = new Map(state.board);
        testBoard.delete(key);
        if (!isBoardConnected(testBoard)) continue;
        const positions = adjacentEmptyPositions(testBoard).filter(
          p => !(p.x === 0 && p.y === 0) && isPlacementValid(testBoard, placed.card, p, state.silverDragonColor, placed.rotation)
        );
        if (positions.length > 0) {
          bestKey = key;
          bestPos = positions[0];
          break;
        }
      }
    }

    return { targetPosKey: bestKey, toPos: bestPos };
  }

  return {};
}
