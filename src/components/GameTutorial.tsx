import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

const INTRO_SLIDES: IntroSlide[] = [
  {
    title: '👑 5 Queens',
    content: (
      <div className="flex flex-col gap-3">
        <p className="text-white/70 text-sm leading-relaxed">
          Gra karciana dla 2–5 graczy. Każdy gracz ma tajną kartę celu — jeden z 5 kolorów smoka.
        </p>
        <div className="bg-white/5 rounded-xl p-3 flex items-start gap-3">
          <span className="text-2xl leading-none mt-0.5">🎯</span>
          <div>
            <p className="text-white font-semibold text-sm mb-0.5">Cel gry</p>
            <p className="text-white/60 text-xs leading-relaxed">
              Stwórz ciągłą grupę <strong className="text-yellow-400">7 paneli</strong> swojego koloru na wspólnej planszy. Kształt dowolny — może się rozgałęziać.
            </p>
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-3 flex items-start gap-3">
          <span className="text-2xl leading-none mt-0.5">🔄</span>
          <div>
            <p className="text-white font-semibold text-sm mb-0.5">Każda tura</p>
            <p className="text-white/60 text-xs leading-relaxed">
              <strong className="text-white/80">1.</strong> Dobierz kartę z talii &nbsp;
              <strong className="text-white/80">2.</strong> Zagraj jedną kartę z ręki
            </p>
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-3 flex items-start gap-3">
          <span className="text-2xl leading-none mt-0.5">🃏</span>
          <div>
            <p className="text-white font-semibold text-sm mb-0.5">Dwa typy kart</p>
            <p className="text-white/60 text-xs leading-relaxed">
              <strong className="text-white/80">Karty smoków</strong> — kładziesz na planszy obok pasujących kolorów.<br />
              <strong className="text-white/80">Karty akcji</strong> — specjalne efekty (opisane dalej).
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: '🃏 Rodzaje kart smoków',
    content: (
      <div className="flex flex-col gap-4">
        <p className="text-white/70 text-sm leading-relaxed">
          Każda karta smoka to siatka <strong className="text-white/80">2×2 paneli</strong>. Panele mogą mieć różne kolory — oto cztery typy kart:
        </p>

        {/* Ace */}
        <div className="bg-white/5 rounded-xl p-3 flex items-center gap-4">
          <MiniCard
            panels={['bg-yellow-500', 'bg-yellow-500', 'bg-yellow-500', 'bg-yellow-500']}
            label="Cała"
          />
          <div>
            <p className="text-white font-semibold text-sm">Cała (Ace)</p>
            <p className="text-white/55 text-xs leading-relaxed mt-0.5">
              Wszystkie 4 panele tego samego koloru. Najłatwiej ją gdzieś położyć i daje od razu 4 panele Twojego celu.
            </p>
          </div>
        </div>

        {/* Half */}
        <div className="bg-white/5 rounded-xl p-3 flex items-center gap-4">
          <MiniCard
            panels={['bg-red-700', 'bg-red-700', 'bg-green-700', 'bg-green-700']}
            label="Połówka"
          />
          <div>
            <p className="text-white font-semibold text-sm">Połówka (Half)</p>
            <p className="text-white/55 text-xs leading-relaxed mt-0.5">
              Górna połowa jeden kolor, dolna połowa inny. Łączy się z sąsiadami po obu stronach — można ją też obrócić o 180°.
            </p>
          </div>
        </div>

        {/* Threeway */}
        <div className="bg-white/5 rounded-xl p-3 flex items-center gap-4">
          <MiniCard
            panels={['bg-blue-700', 'bg-blue-700', 'bg-yellow-500', 'bg-zinc-950']}
            label="Połówka\n+ ćwiartki"
          />
          <div>
            <p className="text-white font-semibold text-sm">Połówka + ćwiartki (Threeway)</p>
            <p className="text-white/55 text-xs leading-relaxed mt-0.5">
              Góra to jeden kolor (2 panele), a na dole dwa różne kolory po jednym. Trzy kolory na jednej karcie — duży potencjał bonusu.
            </p>
          </div>
        </div>

        {/* Quad */}
        <div className="bg-white/5 rounded-xl p-3 flex items-center gap-4">
          <MiniCard
            panels={['bg-red-700', 'bg-yellow-500', 'bg-blue-700', 'bg-green-700']}
            label="4 ćwiartki"
          />
          <div>
            <p className="text-white font-semibold text-sm">Cztery ćwiartki (Quad)</p>
            <p className="text-white/55 text-xs leading-relaxed mt-0.5">
              Każdy panel inny kolor. Niemal zawsze można ją gdzieś położyć i prawie zawsze daje bonus za połączenie wielu kolorów naraz.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: '🐲 Karty smoków',
    content: (
      <div className="flex flex-col gap-3">
        <p className="text-white/70 text-sm leading-relaxed">
          Każda karta smoka to siatka 2×2 kolorowych paneli. Przy kładzeniu na planszę co najmniej jeden panel musi sąsiadować krawędzią z panelem <strong className="text-white/80">tego samego koloru</strong> na sąsiedniej karcie.
        </p>
        <div className="bg-white/5 rounded-xl p-3 flex items-start gap-3">
          <span className="text-2xl leading-none mt-0.5">🌈</span>
          <div>
            <p className="text-white font-semibold text-sm mb-0.5">Rainbow Dragon</p>
            <p className="text-white/60 text-xs leading-relaxed">
              Tęczowy kolor — pasuje do każdego koloru. Można go położyć obok dowolnej karty i liczy się jako każdy kolor przy sprawdzaniu wygranej.
            </p>
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-3 flex items-start gap-3">
          <span className="text-2xl leading-none mt-0.5">🥈</span>
          <div>
            <p className="text-white font-semibold text-sm mb-0.5">Silver Dragon (środek planszy)</p>
            <p className="text-white/60 text-xs leading-relaxed">
              Nigdy się nie rusza. Na początku jest tęczowy (wszystkie kolory). Zmienia kolor za każdym razem gdy zagrana zostanie karta akcji.
            </p>
          </div>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 flex items-start gap-3">
          <span className="text-2xl leading-none mt-0.5">⭐</span>
          <div>
            <p className="text-white font-semibold text-sm mb-0.5">Bonus za połączenie</p>
            <p className="text-white/60 text-xs leading-relaxed">
              Jedna karta łączy 2 różne kolory → dobierz +1<br />
              3 różne kolory → +2 &nbsp;|&nbsp; 4 różne kolory → +3<br />
              <span className="text-white/40">(Rainbow i Silver nie liczą się do bonusu)</span>
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: '⚡ Karty akcji — Move a Card',
    content: (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-green-500 shrink-0" />
          <span className="text-white/40 text-xs">Silver Dragon przyjmuje kolor: Zielony</span>
        </div>
        <div className="bg-white/5 rounded-xl p-3">
          <p className="text-white font-semibold text-sm mb-1">Co robi?</p>
          <p className="text-white/60 text-xs leading-relaxed">
            Wybierasz kartę z planszy i przenosisz ją w nowe miejsce. Karta musi pasować kolorowo do nowych sąsiadów. Nie możesz ruszyć Silver Dragon. Po przeniesieniu plansza musi pozostać spójna (bez rozłączonych wysp).
          </p>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
          <p className="text-white font-semibold text-sm mb-1">🎯 Przykład</p>
          <p className="text-white/60 text-xs leading-relaxed">
            Twoja grupa zielonych jest bliska 7 paneli, ale brakuje połączenia. Przenosisz zieloną kartę z odległego rogu planszy prosto do swojej grupy — i wygrywasz.
          </p>
        </div>
        <div className="bg-white/5 rounded-xl p-3">
          <p className="text-white font-semibold text-sm mb-1">💡 Kiedy używać?</p>
          <p className="text-white/60 text-xs leading-relaxed">
            Gdy masz kartę swojego koloru w złym miejscu, chcesz dołączyć ją do głównej grupy albo rozbić grupę przeciwnika przesuwając kluczową kartę.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: '⚡ Karty akcji — Zap a Card',
    content: (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
          <span className="text-white/40 text-xs">Silver Dragon przyjmuje kolor: Czerwony</span>
        </div>
        <div className="bg-white/5 rounded-xl p-3">
          <p className="text-white font-semibold text-sm mb-1">Co robi?</p>
          <p className="text-white/60 text-xs leading-relaxed">
            Zabierasz dowolną kartę z planszy do swojej ręki. Twoja ręka jest po tym o 1 większa niż normalnie. Nie możesz zabrać Silver Dragon.
          </p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
          <p className="text-white font-semibold text-sm mb-1">🎯 Przykład</p>
          <p className="text-white/60 text-xs leading-relaxed">
            Przeciwnik ma 6 połączonych czerwonych paneli. Zabierasz jego kluczową kartę — rozbijasz grupę i zyskujesz kartę do ręki.
          </p>
        </div>
        <div className="bg-white/5 rounded-xl p-3">
          <p className="text-white font-semibold text-sm mb-1">💡 Kiedy używać?</p>
          <p className="text-white/60 text-xs leading-relaxed">
            Gdy karta na planszy blokuje Twój cel lub przeciwnik jest bliski wygranej. Możesz też zabrać własną kartę, żeby zagrać ją w lepszym miejscu.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: '⚡ Karty akcji — Rotate Goals',
    content: (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
          <span className="text-white/40 text-xs">Silver Dragon przyjmuje kolor: Niebieski</span>
        </div>
        <div className="bg-white/5 rounded-xl p-3">
          <p className="text-white font-semibold text-sm mb-1">Co robi?</p>
          <p className="text-white/60 text-xs leading-relaxed">
            Wszyscy gracze jednocześnie podają swoje karty celu sąsiadowi — w lewo albo w prawo (Ty wybierasz kierunek). Nieużywane cele też uczestniczą w rotacji.
          </p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
          <p className="text-white font-semibold text-sm mb-1">🎯 Przykład</p>
          <p className="text-white/60 text-xs leading-relaxed">
            Widzisz, że na planszy jest dużo niebieskich paneli. Obracasz cele tak, żeby dostać niebieski cel — i nagle jesteś blisko wygranej.
          </p>
        </div>
        <div className="bg-white/5 rounded-xl p-3">
          <p className="text-white font-semibold text-sm mb-1">💡 Kiedy używać?</p>
          <p className="text-white/60 text-xs leading-relaxed">
            Gdy obecny cel jest trudny do zebrania lub inny kolor dominuje na planszy. Ryzykowne — nie wiesz co dostaniesz, chyba że liczyłeś karty.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: '⚡ Karty akcji — Trade Goals',
    content: (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-yellow-500 shrink-0" />
          <span className="text-white/40 text-xs">Silver Dragon przyjmuje kolor: Złoty</span>
        </div>
        <div className="bg-white/5 rounded-xl p-3">
          <p className="text-white font-semibold text-sm mb-1">Co robi?</p>
          <p className="text-white/60 text-xs leading-relaxed">
            Zamieniasz swoją kartę celu z wybranym graczem lub z nieużywanym celem leżącym na stosie. Obie strony nie widzą co dostają — to wymiana w ciemno.
          </p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
          <p className="text-white font-semibold text-sm mb-1">🎯 Przykład</p>
          <p className="text-white/60 text-xs leading-relaxed">
            Gracz po lewej ma 5 złotych paneli połączonych. Zamieniasz z nim cel — teraz to Ty jesteś 2 panele od wygranej, a on musi zaczynać od nowa.
          </p>
        </div>
        <div className="bg-white/5 rounded-xl p-3">
          <p className="text-white font-semibold text-sm mb-1">💡 Kiedy używać?</p>
          <p className="text-white/60 text-xs leading-relaxed">
            Gdy inny gracz jest bliski wygranej — przejmij jego cel. Albo gdy Twój cel jest prawie niemożliwy — wymień go na ślepo z nieużywanym celem.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: '⚡ Karty akcji — Trade Hands',
    content: (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-zinc-900 border border-white/20 shrink-0" />
          <span className="text-white/40 text-xs">Silver Dragon przyjmuje kolor: Czarny</span>
        </div>
        <div className="bg-white/5 rounded-xl p-3">
          <p className="text-white font-semibold text-sm mb-1">Co robi?</p>
          <p className="text-white/60 text-xs leading-relaxed">
            Zamieniasz całą rękę kart z wybranym graczem. Karty celu <strong className="text-white/80">nie</strong> ulegają zmianie — tylko karty w ręce.
          </p>
        </div>
        <div className="bg-zinc-700/30 border border-white/10 rounded-xl p-3">
          <p className="text-white font-semibold text-sm mb-1">🎯 Przykład</p>
          <p className="text-white/60 text-xs leading-relaxed">
            Masz 5 bezużytecznych kart, a widzisz że jeden gracz dobiera dużo i ma pełną rękę. Zamieniasz z nim — dostajesz jego dobre karty, on dostaje Twoje słabe.
          </p>
        </div>
        <div className="bg-white/5 rounded-xl p-3">
          <p className="text-white font-semibold text-sm mb-1">💡 Kiedy używać?</p>
          <p className="text-white/60 text-xs leading-relaxed">
            Gdy masz złe karty i chcesz odświeżyć rękę. Albo defensywnie — gracz z dużą ręką ma dużo opcji, zabierz mu przewagę.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: '💡 Opcja przy kartach akcji',
    content: (
      <div className="flex flex-col gap-3">
        <p className="text-white/70 text-sm leading-relaxed">
          Zagrywając kartę akcji dzieją się <strong className="text-white/80">dwie rzeczy jednocześnie</strong>: efekt akcji i zmiana koloru Silver Dragona. Możesz pominąć jedną z nich.
        </p>
        <div className="bg-white/5 rounded-xl p-3">
          <p className="text-white font-semibold text-sm mb-2">Trzy opcje do wyboru:</p>
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <span className="text-green-400 font-bold text-xs mt-0.5 shrink-0">✓ Oba</span>
              <p className="text-white/60 text-xs">Wykonaj akcję i zmień kolor Silver Dragon (najczęstszy wybór).</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-yellow-400 font-bold text-xs mt-0.5 shrink-0">½ Tylko akcja</span>
              <p className="text-white/60 text-xs">Wykonaj efekt akcji, ale Silver nie zmienia koloru. Przydatne gdy obecny kolor Silver'a jest dla Ciebie korzystny.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-bold text-xs mt-0.5 shrink-0">½ Tylko Silver</span>
              <p className="text-white/60 text-xs">Zmień kolor Silver Dragon, ale nie wykonuj akcji. Karta wraca na dół talii.</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
          <p className="text-white/60 text-xs leading-relaxed">
            <strong className="text-yellow-400">Wskazówka:</strong> Gdy Silver Dragon ma kolor Twojego celu — zastanów się zanim pozwolisz go zmienić przez akcję przeciwnika.
          </p>
        </div>
      </div>
    ),
  },
];

// ── Spotlight steps (highlight UI elements) ────────────────────────────────

type SpotStep = {
  title: string;
  desc: string;
  selector: string;
  tipSide: 'right' | 'above' | 'below' | 'center';
};

const SPOT_STEPS: SpotStep[] = [
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

const TOTAL_STEPS = INTRO_SLIDES.length + SPOT_STEPS.length;

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
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(() => localStorage.getItem(DONE_KEY) === '1');
  const [rect, setRect] = useState<Rect | null>(null);

  const isIntro = step < INTRO_SLIDES.length;
  const spotIdx = step - INTRO_SLIDES.length;

  useEffect(() => {
    if (done || isIntro) return;
    const t = setTimeout(() => {
      const el = document.querySelector(`[data-tutorial="${SPOT_STEPS[spotIdx].selector}"]`);
      if (!el) return;
      const r = el.getBoundingClientRect();
      setRect({ left: r.left - PAD, top: r.top - PAD, width: r.width + PAD * 2, height: r.height + PAD * 2 });
    }, 80);
    return () => clearTimeout(t);
  }, [step, done, isIntro, spotIdx]);

  if (done) return null;
  if (!isIntro && !rect) return null;

  const isFirst = step === 0;
  const isLast = step === TOTAL_STEPS - 1;

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
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
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
          ← Wstecz
        </button>
      )}
      <button
        onClick={next}
        className="flex-1 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl text-sm transition-colors"
      >
        {isLast ? 'Rozumiem!' : 'Dalej →'}
      </button>
    </div>
  );

  // ── Intro slide ──────────────────────────────────────────────────────────
  if (isIntro) {
    const slide = INTRO_SLIDES[step];
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
                Pomiń
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
  const s = SPOT_STEPS[spotIdx];
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
              Pomiń
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
