import { useGameStore } from '../../store/gameStore';
import { GoalCard } from '../Card';

export default function HUD() {
  const state = useGameStore(s => s.state);
  const goals = useGameStore(s => s.state?.goals ?? []);

  if (!state) return (
    <div className="h-12 bg-black/60 border-b border-white/10 flex items-center px-4 text-white/30 text-xs tracking-widest uppercase shrink-0">
      Seven Dragons
    </div>
  );

  const currentPlayer = state.players[state.currentPlayerIndex];
  const deckCount = state.deck.length;

  return (
    <div className="h-12 bg-black/60 border-b border-white/10 flex items-center px-4 gap-4 shrink-0 text-xs text-white/70">
      <span className="font-bold text-white tracking-wide">Seven Dragons</span>
      <span className="text-white/30">|</span>

      {/* Current player */}
      <span>
        Turn: <span className="text-yellow-400 font-semibold">{currentPlayer.name}</span>
      </span>

      {/* Phase */}
      <span className="text-white/40 capitalize">[{state.phase}]</span>

      <span className="text-white/30">|</span>

      {/* Deck */}
      {deckCount === 0
        ? <span className="text-red-400 font-semibold">Deck empty</span>
        : <span>Deck: {deckCount}</span>
      }

      {/* Discard top */}
      {state.discardPile.length > 0 && (
        <span className="text-white/50">
          Silver → <span className="text-zinc-300 font-semibold capitalize">{state.silverDragonColor}</span>
        </span>
      )}

      {/* Player goals (hidden for others) */}
      <div className="ml-auto flex gap-2 items-center">
        {state.players.map((p, i) => {
          const goal = goals.find(g => g.id === p.goalId);
          const isCurrent = i === state.currentPlayerIndex;
          return (
            <div key={p.id} className="flex flex-col items-center gap-0.5">
              <span className={['text-[9px] leading-none', isCurrent ? 'text-yellow-400' : 'text-white/40'].join(' ')}>
                {p.name}
              </span>
              {goal && <GoalCard card={goal} hidden={false} size="sm" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
