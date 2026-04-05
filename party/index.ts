import type * as Party from 'partykit/server';
import { createGame, drawCard, playDragonCard, playActionCard, resolvePendingAction, endTurn } from '../src/engine/game';
import type { GameState } from '../src/engine/types';
import {
  serializeState,
  deserializeState,
  type ClientMessage,
  type ServerMessage,
  type MaskedGameState,
  type MaskedPlayer,
  type LobbyPlayer,
  type SerializedGameState,
} from '../src/network/types';

type ConnectionMeta = {
  playerId: string;   // conn.id (changes on reconnect)
  clientId: string;   // persistent localStorage ID (stable across reconnects)
  name: string;
  playerIndex: number | null;
};

export default class GameRoom implements Party.Server {
  private gameState: GameState | null = null;
  private connections = new Map<string, ConnectionMeta>(); // conn.id → meta
  private hostClientId: string | null = null;

  // Tracks players who disconnected mid-game so they can rejoin with their slot
  private disconnected = new Map<string, { name: string; playerIndex: number }>();
  // clientId → slot

  constructor(readonly room: Party.Room) {}

  private isInviteRoom(): boolean {
    return this.room.id.startsWith('invite-');
  }

  onConnect(conn: Party.Connection) {
    if (this.isInviteRoom()) return; // invite channels need no greeting
    // At this point we don't know clientId yet — join message comes next.
    // Send lobby so the new connection isn't stuck on a blank screen.
    if (!this.gameState) {
      conn.send(JSON.stringify(this.buildLobbyMsg()));
    }
  }

  onMessage(raw: string, sender: Party.Connection) {
    // Invite channel: just relay to everyone else in the room
    if (this.isInviteRoom()) {
      this.room.broadcast(raw, [sender.id]);
      return;
    }
    let msg: ClientMessage;
    try {
      msg = JSON.parse(raw) as ClientMessage;
    } catch {
      return;
    }

    if (msg.type === 'join') {
      this.handleJoin(sender, msg.name, msg.clientId);
      return;
    }

    const meta = this.connections.get(sender.id);
    if (!meta) {
      sender.send(JSON.stringify({ type: 'error', message: 'Not joined' } satisfies ServerMessage));
      return;
    }

    if (msg.type === 'start-game') {
      this.handleStartGame(sender);
      return;
    }

    if (msg.type === 'restart-game') {
      this.gameState = null;
      this.disconnected.clear();
      // Reset all player indices so lobby is fresh
      for (const [id, m] of this.connections) {
        this.connections.set(id, { ...m, playerIndex: null });
      }
      this.room.broadcast(JSON.stringify(this.buildLobbyMsg()));
      return;
    }

    if (msg.type === 'quit') {
      this.handleQuit(sender, meta);
      return;
    }

    if (!this.gameState) {
      sender.send(JSON.stringify({ type: 'error', message: 'Game not started' } satisfies ServerMessage));
      return;
    }

    // Validate it's this player's turn
    const playerIndex = meta.playerIndex;
    if (playerIndex === null || playerIndex !== this.gameState.currentPlayerIndex) {
      sender.send(JSON.stringify({ type: 'error', message: 'Not your turn' } satisfies ServerMessage));
      return;
    }

    try {
      this.gameState = this.applyAction(this.gameState, msg);
      this.broadcastGameState();
    } catch (e) {
      sender.send(JSON.stringify({
        type: 'error',
        message: e instanceof Error ? e.message : 'Invalid action',
      } satisfies ServerMessage));
    }
  }

  onClose(conn: Party.Connection) {
    const meta = this.connections.get(conn.id);
    if (meta && this.gameState && meta.playerIndex !== null) {
      // Save slot for reconnection
      this.disconnected.set(meta.clientId, { name: meta.name, playerIndex: meta.playerIndex });
    }
    this.connections.delete(conn.id);

    // If the host disconnected, transfer host role to next connected player
    if (meta && meta.clientId === this.hostClientId) {
      const next = this.connections.values().next().value as ConnectionMeta | undefined;
      this.hostClientId = next ? next.clientId : null;
    }

    if (!this.gameState) {
      this.room.broadcast(JSON.stringify(this.buildLobbyMsg()));
    } else {
      // Broadcast updated game state so all clients know who the new host is
      // (relevant for "Play again" button visibility after game ends)
      this.broadcastGameState();
    }
  }

  // ── Handlers ───────────────────────────────────────────────────────────────

  private handleJoin(conn: Party.Connection, name: string, clientId: string) {
    // ── Reconnection: player returning mid-game ────────────────────────────
    const slot = this.disconnected.get(clientId);
    if (slot && this.gameState) {
      this.disconnected.delete(clientId);
      this.connections.set(conn.id, {
        playerId: conn.id,
        clientId,
        name: slot.name,
        playerIndex: slot.playerIndex,
      });
      if (this.hostClientId === null) this.hostClientId = clientId;

      conn.send(JSON.stringify({
        type: 'joined',
        playerId: conn.id,
        playerIndex: slot.playerIndex,
        roomId: this.room.id,
      } satisfies ServerMessage));
      conn.send(JSON.stringify(this.buildGameMsg(this.gameState, slot.playerIndex)));
      return;
    }

    // ── Normal join ────────────────────────────────────────────────────────
    const trimmedName = name.trim();
    if (!trimmedName) {
      conn.send(JSON.stringify({ type: 'error', message: 'Name cannot be empty' } satisfies ServerMessage));
      return;
    }

    // Reject duplicate name (case-insensitive), but allow same clientId rejoining lobby
    const existingByClientId = Array.from(this.connections.values()).find(c => c.clientId === clientId);
    if (existingByClientId) {
      // Same client reconnecting to lobby — remove old entry and let them in fresh
      const oldConnId = Array.from(this.connections.entries()).find(([, v]) => v.clientId === clientId)?.[0];
      if (oldConnId) this.connections.delete(oldConnId);
    } else {
      const nameTaken = Array.from(this.connections.values()).some(
        c => c.name.toLowerCase() === trimmedName.toLowerCase()
      );
      if (nameTaken) {
        conn.send(JSON.stringify({ type: 'error', message: `Name "${trimmedName}" is already taken` } satisfies ServerMessage));
        return;
      }
    }

    if (this.connections.size >= 5) {
      conn.send(JSON.stringify({ type: 'error', message: 'Room is full (max 5 players)' } satisfies ServerMessage));
      return;
    }

    if (this.hostClientId === null) this.hostClientId = clientId;

    this.connections.set(conn.id, { playerId: conn.id, clientId, name: trimmedName, playerIndex: null });

    conn.send(JSON.stringify({
      type: 'joined',
      playerId: conn.id,
      playerIndex: -1,
      roomId: this.room.id,
    } satisfies ServerMessage));

    this.room.broadcast(JSON.stringify(this.buildLobbyMsg()));
  }

  private handleQuit(conn: Party.Connection, meta: ConnectionMeta) {
    const playerName = meta.name;

    // Remove from reconnect pool — this player is gone for good
    this.disconnected.delete(meta.clientId);
    this.connections.delete(conn.id);
    conn.close();

    if (!this.gameState) {
      // Still in lobby — just update lobby
      this.room.broadcast(JSON.stringify(this.buildLobbyMsg()));
      return;
    }

    // Count remaining connected players
    const remaining = Array.from(this.connections.values()).filter(c => c.playerIndex !== null);

    if (remaining.length <= 1) {
      // Only 1 player left — end the game, they win
      const winner = remaining[0];
      if (winner) {
        const winnerId = this.gameState.players[winner.playerIndex!]?.id ?? null;
        this.gameState = { ...this.gameState, phase: 'ended', winner: winnerId };
      }
      this.room.broadcast(JSON.stringify({
        type: 'player-left',
        playerName,
        gameEnded: true,
      } satisfies ServerMessage));
      this.broadcastGameState();
    } else {
      // 2+ players remain — skip quitter's turns by advancing if it was their turn
      let state = this.gameState;
      if (meta.playerIndex !== null && state.currentPlayerIndex === meta.playerIndex) {
        state = endTurn(state);
        if (state.winner === null) state = drawCard(state);
      }
      this.gameState = state;
      this.room.broadcast(JSON.stringify({
        type: 'player-left',
        playerName,
        gameEnded: false,
      } satisfies ServerMessage));
      this.broadcastGameState();
    }
  }

  private handleStartGame(sender: Party.Connection) {
    const meta = this.connections.get(sender.id);
    if (!meta || meta.clientId !== this.hostClientId) {
      sender.send(JSON.stringify({ type: 'error', message: 'Only host can start' } satisfies ServerMessage));
      return;
    }

    const connList = Array.from(this.connections.values());
    if (connList.length < 2) {
      sender.send(JSON.stringify({ type: 'error', message: 'Need at least 2 players' } satisfies ServerMessage));
      return;
    }

    const playerNames = connList.map(c => c.name);
    let state = createGame(playerNames);
    state = drawCard(state);

    // Assign player indices in connection order
    connList.forEach((c, i) => {
      const connId = Array.from(this.connections.entries()).find(([, v]) => v === c)![0];
      this.connections.set(connId, { ...c, playerIndex: i });
    });

    this.gameState = state;
    this.broadcastGameState();
  }

  private applyAction(state: GameState, msg: ClientMessage): GameState {
    switch (msg.type) {
      case 'draw-card': {
        return drawCard(state);
      }
      case 'place-card': {
        let next = playDragonCard(state, msg.cardId, msg.pos, msg.rotation);
        if (next.winner === null) next = endTurn(next);
        if (next.winner === null) next = drawCard(next);
        return next;
      }
      case 'play-action': {
        const next = playActionCard(state, msg.cardId, msg.applyAction, msg.applySilver);
        if (!next.pendingAction) {
          let after = endTurn(next);
          after = drawCard(after);
          return after;
        }
        return next;
      }
      case 'resolve-action': {
        let next = resolvePendingAction(state, msg.payload);
        if (next.winner === null && !next.pendingAction) {
          next = endTurn(next);
          next = drawCard(next);
        }
        return next;
      }
      case 'draw-instead': {
        let next = endTurn(state);
        next = drawCard(next);
        return next;
      }
      default:
        throw new Error('Unknown action');
    }
  }

  // ── State broadcasting ─────────────────────────────────────────────────────

  private broadcastGameState() {
    if (!this.gameState) return;
    for (const [connId, meta] of this.connections) {
      if (meta.playerIndex === null) continue;
      const conn = this.room.getConnection(connId);
      if (conn) {
        conn.send(JSON.stringify(this.buildGameMsg(this.gameState, meta.playerIndex)));
      }
    }
  }

  private buildGameMsg(state: GameState, forPlayerIndex: number): ServerMessage {
    const serialized = serializeState(state);
    const masked = this.maskState(serialized, forPlayerIndex);
    return { type: 'game-state', state: masked, myPlayerIndex: forPlayerIndex };
  }

  private maskState(state: SerializedGameState, forPlayerIndex: number): MaskedGameState {
    const maskedPlayers: MaskedPlayer[] = state.players.map((p, i) => ({
      id: p.id,
      name: p.name,
      hand: i === forPlayerIndex ? p.hand : [],
      handCount: p.hand.length,
      goalId: i === forPlayerIndex || state.phase === 'ended' ? p.goalId : 'hidden',
    }));

    const { players: _players, deck, ...rest } = state;
    return {
      ...rest,
      deckCount: deck.length,
      players: maskedPlayers,
    };
  }

  private buildLobbyMsg(): ServerMessage {
    const players: LobbyPlayer[] = Array.from(this.connections.values()).map((c) => ({
      id: c.playerId,
      name: c.name,
      isHost: c.clientId === this.hostClientId,
    }));
    return { type: 'lobby', players };
  }
}

GameRoom satisfies Party.Worker;
