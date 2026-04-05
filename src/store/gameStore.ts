import { create } from 'zustand';
import type { GameState, BoardPosition } from '../engine/types';
import {
  createGame,
  drawCard,
  playDragonCard,
  playActionCard,
  resolvePendingAction,
  endTurn,
} from '../engine/game';
import { countNewColorConnections, bonusDrawCount } from '../engine/connections';
import type { DragonColor } from '../engine/types';
import { setMultiplayerCallbacks, useMultiplayerStore } from './multiplayerStore';
import { aiChooseMove, aiResolveAction } from '../engine/ai';

type BonusNotification = { count: number; colors: DragonColor[] };

type GameStore = {
  state: GameState | null;
  selectedCardId: string | null;
  selectedRotation: 0 | 180;
  playerNames: string[];
  pendingActionCardId: string | null;
  bonusNotification: BonusNotification | null;
  isMultiplayer: boolean;

  startGame: (names: string[]) => void;
  startMultiplayer: () => void;        // called when server sends first game-state
  setServerState: (s: GameState) => void; // called on every server state update
  resetGame: () => void;
  goToLobby: () => void;
  selectCard: (id: string | null) => void;
  rotateSelected: () => void;
  placeCard: (pos: BoardPosition) => void;
  stagingAction: (cardId: string) => void;
  cancelActionStaging: () => void;
  playAction: (cardId: string, applyAction?: boolean, applySilver?: boolean) => void;
  resolveAction: (payload: Parameters<typeof resolvePendingAction>[1]) => void;
  passTurn: () => void;
  drawInsteadOfPlay: () => void;
};

const AI_DELAY = 700; // ms between AI actions

function scheduleAI(getState: () => GameStore, setState: (s: Partial<GameStore>) => void) {
  const { state, isMultiplayer } = getState();
  if (!state || isMultiplayer || state.phase === 'ended') return;

  const currentPlayer = state.players[state.currentPlayerIndex];
  if (!currentPlayer.isAI) return;

  if (state.phase === 'draw') {
    setTimeout(() => {
      const { state: s } = getState();
      if (!s || !s.players[s.currentPlayerIndex].isAI || s.phase !== 'draw') return;
      const next = drawCard(s);
      setState({ state: next });
      scheduleAI(getState, setState);
    }, AI_DELAY);
    return;
  }

  if (state.phase === 'play') {
    setTimeout(() => {
      const { state: s } = getState();
      if (!s || !s.players[s.currentPlayerIndex].isAI || s.phase !== 'play') return;

      const move = aiChooseMove(s);
      if (move.type === 'dragon') {
        try {
          let next = playDragonCard(s, move.cardId, move.pos, move.rotation);
          if (next.winner === null) next = endTurn(next);
          if (next.winner === null) next = drawCard(next);
          setState({ state: next, selectedCardId: null });
          scheduleAI(getState, setState);
        } catch { /* ignore */ }
      } else if (move.type === 'action') {
        try {
          const next = playActionCard(s, move.cardId, true, true);
          setState({ state: next });
          scheduleAI(getState, setState);
        } catch { /* ignore */ }
      } else {
        // pass — no valid moves
        let next = endTurn(s);
        next = drawCard(next);
        setState({ state: next });
        scheduleAI(getState, setState);
      }
    }, AI_DELAY);
    return;
  }

  if (state.phase === 'action-targeting') {
    setTimeout(() => {
      const { state: s } = getState();
      if (!s || !s.players[s.currentPlayerIndex].isAI || s.phase !== 'action-targeting') return;
      try {
        const payload = aiResolveAction(s);
        let next = resolvePendingAction(s, payload);
        if (next.winner === null && !next.pendingAction) {
          next = endTurn(next);
          next = drawCard(next);
        }
        setState({ state: next });
        scheduleAI(getState, setState);
      } catch { /* ignore */ }
    }, AI_DELAY);
  }
}

export const useGameStore = create<GameStore>((set, get) => {
  // Register multiplayer callbacks so multiplayerStore can push state here
  setMultiplayerCallbacks(
    (state) => {
      set({ state, isMultiplayer: true });
    },
    () => {
      set({ state: null, isMultiplayer: false, playerNames: [] });
    },
    () => {
      // Server reset the game (e.g. Play again) — clear state but stay in multiplayer
      set({ state: null, selectedCardId: null, pendingActionCardId: null });
    }
  );

  return {
    state: null,
    selectedCardId: null,
    selectedRotation: 0,
    playerNames: [],
    pendingActionCardId: null,
    bonusNotification: null,
    isMultiplayer: false,

    startGame(names) {
      let s = createGame(names);
      s = drawCard(s);
      set({ state: s, selectedCardId: null, playerNames: names, isMultiplayer: false });
      scheduleAI(get, p => set(p as Partial<GameStore>));
    },

    startMultiplayer() {
      set({ isMultiplayer: true });
    },

    setServerState(state) {
      set({ state });
    },

    resetGame() {
      const { playerNames, isMultiplayer } = get();
      if (isMultiplayer) {
        useMultiplayerStore.getState().sendRestartGame();
        return;
      }
      if (playerNames.length === 0) return;
      let s = createGame(playerNames);
      s = drawCard(s);
      set({ state: s, selectedCardId: null });
    },

    goToLobby() {
      set({ state: null, selectedCardId: null, playerNames: [], isMultiplayer: false, pendingActionCardId: null });
    },

    selectCard(id) {
      set({ selectedCardId: id, selectedRotation: 0, pendingActionCardId: null });
    },

    stagingAction(cardId) {
      set({ pendingActionCardId: cardId, selectedCardId: null });
    },

    cancelActionStaging() {
      set({ pendingActionCardId: null });
    },

    rotateSelected() {
      const { selectedRotation } = get();
      set({ selectedRotation: selectedRotation === 0 ? 180 : 0 });
    },

    placeCard(pos) {
      const { state, selectedCardId, selectedRotation, isMultiplayer } = get();
      if (!state || !selectedCardId) return;
      if (state.phase !== 'play') return;

      const currentPlayer = state.players[state.currentPlayerIndex];
      const card = currentPlayer.hand.find(c => c.id === selectedCardId);
      if (!card || card.type !== 'dragon') return;

      if (isMultiplayer) {
        // In multiplayer, just send to server — state comes back via setServerState
        useMultiplayerStore.getState().sendPlaceCard(selectedCardId, pos, selectedRotation);
        set({ selectedCardId: null, selectedRotation: 0 });
        return;
      }

      try {
        const connectedColors = countNewColorConnections(
          state.board, card, pos, state.silverDragonColor, selectedRotation
        );
        const bonusCount = bonusDrawCount(connectedColors.size);
        const bonusNotification: BonusNotification | null =
          bonusCount > 0 ? { count: bonusCount, colors: Array.from(connectedColors) } : null;

        let next = playDragonCard(state, selectedCardId, pos, selectedRotation);
        if (next.winner === null) next = endTurn(next);
        if (next.winner === null) next = drawCard(next);
        set({ state: next, selectedCardId: null, selectedRotation: 0, bonusNotification });
        scheduleAI(get, p => set(p as Partial<GameStore>));

        if (bonusNotification) {
          setTimeout(() => set({ bonusNotification: null }), 3000);
        }
      } catch {
        // Invalid placement — ignore
      }
    },

    playAction(cardId, applyAction = true, applySilver = true) {
      const { state, isMultiplayer } = get();
      if (!state) return;

      if (isMultiplayer) {
        useMultiplayerStore.getState().sendPlayAction(cardId, applyAction, applySilver);
        set({ pendingActionCardId: null });
        return;
      }

      try {
        const next = playActionCard(state, cardId, applyAction, applySilver);
        if (!next.pendingAction) {
          let after = endTurn(next);
          after = drawCard(after);
          set({ state: after, selectedCardId: null, pendingActionCardId: null });
          scheduleAI(get, p => set(p as Partial<GameStore>));
        } else {
          set({ state: next, selectedCardId: null, pendingActionCardId: null });
          scheduleAI(get, p => set(p as Partial<GameStore>));
        }
      } catch {
        // ignore
      }
    },

    resolveAction(payload) {
      const { state, isMultiplayer } = get();
      if (!state) return;

      if (isMultiplayer) {
        useMultiplayerStore.getState().sendResolveAction(payload);
        return;
      }

      try {
        let next = resolvePendingAction(state, payload);
        if (next.winner === null && !next.pendingAction) {
          next = endTurn(next);
          next = drawCard(next);
        }
        set({ state: next, selectedCardId: null });
        scheduleAI(get, p => set(p as Partial<GameStore>));
      } catch {
        // ignore
      }
    },

    passTurn() {
      const { state } = get();
      if (!state) return;
      let next = endTurn(state);
      next = drawCard(next);
      set({ state: next, selectedCardId: null });
    },

    drawInsteadOfPlay() {
      const { state, isMultiplayer } = get();
      if (!state || state.phase !== 'play') return;

      if (isMultiplayer) {
        useMultiplayerStore.getState().sendDrawInstead();
        return;
      }

      try {
        let next = endTurn(state);
        next = drawCard(next);
        set({ state: next, selectedCardId: null, selectedRotation: 0 });
      } catch {
        // ignore
      }
    },
  };
});
