import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { PANEL_BG, PANEL_BG_FALLBACK } from './Card/colors';
import type { ActionCard } from '../engine/types';
import { useTranslation } from '../i18n/LanguageContext';

type Props = {
  cardId: string;
};

export default function ActionConfirm({ cardId }: Props) {
  const { t } = useTranslation();
  const state = useGameStore(s => s.state);
  const playAction = useGameStore(s => s.playAction);
  const cancelActionStaging = useGameStore(s => s.cancelActionStaging);

  const [applySilver, setApplySilver] = useState(true);

  if (!state) return null;

  const currentPlayer = state.players[state.currentPlayerIndex];
  const card = currentPlayer.hand.find(c => c.id === cardId) as ActionCard | undefined;
  if (!card) return null;

  const actionLabel = t(`action.${card.action}.full`);
  const silverColor = card.silverColor;
  const silverBg = PANEL_BG[silverColor] ?? PANEL_BG_FALLBACK;
  const silverLabel = t(`color.${silverColor}`);

  // First action card ever played must change Silver Dragon color (can't stay 'all')
  const silverForced = state.silverDragonColor === 'all';

  return (
    <div className="shrink-0 bg-[#0d1117] border-t border-white/10 px-4 py-3 flex flex-col gap-3">

      {/* Row 1: card info + silver toggle */}
      <div className="flex items-center gap-3">
        {/* Card badge */}
        <div className="bg-zinc-800 border border-white/20 rounded-xl px-3 py-1.5 flex items-center gap-2 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={silverBg} />
          <p className="text-white font-bold text-sm leading-none">{actionLabel}</p>
        </div>

        <div className="flex-1" />

        {/* Silver Queen pill toggle — locked when Silver is still 'all' */}
        <button
          onClick={() => !silverForced && setApplySilver(v => !v)}
          className={[
            'flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors shrink-0',
            silverForced
              ? 'bg-zinc-700 border-white/20 text-white cursor-not-allowed opacity-80'
              : applySilver
                ? 'bg-zinc-700 border-white/20 text-white'
                : 'bg-zinc-800/50 border-white/10 text-white/40',
          ].join(' ')}
          title={silverForced ? t('actionConfirm.silverForced') : undefined}
        >
          <div className="w-2 h-2 rounded-full shrink-0 transition-colors" style={(silverForced || applySilver) ? silverBg : { backgroundColor: '#52525b' }} />
          <span>{t('hud.silver')} {(silverForced || applySilver) ? silverLabel : t('actionConfirm.silverOff')}</span>
        </button>
      </div>

      {/* Row 2: Cancel + Play buttons */}
      <div className="flex gap-2">
        <button
          onClick={cancelActionStaging}
          className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-sm transition-colors"
        >
          {t('actionConfirm.cancel')}
        </button>
        <button
          onClick={() => playAction(cardId, true, applySilver)}
          className="flex-[2] py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl text-sm transition-colors"
        >
          {t('actionConfirm.play', { action: actionLabel })}
        </button>
      </div>
    </div>
  );
}
