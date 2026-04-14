import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../i18n/LanguageContext';

type Props = { onClose: () => void };

export default function HelpModal({ onClose }: Props) {
  const { t } = useTranslation();
  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[500] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/75" />

        {/* Panel */}
        <motion.div
          className="relative z-10 w-full max-w-xl max-h-[85vh] overflow-y-auto bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl"
          initial={{ scale: 0.95, y: 16 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 16 }}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-bold text-xl tracking-wide">{t('help.title')}</h2>
            <button
              onClick={onClose}
              className="text-white/30 hover:text-white/70 text-lg leading-none transition-colors"
            >
              ✕
            </button>
          </div>

          <Section title={t('help.goal.title')}>
            {t('help.goal.desc')}
          </Section>

          <Section title={t('help.turn.title')}>
            <ol className="list-decimal list-inside space-y-1 text-white/60 text-sm">
              <li>{t('help.turn.1')}</li>
              <li>{t('help.turn.2')}</li>
            </ol>
          </Section>

          <Section title={t('help.cards.title')}>
            <p>{t('help.cards.desc')}</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5 text-white/60 text-sm">
              <li>{t('help.cards.rule1')}</li>
              <li>{t('help.cards.rule2')}</li>
              <li><b className="text-white/80">Rainbow</b> {t('help.cards.rainbow')}</li>
              <li><b className="text-white/80">Silver Queen</b> {t('help.cards.silver')}</li>
            </ul>
            <p className="mt-2">
              <b className="text-white/80">{t('help.cards.click')}</b>{' '}
              <b className="text-white/80">{t('help.cards.clickAgain')}</b>
            </p>
            <p className="mt-2 text-white/50 text-xs">
              {t('help.cards.bonus')}
            </p>
          </Section>

          <Section title={t('help.actions.title')}>
            <p>{t('help.actions.desc')}</p>
            <div className="mt-3 flex flex-col gap-2">
              {[
                ['Trade Hands', t('help.actions.tradeHands')],
                ['Trade Goals', t('help.actions.tradeGoals')],
                ['Move a Card', t('help.actions.moveCard')],
                ['Rotate Goals', t('help.actions.rotateGoals')],
                ['Zap a Card', t('help.actions.zapCard')],
              ].map(([name, desc]) => (
                <div key={name} className="bg-white/5 rounded-xl px-3 py-2">
                  <p className="text-white text-sm font-semibold">{name}</p>
                  <p className="text-white/50 text-xs mt-0.5">{desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title={t('help.silver.title')}>
            {t('help.silver.desc')}
          </Section>

          <Section title={t('help.deckEnd.title')}>
            {t('help.deckEnd.desc')}
          </Section>

          <button
            onClick={onClose}
            className="mt-2 w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl text-sm transition-colors"
          >
            {t('help.close')}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h3 className="text-yellow-400 text-xs font-bold tracking-widest uppercase mb-2">{title}</h3>
      <div className="text-white/60 text-sm leading-relaxed">{children}</div>
    </div>
  );
}
