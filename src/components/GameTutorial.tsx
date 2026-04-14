import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../i18n/LanguageContext';

// Mini 2×2 card visualisation used in intro slides
function MiniCard({ panels, label }: {
  panels: [string, string, string, string]; // [tl, tr, bl, br] Tailwind bg classes
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="grid grid-cols-2 gap-0.5 rounded-lg overflow-hidden border border-white/10" style={{ width: 56, height: 56 }}>
        {panels.map((bg, i) => <div key={i} className={bg} />)}
      </div>
      <span className="text-white/50 text-[10px] text-center leading-tight">{label}</span>
    </div>
  );
}

const DONE_KEY = '5queens_tutorial_done';
const PAD = 8;

// ── Intro slides (full-screen modal, no spotlight) ──────────────────────────

type IntroSlide = {
  title: string;
  content: React.ReactNode;
};

function useIntroSlides(): IntroSlide[] {
  const { t } = useTranslation();
  return useMemo(() => [
    {
      title: t('tutorial.s1.title'),
      content: (
        <div className="flex flex-col gap-3">
          <p className="text-white/70 text-sm leading-relaxed">
            {t('tutorial.s1.desc')}
          </p>
          <div className="bg-white/5 rounded-xl p-3 flex items-start gap-3">
            <span className="text-2xl leading-none mt-0.5">🎯</span>
            <div>
              <p className="text-white font-semibold text-sm mb-0.5">{t('tutorial.s1.goalTitle')}</p>
              <p className="text-white/60 text-xs leading-relaxed">
                {t('tutorial.s1.goalDesc')}
              </p>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 flex items-start gap-3">
            <span className="text-2xl leading-none mt-0.5">🔄</span>
            <div>
              <p className="text-white font-semibold text-sm mb-0.5">{t('tutorial.s1.turnTitle')}</p>
              <p className="text-white/60 text-xs leading-relaxed">
                <strong className="text-white/80">{t('tutorial.s1.turnStep1')}</strong> {t('tutorial.s1.turnStep1Desc')} &nbsp;
                <strong className="text-white/80">{t('tutorial.s1.turnStep2')}</strong> {t('tutorial.s1.turnStep2Desc')}
              </p>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 flex items-start gap-3">
            <span className="text-2xl leading-none mt-0.5">🃏</span>
            <div>
              <p className="text-white font-semibold text-sm mb-0.5">{t('tutorial.s1.cardsTitle')}</p>
              <p className="text-white/60 text-xs leading-relaxed">
                <strong className="text-white/80">{t('tutorial.s1.princessCards')}</strong> {t('tutorial.s1.princessDesc')}<br />
                <strong className="text-white/80">{t('tutorial.s1.actionCards')}</strong> {t('tutorial.s1.actionDesc')}
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t('tutorial.s2.title'),
      content: (
        <div className="flex flex-col gap-4">
          <p className="text-white/70 text-sm leading-relaxed">
            {t('tutorial.s2.desc')}
          </p>

          {/* Ace */}
          <div className="bg-white/5 rounded-xl p-3 flex items-center gap-4">
            <MiniCard
              panels={['bg-yellow-500', 'bg-yellow-500', 'bg-yellow-500', 'bg-yellow-500']}
              label={t('tutorial.s2.ace')}
            />
            <div>
              <p className="text-white font-semibold text-sm">{t('tutorial.s2.ace')}</p>
              <p className="text-white/55 text-xs leading-relaxed mt-0.5">
                {t('tutorial.s2.aceDesc')}
              </p>
            </div>
          </div>

          {/* Half */}
          <div className="bg-white/5 rounded-xl p-3 flex items-center gap-4">
            <MiniCard
              panels={['bg-red-700', 'bg-red-700', 'bg-green-700', 'bg-green-700']}
              label={t('tutorial.s2.half')}
            />
            <div>
              <p className="text-white font-semibold text-sm">{t('tutorial.s2.half')}</p>
              <p className="text-white/55 text-xs leading-relaxed mt-0.5">
                {t('tutorial.s2.halfDesc')}
              </p>
            </div>
          </div>

          {/* Threeway */}
          <div className="bg-white/5 rounded-xl p-3 flex items-center gap-4">
            <MiniCard
              panels={['bg-blue-700', 'bg-blue-700', 'bg-yellow-500', 'bg-zinc-950']}
              label={t('tutorial.s2.threeway')}
            />
            <div>
              <p className="text-white font-semibold text-sm">{t('tutorial.s2.threeway')}</p>
              <p className="text-white/55 text-xs leading-relaxed mt-0.5">
                {t('tutorial.s2.threewayDesc')}
              </p>
            </div>
          </div>

          {/* Quad */}
          <div className="bg-white/5 rounded-xl p-3 flex items-center gap-4">
            <MiniCard
              panels={['bg-red-700', 'bg-yellow-500', 'bg-blue-700', 'bg-green-700']}
              label={t('tutorial.s2.quad')}
            />
            <div>
              <p className="text-white font-semibold text-sm">{t('tutorial.s2.quad')}</p>
              <p className="text-white/55 text-xs leading-relaxed mt-0.5">
                {t('tutorial.s2.quadDesc')}
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t('tutorial.s3.title'),
      content: (
        <div className="flex flex-col gap-3">
          <p className="text-white/70 text-sm leading-relaxed">
            {t('tutorial.s3.desc')}
          </p>
          <div className="bg-white/5 rounded-xl p-3 flex items-start gap-3">
            <span className="text-2xl leading-none mt-0.5">🌈</span>
            <div>
              <p className="text-white font-semibold text-sm mb-0.5">{t('tutorial.s3.rainbow')}</p>
              <p className="text-white/60 text-xs leading-relaxed">
                {t('tutorial.s3.rainbowDesc')}
              </p>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 flex items-start gap-3">
            <span className="text-2xl leading-none mt-0.5">🥈</span>
            <div>
              <p className="text-white font-semibold text-sm mb-0.5">{t('tutorial.s3.silver')}</p>
              <p className="text-white/60 text-xs leading-relaxed">
                {t('tutorial.s3.silverDesc')}
              </p>
            </div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 flex items-start gap-3">
            <span className="text-2xl leading-none mt-0.5">⭐</span>
            <div>
              <p className="text-white font-semibold text-sm mb-0.5">{t('tutorial.s3.bonusTitle')}</p>
              <p className="text-white/60 text-xs leading-relaxed">
                {t('tutorial.s3.bonusLine1')}<br />
                {t('tutorial.s3.bonusLine2')}<br />
                <span className="text-white/40">{t('tutorial.s3.bonusNote')}</span>
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t('tutorial.s4.title'),
      content: (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-green-500 shrink-0" />
            <span className="text-white/40 text-xs">{t('tutorial.s4.silverColor')}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-white font-semibold text-sm mb-1">{t('tutorial.s4.what')}</p>
            <p className="text-white/60 text-xs leading-relaxed">
              {t('tutorial.s4.desc2')}
            </p>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
            <p className="text-white font-semibold text-sm mb-1">{t('tutorial.s9.exampleLabel')}</p>
            <p className="text-white/60 text-xs leading-relaxed">
              {t('tutorial.s4.example')}
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-white font-semibold text-sm mb-1">{t('tutorial.s9.whenLabel')}</p>
            <p className="text-white/60 text-xs leading-relaxed">
              {t('tutorial.s4.when')}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: t('tutorial.s5.title'),
      content: (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
            <span className="text-white/40 text-xs">{t('tutorial.s5.silverColor')}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-white font-semibold text-sm mb-1">{t('tutorial.s4.what')}</p>
            <p className="text-white/60 text-xs leading-relaxed">
              {t('tutorial.s5.desc2')}
            </p>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
            <p className="text-white font-semibold text-sm mb-1">{t('tutorial.s9.exampleLabel')}</p>
            <p className="text-white/60 text-xs leading-relaxed">
              {t('tutorial.s5.example')}
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-white font-semibold text-sm mb-1">{t('tutorial.s9.whenLabel')}</p>
            <p className="text-white/60 text-xs leading-relaxed">
              {t('tutorial.s5.when')}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: t('tutorial.s6.title'),
      content: (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
            <span className="text-white/40 text-xs">{t('tutorial.s6.silverColor')}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-white font-semibold text-sm mb-1">{t('tutorial.s4.what')}</p>
            <p className="text-white/60 text-xs leading-relaxed">
              {t('tutorial.s6.desc2')}
            </p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
            <p className="text-white font-semibold text-sm mb-1">{t('tutorial.s9.exampleLabel')}</p>
            <p className="text-white/60 text-xs leading-relaxed">
              {t('tutorial.s6.example')}
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-white font-semibold text-sm mb-1">{t('tutorial.s9.whenLabel')}</p>
            <p className="text-white/60 text-xs leading-relaxed">
              {t('tutorial.s6.when')}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: t('tutorial.s7.title'),
      content: (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500 shrink-0" />
            <span className="text-white/40 text-xs">{t('tutorial.s7.silverColor')}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-white font-semibold text-sm mb-1">{t('tutorial.s4.what')}</p>
            <p className="text-white/60 text-xs leading-relaxed">
              {t('tutorial.s7.desc2')}
            </p>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
            <p className="text-white font-semibold text-sm mb-1">{t('tutorial.s9.exampleLabel')}</p>
            <p className="text-white/60 text-xs leading-relaxed">
              {t('tutorial.s7.example')}
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-white font-semibold text-sm mb-1">{t('tutorial.s9.whenLabel')}</p>
            <p className="text-white/60 text-xs leading-relaxed">
              {t('tutorial.s7.when')}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: t('tutorial.s8.title'),
      content: (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-zinc-900 border border-white/20 shrink-0" />
            <span className="text-white/40 text-xs">{t('tutorial.s8.silverColor')}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-white font-semibold text-sm mb-1">{t('tutorial.s4.what')}</p>
            <p className="text-white/60 text-xs leading-relaxed">
              {t('tutorial.s8.desc2')}
            </p>
          </div>
          <div className="bg-zinc-700/30 border border-white/10 rounded-xl p-3">
            <p className="text-white font-semibold text-sm mb-1">{t('tutorial.s9.exampleLabel')}</p>
            <p className="text-white/60 text-xs leading-relaxed">
              {t('tutorial.s8.example')}
            </p>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-white font-semibold text-sm mb-1">{t('tutorial.s9.whenLabel')}</p>
            <p className="text-white/60 text-xs leading-relaxed">
              {t('tutorial.s8.when')}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: t('tutorial.s9.title'),
      content: (
        <div className="flex flex-col gap-3">
          <p className="text-white/70 text-sm leading-relaxed">
            {t('tutorial.s9.desc')}
          </p>
          <div className="bg-white/5 rounded-xl p-3">
            <p className="text-white font-semibold text-sm mb-2">{t('tutorial.s9.optionsTitle')}</p>
            <div className="flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <span className="text-green-400 font-bold text-xs mt-0.5 shrink-0">{t('tutorial.s9.both')}</span>
                <p className="text-white/60 text-xs">{t('tutorial.s9.bothDesc')}</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-yellow-400 font-bold text-xs mt-0.5 shrink-0">{t('tutorial.s9.actionOnly')}</span>
                <p className="text-white/60 text-xs">{t('tutorial.s9.actionOnlyDesc')}</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-400 font-bold text-xs mt-0.5 shrink-0">{t('tutorial.s9.silverOnly')}</span>
                <p className="text-white/60 text-xs">{t('tutorial.s9.silverOnlyDesc')}</p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
            <p className="text-white/60 text-xs leading-relaxed">
              <strong className="text-yellow-400">{t('tutorial.s9.tip').split(':')[0]}:</strong> {t('tutorial.s9.tip').includes(':') ? t('tutorial.s9.tip').split(':').slice(1).join(':').trim() : t('tutorial.s9.tip')}
            </p>
          </div>
        </div>
      ),
    },
  ], [t]);
}

// ── Spotlight steps (highlight UI elements) ────────────────────────────────

type SpotStep = {
  title: string;
  desc: string;
  selector: string;
  tipSide: 'right' | 'above' | 'below' | 'center';
};

function useSpotSteps(): SpotStep[] {
  const { t } = useTranslation();
  return useMemo(() => [
    {
      title: t('spot.board'),
      desc: t('spot.boardDesc'),
      selector: 'board',
      tipSide: 'center' as const,
    },
    {
      title: t('spot.goal'),
      desc: t('spot.goalDesc'),
      selector: 'goal',
      tipSide: 'right' as const,
    },
    {
      title: t('spot.hand'),
      desc: t('spot.handDesc'),
      selector: 'hand',
      tipSide: 'above' as const,
    },
    {
      title: t('spot.drawPile'),
      desc: t('spot.drawPileDesc'),
      selector: 'draw-pile',
      tipSide: 'right' as const,
    },
    {
      title: t('spot.opponents'),
      desc: t('spot.opponentsDesc'),
      selector: 'opponents',
      tipSide: 'right' as const,
    },
    {
      title: t('spot.turnToast'),
      desc: t('spot.turnToastDesc'),
      selector: 'turn-toast',
      tipSide: 'below' as const,
    },
  ], [t]);
}

type Rect = { left: number; top: number; width: number; height: number };
const TIP_W = 320;
const TIP_OFFSET = 16;

function tipStyle(rect: Rect, side: SpotStep['tipSide']): React.CSSProperties {
  const vh = window.innerHeight;
  const vw = window.innerWidth;

  if (side === 'right') {
    const left = rect.left + rect.width + TIP_OFFSET;
    const safeLeft = Math.min(left, vw - TIP_W - 12);
    return { left: safeLeft, top: Math.max(8, rect.top) };
  }
  if (side === 'above') {
    return {
      left: Math.max(8, Math.min(rect.left + rect.width / 2 - TIP_W / 2, vw - TIP_W - 8)),
      bottom: vh - rect.top + TIP_OFFSET,
    };
  }
  if (side === 'below') {
    return {
      left: Math.max(8, Math.min(rect.left + rect.width / 2 - TIP_W / 2, vw - TIP_W - 8)),
      top: rect.top + rect.height + TIP_OFFSET,
    };
  }
  return {
    left: Math.max(8, Math.min(rect.left + rect.width / 2 - TIP_W / 2, vw - TIP_W - 8)),
    top: rect.top + rect.height / 2 - 100,
  };
}

export default function GameTutorial() {
  const { t } = useTranslation();
  const introSlides = useIntroSlides();
  const spotSteps = useSpotSteps();
  const totalSteps = introSlides.length + spotSteps.length;

  const [step, setStep] = useState(0);
  const [done, setDone] = useState(() => localStorage.getItem(DONE_KEY) === '1');
  const [rect, setRect] = useState<Rect | null>(null);

  const isIntro = step < introSlides.length;
  const spotIdx = step - introSlides.length;

  useEffect(() => {
    if (done || isIntro) return;
    const timer = setTimeout(() => {
      const el = document.querySelector(`[data-tutorial="${spotSteps[spotIdx].selector}"]`);
      if (!el) return;
      const r = el.getBoundingClientRect();
      setRect({ left: r.left - PAD, top: r.top - PAD, width: r.width + PAD * 2, height: r.height + PAD * 2 });
    }, 80);
    return () => clearTimeout(timer);
  }, [step, done, isIntro, spotIdx, spotSteps]);

  if (done) return null;
  if (!isIntro && !rect) return null;

  const isFirst = step === 0;
  const isLast = step === totalSteps - 1;

  function next() {
    if (isLast) finish();
    else { setRect(null); setStep(step + 1); }
  }
  function back() {
    if (!isFirst) { setRect(null); setStep(step - 1); }
  }
  function finish() {
    localStorage.setItem(DONE_KEY, '1');
    setDone(true);
  }

  // ── Progress dots ────────────────────────────────────────────────────────
  const dots = (
    <div className="flex gap-1 flex-wrap">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={[
            'w-1.5 h-1.5 rounded-full transition-colors',
            i === step ? 'bg-yellow-400' : i < step ? 'bg-white/30' : 'bg-white/10',
          ].join(' ')}
        />
      ))}
    </div>
  );

  // ── Navigation buttons ───────────────────────────────────────────────────
  const navButtons = (
    <div className="flex gap-2 mt-4">
      {!isFirst && (
        <button
          onClick={back}
          className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm transition-colors"
        >
          {t('tutorial.prev')}
        </button>
      )}
      <button
        onClick={next}
        className="flex-1 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl text-sm transition-colors"
      >
        {isLast ? t('tutorial.gotIt') : t('tutorial.next')}
      </button>
    </div>
  );

  // ── Intro slide ──────────────────────────────────────────────────────────
  if (isIntro) {
    const slide = introSlides[step];
    return (
      <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            className="bg-zinc-900 border border-white/15 rounded-2xl shadow-2xl mx-4 flex flex-col"
            style={{ width: '100%', maxWidth: 400, maxHeight: '90vh' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
              {dots}
              <button onClick={finish} className="text-white/30 hover:text-white/60 text-xs transition-colors shrink-0 ml-3">
                {t('tutorial.skip')}
              </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto px-5 pb-1" style={{ overscrollBehavior: 'contain' }}>
              <h3 className="text-white font-bold text-lg mb-3">{slide.title}</h3>
              {slide.content}
            </div>

            {/* Footer */}
            <div className="px-5 pb-5 pt-2 shrink-0">
              {navButtons}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // ── Spotlight step ───────────────────────────────────────────────────────
  const s = spotSteps[spotIdx];
  return (
    <div className="fixed inset-0 z-[400] pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={`spot-${step}`}
          className="fixed rounded-xl"
          style={{
            left: rect!.left,
            top: rect!.top,
            width: rect!.width,
            height: rect!.height,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.82)',
            outline: '2px solid rgba(255,255,255,0.12)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={`tip-${step}`}
          className="fixed bg-zinc-900 border border-white/15 rounded-2xl p-4 shadow-2xl pointer-events-auto"
          style={{ width: TIP_W, ...tipStyle(rect!, s.tipSide) }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            {dots}
            <button onClick={finish} className="text-white/30 hover:text-white/60 text-xs transition-colors ml-3 shrink-0">
              {t('tutorial.skip')}
            </button>
          </div>
          <h3 className="text-white font-bold text-base mb-1.5">{s.title}</h3>
          <p className="text-white/60 text-sm leading-relaxed">{s.desc}</p>
          {navButtons}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
