import type { ActionCard as ActionCardType } from '../../engine/types';
import { PANEL_BG, PANEL_BG_FALLBACK } from './colors';
import { useTranslation } from '../../i18n/LanguageContext';

type Props = {
  card: ActionCardType;
  selected?: boolean;
  onClick?: () => void;
};

const ACTION_ICON: Record<string, string> = {
  'trade-hands':  '🤝',
  'trade-goals':  '🎯',
  'rotate-goals': '🔄',
  'move-card':    '📦',
  'zap-card':     '⚡',
};

export default function ActionCard({ card, selected, onClick }: Props) {
  const { t } = useTranslation();
  const silverDot = PANEL_BG[card.silverColor] ?? PANEL_BG_FALLBACK;

  return (
    <button
      onClick={onClick}
      className={[
        'w-20 h-28 rounded-lg border flex flex-col items-center justify-center gap-1 shrink-0 transition-transform bg-zinc-900',
        selected
          ? 'border-yellow-400 scale-110 shadow-lg shadow-yellow-400/30'
          : 'border-white/10 hover:border-white/30',
        onClick ? 'cursor-pointer' : 'cursor-default',
      ].join(' ')}
      title={card.id}
    >
      <span className="text-2xl">{ACTION_ICON[card.action]}</span>
      <span className="text-[9px] text-center text-white/80 whitespace-pre-line leading-tight px-1">
        {t('action.' + card.action)}
      </span>
      {/* Silver color indicator dot */}
      <div className="w-4 h-4 rounded-full mt-1" style={silverDot} title={`Silver → ${t('color.' + card.silverColor)}`} />
    </button>
  );
}
