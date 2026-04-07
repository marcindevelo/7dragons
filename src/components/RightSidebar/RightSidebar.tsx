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

  // Full "table" ring: players in seat order + unused goal slots
  const unusedCount = state.unusedGoalOrder.length;

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
        // Desktop: static in layout, right side
        'sm:relative sm:w-[196px] sm:shrink-0 sm:border-l sm:translate-x-0',
        // Mobile: fixed drawer from right
        'fixed top-0 right-0 h-full w-[220px] z-50 bg-black/90 backdrop-blur-md border-l transition-transform duration-300',
        mobileOpen ? 'translate-x-0' : 'translate-x-full sm:translate-x-0',
      ].join(' ')}>

        <div className="px-4 pt-4 pb-4 flex flex-col gap-4">

          {/* Players at table */}
          <div>
            <p className="text-[#96a3b7] text-[10px] font-bold tracking-widest mb-2">PLAYERS AT TABLE</p>
            <div className="flex flex-col gap-1.5">
              {state.players.map((p, i) => {
                const isMe = i === myIdx;
                const isCurrentTurn = i === state.currentPlayerIndex;
                const goal = state.goals.find(g => g.id === p.goalId);
                const goalVisible = goal && (goal.id as string) !== 'hidden';
                const handCount = ('handCount' in p)
                  ? (p as unknown as { handCount: number }).handCount
                  : p.hand.length;
                const goalBg = goalVisible ? (PANEL_BG[goal!.color as DragonColor] ?? 'bg-zinc-700') : null;
                const goalLabel = goalVisible ? DRAGON_LABEL[goal!.color as DragonColor] : '?';

                return (
                  <div
                    key={p.id}
                    className={[
                      'rounded-xl px-3 py-2.5 flex items-center gap-2.5 border transition-colors',
                      isCurrentTurn
                        ? 'bg-yellow-500/10 border-yellow-500/40'
                        : 'bg-[#191f28] border-white/5',
                    ].join(' ')}
                  >
                    {/* Seat number + turn indicator */}
                    <div className="relative shrink-0">
                      <div className={[
                        'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                        goalBg ?? 'bg-[#2a3342]',
                      ].join(' ')}>
                        <span className={goalBg ? 'text-white/90' : 'text-[#96a3b7]'}>
                          {goalBg ? goalLabel[0] : p.name[0].toUpperCase()}
                        </span>
                      </div>
                      {isCurrentTurn && (
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-yellow-400 border-2 border-black" />
                      )}
                    </div>

                    {/* Name + hand count */}
                    <div className="min-w-0 flex-1">
                      <p className="text-[#eff1f5] text-xs font-semibold leading-none truncate">
                        {isMe ? 'You' : p.name}
                      </p>
                      <p className="text-[#96a3b7] text-[10px] mt-0.5">
                        {handCount} {handCount === 1 ? 'card' : 'cards'}
                      </p>
                    </div>

                    {/* Goal color chip */}
                    <div className="shrink-0 flex flex-col items-center gap-0.5">
                      <div className={['w-4 h-4 rounded-full border border-white/20', goalBg ?? 'bg-zinc-700'].join(' ')} />
                      <span className="text-[8px] text-white/30 leading-none">{goalVisible ? goalLabel : '?'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Unused goals */}
          {unusedCount > 0 && (
            <div>
              <p className="text-[#96a3b7] text-[10px] font-bold tracking-widest mb-2">UNUSED GOALS</p>
              <div className="flex flex-col gap-1.5">
                {Array.from({ length: unusedCount }).map((_, i) => (
                  <div
                    key={`unused-${i}`}
                    className="rounded-xl px-3 py-2.5 flex items-center gap-2.5 border border-white/5 bg-zinc-900/30"
                  >
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                      <span className="text-white/20 text-sm font-bold">?</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white/30 text-xs font-semibold leading-none">Hidden goal</p>
                      <p className="text-white/20 text-[10px] mt-0.5">face down</p>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-zinc-700 border border-white/10 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Turn order ring — visual hint */}
          <div>
            <p className="text-[#96a3b7] text-[10px] font-bold tracking-widest mb-2">TURN ORDER</p>
            <div className="flex flex-wrap items-center gap-1">
              {state.players.map((p, i) => {
                const isMe = i === myIdx;
                const isCurrentTurn = i === state.currentPlayerIndex;
                return (
                  <div key={p.id} className="flex items-center gap-1">
                    <div className={[
                      'px-2 py-0.5 rounded-md text-[10px] font-semibold border',
                      isCurrentTurn
                        ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-200'
                        : isMe
                          ? 'bg-green-900/40 border-green-700/40 text-green-300/70'
                          : 'bg-zinc-800 border-white/10 text-white/40',
                    ].join(' ')}>
                      {isMe ? 'You' : p.name.split(' ')[0]}
                    </div>
                    <span className="text-white/15 text-[10px]">→</span>
                  </div>
                );
              })}
              {Array.from({ length: unusedCount }).map((_, i) => (
                <div key={`ur-${i}`} className="flex items-center gap-1">
                  <div className="px-2 py-0.5 rounded-md text-[10px] font-semibold border bg-zinc-900 border-white/5 text-white/20">?</div>
                  <span className="text-white/15 text-[10px]">{i < unusedCount - 1 ? '→' : '↺'}</span>
                </div>
              ))}
              {unusedCount === 0 && (
                <span className="text-white/15 text-[10px]">↺</span>
              )}
            </div>
          </div>

        </div>
      </aside>
    </>
  );
}
