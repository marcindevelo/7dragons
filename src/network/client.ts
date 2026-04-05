import PartySocket from 'partysocket';
import type { ClientMessage, ServerMessage, ResolvePayload } from './types';
import type { BoardPosition } from '../engine/types';

const PARTYKIT_HOST = import.meta.env.VITE_PARTYKIT_HOST ?? 'localhost:1999';

function getOrCreateClientId(): string {
  // sessionStorage: unique per tab, survives page reload, cleared when tab is closed.
  // This ensures different browser tabs are different players (no shared clientId).
  const KEY = '7dragons_client_id';
  let id = sessionStorage.getItem(KEY);
  if (!id) {
    id = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
    sessionStorage.setItem(KEY, id);
  }
  return id;
}

type Listener = (msg: ServerMessage) => void;

class GameClient {
  private socket: PartySocket | null = null;
  private listeners = new Set<Listener>();

  connect(roomId: string) {
    this.disconnect();
    this.socket = new PartySocket({
      host: PARTYKIT_HOST,
      room: roomId,
    });
    this.socket.addEventListener('message', (e: MessageEvent) => {
      try {
        const msg = JSON.parse(e.data as string) as ServerMessage;
        for (const l of this.listeners) l(msg);
      } catch { /* ignore */ }
    });
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
  }

  send(msg: ClientMessage) {
    this.socket?.send(JSON.stringify(msg));
  }

  onMessage(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // ── Convenience methods ─────────────────────────────────────────────────

  join(name: string) { this.send({ type: 'join', name, clientId: getOrCreateClientId() }); }
  startGame() { this.send({ type: 'start-game' }); }
  drawCard() { this.send({ type: 'draw-card' }); }
  drawInstead() { this.send({ type: 'draw-instead' }); }

  placeCard(cardId: string, pos: BoardPosition, rotation: 0 | 180) {
    this.send({ type: 'place-card', cardId, pos, rotation });
  }

  playAction(cardId: string, applyAction: boolean, applySilver: boolean) {
    this.send({ type: 'play-action', cardId, applyAction, applySilver });
  }

  resolveAction(payload: ResolvePayload) {
    this.send({ type: 'resolve-action', payload });
  }
}

export const gameClient = new GameClient();
