import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { PANEL_BG, DRAGON_LABEL } from './Card/colors';
import type { ActionCard } from '../engine/types';

type Props = {
  cardId: string;
};

const ACTION_LABEL: Record<string, string> = {
  'trade-hands':  'Trade Hands',
  'trade-goals':  'Trade Goals',
  'rotate-goals': 'Rotate Goals',
  'move-card':    'Move a Card',
  'zap-card':     'Zap a Card',
};

export default function ActionConfirm({ cardId }: Props) {
  const state = useGameStore(s => s.state);
  const playAction = useGameStore(s => s.playAction);
  const cancelActionStaging = useGameStore(s => s.cancelActionStaging);

  const [applySilver, setApplySilver] = useState(true);

  if (!state) return null;

  const currentPlayer = state.players[state.currentPlayerIndex];
  const card = currentPlayer.hand.find(c => c.id === cardId) as ActionCard | undefined;
  if (!card) return null;

  const actionLabel = ACTION_LABEL[card.action] ?? card.action;
  const silverColor = card.silverColor;
  const silverBg = PANEL_BG[silverColor] ?? 'bg-zinc-700';
  const silverLabel = DRAGON_LABEL[silverColor];

  return (
    <div className="h-36 shrink-0 bg-[#0d1117] border-t border-white/10 flex items-center justify-between px-8 gap-6">

      {/* Card info */}
      <div className="flex items-center gap-4">
        <div className="bg-zinc-800 border border-white/20 rounded-xl px-4 py-2 text-center min-w-[96px]">
          <p className="text-white font-bold text-sm">{actionLabel}</p>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <div className={['w-2.5 h-2.5 rounded-full shrink-0', silverBg].join(' ')} />
            <span className="text-white/50 text-[11px]">{silverLabel}</span>
          </div>
        </div>
      </div>

      {/* Silver Dragon toggle */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-white/70 text-xs font-semibold tracking-wide">Silver Dragon</p>
          <p className="text-white/40 text-[11px] leading-snug">
            {applySilver
              ? `Zmieni kolor na ${silverLabel}`
              : 'Kolor pozostanie bez zmian'}
          </p>
        </div>
        <button
          onClick={() => setApplySilver(v => !v)}
          className={[
            'relative w-12 h-6 rounded-full transition-colors border',
            applySilver
              ? `${silverBg} border-transparent`
              : 'bg-zinc-700 border-zinc-600',
          ].join(' ')}
          title="Toggle Silver Dragon color change"
        >
          <span
            className={[
              'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all',
              applySilver ? 'left-[calc(100%-22px)]' : 'left-0.5',
            ].join(' ')}
          />
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 shrink-0">
        <button
          onClick={() => playAction(cardId, true, applySilver)}
          className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl text-sm transition-colors"
        >
          Play {actionLabel}
        </button>
        <button
          onClick={cancelActionStaging}
          className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
