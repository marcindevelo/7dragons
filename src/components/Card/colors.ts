import type { DragonColor, PanelColor } from '../../engine/types';

export const PANEL_BG: Record<string, string> = {
  red:     'bg-red-700',
  gold:    'bg-yellow-500',
  blue:    'bg-blue-700',
  green:   'bg-green-700',
  black:   'bg-zinc-800',
  rainbow: 'bg-gradient-to-br from-red-500 via-yellow-400 via-green-500 to-blue-600',
  empty:   'bg-zinc-900/40',
};

export const DRAGON_LABEL: Record<DragonColor, string> = {
  red:   'Red',
  gold:  'Gold',
  blue:  'Blue',
  green: 'Green',
  black: 'Black',
};

export const SILVER_COLOR_BG: Record<DragonColor | 'all', string> = {
  all:   'bg-gradient-to-br from-red-500 via-yellow-400 via-green-500 to-blue-600',
  red:   'bg-red-700',
  gold:  'bg-yellow-500',
  blue:  'bg-blue-700',
  green: 'bg-green-700',
  black: 'bg-zinc-800',
};

export function panelBg(color: PanelColor): string {
  if (color === null) return PANEL_BG.empty;
  return PANEL_BG[color] ?? PANEL_BG.empty;
}
