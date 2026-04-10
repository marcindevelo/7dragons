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
  if (!state.seatOrder) return null; // guard against old server state without seatOrder

  const myIdx = isMultiplayer ? (myPlayerIndex ?? 0) : 0;

  // Build ring from seatOrder (random seat positions assigned at game start)
  let unusedCursor = 0;
  const rawRing = state.seatOrder.map((seat, seatIdx) => {
    if (seat !== null) {
      const p = state.players[seat];
      const isMe = seat === myIdx;
      const isCurrentTurn = seat === state.currentPlayerIndex;
      const goal = state.goals.find(g => g.id === p.goalId);
      const goalVisible = goal && (goal.id as string) !== 'hidden' && isMe;
      const handCount = ('handCount' in p)
        ? (p as unknown as { handCount: number }).handCount
        : p.hand.length;
      const goalBg = goalVisible ? (PANEL_BG[goal!.color as DragonColor] ?? 'bg-zinc-700') : null;
      const goalLabel = goalVisible ? DRAGON_LABEL[goal!.color as DragonColor] : '?';
      return { type: 'player' as const, isMe, isCurrentTurn, goalBg, goalLabel, name: p.name, handCount, id: p.id, seatNumber: seatIdx + 1 };
    } else {
      const slotIdx = unusedCursor++;
      return { type: 'unused' as const, id: `unused-${slotIdx}`, seatNumber: seatIdx + 1 };
    }
  });

  // Rotate ring so "You" (myIdx) is always at position 2 (middle of 5)
  const myRingIdx = rawRing.findIndex(item => item.type === 'player' && item.isMe);
  const midPos = Math.floor(rawRing.length / 2);
  const start = (myRingIdx - midPos + rawRing.length) % rawRing.length;
  const ring = [...rawRing.slice(start), ...rawRing.slice(0, start)];

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

          {/* Ring: items column + right-side wrap rail */}
          <div className="flex gap-1.5">

            {/* Left: items + down connectors */}
            <div className="flex-1 flex flex-col min-w-0">
              {ring.map((item, idx) => (
                <div key={item.id} className="flex flex-col">
                  {item.type === 'player' ? (
                    <div className={[
                      'rounded-xl px-3 py-2.5 flex items-center gap-2.5 border transition-colors',
                      item.isCurrentTurn
                        ? 'bg-yellow-500/10 border-yellow-500/40'
                        : 'bg-[#191f28] border-white/5',
                    ].join(' ')}>
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
                      <div className="min-w-0 flex-1">
                        <p className="text-[#eff1f5] text-xs font-semibold leading-none truncate">
                          {item.isMe ? 'You' : item.name}
                        </p>
                        <p className="text-[#96a3b7] text-[10px] mt-0.5">
                          {item.handCount} {item.handCount === 1 ? 'card' : 'cards'}
                        </p>
                      </div>
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
                        <p className="text-white/30 text-xs font-semibold leading-none">Unused goal #{item.seatNumber}</p>
                        <p className="text-white/20 text-[10px] mt-0.5">face down</p>
                      </div>
                      <div className="w-4 h-4 rounded-full bg-zinc-700 border border-white/10 shrink-0" />
                    </div>
                  )}

                  {/* Down arrow between items (not after last) */}
                  {idx < ring.length - 1 && (
                    <div className="flex flex-col items-center py-0.5">
                      <div className="w-px h-3 bg-white/20" />
                      <svg width="10" height="7" viewBox="0 0 10 7" fill="none" className="opacity-25">
                        <path d="M5 7L0 0h10L5 7z" fill="white" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right: wrap rail — exits bottom of last item, runs up right side, enters top of first */}
            <div className="relative w-3 self-stretch">
              {/* Bracket: top + right + bottom borders = open-left ⊏ shape */}
              <div className="absolute inset-y-5 inset-x-0 border-r border-y border-white/20 rounded-r-2xl" />
              {/* Arrowhead in the middle of the rail pointing UP — shows direction of flow along the rail */}
              <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-center">
                <svg width="8" height="6" viewBox="0 0 8 6" fill="none" className="opacity-35 rotate-180">
                  <path d="M4 6L0 0h8L4 6z" fill="white" />
                </svg>
              </div>
            </div>

          </div>
        </div>
      </aside>
    </>
  );
}
