import { useGameStore } from '../../store/gameStore';
import { useMultiplayerStore } from '../../store/multiplayerStore';
import { SILVER_COLOR_BG, DRAGON_LABEL, PANEL_BG } from '../Card/colors';
import type { DragonColor } from '../../engine/types';

const GOAL_BORDER: Record<DragonColor, string> = {
  red:   'border-red-600',
  gold:  'border-yellow-500',
  blue:  'border-blue-600',
  green: 'border-green-600',
  black: 'border-zinc-500',
};

const GOAL_TEXT: Record<DragonColor, string> = {
  red:   'text-red-400',
  gold:  'text-yellow-400',
  blue:  'text-blue-400',
  green: 'text-green-400',
  black: 'text-zinc-400',
};

export default function Sidebar() {
  const state = useGameStore(s => s.state);
  const isMultiplayer = useGameStore(s => s.isMultiplayer);
  const goToLobby = useGameStore(s => s.goToLobby);
  const drawInsteadOfPlay = useGameStore(s => s.drawInsteadOfPlay);
  const myPlayerIndex = useMultiplayerStore(s => s.myPlayerIndex);

  if (!state) return null;

  const currentPlayer = state.players[state.currentPlayerIndex];
  // In multiplayer: "my" player is myPlayerIndex, not currentPlayerIndex
  const myPlayer = (isMultiplayer && myPlayerIndex !== null && myPlayerIndex >= 0)
    ? (state.players[myPlayerIndex] ?? currentPlayer)
    : currentPlayer;
  const isMyTurn = !isMultiplayer || myPlayerIndex === state.currentPlayerIndex;
  const myGoal = state.goals.find(g => g.id === myPlayer.goalId);
  const otherPlayers = state.players.filter(p => p.id !== myPlayer.id);
  const topDiscard = state.discardPile[state.discardPile.length - 1] ?? null;
  const isDrawPhase = state.phase === 'draw';
  const isPlayPhase = state.phase === 'play';
  const silverBg = SILVER_COLOR_BG[state.silverDragonColor];

  return (
    <aside className="w-[196px] shrink-0 bg-[#0f131a] border-r border-[#333c4a] flex flex-col overflow-hidden">

      {/* Title */}
      <div className="px-4 pt-5 pb-0">
        <p className="text-[#eff1f5] font-bold text-sm tracking-wide">Seven Dragons</p>
      </div>

      {/* Turn indicator */}
      <div className="px-4 pt-3">
        <div className={[
          'rounded-lg py-2 text-center text-[13px] font-bold',
          isMyTurn && isDrawPhase ? 'bg-yellow-500 text-[#0d1117]'
            : isMyTurn ? 'bg-green-700/40 text-green-300 border border-green-600/40'
            : 'bg-[#1a2130] text-[#96a3b7] border border-[#333c4a]',
        ].join(' ')}>
          {isMyTurn ? (isDrawPhase ? 'Your Turn' : 'Your Turn') : `${currentPlayer.name}'s turn`}
        </div>
        <p className="text-[#96a3b7] text-[11px] mt-2 leading-snug">
          {isMyTurn
            ? (isDrawPhase ? 'Draw a card to start your turn' : 'Select a card to play')
            : 'Waiting for opponent…'}
        </p>
      </div>

      {/* Draw pile + Discard */}
      <div className="px-4 pt-4">
        <div className="flex gap-2">
          <div>
            <p className="text-[#96a3b7] text-[10px] font-bold tracking-widest mb-1">DRAW PILE</p>
            <button
              disabled={!isPlayPhase || !isMyTurn || state.deck.length === 0}
              onClick={isPlayPhase && isMyTurn ? drawInsteadOfPlay : undefined}
              title={isPlayPhase && isMyTurn ? 'Dobierz kartę zamiast zagrać' : undefined}
              className={[
                'rounded-lg w-[70px] h-[72px] flex flex-col items-center justify-center transition-colors',
                isPlayPhase && isMyTurn && state.deck.length > 0
                  ? 'bg-[#0c0f15] border-2 border-green-500/60 hover:border-green-400 hover:bg-green-900/20 cursor-pointer'
                  : 'bg-[#0c0f15] border border-[#333c4a] cursor-default',
              ].join(' ')}
            >
              <span className="text-[#eff1f5] text-2xl font-bold leading-none">{state.deck.length}</span>
              <span className="text-[#96a3b7] text-[9px] mt-0.5">cards left</span>
              {isPlayPhase && state.deck.length > 0 && (
                <span className="text-green-400 text-[8px] mt-1 leading-none">draw</span>
              )}
            </button>
          </div>
          <div>
            <p className="text-[#96a3b7] text-[10px] font-bold tracking-widest mb-1">DISCARD</p>
            <div className={[
              'border-2 rounded-lg w-[70px] h-[72px] flex flex-col items-center justify-center overflow-hidden',
              topDiscard ? 'border-red-600 bg-[#0c0f15]' : 'border-[#333c4a] bg-[#0c0f15]',
            ].join(' ')}>
              {topDiscard ? (
                <>
                  <span className="text-[#eff1f5] text-[10px] font-semibold text-center leading-tight px-1">
                    {topDiscard.action.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </span>
                  <span className="text-[22px] mt-1">↔</span>
                </>
              ) : (
                <span className="text-[#96a3b7] text-[9px]">empty</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Silver Dragon */}
      <div className="px-4 pt-4">
        <div className="bg-[#0c0f15] border border-[#a8a9ad] rounded-lg px-3 py-2">
          <p className="text-[#96a3b7] text-[9px] font-bold tracking-widest mb-2">SILVER DRAGON</p>
          <div className="flex items-center gap-2">
            <div className={['w-3 h-3 rounded-full shrink-0', silverBg].join(' ')} />
            <span className="text-[#eff1f5] text-xs font-semibold">
              Currently: {state.silverDragonColor === 'all' ? 'All' : DRAGON_LABEL[state.silverDragonColor as DragonColor]}
            </span>
          </div>
        </div>
      </div>

      {/* Opponents */}
      {otherPlayers.length > 0 && (
        <div className="px-4 pt-4">
          <p className="text-[#96a3b7] text-[10px] font-bold tracking-widest mb-2">OPPONENTS</p>
          <div className="flex flex-col gap-1.5">
            {otherPlayers.map(p => (
              <div key={p.id} className="bg-[#191f28] rounded-lg px-3 py-2 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#2a3342] flex items-center justify-center shrink-0">
                  <span className="text-[#96a3b7] text-xs font-bold">{p.name[0].toUpperCase()}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[#eff1f5] text-xs font-semibold leading-none truncate">{p.name}</p>
                  <p className="text-[#96a3b7] text-[10px] mt-0.5">
                    {/* handCount is accurate in multiplayer (masked state), hand.length in local */}
                    {('handCount' in p ? (p as { handCount: number }).handCount : p.hand.length)} cards · Goal: ?
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Your Goal */}
      {myGoal && (
        <div className="px-4 pt-4">
          <p className="text-[#96a3b7] text-[10px] font-bold tracking-widest mb-2">YOUR GOAL</p>
          <div className={['bg-[#141921] border-2 rounded-xl p-3 flex items-center gap-3', GOAL_BORDER[myGoal.color]].join(' ')}>
            <div className={['w-8 h-8 rounded-full shrink-0', PANEL_BG[myGoal.color]].join(' ')} />
            <div>
              <p className={['font-bold text-base leading-none', GOAL_TEXT[myGoal.color]].join(' ')}>
                {DRAGON_LABEL[myGoal.color]}
              </p>
              <p className="text-[#96a3b7] text-[10px] mt-0.5">Connect 7 {myGoal.color} panels</p>
            </div>
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Leave Game */}
      <div className="px-4 pb-4 pt-3">
        <button
          onClick={goToLobby}
          className="w-full py-2 rounded-lg border border-red-800 bg-red-950/40 text-red-400 text-xs font-semibold hover:bg-red-900/40 hover:border-red-600 transition-colors"
        >
          ← Leave Game
        </button>
      </div>
    </aside>
  );
}
