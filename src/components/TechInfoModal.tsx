import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../i18n/LanguageContext';

type Props = { onClose: () => void };

export default function TechInfoModal({ onClose }: Props) {
  const { t } = useTranslation();
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[500] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/75" />
        <motion.div
          className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl"
          initial={{ scale: 0.95, y: 16 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 16 }}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-bold text-xl tracking-wide">5 Queens — {t('tech.title')}</h2>
            <button onClick={onClose} className="text-white/30 hover:text-white/70 text-lg leading-none transition-colors">✕</button>
          </div>

          <Section title={t('tech.frontend')}>
            <Row label="React 18 + TypeScript" desc="Interfejs użytkownika i logika widoku — komponenty funkcyjne, hooki, strict mode." />
            <Row label="Vite" desc="Bundler i dev server — błyskawiczny HMR, optymalizowany build produkcyjny." />
            <Row label="Tailwind CSS" desc="Utility-first styling — wszystkie style inline jako klasy, zero własnych arkuszy CSS." />
            <Row label="Framer Motion" desc="Animacje kart, tutorialu, modali i toastów — deklaratywne keyframes i spring physics." />
            <Row label="Zustand" desc="Lekki state manager — osobne store dla stanu gry (gameStore) i multiplayera (multiplayerStore)." />
          </Section>
          <Section title={t('tech.engine')}>
            <Row label="engine/types.ts" desc="Typy danych: DragonCard, ActionCard, GoalCard, GameState, BoardPosition, Panel." />
            <Row label="engine/deck.ts" desc="Definicje wszystkich 72 kart (51 księżniczek, 15 akcji, 5 celów) + tasowanie i rozdawanie." />
            <Row label="engine/board.ts" desc="Walidacja ułożenia kart — panel-level adjacency, color matching, Silver Queen wildcard." />
            <Row label="engine/win.ts" desc="BFS flood-fill — sprawdzenie czy gracz zebrał 7 połączonych paneli swojego koloru." />
            <Row label="engine/connections.ts" desc="Bonus za wielokrotne połączenie — zliczanie unikalnych kolorów w jednym zagraniu." />
            <Row label="engine/actions.ts" desc="Implementacja 5 akcji: Trade Hands, Trade Goals, Rotate Goals, Move a Card, Zap a Card." />
            <Row label="engine/game.ts" desc="Główna maszyna stanów — przejścia: draw → play → action-targeting → ended." />
            <Row label="engine/ai.ts" desc="Przeciwnik AI — greedy heuristic maksymalizujący spójne panele własnego koloru." />
          </Section>
          <Section title={t('tech.multiplayer')}>
            <Row label="PartyKit" desc="WebSocket server w chmurze — pokoje gry, relay wiadomości, autoryzacja ruchów po stronie serwera." />
            <Row label="Invite system" desc="Osobne pokoje WebSocket z prefiksem invite- — wysyłanie zaproszeń po nazwie użytkownika z 5s reconnect." />
            <Row label="Masked game state" desc="Serwer ukrywa karty i cele innych graczy — każdy klient widzi tylko swoje karty." />
            <Row label="Host transfer" desc="Gdy host rozłączy się, serwer automatycznie przekazuje rolę hosta kolejnemu graczowi." />
          </Section>
          <Section title={t('tech.auth')}>
            <Row label="Clerk" desc="Autentykacja użytkowników — sign in/up, profil, username. Wymagana do trybu online." />
            <Row label="Vercel" desc="Hosting frontendu — automatyczny deploy, CDN, HTTPS, domena 5queens.club." />
            <Row label="PartyKit Cloud" desc="Hosting serwera WebSocket — skalowalne pokoje, zero cold-start." />
          </Section>
          <Section title={t('tech.dataArch')}>
            <Row label="Panel grid 2×" desc="Atomową jednostką jest panel, nie karta. Karta 2×2 = 4 panele. Sąsiedztwo przez krawędź (dx+dy=1)." />
            <Row label="Board jako sparse Map" desc='Plansza to Map<string, PlacedCard> gdzie klucz to "x,y". Nieskończona siatka bez alokacji pustych komórek.' />
            <Row label="Silver Queen" desc="Stoi na środku (0,0) na stałe. silverDragonColor: DragonColor | 'all' zmienia się po każdej akcji." />
          </Section>

          <button
            onClick={onClose}
            className="mt-4 w-full py-2.5 bg-white/10 hover:bg-white/20 text-white/70 font-bold rounded-xl text-sm transition-colors"
          >
            {t('tech.close')}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h3 className="text-zinc-400 text-xs font-bold tracking-widest uppercase mb-2">{title}</h3>
      <div className="flex flex-col gap-1.5">{children}</div>
    </div>
  );
}

function Row({ label, desc }: { label: string; desc: string }) {
  return (
    <div className="bg-white/5 rounded-xl px-3 py-2">
      <span className="text-white text-sm font-semibold">{label}</span>
      <span className="text-white/50 text-sm"> — {desc}</span>
    </div>
  );
}
