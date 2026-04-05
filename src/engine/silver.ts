import type { ActionCard, DragonColor } from './types';

// Returns new Silver Dragon color after an action card is played
export function updateSilverColor(actionCard: ActionCard): DragonColor {
  return actionCard.silverColor;
}

// Returns display color for Silver Dragon (its current color or 'all')
export function silverDisplayColor(silverColor: DragonColor | 'all'): DragonColor | 'all' {
  return silverColor;
}
