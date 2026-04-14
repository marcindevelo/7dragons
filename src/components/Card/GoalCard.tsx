import type { GoalCard as GoalCardType } from '../../engine/types';
import { PANEL_BG, DRAGON_LABEL } from './colors';

type Props = {
  card: GoalCardType;
  hidden?: boolean;
  size?: 'sm' | 'md';
};

export default function GoalCard({ card, hidden, size = 'md' }: Props) {
  const bg = PANEL_BG[card.color] ?? 'bg-zinc-700';
  const dim = size === 'sm' ? 'w-10 h-14' : 'w-14 h-20';

  if (hidden) {
    return (
      <div className={[dim, 'rounded-lg border border-white/10 bg-zinc-900 flex items-center justify-center'].join(' ')}>
        <span className="text-white/20 text-xs">?</span>
      </div>
    );
  }

  return (
    <div
      className={[
        dim,
        'rounded-lg border border-white/20 flex flex-col items-center justify-center gap-1',
        bg,
      ].join(' ')}
      title={`Goal: ${card.color}`}
    >
      <span className="text-white font-bold text-xs">{DRAGON_LABEL[card.color]}</span>
      <span className="text-white/60 text-[9px]">GOAL</span>
    </div>
  );
}
