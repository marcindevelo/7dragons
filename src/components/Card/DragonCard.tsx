import type { DragonCard as DragonCardType, PanelColor } from '../../engine/types';
import { panelBg } from './colors';

type Props = {
  card: DragonCardType;
  selected?: boolean;
  rotation?: 0 | 180;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
};

const SIZE = {
  sm: { card: 'w-10 h-14' },
  md: { card: 'w-20 h-28' },
  lg: { card: 'w-28 h-40' },
};

// Panel visual positions as % of card dimensions
// Layout: [TL=0, TR=1, BL=2, BR=3]
const PANEL_BOUNDS = [
  { x1: 0,  y1: 0,  x2: 50,  y2: 50  }, // 0: top-left
  { x1: 50, y1: 0,  x2: 100, y2: 50  }, // 1: top-right
  { x1: 0,  y1: 50, x2: 50,  y2: 100 }, // 2: bottom-left
  { x1: 50, y1: 50, x2: 100, y2: 100 }, // 3: bottom-right
];

// Which panels share an edge
const ADJACENCY = [
  [1, 2], // TL ↔ TR, BL
  [0, 3], // TR ↔ TL, BR
  [0, 3], // BL ↔ TL, BR
  [1, 2], // BR ↔ TR, BL
];

// Group adjacent same-color panels — returns list of groups (each group = array of panel indices)
function getColorGroups(panels: PanelColor[]): number[][] {
  const visited = new Array(4).fill(false);
  const groups: number[][] = [];
  for (let i = 0; i < 4; i++) {
    if (visited[i]) continue;
    const group: number[] = [];
    const queue = [i];
    visited[i] = true;
    while (queue.length > 0) {
      const curr = queue.shift()!;
      group.push(curr);
      for (const neighbor of ADJACENCY[curr]) {
        if (!visited[neighbor] && panels[neighbor] === panels[curr]) {
          visited[neighbor] = true;
          queue.push(neighbor);
        }
      }
    }
    groups.push(group);
  }
  return groups;
}

export default function DragonCard({ card, selected, rotation = 0, onClick, size = 'md' }: Props) {
  const s = SIZE[size];
  const flatPanels = card.panels.flat();
  const panels = rotation === 180
    ? [flatPanels[3], flatPanels[2], flatPanels[1], flatPanels[0]]
    : flatPanels;

  const colorGroups = getColorGroups(panels);

  return (
    <button
      onClick={onClick}
      className={[
        s.card,
        'relative grid grid-cols-2 grid-rows-2 rounded-lg overflow-hidden border shrink-0 transition-all duration-200',
        selected
          ? 'border-white scale-110 shadow-lg shadow-white/30'
          : 'border-white/10 hover:border-white/30',
        onClick ? 'cursor-pointer' : 'cursor-default',
      ].join(' ')}
      title={card.id}
    >
      {/* Colored panels */}
      {panels.map((color, i) => (
        <div key={i} className={[panelBg(color), 'flex items-center justify-center'].join(' ')} />
      ))}

      {/* One crown per same-color region */}
      {colorGroups.map((group, gi) => {
        const x1 = Math.min(...group.map(i => PANEL_BOUNDS[i].x1));
        const y1 = Math.min(...group.map(i => PANEL_BOUNDS[i].y1));
        const x2 = Math.max(...group.map(i => PANEL_BOUNDS[i].x2));
        const y2 = Math.max(...group.map(i => PANEL_BOUNDS[i].y2));
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2;
        const crownW = (x2 - x1) * (2 / 3);
        const crownH = (y2 - y1) * (2 / 3);

        return (
          <div
            key={gi}
            className="absolute pointer-events-none"
            style={{
              left: `${cx}%`,
              top: `${cy}%`,
              transform: 'translate(-50%, -50%)',
              width: `${crownW}%`,
              height: `${crownH}%`,
            }}
          >
            <img src="/card-emblem.svg" alt="" className="w-full h-full object-contain opacity-25" />
          </div>
        );
      })}
    </button>
  );
}
