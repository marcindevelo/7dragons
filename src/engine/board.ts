import type { PlacedCard, BoardPosition, PanelColor, DragonColor, DragonCard } from './types';

export function posKey(x: number, y: number): string {
  return `${x},${y}`;
}

export function parseKey(key: string): BoardPosition {
  const [x, y] = key.split(',').map(Number);
  return { x, y };
}

// Returns the 4 panel positions for a card at (cx, cy) in panel space.
// Applies rotation (0 or 180 degrees): rotation=180 reverses panel layout.
export function cardPanels(placed: PlacedCard): Array<{ px: number; py: number; color: PanelColor }> {
  const { pos, card, rotation } = placed;
  const result: Array<{ px: number; py: number; color: PanelColor }> = [];
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 2; col++) {
      const srcRow = rotation === 180 ? 1 - row : row;
      const srcCol = rotation === 180 ? 1 - col : col;
      result.push({
        px: pos.x * 2 + col,
        py: pos.y * 2 + row,
        color: card.panels[srcRow][srcCol],
      });
    }
  }
  return result;
}

// Silver Dragon panels at (0,0) in card space → panel space (0,0),(1,0),(0,1),(1,1)
function silverPanels(silverColor: DragonColor | 'all'): Array<{ px: number; py: number; color: PanelColor }> {
  if (silverColor === 'all') {
    return [
      { px: 0, py: 0, color: 'rainbow' },
      { px: 1, py: 0, color: 'rainbow' },
      { px: 0, py: 1, color: 'rainbow' },
      { px: 1, py: 1, color: 'rainbow' },
    ];
  }
  return [
    { px: 0, py: 0, color: silverColor },
    { px: 1, py: 0, color: silverColor },
    { px: 0, py: 1, color: silverColor },
    { px: 1, py: 1, color: silverColor },
  ];
}

// Build a map of all panel positions to colors
export function boardPanels(
  board: Map<string, PlacedCard>,
  silverColor: DragonColor | 'all'
): Map<string, PanelColor> {
  const result = new Map<string, PanelColor>();

  // Add Silver Dragon panels at (0,0)
  for (const p of silverPanels(silverColor)) {
    result.set(posKey(p.px, p.py), p.color);
  }

  // Add all placed cards' panels
  for (const placed of board.values()) {
    for (const p of cardPanels(placed)) {
      if (p.color !== null) {
        result.set(posKey(p.px, p.py), p.color);
      }
    }
  }

  return result;
}

// Resolve effective colors of a panel (rainbow = all 5 colors as wildcard)
export function resolveColor(color: PanelColor, silverColor: DragonColor | 'all'): DragonColor[] {
  if (color === null) return [];
  if (color === 'rainbow') {
    if (silverColor === 'all') {
      return ['red', 'gold', 'blue', 'green', 'black'];
    }
    return ['red', 'gold', 'blue', 'green', 'black'];
  }
  return [color];
}

// Check if two panel positions are orthogonally adjacent
export function arePanelsAdjacent(px1: number, py1: number, px2: number, py2: number): boolean {
  return (Math.abs(px1 - px2) === 1 && py1 === py2) || (Math.abs(py1 - py2) === 1 && px1 === px2);
}

// Check if card can be placed at pos
// Rule: position must be empty, not (0,0), and adjacent (card-level) to Silver or any placed card.
export function isPlacementValid(
  board: Map<string, PlacedCard>,
  _card: DragonCard,
  pos: BoardPosition,
  _silverColor: DragonColor | 'all'
): boolean {
  // Position must not be occupied
  if (board.has(posKey(pos.x, pos.y))) return false;

  // Silver Dragon is always at (0,0) - can't place there
  if (pos.x === 0 && pos.y === 0) return false;

  // Must be adjacent (card-level) to Silver Dragon or any placed card
  const occupied = new Set<string>();
  occupied.add(posKey(0, 0)); // Silver Dragon
  for (const key of board.keys()) occupied.add(key);

  for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
    if (occupied.has(posKey(pos.x + dx, pos.y + dy))) return true;
  }

  return false;
}

// Returns all valid positions where card can be placed
export function validPlacements(
  board: Map<string, PlacedCard>,
  card: DragonCard,
  silverColor: DragonColor | 'all'
): BoardPosition[] {
  const candidates = adjacentEmptyPositions(board);
  return candidates.filter((pos) => isPlacementValid(board, card, pos, silverColor));
}

// Returns all positions adjacent to any placed card (including Silver Dragon at 0,0)
export function adjacentEmptyPositions(board: Map<string, PlacedCard>): BoardPosition[] {
  const occupied = new Set<string>();
  // Silver Dragon at (0,0) is always occupied
  occupied.add(posKey(0, 0));
  for (const key of board.keys()) {
    occupied.add(key);
  }

  const candidates = new Set<string>();
  // Check neighbors of Silver Dragon
  for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
    const nx = 0 + dx;
    const ny = 0 + dy;
    const key = posKey(nx, ny);
    if (!occupied.has(key)) candidates.add(key);
  }

  // Check neighbors of placed cards
  for (const key of board.keys()) {
    const pos = parseKey(key);
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const nx = pos.x + dx;
      const ny = pos.y + dy;
      const nkey = posKey(nx, ny);
      if (!occupied.has(nkey)) candidates.add(nkey);
    }
  }

  return Array.from(candidates).map(parseKey);
}

// Check that board remains connected (cards graph, Silver Dragon at 0,0 is anchor)
export function isBoardConnected(board: Map<string, PlacedCard>): boolean {
  if (board.size === 0) return true;

  // Build adjacency for all cards + Silver Dragon
  const allPositions = new Set<string>();
  allPositions.add(posKey(0, 0)); // Silver Dragon
  for (const key of board.keys()) {
    allPositions.add(key);
  }

  // BFS from Silver Dragon
  const visited = new Set<string>();
  const queue: string[] = [posKey(0, 0)];
  visited.add(posKey(0, 0));

  while (queue.length > 0) {
    const current = queue.shift()!;
    const pos = parseKey(current);
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const neighbor = posKey(pos.x + dx, pos.y + dy);
      if (allPositions.has(neighbor) && !visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  // All positions must be visited
  for (const pos of allPositions) {
    if (!visited.has(pos)) return false;
  }
  return true;
}
