import type { GoalCard as GoalCardType } from '../../engine/types';
import { PANEL_BG, PANEL_BG_FALLBACK } from './colors';
import { useTranslation } from '../../i18n/LanguageContext';

type Props = {
  card: GoalCardType;
  hidden?: boolean;
  size?: 'sm' | 'md';
};

export default function GoalCard({ card, hidden, size = 'md' }: Props) {
  const { t } = useTranslation();
  const bg = PANEL_BG[card.color] ?? PANEL_BG_FALLBACK;
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
      ].join(' ')}
      style={bg}
      title={`Goal: ${card.color}`}
    >
      <span className="text-white font-bold text-xs">{t('color.' + card.color)}</span>
      <span className="text-white/60 text-[9px]">{t('goal.label')}</span>
    </div>
  );
}
