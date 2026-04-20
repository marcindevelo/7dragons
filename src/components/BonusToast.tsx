import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { PANEL_BG } from './Card/colors';
import { useTranslation } from '../i18n/LanguageContext';

const CARD_W = 40;
const CARD_H = 56;
// Approximate deck position in HUD top bar ("Deck: N" text)
const DECK_X = 310;
const DECK_Y = 24;

type FlyBatch = { id: number; count: number };

export default function BonusToast() {
  const { t } = useTranslation();
  const bonus = useGameStore(s => s.bonusNotification);
  const [flyBatch, setFlyBatch] = useState<FlyBatch | null>(null);
  const batchId = useRef(0);

  useEffect(() => {
    if (bonus) {
      batchId.current += 1;
      setFlyBatch({ id: batchId.current, count: bonus.count });
    }
  }, [bonus]);

  const endX = window.innerWidth / 2 - CARD_W / 2;
  const endY = window.innerHeight - 144 - CARD_H - 12;

  return (
    <>
      {/* Flying cards — fixed portal over entire UI */}
      {createPortal(
        <AnimatePresence>
          {flyBatch && Array.from({ length: flyBatch.count }, (_, i) => (
            <motion.div
              key={`${flyBatch.id}-${i}`}
              className="fixed pointer-events-none z-[200] rounded-lg border border-white/30 bg-zinc-800 shadow-lg shadow-black/60"
              style={{ width: CARD_W, height: CARD_H, left: 0, top: 0 }}
              initial={{ x: DECK_X, y: DECK_Y, scale: 0.7, opacity: 1, rotate: 0 }}
              animate={{ x: endX, y: endY, scale: 1, opacity: 0, rotate: (i - 1) * 6 }}
              transition={{ duration: 0.55, delay: i * 0.13, ease: [0.2, 0, 0.3, 1] }}
              onAnimationComplete={() => {
                if (i === flyBatch.count - 1) setFlyBatch(null);
              }}
            />
          ))}
        </AnimatePresence>,
        document.body
      )}

      {/* Toast notification */}
      <AnimatePresence>
        {bonus && (
          <motion.div
            className="absolute bottom-36 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
            initial={{ y: 12, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -8, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          >
            <div className="flex items-center gap-3 bg-zinc-900 border border-yellow-400/50 rounded-2xl px-5 py-3 shadow-xl shadow-black/60">
              <span className="text-yellow-400 text-xl font-black">+{bonus.count}</span>
              <div className="flex flex-col">
                <span className="text-white text-sm font-bold leading-tight">
                  {t('bonus.draws', { count: bonus.count })}
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  {bonus.colors.map(color => (
                    <div key={color} className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 rounded-full" style={PANEL_BG[color]} />
                      <span className="text-white/60 text-[11px]">
                        {t(`color.${color}`)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
