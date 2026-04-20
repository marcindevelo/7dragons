import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { PANEL_BG, PANEL_BG_FALLBACK } from './Card/colors';
import { largestGroup } from '../engine/win';
import { useTranslation } from '../i18n/LanguageContext';

export default function WinBanner() {
  const { t } = useTranslation();
  const state = useGameStore(s => s.state);
  const resetGame = useGameStore(s => s.resetGame);
  const goToLobby = useGameStore(s => s.goToLobby);

  if (!state) return null;

  if (state.winner) {
    const winner = state.players.find(p => p.id === state.winner)!;
    const goal = state.goals.find(g => g.id === winner.goalId);
    if (!goal || (goal.id as string) === 'hidden') return null;

    const bg = PANEL_BG[goal.color] ?? PANEL_BG_FALLBACK;
    const count = largestGroup(state.board, goal.color, state.silverDragonColor);
    const deckExhausted = count < 7;

    // All player scores (shown for deck-exhaustion wins)
    const scores = deckExhausted
      ? state.players
          .map(p => {
            const g = state.goals.find(gl => gl.id === p.goalId);
            if (!g || (g.id as string) === 'hidden') return null;
            return { player: p, count: largestGroup(state.board, g.color, state.silverDragonColor) };
          })
          .filter(Boolean)
          .filter(s => s!.player.id !== winner.id)
          .sort((a, b) => b!.count - a!.count)
      : [];

    return (
      <motion.div
        className="shrink-0 bg-[#0d1117] border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-8 py-3 sm:py-0 sm:h-36 gap-3 sm:gap-6"
        initial={{ y: 144, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      >
        {/* Winner info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/30 flex items-center justify-center shrink-0" style={bg}>
            <span className="text-white text-base sm:text-lg font-bold">
              {deckExhausted ? count : t(`color.${goal.color}`)[0]}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-lg sm:text-xl font-bold leading-tight truncate">{t('win.title', { name: winner.name })}</p>
            <p className="text-white/50 text-xs sm:text-sm mt-0.5">
              {deckExhausted
                ? t('win.deckExhausted', { count, color: t(`color.${goal.color}`) })
                : t('win.connected', { color: t(`color.${goal.color}`) })
              }
            </p>
            {deckExhausted && scores.length > 0 && (
              <div className="flex gap-3 mt-1">
                {scores.map(s => (
                  <span key={s!.player.id} className="text-white/30 text-xs">{s!.player.name}: {s!.count}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 sm:gap-3 shrink-0">
          <button
            onClick={resetGame}
            className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl text-sm transition-colors"
          >
            {t('win.playAgain')}
          </button>
          <button
            onClick={goToLobby}
            className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm transition-colors"
          >
            {t('win.lobby')}
          </button>
        </div>
      </motion.div>
    );
  }

  return null;
}
