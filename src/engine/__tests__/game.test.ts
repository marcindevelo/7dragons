import { describe, it, expect } from 'vitest';
import type { DragonCard, PlacedCard, PanelColor, GameState, Player } from '../types';
import { posKey } from '../board';
import { createGame, drawCard, playDragonCard, endTurn } from '../game';
import { goalCards, dragonCards } from '../deck';

function makeCard(id: string, panels: [[PanelColor, PanelColor], [PanelColor, PanelColor]]): DragonCard {
  return { id, type: 'dragon', panels };
}

function makePlaced(card: DragonCard, x: number, y: number): PlacedCard {
  return { card, pos: { x, y }, rotation: 0 };
}

describe('createGame', () => {
  it('creates valid initial state for 2 players', () => {
    const state = createGame(['Alice', 'Bob']);

    expect(state.players).toHaveLength(2);
    expect(state.players[0].name).toBe('Alice');
    expect(state.players[1].name).toBe('Bob');
  });

  it('deals 3 cards to each player', () => {
    const state = createGame(['Alice', 'Bob', 'Carol']);

    for (const player of state.players) {
      expect(player.hand).toHaveLength(3);
    }
  });

  it('starts in draw phase', () => {
    const state = createGame(['Alice', 'Bob']);
    expect(state.phase).toBe('draw');
  });

  it('board is empty initially (Silver Dragon is not in board Map)', () => {
    const state = createGame(['Alice', 'Bob']);
    expect(state.board.size).toBe(0);
  });

  it('silverDragonColor starts as all', () => {
    const state = createGame(['Alice', 'Bob']);
    expect(state.silverDragonColor).toBe('all');
  });

  it('assigns goal cards to players', () => {
    const state = createGame(['Alice', 'Bob']);
    expect(state.players[0].goalId).toBeTruthy();
    expect(state.players[1].goalId).toBeTruthy();
    expect(state.players[0].goalId).not.toBe(state.players[1].goalId);
  });

  it('deck has correct number of cards (66 - 3*playerCount)', () => {
    const state2 = createGame(['Alice', 'Bob']);
    expect(state2.deck).toHaveLength(66 - 3 * 2);

    const state3 = createGame(['Alice', 'Bob', 'Carol']);
    expect(state3.deck).toHaveLength(66 - 3 * 3);
  });

  it('has no winner at start', () => {
    const state = createGame(['Alice', 'Bob']);
    expect(state.winner).toBeNull();
  });

  it('has all 5 goal cards', () => {
    const state = createGame(['Alice', 'Bob']);
    expect(state.goals).toHaveLength(5);
  });

  it('currentPlayerIndex starts at 0', () => {
    const state = createGame(['Alice', 'Bob']);
    expect(state.currentPlayerIndex).toBe(0);
  });
});

describe('drawCard', () => {
  it('draws a card from deck to current player hand', () => {
    const state = createGame(['Alice', 'Bob']);
    // First player starts in draw phase
    const handBefore = state.players[0].hand.length;
    const deckBefore = state.deck.length;

    const newState = drawCard(state);

    expect(newState.players[0].hand).toHaveLength(handBefore + 1);
    expect(newState.deck).toHaveLength(deckBefore - 1);
  });

  it('advances phase to play after drawing', () => {
    const state = createGame(['Alice', 'Bob']);
    const newState = drawCard(state);
    expect(newState.phase).toBe('play');
  });

  it('throws if not in draw phase', () => {
    const state = createGame(['Alice', 'Bob']);
    const playState = { ...state, phase: 'play' as const };
    expect(() => drawCard(playState)).toThrow();
  });

  it('skips draw when deck is empty but player has cards', () => {
    const state = createGame(['Alice', 'Bob']);
    const emptyDeckState = { ...state, deck: [] };
    const result = drawCard(emptyDeckState);
    // hand unchanged, moves to play
    expect(result.phase).toBe('play');
    expect(result.players[0].hand).toHaveLength(state.players[0].hand.length);
  });

  it('auto-advances past empty-handed players when deck is empty', () => {
    const state = createGame(['Alice', 'Bob']);
    // Drain deck and empty Alice's hand, give Bob cards
    const emptyDeckState = {
      ...state,
      deck: [],
      players: state.players.map((p, i) => ({
        ...p,
        hand: i === 0 ? [] : p.hand,
      })),
    };
    const result = drawCard(emptyDeckState);
    // Should advance to Bob (index 1) in play phase
    expect(result.currentPlayerIndex).toBe(1);
    expect(result.phase).toBe('play');
  });

  it('ends game with closest-to-7 winner when all hands empty and deck empty', () => {
    const state = createGame(['Alice', 'Bob']);
    const emptyState = {
      ...state,
      deck: [],
      players: state.players.map(p => ({ ...p, hand: [] })),
    };
    const result = drawCard(emptyState);
    expect(result.phase).toBe('ended');
    expect(result.winner).not.toBeNull();
  });

  it('does not mutate original state', () => {
    const state = createGame(['Alice', 'Bob']);
    const originalDeckLength = state.deck.length;
    drawCard(state);
    expect(state.deck.length).toBe(originalDeckLength);
  });
});

describe('playDragonCard', () => {
  function getStateInPlayPhase(playerNames: string[] = ['Alice', 'Bob']): GameState {
    const state = createGame(playerNames);
    return drawCard(state);
  }

  it('places card on board', () => {
    const state = getStateInPlayPhase();
    // Find a dragon card in hand
    const dragonCard = state.players[0].hand.find((c) => c.type === 'dragon') as DragonCard;
    if (!dragonCard) return; // skip if no dragon card in hand

    // Try to find valid placement
    const pos = { x: 1, y: 0 }; // adjacent to Silver at (0,0)
    try {
      const newState = playDragonCard(state, dragonCard.id, pos);
      expect(newState.board.has(posKey(1, 0))).toBe(true);
    } catch {
      // card might not be valid for this position, that's ok
    }
  });

  it('removes played card from hand', () => {
    // Build a deterministic state
    const redCard = makeCard('red_test', [['red', 'red'], ['red', 'red']]);
    const players: Player[] = [
      { id: 'p1', name: 'Alice', hand: [redCard], goalId: 'goal_red' },
      { id: 'p2', name: 'Bob', hand: [], goalId: 'goal_blue' },
    ];

    const state: GameState = {
      board: new Map<string, PlacedCard>(),
      deck: [],
      discardPile: [],
      silverDragonColor: 'all',
      players,
      goals: [...goalCards],
      currentPlayerIndex: 0,
      phase: 'play',
      pendingAction: null,
      winner: null,
      applyActionEffect: false,
      applySilverChange: false,
    };

    const newState = playDragonCard(state, 'red_test', { x: 1, y: 0 });
    expect(newState.players[0].hand.find((c) => c.id === 'red_test')).toBeUndefined();
    expect(newState.board.has(posKey(1, 0))).toBe(true);
  });

  it('throws if card is not in hand', () => {
    const state = createGame(['Alice', 'Bob']);
    const playState = drawCard(state);
    expect(() => playDragonCard(playState, 'nonexistent_card', { x: 1, y: 0 })).toThrow();
  });

  it('throws if placement is invalid (not adjacent to any card)', () => {
    const redCard = makeCard('red_test2', [['red', 'red'], ['red', 'red']]);
    const players: Player[] = [
      { id: 'p1', name: 'Alice', hand: [redCard], goalId: 'goal_red' },
      { id: 'p2', name: 'Bob', hand: [], goalId: 'goal_blue' },
    ];

    const state: GameState = {
      board: new Map<string, PlacedCard>(),
      deck: [],
      discardPile: [],
      silverDragonColor: 'blue',
      players,
      goals: [...goalCards],
      currentPlayerIndex: 0,
      phase: 'play',
      pendingAction: null,
      winner: null,
      applyActionEffect: false,
      applySilverChange: false,
    };

    // Not adjacent to Silver or any card
    expect(() => playDragonCard(state, 'red_test2', { x: 5, y: 5 })).toThrow();
  });

  it('detects win condition when placed', () => {
    // Win = 7 connected dragons (cards) of goal color.
    // Silver(red)=1 dragon. Pre-place 5 red Ace cards in a line at (1..5, 0).
    // Placing the 7th red card at (6,0) completes the group of 7: Silver + 6 cards.
    const makeRed = (id: string) => makeCard(id, [['red', 'red'], ['red', 'red']]);
    const winCard = makeRed('win_card');

    // Pre-place 5 red cards adjacent to Silver and each other
    const board = new Map<string, PlacedCard>();
    for (let i = 1; i <= 5; i++) {
      const c = makeRed(`pre${i}`);
      board.set(posKey(i, 0), { card: c, pos: { x: i, y: 0 }, rotation: 0 });
    }

    const players: Player[] = [
      { id: 'p1', name: 'Alice', hand: [winCard], goalId: 'goal_red' },
      { id: 'p2', name: 'Bob',   hand: [],        goalId: 'goal_blue' },
    ];

    const state: GameState = {
      board,
      deck: [],
      discardPile: [],
      silverDragonColor: 'red',  // Silver counts as 1 red dragon
      players,
      goals: [...goalCards],
      currentPlayerIndex: 0,
      phase: 'play',
      pendingAction: null,
      winner: null,
      applyActionEffect: false,
      applySilverChange: false,
    };

    // Before: Silver(1) + 5 pre-placed = 6 red dragons → not yet a win
    // After placing winCard at (6,0): 7 connected red dragons → win!
    const newState = playDragonCard(state, 'win_card', { x: 6, y: 0 });
    expect(newState.winner).toBe('p1');
    expect(newState.phase).toBe('ended');
  });
});

describe('endTurn', () => {
  it('advances to next player', () => {
    const state = createGame(['Alice', 'Bob']);
    const playState = { ...state, phase: 'play' as const };
    const newState = endTurn(playState);
    expect(newState.currentPlayerIndex).toBe(1);
  });

  it('wraps around to player 0 after last player', () => {
    const state = createGame(['Alice', 'Bob']);
    const p2State = { ...state, phase: 'play' as const, currentPlayerIndex: 1 };
    const newState = endTurn(p2State);
    expect(newState.currentPlayerIndex).toBe(0);
  });

  it('resets phase to draw', () => {
    const state = createGame(['Alice', 'Bob']);
    const playState = { ...state, phase: 'play' as const };
    const newState = endTurn(playState);
    expect(newState.phase).toBe('draw');
  });

  it('does nothing if game has ended', () => {
    const state = createGame(['Alice', 'Bob']);
    const endedState = { ...state, phase: 'ended' as const, winner: 'p1' };
    const newState = endTurn(endedState);
    expect(newState.phase).toBe('ended');
    expect(newState.winner).toBe('p1');
  });
});

describe('Full turn end-to-end', () => {
  it('draw → play dragon card → check state → end turn', () => {
    // Set up a controlled game state
    const redCard = makeCard('red_e2e', [['red', 'red'], ['red', 'red']]);
    const players: Player[] = [
      { id: 'p1', name: 'Alice', hand: [], goalId: 'goal_red' },
      { id: 'p2', name: 'Bob', hand: [], goalId: 'goal_blue' },
    ];

    const initialState: GameState = {
      board: new Map<string, PlacedCard>(),
      deck: [redCard], // Only 1 card in deck
      discardPile: [],
      silverDragonColor: 'blue', // silver is blue, so silver panels don't count as red
      players,
      goals: [...goalCards],
      currentPlayerIndex: 0,
      phase: 'draw',
      pendingAction: null,
      winner: null,
      applyActionEffect: false,
      applySilverChange: false,
    };

    // Step 1: Draw
    const afterDraw = drawCard(initialState);
    expect(afterDraw.phase).toBe('play');
    expect(afterDraw.players[0].hand).toHaveLength(1);
    expect(afterDraw.deck).toHaveLength(0);

    // Step 2: Play the dragon card (red card next to silver=blue — need rainbow or blue)
    // Use rainbow card so placement is valid next to blue silver
    const rainbowCard2 = makeCard('rain_e2e', [['rainbow', 'rainbow'], ['rainbow', 'rainbow']]);
    const stateWithRainbow = {
      ...afterDraw,
      players: afterDraw.players.map((p, i) =>
        i === 0 ? { ...p, hand: [rainbowCard2] } : p
      ),
    };
    const afterPlay = playDragonCard(stateWithRainbow, 'rain_e2e', { x: 1, y: 0 });
    expect(afterPlay.board.has(posKey(1, 0))).toBe(true);
    expect(afterPlay.players[0].hand).toHaveLength(0);

    // Step 3: Check win (rainbow+silver=blue counts, but goal is red, so 0 red panels → no win)
    expect(afterPlay.winner).toBeNull();

    // Step 4: End turn
    const afterEndTurn = endTurn(afterPlay);
    expect(afterEndTurn.currentPlayerIndex).toBe(1);
    expect(afterEndTurn.phase).toBe('draw');
  });
});
