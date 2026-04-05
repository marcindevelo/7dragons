import type { ActionCard as ActionCardType } from '../../engine/types';
import { PANEL_BG } from './colors';

type Props = {
  card: ActionCardType;
  selected?: boolean;
  onClick?: () => void;
};

const ACTION_LABEL: Record<string, string> = {
  'trade-hands':  'Trade\nHands',
  'trade-goals':  'Trade\nGoals',
  'rotate-goals': 'Rotate\nGoals',
  'move-card':    'Move\nCard',
  'zap-card':     'Zap\nCard',
};

const ACTION_ICON: Record<string, string> = {
  'trade-hands':  '🤝',
  'trade-goals':  '🎯',
  'rotate-goals': '🔄',
  'move-card':    '📦',
  'zap-card':     '⚡',
};

export default function ActionCard({ card, selected, onClick }: Props) {
  const silverDot = PANEL_BG[card.silverColor] ?? 'bg-zinc-600';

  return (
    <button
      onClick={onClick}
      className={[
        'w-20 h-28 rounded-lg border-2 flex flex-col items-center justify-center gap-1 shrink-0 transition-transform bg-zinc-900',
        selected
          ? 'border-yellow-400 scale-110 shadow-lg shadow-yellow-400/30'
          : 'border-white/20 hover:border-white/50',
        onClick ? 'cursor-pointer' : 'cursor-default',
      ].join(' ')}
      title={card.id}
    >
      <span className="text-2xl">{ACTION_ICON[card.action]}</span>
      <span className="text-[9px] text-center text-white/80 whitespace-pre-line leading-tight px-1">
        {ACTION_LABEL[card.action]}
      </span>
      {/* Silver color indicator dot */}
      <div className={['w-4 h-4 rounded-full mt-1', silverDot].join(' ')} title={`Silver → ${card.silverColor}`} />
    </button>
  );
}
