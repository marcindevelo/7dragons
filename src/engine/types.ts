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
  rotation: 0 | 90 | 180 | 270; // for future UI use, always 0 in logic
};

export type Player = {
  id: string;
  name: string;
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

export type GameState = {
  board: Map<string, PlacedCard>;    // key: posKey(x,y)
  deck: (DragonCard | ActionCard)[];
  discardPile: ActionCard[];
  silverDragonColor: DragonColor | 'all';
  players: Player[];
  goals: GoalCard[];                 // all 5 goal cards (including unused ones)
  unusedGoalOrder: string[];         // ordered goalIds for unused "imaginary player" seats
  currentPlayerIndex: number;
  phase: GamePhase;
  pendingAction: PendingAction | null;
  winner: string | null;             // player id
  applyActionEffect: boolean;        // two-step Silver + action choice
  applySilverChange: boolean;
};
