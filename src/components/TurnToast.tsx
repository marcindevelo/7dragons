import { useEffect, useRef, useState } from 'react'; // useRef kept for prevIndex
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useMultiplayerStore } from '../store/multiplayerStore';
import { useTranslation } from '../i18n/LanguageContext';

export default function TurnToast() {
  const state = useGameStore(s => s.state);
  const isMultiplayer = useGameStore(s => s.isMultiplayer);
  const myPlayerIndex = useMultiplayerStore(s => s.myPlayerIndex);

  const { t } = useTranslation();

  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState('');
  const [isMe, setIsMe] = useState(false);
  const prevIndex = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!state || state.phase === 'ended') return;

    const idx = state.currentPlayerIndex;
    if (prevIndex.current === idx) return;
    prevIndex.current = idx;

    const player = state.players[idx];
    const me = !isMultiplayer
      ? idx === 0
      : myPlayerIndex === idx;

    setLabel(me ? t('turn.yours') : t('turn.other', { name: player.name }));
    setIsMe(me);
    setVisible(true);

    if (timerRef.current) clearTimeout(timerRef.current);
  }, [state?.currentPlayerIndex, state?.phase]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={label}
          data-tutorial="turn-toast"
          className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
          initial={{ y: -20, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -12, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 420, damping: 30 }}
        >
          <div className={[
            'relative overflow-hidden px-6 py-2.5 rounded-xl text-sm font-bold shadow-xl shadow-black/50 border',
            isMe
              ? 'bg-green-700/90 text-green-100 border-green-500/60'
              : 'bg-zinc-800/90 text-white/80 border-white/10',
          ].join(' ')}>
            {label}
            {!isMe && (
              <motion.div
                className="absolute bottom-0 left-0 h-px bg-yellow-400"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 4, ease: 'linear' }}
                style={{ transformOrigin: 'left', width: '100%' }}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
