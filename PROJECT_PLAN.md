# Seven Dragons — Web Game Project Plan

## Game Summary

**Cards (72 total):**
- 5 Goal cards (one per player, secret) — Red, Gold, Blue, Green, Black
- 1 Silver Dragon (center, never moves; starts as all-colors, changes to the color shown on the top Action card each time an Action is played)
- 51 Dragon cards (multi-panel, 1–4 panels per card)
- 15 Action cards (3 each × 5 types)

**Turn:** Draw 1 card → Play 1 card (either a Dragon onto the table, or an Action)

**Win:** First to have 7 connected panels of their goal color in one contiguous group (branching allowed)

**Special rules:** Rainbow Dragon = wild (all colors at once). Multi-connection bonus: connecting 2/3/4 different colors in one placement draws 1/2/3 bonus cards.

---

## Recommended Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Frontend | React 18 + TypeScript + Vite | Fast DX, strong typing for game logic |
| Styling | Tailwind CSS + Framer Motion | Layout + card animations |
| Client state | Zustand | Simple, no boilerplate |
| Game engine | Pure TypeScript (no framework deps) | Testable in isolation, portable |
| Real-time | PartyKit or Socket.io | Room-based WebSocket sessions |
| Backend | Node.js + Express (or Next.js API routes) | Thin server, mostly a relay + auth |
| Session store | Redis | Fast ephemeral game state |
| Persistence | PostgreSQL | User accounts, stats, game history |
| Testing | Vitest + React Testing Library | Fast unit tests for game engine |

---

## Core Data Model

This is the hardest design decision. The key insight is that **panels are the atomic unit**, not cards.

```typescript
type DragonColor = 'red' | 'gold' | 'blue' | 'green' | 'black';

// A panel slot on a dragon card — null means the slot exists but is "blank"
type Panel = DragonColor | 'rainbow' | null;

// Every dragon card is a 2×2 grid of panels
type DragonCard = {
  id: string;
  type: 'dragon';
  panels: [[Panel, Panel], [Panel, Panel]]; // [row0, row1], each row is [col0, col1]
};

type ActionType = 'trade-hands' | 'trade-goals' | 'rotate-goals' | 'move-card' | 'zap-card';

type ActionCard = {
  id: string;
  type: 'action';
  action: ActionType;
  // The dragon image shown on this action card — determines Silver Dragon color when played
  silverColor: DragonColor;
};

type GoalCard = {
  id: string;
  type: 'goal';
  color: DragonColor;
};

// Board uses sparse map: "x,y" → placed card
type BoardPosition = { x: number; y: number };

type PlacedCard = {
  card: DragonCard;
  pos: BoardPosition;
};

type Player = {
  id: string;
  name: string;
  hand: (DragonCard | ActionCard)[];
  goal: GoalCard;
};

type GameState = {
  board: Map<string, PlacedCard>;   // key: "x,y"
  deck: (DragonCard | ActionCard)[];
  discardPile: ActionCard[];
  silverDragonColor: DragonColor | 'all'; // 'all' initially
  players: Player[];
  currentPlayerIndex: number;
  phase: 'draw' | 'play' | 'action-pending' | 'ended';
  winner: string | null;
};
```

### Panel Coordinate System

Cards sit on an integer grid. Internally, expand to a **panel grid** at 2× resolution:

```
Card at board position (cx, cy) → panels at panel positions:
  (cx*2,   cy*2  )  (cx*2+1, cy*2  )
  (cx*2,   cy*2+1)  (cx*2+1, cy*2+1)
```

Two panels are adjacent if their panel coordinates differ by 1 in exactly one axis. This gives a unified adjacency graph for the win-condition BFS across both intra-card and inter-card panel neighbors — no special cases.

---

## Game Engine (Pure Functions)

This module has zero UI dependencies and is fully unit-tested.

```
src/engine/
  types.ts          — all game types
  deck.ts           — card definitions, shuffle, deal
  board.ts          — placement validation, panel adjacency
  connections.ts    — multi-connection bonus detection
  win.ts            — BFS flood-fill for 7 connected same-color panels
  actions.ts        — execute each of the 5 action types
  silver.ts         — Silver Dragon color tracking
  game.ts           — top-level state machine (reducers/transitions)
```

**Critical algorithms:**

1. **`isPlacementValid(board, card, pos)`** — card must share an edge with at least one existing card AND at least one panel pair on the shared edge must match color (considering Rainbow as wild, Silver as its current color).

2. **`countNewConnections(board, card, pos)`** — after tentative placement, count how many distinct non-rainbow colors were newly connected; drives the bonus draw.

3. **`checkWin(board, goalColor, silverColor)`** — flood-fill from every panel of `goalColor` (treating Rainbow + Silver-if-matching as that color), return true if any connected component has ≥ 7 nodes.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                    Browser                       │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐ │
│  │  Lobby   │  │  Board   │  │  Hand / UI    │ │
│  │  (rooms) │  │  (cards) │  │  (actions)    │ │
│  └──────────┘  └──────────┘  └───────────────┘ │
│           Zustand store (client-side)            │
│           ↑ events ↓ actions                     │
│      WebSocket client (PartyKit/Socket.io)       │
└──────────────────────┬──────────────────────────┘
                       │ WS
┌──────────────────────▼──────────────────────────┐
│              Game Server / Party                 │
│  - Authoritative game state (GameState in Redis) │
│  - Validates moves via game engine (same code)   │
│  - Broadcasts state diffs to all room clients    │
└─────────────────────────────────────────────────┘
```

**Key principle:** The game engine runs on **both client and server**. The client applies moves optimistically; the server validates and is authoritative. Reuse exact same TypeScript modules.

---

## UI Components

```
src/components/
  Board/
    Board.tsx          — renders the placed-card grid (CSS Grid or SVG)
    PlacedCard.tsx     — a card on the board
    DropZone.tsx       — highlight valid placement positions
  Hand/
    Hand.tsx           — player's current cards
    CardInHand.tsx     — draggable card
  Card/
    DragonCard.tsx     — 2×2 panel layout with colored dragon art
    ActionCard.tsx     — action card face
    GoalCard.tsx       — goal card (own goal shown, others hidden)
    SilverDragon.tsx   — always-visible center card with current color indicator
  HUD/
    PlayerStatus.tsx   — hand count, goal color indicator
    DeckPile.tsx       — draw pile count
    DiscardPile.tsx    — top card visible
    TurnIndicator.tsx
  Lobby/
    RoomCreate.tsx
    RoomJoin.tsx
    PlayerList.tsx
```

**Board rendering:** Use absolute positioning on a panning container (infinite canvas). Cards snap to grid. Show ghost preview of where a dragged card would land, highlighted green/red based on validity.

---

## Multiplayer Flow

```
Client A                Server              Client B
   │── create room ────→ │                    │
   │← room code ─────── │                    │
   │                     │ ←── join room ─── │
   │                     │──── game-start ──→│ (→ Client A too)
   │── draw-card ───────→│ validate + update │
   │                     │──── state-diff ──→│
   │── play-card(pos) ──→│ validate placement│
   │                     │  run win check    │
   │                     │──── state-diff ──→│
```

Actions that require targeting (Move a Card, Zap a Card, Trade Hands) use a two-step flow: play action card → enter "targeting mode" → click target → confirm.

---

## Development Phases

### Phase 0 — Game Engine (1–2 weeks)
- [ ] Define all TypeScript types
- [ ] Build card dataset (all 72 cards with panel layouts)
- [ ] Implement `board.ts`: placement validation with full edge/panel matching
- [ ] Implement `connections.ts`: multi-connection bonus detection
- [ ] Implement `win.ts`: BFS/flood-fill for win condition
- [ ] Implement `actions.ts`: all 5 action types as pure functions
- [ ] Implement `silver.ts`: Silver Dragon color state tracking
- [ ] Implement `game.ts`: full turn state machine
- **100% unit-tested before any UI work**

### Phase 1 — Local Hot-Seat (2 weeks)
- [ ] Project scaffold (Vite + React + TypeScript + Tailwind)
- [ ] Board rendering (draggable grid, placement highlights)
- [ ] Card components (visual panel layout)
- [ ] Hand UI
- [ ] Full turn loop working locally (2 players, same screen)
- [ ] Win detection + end screen

### Phase 2 — Multiplayer (2 weeks)
- [ ] Room creation / join with shareable codes
- [ ] WebSocket server with authoritative state
- [ ] Hidden information (you only see your own Goal)
- [ ] Reconnection handling (reload page → rejoin)
- [ ] 2–5 player support

### Phase 3 — Actions & Special Cases (1 week)
- [ ] Targeting UI for Move a Card, Zap a Card, Trade Hands
- [ ] Trade Goals / Rotate Goals flows
- [ ] Multi-connection bonus animations + card draw
- [ ] Unused Goal handling for 2–4 player games
- [ ] Deck exhaustion endgame (closest to 7 wins)
- [ ] Silver Dragon visual state change on Action play

### Phase 4 — Design & Grafiki ✅ FIGMA GOTOWE
**Plik Figma:** https://www.figma.com/design/ljX9l7rlHeLZECDAf321la
*(Develocraft team, 8 stron)*

### Phase 4 — Design & Grafiki (1–2 tygodnie, równolegle z Fazą 1–3)

Ten etap może toczyć się równolegle z pracami programistycznymi — designerzy nie blokują developerów, jeśli zaczną od placeholderów.

#### Styl wizualny
- [ ] Zdefiniuj kierunek artystyczny: mroczny fantasy (zgodny z ilustracjami Larry'ego Elmore'a) vs. bardziej współczesny flat design
- [ ] Przygotuj moodboard i paletę kolorów dla każdego smoka (Red, Gold, Blue, Green, Black, Rainbow, Silver)
- [ ] Zaprojektuj system typografii (font nagłówkowy — stylizowany, font UI — czytelny)
- [ ] Zdefiniuj design tokens (kolory, cienie, border-radius, spacing) — wdrożone w Tailwind config

#### Karty
- [ ] Zaprojektuj szablon karty smoka: ramka, układ 2×2 paneli, tło per kolor
- [ ] Zaprojektuj rewers karty (widok z ręki przeciwnika)
- [ ] Zaprojektuj karty akcji (5 typów) — każda z wyraźną ikoną akcji i ilustracją smoka
- [ ] Zaprojektuj karty Goal — powinny wyglądać wyróżniająco od kart smoka
- [ ] Zaprojektuj kartę Silver Dragon (specjalna ramka wskazująca aktualny kolor)
- [ ] Przygotuj ilustracje smoków (72 unikalne panele lub zestaw reużywalnych per kolor)
  - Opcja A: Licencja ilustracji Larry'ego Elmore'a (oryginalne karty)
  - Opcja B: Zamówienie nowych ilustracji u freelancera (Behance/ArtStation)
  - Opcja C: Generowanie AI (Midjourney/Stable Diffusion) jako placeholder

#### UI / Ekrany
- [ ] Zaprojektuj ekran Lobby (tworzenie pokoju, wpisanie kodu, lista graczy)
- [ ] Zaprojektuj główny ekran gry:
  - Plansza (infinite canvas, centrowany Silver Dragon)
  - Ręka gracza (bottom bar)
  - HUD: talia, stos odrzuconych, wskaźnik tury, liczniki połączeń
  - Panel statusu innych graczy (liczba kart w ręce, zamazany cel)
- [ ] Zaprojektuj overlaye akcji (targeting mode: Move a Card, Zap, Trade Hands)
- [ ] Zaprojektuj ekran końca gry (zwycięstwo / przegrana)
- [ ] Zaprojektuj wersję mobilną (karty w poziomie, plansza z gestem pinch-to-zoom)

#### Animacje (specyfikacja dla developera)
- [ ] Specyfikacja: wciągnięcie karty na planszę (ease-out, 200ms)
- [ ] Specyfikacja: zmiana koloru Silver Dragon (pulse glow, 400ms)
- [ ] Specyfikacja: bonus draw — karta "leci" z talii do ręki
- [ ] Specyfikacja: win condition — podświetlenie 7 połączonych paneli (sequential glow)
- [ ] Specyfikacja: efekt odrzucenia karty (shake + red flash, invalid placement)

#### Deliverables
- Figma file z komponentami (design system)
- Eksport SVG/PNG wszystkich kart w @1x i @2x
- Sprite sheet lub zestaw plików per karta dla frontendu

---

### Phase 5 — Polish (ongoing)
- [ ] Animacje: placement, draw, Silver Dragon color shift (wg specyfikacji z Fazy 4)
- [ ] Mobile touch support (drag & drop na mobile, pinch-to-zoom na planszy)
- [ ] Efekty dźwiękowe (placement, draw, wygrana, akcje)
- [ ] Prosty AI opponent (greedy heuristic: maksymalizuj własne połączone panele)
- [ ] Historia gry / tryb widza

---

### Phase 6 — Publikacja i Deployment (1 tydzień)

#### Infrastruktura
- [ ] Wybór providera:
  - **Frontend**: Vercel (zero-config dla React/Vite, darmowy tier)
  - **WebSocket server**: Railway lub Fly.io (wspierają długotrwałe połączenia WS)
  - **Redis**: Upstash (serverless Redis, pay-per-use)
  - **PostgreSQL**: Supabase lub Railway
- [ ] Skonfiguruj środowiska: `development` → `staging` → `production`
- [ ] Ustaw zmienne środowiskowe (`.env.production`) dla każdego środowiska

#### CI/CD
- [ ] GitHub Actions pipeline:
  - `push → main`: uruchom testy → build → deploy na staging
  - `release tag`: deploy na production po ręcznym zatwierdzeniu
- [ ] Dodaj badge statusu buildu do README
- [ ] Skonfiguruj Playwright E2E tests (smoke test przed każdym deployem na prod)

#### Domena i SSL
- [ ] Kup domenę (np. `sevendragons.app` lub `7dragons.io`)
- [ ] Skonfiguruj DNS → Vercel (frontend) + Railway/Fly (backend)
- [ ] SSL certyfikat automatyczny (Vercel + Let's Encrypt)
- [ ] Skonfiguruj CORS: backend akceptuje tylko ruch z właściwej domeny

#### Monitoring
- [ ] Sentry — error tracking (frontend + backend)
- [ ] Uptime monitor — BetterUptime lub Checkly (ping co 1 min)
- [ ] Logi WebSocket sesji — Logtail lub Axiom

#### Pre-launch checklist
- [ ] Test obciążeniowy: symulacja 50 równoczesnych gier (k6 lub Artillery)
- [ ] Weryfikacja ukrytej informacji: Goal card nie wyciek przez API do innych graczy
- [ ] Rate limiting na endpointach room/create i room/join
- [ ] Robots.txt + OpenGraph meta tagi (podgląd linku przy udostępnianiu pokoju)
- [ ] Strona 404 i strona błędu serwera

---

## Key Edge Cases to Handle from Day 1

| Rule | Implementation note |
|---|---|
| Silver Dragon changes color when Action played | Stored as `silverDragonColor` in `GameState`, updated **after** the action resolves |
| Playing Action = two effects (action + Silver color change); player can forfeit one | Two-step confirmation UI: "Apply action?", "Allow Silver Dragon color change?" |
| Deck runs out: keep playing without drawing | `deck.length === 0` → skip draw step; when all hands empty, trigger closest-to-7 scoring |
| Move a Card cannot create disconnected island | Validate post-move board: all placed cards must remain in one connected group |
| Zap picks up any card (including ones you placed) | No ownership restriction |
| Rainbow connects to every color for win-check | Treat Rainbow panels as matching any color during BFS |
| Silver Dragon counts as its current color for placement + win-check | Parameterize all checks with `silverDragonColor` |
| Multi-connection bonus: no bonus for Rainbow or Silver connections | Explicitly exclude from bonus color count |

---

## First Steps

1. `npm create vite@latest 7dragons-web -- --template react-ts`
2. Write the full TypeScript types (`src/engine/types.ts`)
3. Create the card dataset JSON (all 72 cards with panel color arrays)
4. Write and pass unit tests for placement validation and win detection before touching UI
