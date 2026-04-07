import { useGameStore } from '../../store/gameStore';
import { useMultiplayerStore } from '../../store/multiplayerStore';
import { PANEL_BG, DRAGON_LABEL } from '../Card/colors';
import type { DragonColor } from '../../engine/types';

export function RightSidebarToggle({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="sm:hidden fixed bottom-20 right-3 z-40 w-9 h-9 rounded-full bg-black/70 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white transition-colors"
    >
      ☰
    </button>
  );
}

export default function RightSidebar({ mobileOpen, onClose }: { mobileOpen?: boolean; onClose?: () => void }) {
  const state = useGameStore(s => s.state);
  const isMultiplayer = useGameStore(s => s.isMultiplayer);
  const myPlayerIndex = useMultiplayerStore(s => s.myPlayerIndex);

  if (!state) return null;

  const myIdx = isMultiplayer ? (myPlayerIndex ?? 0) : 0;

  // Build unified ring: players in seat order, then unused goal slots
  const playerItems = state.players.map((p, i) => {
    const isMe = i === myIdx;
    const isCurrentTurn = i === state.currentPlayerIndex;
    const goal = state.goals.find(g => g.id === p.goalId);
    const goalVisible = goal && (goal.id as string) !== 'hidden' && i === myIdx;
    const handCount = ('handCount' in p)
      ? (p as unknown as { handCount: number }).handCount
      : p.hand.length;
    const goalBg = goalVisible ? (PANEL_BG[goal!.color as DragonColor] ?? 'bg-zinc-700') : null;
    const goalLabel = goalVisible ? DRAGON_LABEL[goal!.color as DragonColor] : '?';

    return { type: 'player' as const, isMe, isCurrentTurn, goalBg, goalLabel, name: p.name, handCount, id: p.id };
  });

  const unusedItems = state.unusedGoalOrder.map((_, i) => ({
    type: 'unused' as const,
    id: `unused-${i}`,
  }));

  const ring = [...playerItems, ...unusedItems];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="sm:hidden fixed inset-0 z-40 bg-black/60"
          onClick={onClose}
        />
      )}

      <aside className={[
        'flex flex-col overflow-y-auto overflow-x-hidden border-white/10',
        'sm:relative sm:w-[196px] sm:shrink-0 sm:border-l sm:translate-x-0',
        'fixed top-0 right-0 h-full w-[220px] z-50 bg-black/90 backdrop-blur-md border-l transition-transform duration-300',
        mobileOpen ? 'translate-x-0' : 'translate-x-full sm:translate-x-0',
      ].join(' ')}>

        <div className="px-4 pt-4 pb-4 flex flex-col">
          <p className="text-[#96a3b7] text-[10px] font-bold tracking-widest mb-3">GOALS ON TABLE</p>

          <div className="flex flex-col">
            {ring.map((item, idx) => (
              <div key={item.id} className="flex flex-col items-stretch">

                {item.type === 'player' ? (
                  <div className={[
                    'rounded-xl px-3 py-2.5 flex items-center gap-2.5 border transition-colors',
                    item.isCurrentTurn
                      ? 'bg-yellow-500/10 border-yellow-500/40'
                      : 'bg-[#191f28] border-white/5',
                  ].join(' ')}>
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className={[
                        'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                        item.goalBg ?? 'bg-[#2a3342]',
                      ].join(' ')}>
                        <span className={item.goalBg ? 'text-white/90' : 'text-[#96a3b7]'}>
                          {item.goalBg ? item.goalLabel[0] : item.name[0].toUpperCase()}
                        </span>
                      </div>
                      {item.isCurrentTurn && (
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-yellow-400 border-2 border-black" />
                      )}
                    </div>

                    {/* Name + hand count */}
                    <div className="min-w-0 flex-1">
                      <p className="text-[#eff1f5] text-xs font-semibold leading-none truncate">
                        {item.isMe ? 'You' : item.name}
                      </p>
                      <p className="text-[#96a3b7] text-[10px] mt-0.5">
                        {item.handCount} {item.handCount === 1 ? 'card' : 'cards'}
                      </p>
                    </div>

                    {/* Goal chip */}
                    <div className="shrink-0 flex flex-col items-center gap-0.5">
                      <div className={['w-4 h-4 rounded-full border border-white/20', item.goalBg ?? 'bg-zinc-700'].join(' ')} />
                      <span className="text-[8px] text-white/30 leading-none">{item.goalLabel}</span>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl px-3 py-2.5 flex items-center gap-2.5 border border-white/5 bg-zinc-900/30">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                      <span className="text-white/20 text-sm font-bold">?</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white/30 text-xs font-semibold leading-none">Hidden goal</p>
                      <p className="text-white/20 text-[10px] mt-0.5">face down</p>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-zinc-700 border border-white/10 shrink-0" />
                  </div>
                )}

                {/* Arrow connector */}
                <div className="flex justify-center py-1">
                  <span className={[
                    'text-[11px]',
                    idx < ring.length - 1 ? 'text-white/15' : 'text-white/20',
                  ].join(' ')}>
                    {idx < ring.length - 1 ? '↓' : '↺'}
                  </span>
                </div>

              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
