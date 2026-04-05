import type { PlacedCard, DragonColor, PanelColor } from './types';
import { posKey, parseKey } from './board';

// Check if a panel color counts as targetColor
function panelCountsAsColor(color: PanelColor, targetColor: DragonColor): boolean {
  if (color === null) return false;
  if (color === 'rainbow') return true;
  return color === targetColor;
}

// Get the effective panel at visual position (row, col) accounting for rotation.
function getPanel(placed: PlacedCard, row: number, col: number): PanelColor {
  const srcRow = placed.rotation === 180 ? 1 - row : row;
  const srcCol = placed.rotation === 180 ? 1 - col : col;
  return placed.card.panels[srcRow][srcCol];
}

// Get panel for a card key. Silver Dragon (0,0) is not in board — treat all its
// panels as silverColor (or 'rainbow' when silverColor === 'all').
function getPanelForKey(
  key: string,
  row: number,
  col: number,
  board: Map<string, PlacedCard>,
  silverColor: DragonColor | 'all'
): PanelColor {
  if (key === posKey(0, 0)) {
    return silverColor === 'all' ? 'rainbow' : silverColor;
  }
  const placed = board.get(key);
  return placed ? getPanel(placed, row, col) : null;
}

// Check if the shared edge between two adjacent cards has at least one panel pair
// that both count as goalColor.
// dx/dy is the direction from aKey to bKey.
function sharedEdgeConnects(
  aKey: string,
  bKey: string,
  dx: number,
  dy: number,
  board: Map<string, PlacedCard>,
  goalColor: DragonColor,
  silverColor: DragonColor | 'all'
): boolean {
  const get = (key: string, row: number, col: number) =>
    getPanelForKey(key, row, col, board, silverColor);

  if (dx === 1) {
    // b is to the right: a's col=1 faces b's col=0
    for (let row = 0; row < 2; row++) {
      if (panelCountsAsColor(get(aKey, row, 1), goalColor) &&
          panelCountsAsColor(get(bKey, row, 0), goalColor)) return true;
    }
  } else if (dx === -1) {
    // b is to the left: a's col=0 faces b's col=1
    for (let row = 0; row < 2; row++) {
      if (panelCountsAsColor(get(aKey, row, 0), goalColor) &&
          panelCountsAsColor(get(bKey, row, 1), goalColor)) return true;
    }
  } else if (dy === 1) {
    // b is below: a's row=1 faces b's row=0
    for (let col = 0; col < 2; col++) {
      if (panelCountsAsColor(get(aKey, 1, col), goalColor) &&
          panelCountsAsColor(get(bKey, 0, col), goalColor)) return true;
    }
  } else if (dy === -1) {
    // b is above: a's row=0 faces b's row=1
    for (let col = 0; col < 2; col++) {
      if (panelCountsAsColor(get(aKey, 0, col), goalColor) &&
          panelCountsAsColor(get(bKey, 1, col), goalColor)) return true;
    }
  }
  return false;
}

// Check if a card has at least one panel matching goalColor (applies rotation).
function cardHasGoalColor(placed: PlacedCard, goalColor: DragonColor): boolean {
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 2; col++) {
      if (panelCountsAsColor(getPanel(placed, row, col), goalColor)) return true;
    }
  }
  return false;
}

// BFS at CARD level.
// Two cards are connected for goalColor only when:
//   1. Both have ≥1 panel of goalColor
//   2. Their shared edge has at least one facing panel pair that both count as goalColor
//
// This prevents a card from "joining" the island via a non-red shared edge even if
// it happens to have a red panel elsewhere on the card.
//
// Win condition: 7 connected cards in one component.
export function largestGroup(
  board: Map<string, PlacedCard>,
  goalColor: DragonColor,
  silverColor: DragonColor | 'all'
): number {
  const qualifiedCards = new Set<string>();

  if (silverColor === 'all' || silverColor === goalColor) {
    qualifiedCards.add(posKey(0, 0));
  }

  for (const [key, placed] of board) {
    if (cardHasGoalColor(placed, goalColor)) {
      qualifiedCards.add(key);
    }
  }

  if (qualifiedCards.size === 0) return 0;

  const visited = new Set<string>();
  let maxSize = 0;

  for (const startKey of qualifiedCards) {
    if (visited.has(startKey)) continue;

    const queue: string[] = [startKey];
    visited.add(startKey);
    let size = 0;

    while (queue.length > 0) {
      const current = queue.shift()!;
      size++;
      const pos = parseKey(current);

      for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        const neighborKey = posKey(pos.x + dx, pos.y + dy);
        if (
          qualifiedCards.has(neighborKey) &&
          !visited.has(neighborKey) &&
          sharedEdgeConnects(current, neighborKey, dx, dy, board, goalColor, silverColor)
        ) {
          visited.add(neighborKey);
          queue.push(neighborKey);
        }
      }
    }

    if (size > maxSize) maxSize = size;
  }

  return maxSize;
}

// Returns true if any connected dragon group has >= 7 dragons of goalColor
export function checkWin(
  board: Map<string, PlacedCard>,
  goalColor: DragonColor,
  silverColor: DragonColor | 'all'
): boolean {
  return largestGroup(board, goalColor, silverColor) >= 7;
}
