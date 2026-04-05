import { describe, it, expect } from 'vitest';
import type { DragonCard, PlacedCard, PanelColor, GameState, Player, GoalCard } from '../types';
import { posKey } from '../board';
import { tradeHands, tradeGoals, rotateGoals, moveCard, zapCard } from '../actions';
import { goalCards } from '../deck';

function makeCard(id: string, panels: [[PanelColor, PanelColor], [PanelColor, PanelColor]]): DragonCard {
  return { id, type: 'dragon', panels };
}

function makePlaced(card: DragonCard, x: number, y: number): PlacedCard {
  return { card, pos: { x, y }, rotation: 0 };
}

function makeBaseState(overrides: Partial<GameState> = {}): GameState {
  const redCard = makeCard('red1', [['red', 'red'], ['red', 'red']]);
  const blueCard = makeCard('blue1', [['blue', 'blue'], ['blue', 'blue']]);
  const goldCard = makeCard('gold1', [['gold', 'gold'], ['gold', 'gold']]);

  const players: Player[] = [
    { id: 'p1', name: 'Alice', hand: [redCard, blueCard], goalId: 'goal_red' },
    { id: 'p2', name: 'Bob', hand: [goldCard], goalId: 'goal_blue' },
  ];

  const base = {
    board: new Map<string, PlacedCard>(),
    deck: [],
    discardPile: [],
    silverDragonColor: 'all' as const,
    players,
    goals: [...goalCards],
    unusedGoalOrder: [] as string[],
    currentPlayerIndex: 0,
    phase: 'play' as const,
    pendingAction: null,
    winner: null,
    applyActionEffect: false,
    applySilverChange: false,
    ...overrides,
  };

  // Compute unusedGoalOrder from the final players (after overrides), unless explicitly provided
  if (!overrides.unusedGoalOrder) {
    const heldGoalIds = new Set(base.players.map(p => p.goalId));
    base.unusedGoalOrder = [...goalCards]
      .filter(g => !heldGoalIds.has(g.id))
      .map(g => g.id);
  }

  return base;
}

describe('tradeHands', () => {
  it('swaps hands between two players', () => {
    const state = makeBaseState();
    const newState = tradeHands(state, 'p1', 'p2');

    expect(newState.players[0].hand).toHaveLength(1); // p1 gets Bob's hand
    expect(newState.players[1].hand).toHaveLength(2); // p2 gets Alice's hand
    expect(newState.players[0].hand[0].id).toBe('gold1');
    expect(newState.players[1].hand.map((c) => c.id)).toContain('red1');
  });

  it('does not change goals after trading hands', () => {
    const state = makeBaseState();
    const newState = tradeHands(state, 'p1', 'p2');

    expect(newState.players[0].goalId).toBe('goal_red');
    expect(newState.players[1].goalId).toBe('goal_blue');
  });

  it('does not mutate original state', () => {
    const state = makeBaseState();
    const originalP1Hand = [...state.players[0].hand];
    tradeHands(state, 'p1', 'p2');
    expect(state.players[0].hand).toEqual(originalP1Hand);
  });

  it('throws if player not found', () => {
    const state = makeBaseState();
    expect(() => tradeHands(state, 'p1', 'nonexistent')).toThrow();
  });
});

describe('tradeGoals', () => {
  it('swaps goals between two players', () => {
    const state = makeBaseState();
    const newState = tradeGoals(state, 'p1', 'p2');

    expect(newState.players[0].goalId).toBe('goal_blue'); // p1 gets p2's goal
    expect(newState.players[1].goalId).toBe('goal_red'); // p2 gets p1's goal
  });

  it('swaps with unused goal pile', () => {
    const state = makeBaseState();
    // unused goals: goal_gold, goal_green, goal_black
    const heldIds = new Set(state.players.map((p) => p.goalId));
    const unused = state.goals.filter((g) => !heldIds.has(g.id));
    expect(unused.length).toBeGreaterThan(0);

    const newState = tradeGoals(state, 'p1', null, 0);
    expect(newState.players[0].goalId).toBe(unused[0].id);
  });

  it('does not change hands after trading goals', () => {
    const state = makeBaseState();
    const newState = tradeGoals(state, 'p1', 'p2');

    expect(newState.players[0].hand).toHaveLength(2); // unchanged
    expect(newState.players[1].hand).toHaveLength(1); // unchanged
  });
});

describe('rotateGoals', () => {
  // goalCards order: red, gold, blue, green, black (from deck.ts)
  // makeBaseState: p1=goal_red, p2=goal_blue → unused: goal_gold, goal_green, goal_black
  // Full ring (left shift): [goal_red, goal_blue, goal_gold, goal_green, goal_black]

  it('rotates goals left: each seat gets next seat\'s goal (ring includes unused)', () => {
    const state = makeBaseState();
    const newState = rotateGoals(state, 'left');

    // Ring [goal_red, goal_blue, goal_gold, goal_green, goal_black] → left shift
    // p1 seat (0) gets goal_blue, p2 seat (1) gets goal_gold (first unused)
    expect(newState.players[0].goalId).toBe('goal_blue');
    expect(newState.players[1].goalId).toBe('goal_gold');
  });

  it('rotates goals right: each seat gets previous seat\'s goal', () => {
    const state = makeBaseState();
    const newState = rotateGoals(state, 'right');

    // Right shift: p1 seat (0) gets last = goal_black, p2 seat (1) gets goal_red
    expect(newState.players[0].goalId).toBe('goal_black');
    expect(newState.players[1].goalId).toBe('goal_red');
  });

  it('rotating left then right returns to original state', () => {
    const state = makeBaseState();
    const left = rotateGoals(state, 'left');
    const back = rotateGoals(left, 'right');

    expect(back.players[0].goalId).toBe(state.players[0].goalId);
    expect(back.players[1].goalId).toBe(state.players[1].goalId);
  });

  it('works correctly with 5 players (no unused goals)', () => {
    // With all 5 goals assigned, ring = players only → wraps among themselves
    const state = makeBaseState({
      players: [
        { id: 'p1', name: 'Alice', hand: [], goalId: 'goal_red' },
        { id: 'p2', name: 'Bob',   hand: [], goalId: 'goal_gold' },
        { id: 'p3', name: 'Carol', hand: [], goalId: 'goal_blue' },
        { id: 'p4', name: 'Dave',  hand: [], goalId: 'goal_green' },
        { id: 'p5', name: 'Eve',   hand: [], goalId: 'goal_black' },
      ],
    });

    const newState = rotateGoals(state, 'left');
    expect(newState.players[0].goalId).toBe('goal_gold');  // got p2's
    expect(newState.players[1].goalId).toBe('goal_blue');  // got p3's
    expect(newState.players[4].goalId).toBe('goal_red');   // got p1's (wrap)
  });

  it('unused goals participate: after left rotation a player receives an unused goal', () => {
    // 2 players, 3 unused → p2 should receive the first unused goal
    const state = makeBaseState(); // p1=goal_red, p2=goal_blue
    const heldIds = new Set(state.players.map(p => p.goalId));
    const firstUnused = state.goals.find(g => !heldIds.has(g.id))!;

    const newState = rotateGoals(state, 'left');
    expect(newState.players[1].goalId).toBe(firstUnused.id);
  });
});

describe('zapCard', () => {
  const redCard = makeCard('red_board', [['red', 'red'], ['red', 'red']]);
  const blueCard = makeCard('blue_board', [['blue', 'blue'], ['blue', 'blue']]);

  it('removes card from board and adds to current player\'s hand', () => {
    const board = new Map<string, PlacedCard>();
    board.set(posKey(1, 0), makePlaced(redCard, 1, 0));

    const state = makeBaseState({ board });
    const newState = zapCard(state, posKey(1, 0));

    expect(newState.board.has(posKey(1, 0))).toBe(false);
    expect(newState.players[0].hand.map((c) => c.id)).toContain('red_board');
  });

  it('throws if card does not exist at position', () => {
    const state = makeBaseState();
    expect(() => zapCard(state, posKey(5, 5))).toThrow();
  });

  it('throws if zapping would disconnect the board', () => {
    // Chain: Silver(0,0) - (1,0) - (2,0)
    // Zapping (1,0) would disconnect (2,0) from Silver
    const board = new Map<string, PlacedCard>();
    board.set(posKey(1, 0), makePlaced(redCard, 1, 0));
    board.set(posKey(2, 0), makePlaced(blueCard, 2, 0));

    const state = makeBaseState({ board });
    expect(() => zapCard(state, posKey(1, 0))).toThrow();
  });

  it('does not mutate original state', () => {
    const board = new Map<string, PlacedCard>();
    board.set(posKey(1, 0), makePlaced(redCard, 1, 0));

    const state = makeBaseState({ board });
    const originalHandLength = state.players[0].hand.length;
    zapCard(state, posKey(1, 0));
    expect(state.players[0].hand.length).toBe(originalHandLength);
  });
});

describe('moveCard', () => {
  const redCard = makeCard('red_move', [['red', 'red'], ['red', 'red']]);
  const blueCard = makeCard('blue_move', [['blue', 'blue'], ['blue', 'blue']]);

  it('moves card to a valid new position', () => {
    const board = new Map<string, PlacedCard>();
    // Red card at (1,0) adjacent to Silver(red)
    board.set(posKey(1, 0), makePlaced(redCard, 1, 0));

    const state = makeBaseState({ board, silverDragonColor: 'red' });
    // Move it to (-1,0) — also adjacent to Silver(red)
    const newState = moveCard(state, posKey(1, 0), { x: -1, y: 0 });

    expect(newState.board.has(posKey(1, 0))).toBe(false);
    expect(newState.board.has(posKey(-1, 0))).toBe(true);
  });

  it('throws when move creates island (disconnects board)', () => {
    // Chain: Silver(0,0) - (1,0) - (2,0)
    // Moving (1,0) elsewhere would disconnect (2,0)
    const board = new Map<string, PlacedCard>();
    board.set(posKey(1, 0), makePlaced(redCard, 1, 0));
    board.set(posKey(2, 0), makePlaced(blueCard, 2, 0));

    const state = makeBaseState({ board, silverDragonColor: 'all' });
    // Move (1,0) to (0,-1) — (2,0) would become island
    expect(() => moveCard(state, posKey(1, 0), { x: 0, y: -1 })).toThrow();
  });

  it('throws when target position is not adjacent to any card', () => {
    const board = new Map<string, PlacedCard>();
    board.set(posKey(1, 0), makePlaced(redCard, 1, 0));

    const state = makeBaseState({ board, silverDragonColor: 'blue' });
    // Try to move to a non-adjacent position — invalid
    expect(() => moveCard(state, posKey(1, 0), { x: 5, y: 5 })).toThrow();
  });

  it('throws when source position has no card', () => {
    const state = makeBaseState();
    expect(() => moveCard(state, posKey(5, 5), { x: 1, y: 0 })).toThrow();
  });
});
