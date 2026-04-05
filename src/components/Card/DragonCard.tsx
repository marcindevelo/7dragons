import type { DragonCard as DragonCardType } from '../../engine/types';
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

export default function DragonCard({ card, selected, rotation = 0, onClick, size = 'md' }: Props) {
  const s = SIZE[size];
  const flatPanels = card.panels.flat();
  const panels = rotation === 180
    ? [flatPanels[3], flatPanels[2], flatPanels[1], flatPanels[0]]
    : flatPanels;

  return (
    <button
      onClick={onClick}
      className={[
        s.card,
        'relative grid grid-cols-2 grid-rows-2 rounded-lg overflow-hidden border-2 shrink-0 transition-all duration-200',
        selected
          ? 'border-white scale-110 shadow-lg shadow-white/30'
          : 'border-white/20 hover:border-white/50',
        onClick ? 'cursor-pointer' : 'cursor-default',
      ].join(' ')}
      title={card.id}
    >
      {/* Colored panels */}
      {panels.map((color, i) => (
        <div key={i} className={[panelBg(color), 'flex items-center justify-center'].join(' ')} />
      ))}

      {/* Dragon emblem overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img src="/dragon-emblem.png" alt="" className="h-full w-auto opacity-35 mix-blend-multiply" />
      </div>
    </button>
  );
}
