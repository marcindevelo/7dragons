import type { PlacedCard, BoardPosition, DragonColor } from './types';
import { boardPanels, cardPanels, arePanelsAdjacent, parseKey } from './board';

// After placing a card, return the SET of new distinct non-rainbow colors connected
export function countNewColorConnections(
  board: Map<string, PlacedCard>,
  placedCard: import('./types').DragonCard,
  pos: BoardPosition,
  silverColor: DragonColor | 'all',
  rotation: 0 | 90 | 180 | 270 = 0
): Set<DragonColor> {
  const tempPlaced: PlacedCard = { card: placedCard, pos, rotation };
  const newPanels = cardPanels(tempPlaced);
  const existingPanels = boardPanels(board, silverColor);
  const connectedColors = new Set<DragonColor>();

  for (const np of newPanels) {
    if (np.color === null || np.color === 'rainbow') continue;
    const newColor = np.color as DragonColor;

    for (const [epKey, epColor] of existingPanels) {
      if (epColor === null) continue;
      if (epColor === 'rainbow') continue;
      const ep = parseKey(epKey);
      if (!arePanelsAdjacent(np.px, np.py, ep.x, ep.y)) continue;
      if (epColor === newColor) {
        connectedColors.add(newColor);
        break;
      }
    }
  }

  return connectedColors;
}

// Returns bonus cards to draw: 0, 1, 2, or 3
export function bonusDrawCount(newColorConnections: number): number {
  if (newColorConnections <= 1) return 0;
  if (newColorConnections === 2) return 1;
  if (newColorConnections === 3) return 2;
  return 3; // 4+
}
