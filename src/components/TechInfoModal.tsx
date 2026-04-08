import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Props = { onClose: () => void };

type Tab = 'history' | 'stack';

export default function TechInfoModal({ onClose }: Props) {
  const [tab, setTab] = useState<Tab>('history');

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
            <h2 className="text-white font-bold text-xl tracking-wide">Seven Dragons — O projekcie</h2>
            <button onClick={onClose} className="text-white/30 hover:text-white/70 text-lg leading-none transition-colors">✕</button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-5">
            <button
              onClick={() => setTab('history')}
              className={['flex-1 py-2 rounded-lg text-sm font-bold transition-colors', tab === 'history' ? 'bg-yellow-500 text-black' : 'bg-white/5 text-white/50 hover:bg-white/10'].join(' ')}
            >
              Historia projektu
            </button>
            <button
              onClick={() => setTab('stack')}
              className={['flex-1 py-2 rounded-lg text-sm font-bold transition-colors', tab === 'stack' ? 'bg-yellow-500 text-black' : 'bg-white/5 text-white/50 hover:bg-white/10'].join(' ')}
            >
              Stack technologiczny
            </button>
          </div>

          {tab === 'history' && (
            <div>
              <div className="bg-white/5 rounded-xl px-4 py-3 mb-4 flex gap-6">
                <div className="text-center">
                  <p className="text-yellow-400 text-xl font-bold font-mono">~20h</p>
                  <p className="text-white/40 text-[10px] leading-tight">aktywnej<br/>współpracy</p>
                </div>
                <div className="text-center">
                  <p className="text-yellow-400 text-xl font-bold font-mono">145h</p>
                  <p className="text-white/40 text-[10px] leading-tight">czas zegarowy<br/>od startu</p>
                </div>
                <div className="border-l border-white/10 pl-6 flex items-center">
                  <p className="text-white/40 text-xs leading-relaxed">
                    Gra powstała w całości podczas sesji z Claude Code (Anthropic) — ok. 2 pełne dni robocze na kompletną grę z multiplayerem, AI, mobilem i deploye'm na produkcję.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <HistoryRow time="31 mar, 22:30" delta="0h" title="Start projektu">
                  Scaffold Vite + React 18 + TypeScript + Tailwind CSS. Definicja wszystkich typów gry
                  (DragonCard, ActionCard, GoalCard, GameState). Pierwsza wersja silver.ts i engine/index.ts.
                </HistoryRow>
                <HistoryRow time="31 mar, 23:30" delta="+1h" title="Definicja 72 kart">
                  deck.ts — kompletna lista wszystkich kart: 51 smoków (Aces, Halves, Banners, Threeways, Quads),
                  15 kart akcji, Silver Dragon. Tasowanie i rozdawanie.
                </HistoryRow>
                <HistoryRow time="1 kwi, 21:00" delta="+22h" title="Silnik planszy">
                  board.ts — walidacja ułożenia kart na poziomie paneli (2× rozdzielczość). Sprawdzanie
                  sąsiedztwa krawędziowego, dopasowanie kolorów, Rainbow i Silver jako wildcard.
                  Pełny zestaw testów jednostkowych.
                </HistoryRow>
                <HistoryRow time="2 kwi, 23:40" delta="+49h" title="Akcje i bonusy">
                  connections.ts — wykrywanie bonusu za wielokrotne połączenie (2/3/4 kolory → +1/2/3 karty).
                  actions.ts — implementacja wszystkich 5 akcji: Trade Hands, Trade Goals, Rotate Goals,
                  Move a Card, Zap a Card. Testy jednostkowe każdej akcji.
                </HistoryRow>
                <HistoryRow time="3 kwi, 00:30" delta="+50h" title="Warunek wygranej">
                  win.ts — BFS flood-fill po siatce paneli. Sprawdzenie czy gracz zebrał 7 połączonych
                  paneli swojego koloru (Rainbow i Silver jako wildcard). Pełne testy scenariuszy wygranej.
                </HistoryRow>
                <HistoryRow time="4 kwi, 19:00" delta="+92h" title="UI gry i ActionTargeting">
                  ActionTargeting — nakładka na planszę do wskazywania celu akcji (Zap, Move, Trade).
                  DragonEmblem — system SVG emblematów smoków per kolor (gotycki medalion). Testy game.ts.
                </HistoryRow>
                <HistoryRow time="4 kwi, 23:55" delta="+97h" title="Ekran zwycięstwa">
                  WinOverlay — animowany banner końca gry z informacją o zwycięzcy i wynikiem.
                </HistoryRow>
                <HistoryRow time="5 kwi, 00:52" delta="+98h" title="Autentykacja + BonusToast">
                  Integracja Clerk — logowanie użytkowników, usernames, wymagane do trybu online.
                  BonusToast — animowane powiadomienie o dodatkowych kartach za wielokrotne połączenie.
                </HistoryRow>
                <HistoryRow time="5 kwi, 19:55" delta="+117h" title="AI opponent + refactor">
                  ai.ts — przeciwnik komputerowy oparty na greedy heuristic (maksymalizacja spójnych
                  paneli własnego koloru). Refactor game.ts i types.ts pod tryb multiplayer
                  (masked state — gracze nie widzą kart i celów przeciwników).
                </HistoryRow>
                <HistoryRow time="5 kwi, 20:38" delta="+118h" title="Warstwa sieciowa">
                  network/client.ts + types.ts — protokół WebSocket. multiplayerStore + gameStore (Zustand) —
                  zarządzanie stanem multiplayer. PlayerLeftToast, InviteBanner. App.tsx z routingiem
                  lobby ↔ gra.
                </HistoryRow>
                <HistoryRow time="5 kwi, 21:12" delta="+118h 42min" title="Serwer PartyKit">
                  party/index.ts — serwer WebSocket w chmurze. Pokoje gry, autoryzacja ruchów,
                  broadcast state diff do wszystkich graczy. Host transfer gdy host rozłączy się.
                  Pierwsze działające partie online.
                </HistoryRow>
                <HistoryRow time="6 kwi, 01:05" delta="+122h 35min" title="System zaproszeń">
                  inviteClient.ts — dedykowany WebSocket do zaproszeń z 5s auto-reconnect.
                  Kanały invite-{'{username}'} w PartyKit. Badge statusu online w lobby.
                  Diagnoza i naprawa buga dostarczania zaproszeń (typo w nicku).
                </HistoryRow>
                <HistoryRow time="6 kwi, 01:25" delta="+122h 55min" title="Onboarding tutorial">
                  GameTutorial — 6-krokowy interaktywny tutorial z podświetleniem spotlight.
                  Pozycjonowanie oparte na getBoundingClientRect() (data-tutorial atrybuty).
                  Stan zapamiętywany w localStorage.
                </HistoryRow>
                <HistoryRow time="6 kwi, 01:33" delta="+123h 3min" title="Instrukcja gry (Help)">
                  HelpModal — pełna instrukcja zasad gry w polskim. Przycisk "? Help" w sidebarze.
                  Animacje Framer Motion, sekcje per mechanika.
                </HistoryRow>
                <HistoryRow time="6 kwi, 02:06" delta="+123h 36min" title="Tło graficzne">
                  bg.webp — grafika smoka jako tło lobby i planszy gry (359 KB WebP, optymalizacja
                  z Python Pillow z 9.5 MB PNG). Frosted glass panels w lobby.
                </HistoryRow>
                <HistoryRow time="6 kwi, 02:28" delta="+123h 58min" title="Tło na planszy gry">
                  Rozszerzenie tła na całą stronę gry. Transparentne Sidebar, HandBar i BoardArea
                  — smok widoczny przez całą grę.
                </HistoryRow>
                <HistoryRow time="6 kwi, 02:51" delta="+124h 21min" title="Nowy emblemat na kartach">
                  Emblemat "7 Dragons" (herb z 7 głowami smoków) jako overlay na kartach.
                  Usunięcie tła PNG flood-fillem z rogów (Python Pillow, 3.1M pikseli).
                  Podmiana w DragonCard i SilverDragonCard.
                </HistoryRow>
                <HistoryRow time="6 kwi, 03:01" delta="+124h 31min" title="Black → zinc-950">
                  Kolor paneli Black zmieniony z bg-zinc-800 na bg-zinc-950 — wyraźniejszy,
                  prawdziwie czarny.
                </HistoryRow>
                <HistoryRow time="6 kwi, 03:08" delta="+124h 38min" title="Ten modal">
                  TechInfoModal — opis historii i stacku technologicznego pod przyciskiem "? tech stack"
                  w prawym dolnym rogu lobby.
                </HistoryRow>
                <HistoryRow time="6 kwi, 20:00" delta="+141h 30min" title="Mobile layout overhaul">
                  Sidebar jako drawer (fixed + translate-x) z hamburger togglem. MobileTopBar —
                  pasek na górze z talią, stosem odrzuconych, Silver Dragon i celem. Responsywna
                  ręka gracza (sm/md karty, h-24/h-36). h-dvh zamiast h-screen (fix Safari iOS).
                </HistoryRow>
                <HistoryRow time="6 kwi, 21:00" delta="+142h 30min" title="ActionConfirm redesign">
                  Przebudowa panelu potwierdzenia karty akcji na mobile — dwa rzędy: badge akcji
                  + Silver toggle, następnie pełnowymiarowe przyciski Cancel / Play.
                </HistoryRow>
                <HistoryRow time="6 kwi, 22:00" delta="+143h 30min" title="Naprawa buga AI (action-targeting)">
                  Bug: AI grało kartę akcji wymagającą wskazania celu (move-card/zap-card), a gdy
                  nie mogło znaleźć poprawnego ruchu, gra zawieszała się. Fix: catch w scheduleAI
                  wykonuje endTurn + drawCard zamiast cicho ignorować błąd.
                </HistoryRow>
                <HistoryRow time="6 kwi, 23:20" delta="+144h 50min" title="isMyTurn fix + usunięcie draw-instead">
                  isMyTurn w singleplayerze zmienione na !currentPlayer.isAI — AI nie przejmuje
                  już planszy podczas ruchu gracza. Overlay "AI is thinking…" na handbarze.
                  Usunięto przycisk "draw instead of play" — niezgodny z zasadami gry.
                </HistoryRow>
                <HistoryRow time="6 kwi, 23:26" delta="+144h 56min" title="Rotate Goals — ring graczy">
                  Wizualizacja kolejności graczy przy stole podczas wyboru kierunku rotacji celów.
                  Każdy przycisk (Left/Right) pokazuje podgląd "receive from: [imię/?]" oparty
                  na dokładnej logice ring-shift silnika gry.
                </HistoryRow>
                <HistoryRow time="6 kwi, 23:40" delta="+145h 10min" title="Fix: sidebar pokazywał cel AI">
                  myPlayer w Sidebar i MobileTopBar używał currentPlayer — podczas tury AI
                  wyświetlał cel AI w sekcji "YOUR GOAL". Naprawiono przez state.players[0]
                  (gracz-człowiek zawsze na indeksie 0 w singleplayerze).
                </HistoryRow>
                <HistoryRow time="7 kwi, 00:00" delta="+145h 30min" title="HelpModal — portal fix">
                  HelpModal renderowany wewnątrz Sidebara z CSS transform (drawer) łamał
                  position:fixed. Fix przez ReactDOM.createPortal do document.body — modal
                  teraz poprawnie zajmuje pełny ekran na desktopie.
                </HistoryRow>
              </div>
              <p className="text-white/20 text-xs mt-4 text-center">
                Łączny czas od startu do chwili obecnej: ~145 godzin
              </p>
            </div>
          )}

          {tab === 'stack' && (
            <div>
              <Section title="Frontend">
                <Row label="React 18 + TypeScript" desc="Interfejs użytkownika i logika widoku — komponenty funkcyjne, hooki, strict mode." />
                <Row label="Vite" desc="Bundler i dev server — błyskawiczny HMR, optymalizowany build produkcyjny." />
                <Row label="Tailwind CSS" desc="Utility-first styling — wszystkie style inline jako klasy, zero własnych arkuszy CSS." />
                <Row label="Framer Motion" desc="Animacje kart, tutorialu, modali i toastów — deklaratywne keyframes i spring physics." />
                <Row label="Zustand" desc="Lekki state manager — osobne store dla stanu gry (gameStore) i multiplayera (multiplayerStore)." />
              </Section>
              <Section title="Silnik gry (Pure TypeScript)">
                <Row label="engine/types.ts" desc="Typy danych: DragonCard, ActionCard, GoalCard, GameState, BoardPosition, Panel." />
                <Row label="engine/deck.ts" desc="Definicje wszystkich 72 kart (51 smoków, 15 akcji, 5 celów) + tasowanie i rozdawanie." />
                <Row label="engine/board.ts" desc="Walidacja ułożenia kart — panel-level adjacency, color matching, Silver Dragon wildcard." />
                <Row label="engine/win.ts" desc="BFS flood-fill — sprawdzenie czy gracz zebrał 7 połączonych paneli swojego koloru." />
                <Row label="engine/connections.ts" desc="Bonus za wielokrotne połączenie — zliczanie unikalnych kolorów w jednym zagraniu." />
                <Row label="engine/actions.ts" desc="Implementacja 5 akcji: Trade Hands, Trade Goals, Rotate Goals, Move a Card, Zap a Card." />
                <Row label="engine/game.ts" desc="Główna maszyna stanów — przejścia: draw → play → action-targeting → ended." />
                <Row label="engine/ai.ts" desc="Przeciwnik AI — greedy heuristic maksymalizujący spójne panele własnego koloru." />
              </Section>
              <Section title="Multiplayer (Real-time)">
                <Row label="PartyKit" desc="WebSocket server w chmurze — pokoje gry, relay wiadomości, autoryzacja ruchów po stronie serwera." />
                <Row label="Invite system" desc="Osobne pokoje WebSocket z prefiksem invite- — wysyłanie zaproszeń po nazwie użytkownika z 5s reconnect." />
                <Row label="Masked game state" desc="Serwer ukrywa karty i cele innych graczy — każdy klient widzi tylko swoje karty." />
                <Row label="Host transfer" desc="Gdy host rozłączy się, serwer automatycznie przekazuje rolę hosta kolejnemu graczowi." />
              </Section>
              <Section title="Autoryzacja i infrastruktura">
                <Row label="Clerk" desc="Autentykacja użytkowników — sign in/up, profil, username. Wymagana do trybu online." />
                <Row label="Vercel" desc="Hosting frontendu — automatyczny deploy, CDN, HTTPS, domena 7dragons.club." />
                <Row label="PartyKit Cloud" desc="Hosting serwera WebSocket — skalowalne pokoje, zero cold-start." />
              </Section>
              <Section title="Architektura danych">
                <Row label="Panel grid 2×" desc="Atomową jednostką jest panel, nie karta. Karta 2×2 = 4 panele. Sąsiedztwo przez krawędź (dx+dy=1)." />
                <Row label="Board jako sparse Map" desc='Plansza to Map<string, PlacedCard> gdzie klucz to "x,y". Nieskończona siatka bez alokacji pustych komórek.' />
                <Row label="Silver Dragon" desc="Stoi na środku (0,0) na stałe. silverDragonColor: DragonColor | 'all' zmienia się po każdej akcji." />
              </Section>
            </div>
          )}

          <button
            onClick={onClose}
            className="mt-4 w-full py-2.5 bg-white/10 hover:bg-white/20 text-white/70 font-bold rounded-xl text-sm transition-colors"
          >
            Zamknij
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

function HistoryRow({ time, delta, title, children }: { time: string; delta: string; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 rounded-xl px-3 py-2.5 flex gap-3">
      <div className="shrink-0 flex flex-col items-end gap-0.5 pt-0.5">
        <span className="text-yellow-400 text-xs font-mono font-bold whitespace-nowrap">{delta}</span>
        <span className="text-white/30 text-[10px] font-mono whitespace-nowrap">{time}</span>
      </div>
      <div className="border-l border-white/10 pl-3">
        <p className="text-white text-sm font-semibold mb-0.5">{title}</p>
        <p className="text-white/50 text-xs leading-relaxed">{children}</p>
      </div>
    </div>
  );
}
