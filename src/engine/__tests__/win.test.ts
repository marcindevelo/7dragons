import { describe, it, expect } from 'vitest';
import type { DragonCard, PlacedCard, PanelColor } from '../types';
import { posKey } from '../board';
import { checkWin, largestGroup } from '../win';

function makeCard(id: string, panels: [[PanelColor, PanelColor], [PanelColor, PanelColor]]): DragonCard {
  return { id, type: 'dragon', panels };
}

function makePlaced(card: DragonCard, x: number, y: number): PlacedCard {
  return { card, pos: { x, y }, rotation: 0 };
}

// Helpers: standard test cards
const redAce    = makeCard('r', [['red',  'red'],  ['red',  'red']]);   // 1 red dragon
const blueAce   = makeCard('b', [['blue', 'blue'], ['blue', 'blue']]);  // 1 blue dragon
const rainbowAce= makeCard('w', [['rainbow','rainbow'],['rainbow','rainbow']]); // 1 rainbow dragon
const halfRedGold = makeCard('hRG', [['red','red'],['gold','gold']]);   // 1 red + 1 gold

// Place N identical-color Ace cards in a horizontal line starting at (x0, y).
// They must be adjacent to each other AND to the starting anchor.
// Returns a board map.
function redLine(count: number, startX = 1, startY = 0): Map<string, PlacedCard> {
  const board = new Map<string, PlacedCard>();
  for (let i = 0; i < count; i++) {
    const card = makeCard(`r${i}`, [['red','red'],['red','red']]);
    board.set(posKey(startX + i, startY), makePlaced(card, startX + i, startY));
  }
  return board;
}

// ── largestGroup ──────────────────────────────────────────────────────────────

describe('largestGroup', () => {
  it('returns 0 when no target-color dragons exist', () => {
    const board = new Map<string, PlacedCard>();
    // Silver='blue' → blue dragons; no red cards → red largestGroup = 0
    expect(largestGroup(board, 'red', 'blue')).toBe(0);
  });

  it('Silver Dragon alone with matching color counts as 1 dragon', () => {
    const board = new Map<string, PlacedCard>();
    // Silver(red) = 1 dragon
    expect(largestGroup(board, 'red', 'red')).toBe(1);
  });

  it('Silver Dragon when all counts as every color (like Rainbow)', () => {
    const board = new Map<string, PlacedCard>();
    // Silver='all' acts like Rainbow — counts as every color including red
    expect(largestGroup(board, 'red', 'all')).toBe(1);
  });

  it('single placed red Ace = 1 dragon (not 4 panels)', () => {
    const board = redLine(1);
    // silverColor='blue' so Silver doesn't count for red
    expect(largestGroup(board, 'red', 'blue')).toBe(1);
  });

  it('two adjacent red Aces = 2 dragons', () => {
    const board = redLine(2);
    expect(largestGroup(board, 'red', 'blue')).toBe(2);
  });

  it('Silver(red) + 1 adjacent red card = 2 dragons', () => {
    const board = redLine(1); // card at (1,0), adjacent to Silver at (0,0)
    expect(largestGroup(board, 'red', 'red')).toBe(2);
  });

  it('rainbow Ace + Silver(all) adjacent = 2 dragons (both wild)', () => {
    const board = new Map<string, PlacedCard>();
    board.set(posKey(1, 0), makePlaced(rainbowAce, 1, 0));
    // Silver='all' counts as red, rainbow counts as red, both adjacent → 2
    expect(largestGroup(board, 'red', 'all')).toBe(2);
  });

  it('half red-gold card counts as 1 red dragon and 1 gold dragon separately', () => {
    const board = new Map<string, PlacedCard>();
    board.set(posKey(1, 0), makePlaced(halfRedGold, 1, 0));
    expect(largestGroup(board, 'red',  'blue')).toBe(1);
    expect(largestGroup(board, 'gold', 'blue')).toBe(1);
  });

  it('returns largest when two disconnected groups exist', () => {
    // Group A: Silver(red) + 2 adjacent red cards = 3 dragons
    const board = redLine(2);
    // Group B: isolated red card far away = 1 dragon
    board.set(posKey(10, 10), makePlaced(makeCard('iso', [['red','red'],['red','red']]), 10, 10));
    expect(largestGroup(board, 'red', 'red')).toBe(3); // silver + 2 line
  });

  it('Silver(red) + 6 adjacent red cards = 7 dragons', () => {
    const board = redLine(6);
    expect(largestGroup(board, 'red', 'red')).toBe(7);
  });
});

// ── checkWin ──────────────────────────────────────────────────────────────────

describe('checkWin', () => {
  it('returns false for empty board (only Silver=all = 1, not enough)', () => {
    // Silver='all' counts as red → 1 card. Need 7. → false
    expect(checkWin(new Map(), 'red', 'all')).toBe(false);
  });

  it('returns false for 5 red cards when Silver=all bridges nothing new (5+Silver=6)', () => {
    // redLine(5) at x=1..5, Silver(all) at x=0 adjacent to x=1 → group = 6, not enough
    const board = redLine(5);
    expect(checkWin(board, 'red', 'all')).toBe(false);
  });

  it('Silver(all) + 6 adjacent red cards = 7 → win', () => {
    // Silver at (0,0) counts as red (all=wild), + redLine(6) at x=1..6 → group = 7
    const board = redLine(6);
    expect(checkWin(board, 'red', 'all')).toBe(true);
  });

  it('returns true for exactly 7 connected red cards (Silver=blue, excluded)', () => {
    const board = redLine(7); // 7 red cards, Silver='blue' excluded
    expect(checkWin(board, 'red', 'blue')).toBe(true);
  });

  it('Silver(red) + 6 adjacent red cards = 7 dragons → win', () => {
    const board = redLine(6);
    expect(checkWin(board, 'red', 'red')).toBe(true);
  });

  it('returns false when 7 dragons exist but split across two groups (4+3)', () => {
    // Group A: 4 red cards in line starting at (1,0)
    const board = redLine(4);
    // Group B: 3 red cards isolated at (10,0)
    for (let i = 0; i < 3; i++) {
      const c = makeCard(`iso${i}`, [['red','red'],['red','red']]);
      board.set(posKey(10 + i, 0), makePlaced(c, 10 + i, 0));
    }
    // Largest connected red group = 4 (Silver='all' excluded) + line of 4 ← wait:
    // Silver excluded, line at (1..4) = 4 connected red cards; line at (10..12) = 3 cards
    expect(checkWin(board, 'red', 'all')).toBe(false);
  });

  it('rainbow dragons count toward any color for win', () => {
    // 7 rainbow cards in a line (no Silver contribution, silverColor='all')
    const board = new Map<string, PlacedCard>();
    for (let i = 0; i < 7; i++) {
      const c = makeCard(`rain${i}`, [['rainbow','rainbow'],['rainbow','rainbow']]);
      board.set(posKey(1 + i, 0), makePlaced(c, 1 + i, 0));
    }
    expect(checkWin(board, 'red',  'all')).toBe(true);
    expect(checkWin(board, 'gold', 'all')).toBe(true);
  });

  it('returns false for wrong color goal (no blue cards, Silver bridges red only)', () => {
    // redLine(7) = red cards, no blue panels. Silver='all' counts for blue too,
    // but no blue cards are adjacent to Silver. Group of blue = just Silver = 1.
    const board = redLine(7);
    expect(checkWin(board, 'blue', 'all')).toBe(false);
  });
});
