import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DONE_KEY = '7dragons_tutorial_done';

type SpotArea = {
  left: string | number;
  top: string | number;
  width: string | number;
  height: string | number;
};

type Step = {
  title: string;
  desc: string;
  spot: SpotArea;
  tip: React.CSSProperties;
};

const px = (v: string | number) => (typeof v === 'number' ? `${v}px` : v);

const STEPS: Step[] = [
  {
    title: 'Plansza',
    desc: 'Tu układasz karty smoków. Silver Dragon stoi na środku i nigdy się nie rusza.',
    spot: { left: 196, top: 0, width: 'calc(100vw - 196px)', height: 'calc(100vh - 130px)' },
    tip: { right: '24px', bottom: '160px' },
  },
  {
    title: 'Twój cel',
    desc: 'To jest Twoja tajna karta celu. Musisz połączyć 7 paneli tego koloru w jedną ciągłą grupę.',
    spot: { left: 6, top: 'calc(100vh - 190px)', width: 184, height: 120 },
    tip: { left: '216px', bottom: '110px' },
  },
  {
    title: 'Twoja ręka',
    desc: 'Tu są Twoje karty. Kliknij kartę żeby ją wybrać, kliknij drugi raz żeby obrócić o 180°, a potem połóż ją na planszy. Karty akcji zagrywasz jednym kliknięciem.',
    spot: { left: 196, top: 'calc(100vh - 130px)', width: 'calc(100vw - 196px)', height: 130 },
    tip: { left: '50%', bottom: '150px', transform: 'translateX(-50%)' },
  },
  {
    title: 'Talia i stos odrzuconych',
    desc: 'Na początku tury dobierasz kartę z talii. Zagrane karty akcji lądują na stosie odrzuconych.',
    spot: { left: 6, top: 136, width: 184, height: 96 },
    tip: { left: '216px', top: '130px' },
  },
  {
    title: 'Przeciwnicy',
    desc: 'Widzisz ile kart mają inni gracze, ale nie widzisz ich celów ani rąk.',
    spot: { left: 6, top: 270, width: 184, height: 90 },
    tip: { left: '216px', top: '262px' },
  },
  {
    title: 'Twoja tura',
    desc: 'Gdy pojawi się komunikat na górze ekranu — Twoja tura. Dobierz kartę, a potem zagraj jedną.',
    spot: { left: 'calc(50vw - 90px)', top: 18, width: 180, height: 48 },
    tip: { left: '50%', top: '84px', transform: 'translateX(-50%)' },
  },
];

export default function GameTutorial() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(() => localStorage.getItem(DONE_KEY) === '1');

  if (done) return null;

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
      {/* Spotlight hole */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`spot-${step}`}
          className="fixed rounded-xl"
          style={{
            left: px(s.spot.left),
            top: px(s.spot.top),
            width: px(s.spot.width),
            height: px(s.spot.height),
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.80)',
            outline: '2px solid rgba(255,255,255,0.10)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        />
      </AnimatePresence>

      {/* Tooltip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`tip-${step}`}
          className="fixed w-72 bg-zinc-900 border border-white/15 rounded-2xl p-4 shadow-2xl pointer-events-auto"
          style={s.tip}
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
            <button
              onClick={finish}
              className="text-white/30 hover:text-white/60 text-xs transition-colors"
            >
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
