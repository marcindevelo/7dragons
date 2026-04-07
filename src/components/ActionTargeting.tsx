import type { } from 'react';
import { useGameStore } from '../store/gameStore';
import type { PendingAction, BoardPosition } from '../engine/types';

type Props = {
  pendingAction: PendingAction;
  onBoardCardClick?: (posKey: string) => void;
  onDropZoneClick?: (pos: BoardPosition) => void;
};

/**
 * Overlay shown during action-targeting phase.
 * Handles: trade-hands, trade-goals, rotate-goals.
 * Zap-card and move-card targeting is handled via board clicks (see GamePage).
 */
export default function ActionTargeting({ pendingAction }: Props) {
  const state = useGameStore(s => s.state);
  const resolveAction = useGameStore(s => s.resolveAction);

  if (!state) return null;

  const currentPlayer = state.players[state.currentPlayerIndex];
  const otherPlayers = state.players.filter(p => p.id !== currentPlayer.id);

  // ── Rotate Goals ──────────────────────────────────────────────────────────
  if (pendingAction.type === 'rotate-goals') {
    const myIdx = state.currentPlayerIndex;
    const rawRing = [
      ...state.players.map((p, i) => ({ label: i === myIdx ? 'You' : p.name, isMe: i === myIdx, isPlayer: true })),
      ...state.unusedGoalOrder.map(() => ({ label: '?', isMe: false, isPlayer: false })),
    ];
    const n = rawRing.length;
    // Left: ring shifts left → seat i gets ring[i+1] → I receive from (myIdx+1)%n
    const leftSource = rawRing[(myIdx + 1) % n];
    // Right: ring shifts right → seat i gets ring[i-1] → I receive from (myIdx-1+n)%n
    const rightSource = rawRing[(myIdx - 1 + n) % n];

    // Rotate so current player is always in the middle
    const midPos = Math.floor(n / 2);
    const start = (myIdx - midPos + n) % n;
    const ring = [...rawRing.slice(start), ...rawRing.slice(0, start)];

    return (
      <div className="absolute inset-0 flex items-center justify-center z-40 bg-black/60 backdrop-blur-sm">
        <div className="bg-zinc-900 rounded-2xl p-5 border border-white/20 shadow-2xl text-center max-w-sm w-full mx-4">
          <p className="text-white font-bold text-lg mb-1">Rotate Goals</p>
          <p className="text-white/40 text-xs mb-4">Goals pass around the ring — choose direction</p>

          {/* Ring visualization */}
          <div className="flex items-center justify-center flex-wrap gap-1 mb-5">
            {ring.map((seat, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className={[
                  'px-2.5 py-1 rounded-lg text-xs font-semibold border',
                  seat.isMe
                    ? 'bg-green-800/60 border-green-500/50 text-green-100'
                    : seat.isPlayer
                      ? 'bg-zinc-700 border-white/20 text-white/80'
                      : 'bg-zinc-800 border-white/10 text-white/30',
                ].join(' ')}>
                  {seat.label}
                </div>
                <span className="text-white/20 text-xs">{i < ring.length - 1 ? '→' : '↺'}</span>
              </div>
            ))}
          </div>

          {/* Buttons with receive preview */}
          <div className="flex gap-3">
            <button
              onClick={() => resolveAction({ direction: 'left' })}
              className="flex-1 py-3 px-2 bg-blue-700/80 hover:bg-blue-600 text-white font-bold rounded-xl transition-colors flex flex-col items-center gap-0.5"
            >
              <span>← Left</span>
              <span className="text-blue-200/70 text-[10px] font-normal leading-tight">
                receive: <span className="font-semibold text-blue-100">{leftSource.label}</span>
              </span>
            </button>
            <button
              onClick={() => resolveAction({ direction: 'right' })}
              className="flex-1 py-3 px-2 bg-blue-700/80 hover:bg-blue-600 text-white font-bold rounded-xl transition-colors flex flex-col items-center gap-0.5"
            >
              <span>Right →</span>
              <span className="text-blue-200/70 text-[10px] font-normal leading-tight">
                receive: <span className="font-semibold text-blue-100">{rightSource.label}</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Trade Hands ───────────────────────────────────────────────────────────
  if (pendingAction.type === 'trade-hands') {
    return (
      <div className="absolute inset-0 flex items-center justify-center z-40 bg-black/60 backdrop-blur-sm">
        <div className="bg-zinc-900 rounded-2xl p-8 border border-white/20 shadow-2xl text-center max-w-xs w-full mx-4">
          <p className="text-white font-bold text-lg mb-2">Trade Hands</p>
          <p className="text-white/50 text-sm mb-6">Choose a player to swap hands with</p>
          <div className="flex flex-col gap-3">
            {otherPlayers.map(p => {
              const count = 'handCount' in p ? (p as unknown as { handCount: number }).handCount : p.hand.length;
              return (
                <button
                  key={p.id}
                  onClick={() => resolveAction({ targetPlayerId: p.id })}
                  className="py-3 bg-zinc-700 hover:bg-zinc-600 text-white font-semibold rounded-xl transition-colors"
                >
                  {p.name} ({count} cards)
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── Trade Goals ───────────────────────────────────────────────────────────
  if (pendingAction.type === 'trade-goals') {
    const unusedGoals = state.unusedGoalOrder
      .map(id => state.goals.find(g => g.id === id)!)
      .filter(Boolean);
    return (
      <div className="absolute inset-0 flex items-center justify-center z-40 bg-black/60 backdrop-blur-sm">
        <div className="bg-zinc-900 rounded-2xl p-8 border border-white/20 shadow-2xl text-center max-w-xs w-full mx-4">
          <p className="text-white font-bold text-lg mb-2">Trade Goals</p>
          <p className="text-white/50 text-sm mb-4">Choose who to swap goals with</p>
          <div className="flex flex-col gap-3">
            {otherPlayers.map(p => (
              <button
                key={p.id}
                onClick={() => resolveAction({ targetPlayerId: p.id })}
                className="py-3 bg-zinc-700 hover:bg-zinc-600 text-white font-semibold rounded-xl transition-colors"
              >
                {p.name}
              </button>
            ))}
            {unusedGoals.map((g, i) => (
              <button
                key={g.id}
                onClick={() => resolveAction({ targetPlayerId: undefined, unusedGoalIndex: i })}
                className="py-3 bg-zinc-700 hover:bg-zinc-600 text-white/60 font-semibold rounded-xl transition-colors"
              >
                Unused goal #{i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Zap Card / Move Card — board click instructions banner ────────────────
  if (pendingAction.type === 'zap-card' || pendingAction.type === 'move-card') {
    const isMove = pendingAction.type === 'move-card';
    const needsDest = isMove && pendingAction.cardPosKey !== null;
    const label = needsDest
      ? 'Click a drop zone to place the card'
      : isMove
        ? 'Click a card on the board to move'
        : 'Click a card on the board to zap it';

    return (
      <div className="absolute top-14 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
        <div className="bg-yellow-500/90 text-black font-bold text-sm px-5 py-2 rounded-full shadow-lg">
          {label}
        </div>
      </div>
    );
  }

  return null;
}
