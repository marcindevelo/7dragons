import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useMultiplayerStore } from '../store/multiplayerStore';

const ACTION_LABEL: Record<string, string> = {
  'trade-hands':  'Trade Hands',
  'trade-goals':  'Trade Goals',
  'rotate-goals': 'Rotate Goals',
  'move-card':    'Move a Card',
  'zap-card':     'Zap a Card',
};

export default function ActionEventToast() {
  const state = useGameStore(s => s.state);
  const isMultiplayer = useGameStore(s => s.isMultiplayer);
  const myPlayerIndex = useMultiplayerStore(s => s.myPlayerIndex);

  const [visible, setVisible] = useState(false);
  const [event, setEvent] = useState<{ playerName: string; action: string; description: string } | null>(null);
  const lastSeqRef = useRef<number>(-1);

  const myPlayerId = state?.players[isMultiplayer ? (myPlayerIndex ?? 0) : 0]?.id;

  useEffect(() => {
    const ev = state?.lastActionEvent;
    if (!ev) return;
    if (ev.seq === lastSeqRef.current) return;
    lastSeqRef.current = ev.seq;

    // Only show to opponents, not to the player who performed the action
    if (ev.playerId === myPlayerId) return;

    // Personalise: replace target's name with "you" if this viewer is the target
    let description = ev.description;
    if (ev.targetPlayerId === myPlayerId && ev.targetName) {
      description = description.replace(ev.targetName, 'you');
    }

    setEvent({ playerName: ev.playerName, action: ev.action, description });
    setVisible(true);
  }, [state?.lastActionEvent?.seq]);

  if (!visible || !event) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-zinc-900 border border-white/20 rounded-2xl p-6 shadow-2xl max-w-xs w-full mx-4 flex flex-col gap-4"
          initial={{ scale: 0.9, y: 10 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        >
          <div>
            <p className="text-white/40 text-xs font-bold tracking-widest mb-1">ACTION PLAYED</p>
            <p className="text-white font-bold text-base leading-tight">
              {ACTION_LABEL[event.action] ?? event.action}
            </p>
            <p className="text-white/60 text-sm mt-2">
              <span className="text-white/90 font-semibold">{event.playerName}</span>{' '}
              {event.description}.
            </p>
          </div>
          <button
            onClick={() => setVisible(false)}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-colors"
          >
            OK
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
