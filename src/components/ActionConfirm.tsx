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
    <div className="shrink-0 bg-[#0d1117] border-t border-white/10 px-4 py-3 flex flex-col gap-3">

      {/* Row 1: card info + silver toggle */}
      <div className="flex items-center gap-3">
        {/* Card badge */}
        <div className="bg-zinc-800 border border-white/20 rounded-xl px-3 py-1.5 flex items-center gap-2 shrink-0">
          <div className={['w-2.5 h-2.5 rounded-full shrink-0', silverBg].join(' ')} />
          <p className="text-white font-bold text-sm leading-none">{actionLabel}</p>
        </div>

        <div className="flex-1" />

        {/* Silver Dragon pill toggle */}
        <button
          onClick={() => setApplySilver(v => !v)}
          className={[
            'flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors shrink-0',
            applySilver
              ? 'bg-zinc-700 border-white/20 text-white'
              : 'bg-zinc-800/50 border-white/10 text-white/40',
          ].join(' ')}
        >
          <div className={['w-2 h-2 rounded-full shrink-0 transition-colors', applySilver ? silverBg : 'bg-zinc-600'].join(' ')} />
          <span>Silver → {applySilver ? silverLabel : 'off'}</span>
        </button>
      </div>

      {/* Row 2: Cancel + Play buttons */}
      <div className="flex gap-2">
        <button
          onClick={cancelActionStaging}
          className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-sm transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => playAction(cardId, true, applySilver)}
          className="flex-[2] py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl text-sm transition-colors"
        >
          Play {actionLabel}
        </button>
      </div>
    </div>
  );
}
