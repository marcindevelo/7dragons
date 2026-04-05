import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DONE_KEY = '7dragons_tutorial_done';
const PAD = 8; // spotlight padding around element

type Step = {
  title: string;
  desc: string;
  selector: string;          // data-tutorial attribute value
  tipSide: 'right' | 'above' | 'below' | 'center';
};

const STEPS: Step[] = [
  {
    title: 'Plansza',
    desc: 'Tu układasz karty smoków. Silver Dragon stoi na środku i nigdy się nie rusza.',
    selector: 'board',
    tipSide: 'center',
  },
  {
    title: 'Twój cel',
    desc: 'To jest Twoja tajna karta celu. Musisz połączyć 7 paneli tego koloru w jedną ciągłą grupę.',
    selector: 'goal',
    tipSide: 'right',
  },
  {
    title: 'Twoja ręka',
    desc: 'Tu są Twoje karty. Kliknij kartę żeby ją wybrać, kliknij drugi raz żeby obrócić o 180°, a potem połóż ją na planszy. Karty akcji zagrywasz jednym kliknięciem.',
    selector: 'hand',
    tipSide: 'above',
  },
  {
    title: 'Talia i stos odrzuconych',
    desc: 'Na początku tury dobierasz kartę z talii. Zagrane karty akcji lądują na stosie odrzuconych.',
    selector: 'draw-pile',
    tipSide: 'right',
  },
  {
    title: 'Przeciwnicy',
    desc: 'Widzisz ile kart mają inni gracze, ale nie widzisz ich celów ani rąk.',
    selector: 'opponents',
    tipSide: 'right',
  },
  {
    title: 'Twoja tura',
    desc: 'Gdy pojawi się komunikat na górze ekranu — Twoja tura. Dobierz kartę, a potem zagraj jedną.',
    selector: 'turn-toast',
    tipSide: 'below',
  },
];

type Rect = { left: number; top: number; width: number; height: number };
const TIP_W = 288;
const TIP_OFFSET = 16;

function tipStyle(rect: Rect, side: Step['tipSide']): React.CSSProperties {
  const vh = window.innerHeight;
  const vw = window.innerWidth;

  if (side === 'right') {
    const left = rect.left + rect.width + TIP_OFFSET;
    // If tooltip would overflow right edge, flip to center
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
  // center: place in center of the spotlight area
  return {
    left: Math.max(8, Math.min(rect.left + rect.width / 2 - TIP_W / 2, vw - TIP_W - 8)),
    top: rect.top + rect.height / 2 - 100,
  };
}

export default function GameTutorial() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(() => localStorage.getItem(DONE_KEY) === '1');
  const [rect, setRect] = useState<Rect | null>(null);

  useEffect(() => {
    if (done) return;
    // Small delay so DOM is fully rendered
    const t = setTimeout(() => {
      const el = document.querySelector(`[data-tutorial="${STEPS[step].selector}"]`);
      if (!el) return;
      const r = el.getBoundingClientRect();
      setRect({ left: r.left - PAD, top: r.top - PAD, width: r.width + PAD * 2, height: r.height + PAD * 2 });
    }, 80);
    return () => clearTimeout(t);
  }, [step, done]);

  if (done || !rect) return null;

  const s = STEPS[step];
  const isLast = step === STEPS.length - 1;

  function next() {
    if (isLast) finish();
    else setStep(step + 1);
  }

  function finish() {
    localStorage.setItem(DONE_KEY, '1');
    setDone(true);
  }

  return (
    <div className="fixed inset-0 z-[400] pointer-events-none">
      {/* Spotlight */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`spot-${step}`}
          className="fixed rounded-xl"
          style={{
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.82)',
            outline: '2px solid rgba(255,255,255,0.12)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      </AnimatePresence>

      {/* Tooltip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`tip-${step}`}
          className="fixed bg-zinc-900 border border-white/15 rounded-2xl p-4 shadow-2xl pointer-events-auto"
          style={{ width: TIP_W, ...tipStyle(rect, s.tipSide) }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-1">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={[
                    'w-1.5 h-1.5 rounded-full transition-colors',
                    i === step ? 'bg-yellow-400' : i < step ? 'bg-white/30' : 'bg-white/10',
                  ].join(' ')}
                />
              ))}
            </div>
            <button onClick={finish} className="text-white/30 hover:text-white/60 text-xs transition-colors">
              Pomiń
            </button>
          </div>

          <h3 className="text-white font-bold text-base mb-1.5">{s.title}</h3>
          <p className="text-white/60 text-sm leading-relaxed mb-4">{s.desc}</p>

          <button
            onClick={next}
            className="w-full py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl text-sm transition-colors"
          >
            {isLast ? 'Rozumiem!' : 'Dalej →'}
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
