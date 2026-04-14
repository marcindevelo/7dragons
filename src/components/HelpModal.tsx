import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

type Props = { onClose: () => void };

export default function HelpModal({ onClose }: Props) {
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
            <h2 className="text-white font-bold text-xl tracking-wide">5 Queens — Zasady</h2>
            <button
              onClick={onClose}
              className="text-white/30 hover:text-white/70 text-lg leading-none transition-colors"
            >
              ✕
            </button>
          </div>

          <Section title="Cel gry">
            Każdy gracz ma tajną kartę <b>Celu</b> — jeden z pięciu kolorów. Wygrywasz, gdy na planszy powstanie
            spójna grupa <b>7 lub więcej paneli Twojego koloru</b> połączonych krawędziami. Kształt dowolny.
          </Section>

          <Section title="Tura gracza">
            <ol className="list-decimal list-inside space-y-1 text-white/60 text-sm">
              <li>Dobierz 1 kartę z talii.</li>
              <li>Zagraj 1 kartę z ręki — Smoka lub Akcję.</li>
            </ol>
          </Section>

          <Section title="Karty Smoka">
            <p>Każda karta to siatka 2×2 paneli. Aby ją zagrać:</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5 text-white/60 text-sm">
              <li>Musi przylegać krawędzią do karty już na stole.</li>
              <li>Co najmniej jedna para sąsiadujących paneli musi być tego samego koloru.</li>
              <li><b className="text-white/80">Rainbow</b> pasuje do każdego koloru.</li>
              <li><b className="text-white/80">Silver Dragon</b> działa jako swój aktualny kolor.</li>
            </ul>
            <p className="mt-2">
              <b className="text-white/80">Kliknij kartę</b> żeby wybrać,{' '}
              <b className="text-white/80">kliknij ponownie</b> żeby obrócić o 180°, potem kliknij miejsce na planszy.
            </p>
            <p className="mt-2 text-white/50 text-xs">
              Bonus za wielokrotne połączenie: 2 różne kolory → +1 karta, 3 → +2, 4 → +3.
              Rainbow i Silver nie liczą się do bonusu.
            </p>
          </Section>

          <Section title="Karty Akcji">
            <p>Po zagraniu dzieją się <b className="text-white/80">dwie rzeczy jednocześnie</b>: efekt akcji
            + Silver Dragon zmienia kolor. Możesz pominąć jedno z nich.</p>
            <div className="mt-3 flex flex-col gap-2">
              {[
                ['Trade Hands', 'Zamień całą rękę z dowolnym graczem.'],
                ['Trade Goals', 'Zamień kartę Celu z innym graczem lub nieużywaną kartą.'],
                ['Move a Card', 'Przenieś kartę z planszy w nowe, poprawne miejsce. Nie możesz ruszyć Silver Dragona. Wszystkie karty muszą nadal tworzyć jedną spójną grupę.'],
                ['Rotate Goals', 'Wszyscy gracze przekazują karty Celu sąsiadowi w wybranym kierunku.'],
                ['Zap a Card', 'Weź dowolną kartę z planszy z powrotem do ręki. Nie możesz zabrać Silver Dragona.'],
              ].map(([name, desc]) => (
                <div key={name} className="bg-white/5 rounded-xl px-3 py-2">
                  <p className="text-white text-sm font-semibold">{name}</p>
                  <p className="text-white/50 text-xs mt-0.5">{desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Silver Dragon">
            Stoi na środku na stałe i nigdy się nie rusza. Na początku działa jak Rainbow (wszystkie kolory).
            Po każdej zagranej Akcji zmienia kolor na kolor smoka z tej karty.
          </Section>

          <Section title="Koniec talii">
            Gdy talia się wyczerpie, gracze nie dobierają kart. Gra trwa, dopóki ktoś ma karty.
            Jeśli nikt nie wygrał — wygrywa gracz z <b className="text-white/80">największą spójną grupą paneli</b> swojego koloru.
          </Section>

          <button
            onClick={onClose}
            className="mt-2 w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl text-sm transition-colors"
          >
            Rozumiem!
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
