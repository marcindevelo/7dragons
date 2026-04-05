import { create } from 'zustand';
import { gameClient } from '../network/client';
import { deserializeState } from '../network/types';
import type { MaskedGameState, LobbyPlayer } from '../network/types';
import type { GameState } from '../engine/types';
import type { BoardPosition } from '../engine/types';

// Reconstruct a GameState from masked server data so the existing store/UI works
function hydrateMaskedState(masked: MaskedGameState): GameState {
  const { deckCount, players, ...rest } = masked;

  // Rebuild deck as an array of the right length (UI only needs .length)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deck = new Array(deckCount).fill(null) as any[];

  // Players come with handCount and masked goalId — cast to satisfy GameState type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hydratedPlayers = players as any[];

  return deserializeState({ ...rest, deck, players: hydratedPlayers });
}

type MultiplayerStore = {
  // Connection / room state
  roomId: string | null;
  myPlayerId: string | null;
  myPlayerIndex: number | null;
  lobbyPlayers: LobbyPlayer[];
  isConnecting: boolean;
  error: string | null;

  // Actions
  createRoom: (name: string) => void;
  joinRoom: (roomId: string, name: string) => void;
  rejoin: (roomId: string, name: string) => void; // reconnect after page reload
  startGame: () => void;
  disconnect: () => void;

  // Game actions (forwarded to server)
  sendDrawCard: () => void;
  sendPlaceCard: (cardId: string, pos: BoardPosition, rotation: 0 | 180) => void;
  sendPlayAction: (cardId: string, applyAction: boolean, applySilver: boolean) => void;
  sendResolveAction: (payload: Parameters<typeof gameClient.resolveAction>[0]) => void;
  sendDrawInstead: () => void;
  sendRestartGame: () => void;
  sendQuit: () => void;
};

// Callback set by gameStore to receive server state updates
let onServerState: ((state: GameState) => void) | null = null;
let onDisconnect: (() => void) | null = null;
let onGameReset: (() => void) | null = null;
let onPlayerLeft: ((name: string, gameEnded: boolean) => void) | null = null;

export function setMultiplayerCallbacks(
  onState: (state: GameState) => void,
  onDisc: () => void,
  onReset: () => void,
  onLeft?: (name: string, gameEnded: boolean) => void
) {
  onServerState = onState;
  onDisconnect = onDisc;
  onGameReset = onReset;
  onPlayerLeft = onLeft ?? null;
}

let gameWasActive = false;

function generateRoomCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export const useMultiplayerStore = create<MultiplayerStore>((set, _get) => ({
  roomId: null,
  myPlayerId: null,
  myPlayerIndex: null,
  lobbyPlayers: [],
  isConnecting: false,
  error: null,

  createRoom(name) {
    const roomId = generateRoomCode();
    sessionStorage.setItem('7dragons_room', roomId);
    sessionStorage.setItem('7dragons_name', name);
    set({ isConnecting: true, error: null, roomId });

    const unsub = gameClient.onMessage(msg => {
      if (msg.type === 'joined') {
        set({
          myPlayerId: msg.playerId,
          myPlayerIndex: msg.playerIndex,
          isConnecting: false,
        });
      } else if (msg.type === 'lobby') {
        // If server sent lobby while we had a game running → game was reset
        if (onServerState && gameWasActive) {
          gameWasActive = false;
          onGameReset?.();
        }
        set({ lobbyPlayers: msg.players });
      } else if (msg.type === 'game-state') {
        gameWasActive = true;
        set({ myPlayerIndex: msg.myPlayerIndex });
        onServerState?.(hydrateMaskedState(msg.state));
      } else if (msg.type === 'player-left') {
        onPlayerLeft?.(msg.playerName, msg.gameEnded);
      } else if (msg.type === 'error') {
        set({ error: msg.message, isConnecting: false });
      }
    });

    gameClient.connect(roomId);
    gameClient.join(name);
    void unsub;
  },

  joinRoom(roomId, name) {
    sessionStorage.setItem('7dragons_room', roomId);
    sessionStorage.setItem('7dragons_name', name);
    set({ isConnecting: true, error: null, roomId });

    gameClient.onMessage(msg => {
      if (msg.type === 'joined') {
        set({
          myPlayerId: msg.playerId,
          myPlayerIndex: msg.playerIndex,
          isConnecting: false,
        });
      } else if (msg.type === 'lobby') {
        if (onServerState && gameWasActive) {
          gameWasActive = false;
          onGameReset?.();
        }
        set({ lobbyPlayers: msg.players });
      } else if (msg.type === 'game-state') {
        gameWasActive = true;
        set({ myPlayerIndex: msg.myPlayerIndex });
        onServerState?.(hydrateMaskedState(msg.state));
      } else if (msg.type === 'error') {
        set({ error: msg.message, isConnecting: false });
      }
    });

    gameClient.connect(roomId);
    gameClient.join(name);
  },

  rejoin(roomId, name) {
    // Called on page reload when we have a saved roomId+name in sessionStorage
    set({ isConnecting: true, error: null, roomId });

    gameClient.onMessage(msg => {
      if (msg.type === 'joined') {
        set({ myPlayerId: msg.playerId, myPlayerIndex: msg.playerIndex, isConnecting: false });
      } else if (msg.type === 'lobby') {
        if (onServerState && gameWasActive) { gameWasActive = false; onGameReset?.(); }
        set({ lobbyPlayers: msg.players });
      } else if (msg.type === 'game-state') {
        gameWasActive = true;
        set({ myPlayerIndex: msg.myPlayerIndex });
        onServerState?.(hydrateMaskedState(msg.state));
      } else if (msg.type === 'error') {
        set({ error: msg.message, isConnecting: false });
      }
    });

    gameClient.connect(roomId);
    gameClient.join(name); // clientId from localStorage is sent automatically
  },

  startGame() {
    gameClient.startGame();
  },

  disconnect() {
    sessionStorage.removeItem('7dragons_room');
    sessionStorage.removeItem('7dragons_name');
    gameWasActive = false;
    gameClient.disconnect();
    onDisconnect?.();
    set({
      roomId: null,
      myPlayerId: null,
      myPlayerIndex: null,
      lobbyPlayers: [],
      isConnecting: false,
      error: null,
    });
  },

  sendDrawCard() { gameClient.drawCard(); },
  sendPlaceCard(cardId, pos, rotation) { gameClient.placeCard(cardId, pos, rotation); },
  sendPlayAction(cardId, applyAction, applySilver) { gameClient.playAction(cardId, applyAction, applySilver); },
  sendResolveAction(payload) { gameClient.resolveAction(payload); },
  sendDrawInstead() { gameClient.drawInstead(); },
  sendRestartGame() { gameClient.send({ type: 'restart-game' }); },
  sendQuit() {
    gameClient.quit();
    sessionStorage.removeItem('7dragons_room');
    sessionStorage.removeItem('7dragons_name');
    gameWasActive = false;
    gameClient.disconnect();
    onDisconnect?.();
    set({ roomId: null, myPlayerId: null, myPlayerIndex: null, lobbyPlayers: [], isConnecting: false, error: null });
  },
}));
