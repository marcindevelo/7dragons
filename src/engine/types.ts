export type DragonColor = 'red' | 'gold' | 'blue' | 'green' | 'black';
export type PanelColor = DragonColor | 'rainbow' | null;

// 2x2 grid: panels[row][col], row 0 = top, col 0 = left
export type DragonCard = {
  id: string;
  type: 'dragon';
  panels: [[PanelColor, PanelColor], [PanelColor, PanelColor]];
};

export type ActionType = 'trade-hands' | 'trade-goals' | 'rotate-goals' | 'move-card' | 'zap-card';

export type ActionCard = {
  id: string;
  type: 'action';
  action: ActionType;
  silverColor: DragonColor; // color shown on this action card — sets Silver Dragon color
};

export type GoalCard = {
  id: string;
  type: 'goal';
  color: DragonColor;
};

export type Card = DragonCard | ActionCard | GoalCard;

export type BoardPosition = { x: number; y: number };

export type PlacedCard = {
  card: DragonCard;
  pos: BoardPosition;
  rotation: 0 | 180;
};

export type Player = {
  id: string;
  name: string;
  isAI: boolean;
  hand: (DragonCard | ActionCard)[];
  goalId: string; // ID of their GoalCard
};

export type GamePhase = 'draw' | 'play' | 'action-targeting' | 'ended';

export type PendingAction =
  | { type: 'move-card'; cardPosKey: string | null }
  | { type: 'zap-card'; cardPosKey: string | null }
  | { type: 'trade-hands'; targetPlayerId: string | null }
  | { type: 'trade-goals'; targetPlayerId: string | null } // null = unused goal pile
  | { type: 'rotate-goals'; direction: 'left' | 'right' | null };

export type ActionEvent = {
  seq: number;          // monotonically increasing — detects new events even for same action
  playerId: string;
  playerName: string;
  action: ActionType;
  description: string;  // full human-readable sentence shown in the alert
  targetPlayerId?: string; // set when action directly affects a specific player
  targetName?: string;     // display name of that player (for 'you' substitution)
};

export type GameState = {
  board: Map<string, PlacedCard>;    // key: posKey(x,y)
  deck: (DragonCard | ActionCard)[];
  discardPile: ActionCard[];
  silverDragonColor: DragonColor | 'all';
  players: Player[];
  goals: GoalCard[];                 // all 5 goal cards (including unused ones)
  unusedGoalOrder: string[];         // ordered goalIds for unused "imaginary player" seats
  seatOrder: Array<number | null>;   // seat 0..4: player index or null (unused seat)
  currentPlayerIndex: number;
  phase: GamePhase;
  pendingAction: PendingAction | null;
  winner: string | null;             // player id
  applyActionEffect: boolean;        // two-step Silver + action choice
  applySilverChange: boolean;
  lastActionEvent: ActionEvent | null;
  lastPlacedPosKey: string | null;   // posKey of most recently placed dragon card
  lastZappedPosKey: string | null;   // posKey of most recently zapped card (now empty)
  lastMovedFromPosKey: string | null; // posKey where move-card picked up the card from
  startedAt: number | null;          // unix ms timestamp when game started
};
