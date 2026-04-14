import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchGameHistory, type GameRecord } from '../network/historyClient';
import { useTranslation } from '../i18n/LanguageContext';

type Props = { onClose: () => void };

const COLOR_DOT: Record<string, string> = {
  red: 'bg-red-700',
  gold: 'bg-yellow-500',
  blue: 'bg-blue-700',
  green: 'bg-green-700',
  black: 'bg-zinc-950',
};

const REASON_LABEL: Record<string, Record<string, string>> = {
  pl: { 'seven-connected': '7 paneli', 'closest-count': 'Talia wyczerpana', 'last-standing': 'Ostatni gracz' },
  en: { 'seven-connected': '7 panels', 'closest-count': 'Deck exhausted', 'last-standing': 'Last standing' },
};

function formatDuration(start: number, end: number): string {
  const s = Math.round((end - start) / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('pl-PL', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function GameHistoryModal({ onClose }: Props) {
  const { t, lang } = useTranslation();
  const [games, setGames] = useState<GameRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGameHistory()
      .then(setGames)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[500] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <motion.div
          className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl"
          initial={{ scale: 0.95, y: 16 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 16 }}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-bold text-xl tracking-wide">
              {lang === 'pl' ? 'Historia gier' : 'Game History'}
              <span className="text-white/30 text-sm font-normal ml-2">({games.length})</span>
            </h2>
            <button onClick={onClose} className="text-white/30 hover:text-white/70 text-lg leading-none transition-colors">✕</button>
          </div>

          {loading && (
            <p className="text-white/40 text-sm text-center py-8">
              {lang === 'pl' ? 'Ładowanie…' : 'Loading…'}
            </p>
          )}

          {error && (
            <p className="text-red-400 text-sm text-center py-8">{error}</p>
          )}

          {!loading && !error && games.length === 0 && (
            <p className="text-white/40 text-sm text-center py-8">
              {lang === 'pl' ? 'Brak rozegranych gier.' : 'No games played yet.'}
            </p>
          )}

          {!loading && !error && games.length > 0 && (
            <div className="flex flex-col gap-2">
              {games.map(game => (
                <div key={game.id} className="bg-white/5 rounded-xl px-4 py-3 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-white/30 text-[10px] font-mono">{game.roomId}</span>
                      {game.isAI && (
                        <span className="text-[10px] text-yellow-400/60 border border-yellow-400/20 rounded px-1">AI</span>
                      )}
                    </div>
                    <span className="text-white/30 text-[10px]">{formatDate(game.startedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {game.players.map((p, i) => (
                      <div key={i} className={[
                        'flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs',
                        p.isWinner ? 'bg-yellow-500/15 text-yellow-300 font-semibold' : 'text-white/50',
                      ].join(' ')}>
                        <div className={['w-2 h-2 rounded-full shrink-0', COLOR_DOT[p.goalColor] ?? 'bg-zinc-600'].join(' ')} />
                        {p.name}
                        {p.isWinner && <span className="text-yellow-400">★</span>}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-white/25">
                    <span>{REASON_LABEL[lang]?.[game.winReason] ?? game.winReason}</span>
                    <span>⏱ {formatDuration(game.startedAt, game.endedAt)}</span>
                    <span>{game.playerCount}P</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={onClose}
            className="mt-4 w-full py-2.5 bg-white/10 hover:bg-white/20 text-white/70 font-bold rounded-xl text-sm transition-colors"
          >
            {t('tech.close')}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
