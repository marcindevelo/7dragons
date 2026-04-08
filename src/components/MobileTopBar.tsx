import { useGameStore } from '../store/gameStore';
import { useMultiplayerStore } from '../store/multiplayerStore';
import { SILVER_COLOR_BG, DRAGON_LABEL, PANEL_BG } from './Card/colors';
import type { DragonColor } from '../engine/types';

export default function MobileTopBar() {
  const state = useGameStore(s => s.state);
  const isMultiplayer = useGameStore(s => s.isMultiplayer);
  const myPlayerIndex = useMultiplayerStore(s => s.myPlayerIndex);

  if (!state) return null;

  const silverBg = SILVER_COLOR_BG[state.silverDragonColor];

  const myPlayer = (isMultiplayer && myPlayerIndex !== null && myPlayerIndex >= 0)
    ? (state.players[myPlayerIndex] ?? state.players[state.currentPlayerIndex])
    : state.players[0]; // in singleplayer, human is always index 0
  const myGoal = state.goals.find(g => g.id === myPlayer.goalId);

  const topDiscard = state.discardPile[state.discardPile.length - 1] ?? null;

  return (
    <div className="sm:hidden flex items-center gap-2 px-3 py-1.5 border-b border-white/10 bg-black/40 backdrop-blur-sm shrink-0">
      {/* Draw pile — informational only */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-white/10 bg-white/5">
        <span className="text-white font-bold text-sm leading-none">{state.deck.length}</span>
        <span className="text-white/40 text-[10px] leading-none">cards</span>
      </div>

      {/* Discard */}
      <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-white/10 bg-white/5 min-w-[56px]">
        {topDiscard ? (
          <span className="text-white/70 text-[10px] leading-none truncate">
            {topDiscard.action.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </span>
        ) : (
          <span className="text-white/30 text-[10px]">empty</span>
        )}
      </div>

      <div className="flex-1" />

      {/* Silver Dragon */}
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-white/10 bg-white/5">
        <div className={['w-2.5 h-2.5 rounded-full shrink-0', silverBg].join(' ')} />
        <span className="text-white/60 text-[10px]">
          {state.silverDragonColor === 'all' ? 'All' : DRAGON_LABEL[state.silverDragonColor as DragonColor]}
        </span>
      </div>

      {/* Goal */}
      {myGoal && (
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-white/10 bg-white/5">
          <div className={['w-2.5 h-2.5 rounded-full shrink-0', PANEL_BG[myGoal.color]].join(' ')} />
          <span className="text-white/60 text-[10px]">{DRAGON_LABEL[myGoal.color]}</span>
        </div>
      )}
    </div>
  );
}
