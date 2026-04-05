import { describe, it, expect } from 'vitest';
import type { DragonCard, PlacedCard, PanelColor } from '../types';
import {
  posKey,
  parseKey,
  isPlacementValid,
  isBoardConnected,
  adjacentEmptyPositions,
  boardPanels,
} from '../board';

function makeCard(id: string, panels: [[PanelColor, PanelColor], [PanelColor, PanelColor]]): DragonCard {
  return { id, type: 'dragon', panels };
}

function makePlaced(card: DragonCard, x: number, y: number): PlacedCard {
  return { card, pos: { x, y }, rotation: 0 };
}

describe('posKey / parseKey', () => {
  it('encodes and decodes positions correctly', () => {
    expect(posKey(3, -2)).toBe('3,-2');
    expect(parseKey('3,-2')).toEqual({ x: 3, y: -2 });
  });
});

describe('isPlacementValid', () => {
  const redCard = makeCard('red1', [['red', 'red'], ['red', 'red']]);
  const blueCard = makeCard('blue1', [['blue', 'blue'], ['blue', 'blue']]);
  const goldCard = makeCard('gold1', [['gold', 'gold'], ['gold', 'gold']]);
  const rainbowCard = makeCard('rain1', [['rainbow', 'rainbow'], ['rainbow', 'rainbow']]);
  const mixedCard = makeCard('mix1', [['red', 'blue'], ['red', 'blue']]);

  it('returns false for (0,0) — Silver Dragon position', () => {
    const board = new Map<string, PlacedCard>();
    expect(isPlacementValid(board, redCard, { x: 0, y: 0 }, 'all')).toBe(false);
  });

  it('returns true when placing adjacent to Silver Dragon with matching color (all=rainbow)', () => {
    const board = new Map<string, PlacedCard>();
    // Silver is at (0,0) with all colors (rainbow). Any color card next to it matches.
    expect(isPlacementValid(board, redCard, { x: 1, y: 0 }, 'all')).toBe(true);
  });

  it('returns true when placing adjacent to Silver Dragon with matching specific color', () => {
    const board = new Map<string, PlacedCard>();
    // Silver is red, place red card next to it
    expect(isPlacementValid(board, redCard, { x: 1, y: 0 }, 'red')).toBe(true);
  });

  it('returns true regardless of color when adjacent to Silver Dragon', () => {
    const board = new Map<string, PlacedCard>();
    // Any card can be placed next to Silver — color matching not required
    expect(isPlacementValid(board, blueCard, { x: 1, y: 0 }, 'red')).toBe(true);
  });

  it('returns false when position is already occupied', () => {
    const board = new Map<string, PlacedCard>();
    board.set(posKey(1, 0), makePlaced(redCard, 1, 0));
    expect(isPlacementValid(board, goldCard, { x: 1, y: 0 }, 'all')).toBe(false);
  });

  it('returns false when no shared edge with existing cards', () => {
    const board = new Map<string, PlacedCard>();
    board.set(posKey(1, 0), makePlaced(redCard, 1, 0));
    // Place at (3, 0) — not adjacent to (1,0) or Silver at (0,0)
    expect(isPlacementValid(board, redCard, { x: 3, y: 0 }, 'all')).toBe(false);
  });

  it('rainbow card matches any color panel', () => {
    const board = new Map<string, PlacedCard>();
    // Blue card at (1,0), try placing rainbow card next to it
    board.set(posKey(1, 0), makePlaced(blueCard, 1, 0));
    expect(isPlacementValid(board, rainbowCard, { x: 2, y: 0 }, 'all')).toBe(true);
  });

  it('existing rainbow panel matches any new card color', () => {
    const board = new Map<string, PlacedCard>();
    board.set(posKey(1, 0), makePlaced(rainbowCard, 1, 0));
    // Gold card adjacent to rainbow — should match
    expect(isPlacementValid(board, goldCard, { x: 2, y: 0 }, 'all')).toBe(true);
  });

  it('returns true for any color when adjacent to placed card', () => {
    const board = new Map<string, PlacedCard>();
    board.set(posKey(1, 0), makePlaced(redCard, 1, 0));
    // Any card can be placed adjacent — color matching not required
    expect(isPlacementValid(board, blueCard, { x: 2, y: 0 }, 'red')).toBe(true);
  });

  it('Silver Dragon color does not affect placement validation', () => {
    const board = new Map<string, PlacedCard>();
    // Any card can be placed next to Silver regardless of Silver's color
    expect(isPlacementValid(board, blueCard, { x: 1, y: 0 }, 'blue')).toBe(true);
    expect(isPlacementValid(board, redCard, { x: 1, y: 0 }, 'blue')).toBe(true);
  });
});

describe('isBoardConnected', () => {
  const redCard = makeCard('red1', [['red', 'red'], ['red', 'red']]);
  const blueCard = makeCard('blue1', [['blue', 'blue'], ['blue', 'blue']]);

  it('returns true for empty board', () => {
    const board = new Map<string, PlacedCard>();
    expect(isBoardConnected(board)).toBe(true);
  });

  it('returns true when cards are connected through Silver Dragon', () => {
    const board = new Map<string, PlacedCard>();
    // Cards adjacent to Silver at (0,0)
    board.set(posKey(1, 0), makePlaced(redCard, 1, 0));
    board.set(posKey(-1, 0), makePlaced(blueCard, -1, 0));
    expect(isBoardConnected(board)).toBe(true);
  });

  it('returns true for a chain connected to Silver', () => {
    const board = new Map<string, PlacedCard>();
    board.set(posKey(1, 0), makePlaced(redCard, 1, 0));
    board.set(posKey(2, 0), makePlaced(redCard, 2, 0));
    board.set(posKey(3, 0), makePlaced(blueCard, 3, 0));
    expect(isBoardConnected(board)).toBe(true);
  });

  it('returns false when a card is isolated (island)', () => {
    const board = new Map<string, PlacedCard>();
    board.set(posKey(1, 0), makePlaced(redCard, 1, 0));
    // Island at (5, 5) — not connected to Silver or any other card
    board.set(posKey(5, 5), makePlaced(blueCard, 5, 5));
    expect(isBoardConnected(board)).toBe(false);
  });

  it('returns false after removing a bridge card creates an island', () => {
    const board = new Map<string, PlacedCard>();
    // Chain: Silver(0,0) - (1,0) - (2,0) - (3,0)
    board.set(posKey(1, 0), makePlaced(redCard, 1, 0));
    board.set(posKey(2, 0), makePlaced(redCard, 2, 0));
    board.set(posKey(3, 0), makePlaced(blueCard, 3, 0));

    // Remove the bridge card at (2,0)
    const newBoard = new Map(board);
    newBoard.delete(posKey(2, 0));
    expect(isBoardConnected(newBoard)).toBe(false);
  });
});

describe('adjacentEmptyPositions', () => {
  const redCard = makeCard('red1', [['red', 'red'], ['red', 'red']]);

  it('returns 4 neighbors of Silver Dragon on empty board', () => {
    const board = new Map<string, PlacedCard>();
    const positions = adjacentEmptyPositions(board);
    expect(positions).toHaveLength(4);
    const keys = positions.map((p) => posKey(p.x, p.y));
    expect(keys).toContain('1,0');
    expect(keys).toContain('-1,0');
    expect(keys).toContain('0,1');
    expect(keys).toContain('0,-1');
  });

  it('adds more candidates when a card is placed', () => {
    const board = new Map<string, PlacedCard>();
    board.set(posKey(1, 0), makePlaced(redCard, 1, 0));
    const positions = adjacentEmptyPositions(board);
    // (0,0) is Silver, occupied. (1,0) is placed.
    // Neighbors of Silver: (-1,0),(0,1),(0,-1) — (1,0) is occupied
    // Neighbors of (1,0): (0,0) occupied, (2,0), (1,1), (1,-1)
    const keys = new Set(positions.map((p) => posKey(p.x, p.y)));
    expect(keys.has('2,0')).toBe(true);
  });
});
