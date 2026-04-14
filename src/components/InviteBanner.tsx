import { AnimatePresence, motion } from 'framer-motion';
import type { InviteMessage } from '../network/inviteClient';
import { useTranslation } from '../i18n/LanguageContext';

type Props = {
  invite: InviteMessage | null;
  onJoin: (roomCode: string) => void;
  onDismiss: () => void;
};

export default function InviteBanner({ invite, onJoin, onDismiss }: Props) {
  const { t } = useTranslation();
  return (
    <AnimatePresence>
      {invite && (
        <motion.div
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] pointer-events-auto"
          initial={{ y: -40, opacity: 0, scale: 0.92 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -20, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          <div className="flex items-center gap-4 bg-zinc-900 border border-blue-500/50 rounded-2xl px-5 py-4 shadow-2xl shadow-black/70 min-w-[320px]">
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-white font-bold text-sm leading-tight">
                {t('invite.text', { name: invite.fromName })}
              </span>
              <span className="text-white/40 text-xs mt-0.5">
                {t('invite.room')} <span className="font-mono text-white/70 tracking-widest">{invite.roomCode}</span>
              </span>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => onJoin(invite.roomCode)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors"
              >
                {t('invite.join')}
              </button>
              <button
                onClick={onDismiss}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white/60 text-xs font-bold rounded-xl transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
