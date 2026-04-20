import type { CSSProperties } from 'react';
import type { DragonColor, PanelColor } from '../../engine/types';

const RAINBOW_GRADIENT = 'linear-gradient(135deg, #e74c3c, #f1c40f, #2ecc71, #3498db)';

export const PANEL_BG: Record<string, CSSProperties> = {
  red:     { backgroundColor: '#c0392b' },
  gold:    { backgroundColor: '#d4ac0d' },
  blue:    { backgroundColor: '#1a6fa8' },
  green:   { backgroundColor: '#1e8449' },
  black:   { backgroundColor: '#2c2c2c' },
  rainbow: { background: RAINBOW_GRADIENT },
  empty:   { backgroundColor: 'rgba(24, 24, 27, 0.4)' },
};

export const PANEL_BG_FALLBACK: CSSProperties = { backgroundColor: '#3f3f46' };

export const DRAGON_LABEL: Record<DragonColor, string> = {
  red:   'Red',
  gold:  'Gold',
  blue:  'Blue',
  green: 'Green',
  black: 'Black',
};

export const SILVER_COLOR_BG: Record<DragonColor | 'all', CSSProperties> = {
  all:   { background: RAINBOW_GRADIENT },
  red:   { backgroundColor: '#c0392b' },
  gold:  { backgroundColor: '#d4ac0d' },
  blue:  { backgroundColor: '#1a6fa8' },
  green: { backgroundColor: '#1e8449' },
  black: { backgroundColor: '#2c2c2c' },
};

export function panelBg(color: PanelColor): CSSProperties {
  if (color === null) return PANEL_BG.empty;
  return PANEL_BG[color] ?? PANEL_BG.empty;
}
