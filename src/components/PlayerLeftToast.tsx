import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

export default function PlayerLeftToast() {
  const notification = useGameStore(s => s.playerLeftNotification);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          className="absolute top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          initial={{ y: -16, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -10, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          <div className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-zinc-900/95 border border-red-500/40 text-red-300 shadow-xl shadow-black/50 whitespace-nowrap">
            {notification.gameEnded
              ? `${notification.name} left — game over`
              : `${notification.name} left the game`}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
