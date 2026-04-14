import type { DragonCard, ActionCard, GoalCard, DragonColor, PanelColor } from './types';

export const SILVER_DRAGON_ID = 'silver';

const COLORS: DragonColor[] = ['red', 'gold', 'blue', 'green', 'black'];

// ─── ACES (11 in main deck + 1 Silver Dragon as start card) ──────────────────
// Silver Dragon is NOT in the deck — it's the permanent center card.
// Rainbow Dragon: 1 card, all 4 panels rainbow.
// Single-color Aces: 2 cards per color × 5 colors = 10 cards.
// Total Aces in deck: 11

const rainbowAce: DragonCard = {
  id: 'ace_rainbow',
  type: 'dragon',
  panels: [['rainbow', 'rainbow'], ['rainbow', 'rainbow']],
};

const singleColorAces: DragonCard[] = COLORS.flatMap((color) =>
  [1, 2].map((i) => ({
    id: `ace_${color}_${i}`,
    type: 'dragon' as const,
    panels: [[color, color], [color, color]] as [[PanelColor, PanelColor], [PanelColor, PanelColor]],
  }))
);

// ─── HALVES (10 cards) ────────────────────────────────────────────────────────
// Horizontal split: top row = color A, bottom row = color B.
// Layout: [[A, A], [B, B]]
// Exact pairs from official card list:

const halvesData: [DragonColor, DragonColor][] = [
  ['black', 'green'],
  ['black', 'red'],
  ['blue',  'black'],
  ['black', 'gold'],
  ['red',   'green'],
  ['green', 'blue'],
  ['red',   'blue'],
  ['gold',  'blue'],
  ['gold',  'green'],
  ['gold',  'red'],
];

const halvesCards: DragonCard[] = halvesData.map(([a, b]) => ({
  id: `half_${a}_${b}`,
  type: 'dragon' as const,
  panels: [[a, a], [b, b]] as [[PanelColor, PanelColor], [PanelColor, PanelColor]],
}));

// ─── BANNERS (10 cards) ───────────────────────────────────────────────────────
// Vertical split: left col = color A, right col = color B.
// Layout: [[A, B], [A, B]]
// Same 10 color pairs as Halves, different layout:

const bannersData: [DragonColor, DragonColor][] = [
  ['black', 'green'],
  ['green', 'blue'],
  ['blue',  'black'],
  ['red',   'green'],
  ['black', 'red'],
  ['blue',  'red'],
  ['gold',  'red'],
  ['gold',  'green'],
  ['black', 'gold'],
  ['gold',  'blue'],
];

const bannersCards: DragonCard[] = bannersData.map(([a, b]) => ({
  id: `banner_${a}_${b}`,
  type: 'dragon' as const,
  panels: [[a, b], [a, b]] as [[PanelColor, PanelColor], [PanelColor, PanelColor]],
}));

// ─── THREEWAYS (10 cards) ─────────────────────────────────────────────────────
// "Half" of one color (2 panels) + "quarter" of two others (1 panel each).
// Layout: [[half, half], [quarter1, quarter2]]
// Exact cards from official card list:

const threewaysData: [DragonColor, DragonColor, DragonColor][] = [
  ['green', 'black',  'red'  ],  // Half Green, quarter Black and Red
  ['green', 'blue',   'gold' ],  // Half Green, quarter Blue and Gold
  ['black', 'gold',   'red'  ],  // Half Black, quarter Gold and Red
  ['black', 'green',  'blue' ],  // Half Black, quarter Green and Blue
  ['red',   'gold',   'blue' ],  // Half Red, quarter Gold and Blue
  ['red',   'black',  'green'],  // Half Red, quarter Black and Green
  ['blue',  'black',  'red'  ],  // Half Blue, quarter Black and Red
  ['blue',  'gold',   'red'  ],  // Half Blue, quarter Gold and Red
  ['gold',  'blue',   'green'],  // Half Gold, quarter Blue and Green
  ['gold',  'red',    'black'],  // Half Gold, quarter Red and Black
];

const threewaysCards: DragonCard[] = threewaysData.map(([half, q1, q2]) => ({
  id: `three_${half}_${q1}_${q2}`,
  type: 'dragon' as const,
  panels: [[half, half], [q1, q2]] as [[PanelColor, PanelColor], [PanelColor, PanelColor]],
}));

// ─── QUADS (10 cards) ─────────────────────────────────────────────────────────
// One panel of each of 4 different colors.
// Layout: [[c1, c2], [c3, c4]]
// Exact cards from official card list (order = reading order top-left → top-right → bottom-left → bottom-right):

const quadsData: [DragonColor, DragonColor, DragonColor, DragonColor][] = [
  ['blue',  'red',   'green', 'black'],  // Blue, Red, Green, and Black
  ['red',   'black', 'blue',  'green'],  // Red, Black, Blue, and Green
  ['green', 'red',   'black', 'gold' ],  // Green, Red, Black, and Gold
  ['black', 'green', 'gold',  'red'  ],  // Black, Green, Gold and Red
  ['green', 'red',   'gold',  'blue' ],  // Green, Red, Gold and Blue
  ['gold',  'green', 'blue',  'red'  ],  // Gold, Green, Blue, and Red
  ['green', 'gold',  'blue',  'black'],  // Green, Gold, Blue and Black
  ['gold',  'black', 'green', 'blue' ],  // Gold, Black, Green, and Blue
  ['gold',  'blue',  'red',   'black'],  // Gold, Blue, Red, and Black
  ['blue',  'black', 'gold',  'red'  ],  // Blue, Black, Gold, and Red
];

const quadsCards: DragonCard[] = quadsData.map(([c1, c2, c3, c4]) => ({
  id: `quad_${c1}_${c2}_${c3}_${c4}`,
  type: 'dragon' as const,
  panels: [[c1, c2], [c3, c4]] as [[PanelColor, PanelColor], [PanelColor, PanelColor]],
}));

// ─── FULL DRAGON CARD LIST (51 cards) ────────────────────────────────────────
// Aces: 11 (1 rainbow + 10 single-color)
// Halves: 10
// Banners: 10
// Threeways: 10
// Quads: 10
// Total: 51

export const dragonCards: DragonCard[] = [
  rainbowAce,
  ...singleColorAces,
  ...halvesCards,
  ...bannersCards,
  ...threewaysCards,
  ...quadsCards,
];

// ─── ACTION CARDS (15 cards) ──────────────────────────────────────────────────
// 3 per type × 5 types = 15
// silverColor = the dragon image on that action card (sets Silver Dragon color when played)

// Kolory ustalono na podstawie ilustracji na kartach (każdy typ akcji ma jeden stały kolor):
// Move a Card  = green  (zielona księżniczka)
// Zap a Card   = red    (czerwone płomienie)
// Rotate Goals = blue   (niebieska księżniczka)
// Trade Goals  = gold   (złota księżniczka)
// Trade Hands  = black  (czarna księżniczka)

export const actionCards: ActionCard[] = [
  { id: 'move-card_1',    type: 'action', action: 'move-card',    silverColor: 'green' },
  { id: 'move-card_2',    type: 'action', action: 'move-card',    silverColor: 'green' },
  { id: 'move-card_3',    type: 'action', action: 'move-card',    silverColor: 'green' },

  { id: 'zap-card_1',     type: 'action', action: 'zap-card',     silverColor: 'red'   },
  { id: 'zap-card_2',     type: 'action', action: 'zap-card',     silverColor: 'red'   },
  { id: 'zap-card_3',     type: 'action', action: 'zap-card',     silverColor: 'red'   },

  { id: 'rotate-goals_1', type: 'action', action: 'rotate-goals', silverColor: 'blue'  },
  { id: 'rotate-goals_2', type: 'action', action: 'rotate-goals', silverColor: 'blue'  },
  { id: 'rotate-goals_3', type: 'action', action: 'rotate-goals', silverColor: 'blue'  },

  { id: 'trade-goals_1',  type: 'action', action: 'trade-goals',  silverColor: 'gold'  },
  { id: 'trade-goals_2',  type: 'action', action: 'trade-goals',  silverColor: 'gold'  },
  { id: 'trade-goals_3',  type: 'action', action: 'trade-goals',  silverColor: 'gold'  },

  { id: 'trade-hands_1',  type: 'action', action: 'trade-hands',  silverColor: 'black' },
  { id: 'trade-hands_2',  type: 'action', action: 'trade-hands',  silverColor: 'black' },
  { id: 'trade-hands_3',  type: 'action', action: 'trade-hands',  silverColor: 'black' },
];

// ─── GOAL CARDS (5 cards) ─────────────────────────────────────────────────────
export const goalCards: GoalCard[] = COLORS.map((color) => ({
  id: `goal_${color}`,
  type: 'goal' as const,
  color,
}));

// ─── UTILS ────────────────────────────────────────────────────────────────────

// Fisher-Yates shuffle
export function shuffleDeck<T>(cards: T[]): T[] {
  const arr = [...cards];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Build main deck: 51 dragon + 15 action = 66 cards, shuffled
export function buildMainDeck(): (DragonCard | ActionCard)[] {
  return shuffleDeck([...dragonCards, ...actionCards]);
}

// Deal initial hands: 3 cards per player
export function dealInitialHands(
  deck: (DragonCard | ActionCard)[],
  playerCount: number
): { hands: (DragonCard | ActionCard)[][]; remainingDeck: (DragonCard | ActionCard)[] } {
  const hands: (DragonCard | ActionCard)[][] = Array.from({ length: playerCount }, () => []);
  const remaining = [...deck];
  for (let i = 0; i < playerCount; i++) {
    hands[i] = remaining.splice(0, 3);
  }
  return { hands, remainingDeck: remaining };
}
