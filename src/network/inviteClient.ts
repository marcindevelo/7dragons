import PartySocket from 'partysocket';

const PARTYKIT_HOST = import.meta.env.VITE_PARTYKIT_HOST ?? 'localhost:1999';

export type InviteMessage = {
  type: 'invite';
  fromName: string;
  roomCode: string;
};

type InviteListener = (msg: InviteMessage) => void;
type StatusListener = (connected: boolean) => void;

class InviteClient {
  private socket: PartySocket | null = null;
  private listeners = new Set<InviteListener>();
  private statusListeners = new Set<StatusListener>();
  private pingInterval: ReturnType<typeof setInterval> | null = null;

  connect(username: string) {
    this.disconnect();
    this._open(username);

    this.pingInterval = setInterval(() => {
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        this._open(username);
      }
    }, 5000);
  }

  private _open(username: string) {
    this.socket?.close();
    this.socket = new PartySocket({
      host: PARTYKIT_HOST,
      room: `invite-${username.toLowerCase()}`,
    });
    this.socket.addEventListener('open', () => {
      for (const l of this.statusListeners) l(true);
    });
    this.socket.addEventListener('close', () => {
      for (const l of this.statusListeners) l(false);
    });
    this.socket.addEventListener('message', (e: MessageEvent) => {
      try {
        const msg = JSON.parse(e.data as string) as InviteMessage;
        if (msg.type === 'invite') {
          for (const l of this.listeners) l(msg);
        }
      } catch { /* ignore */ }
    });
  }

  disconnect() {
    if (this.pingInterval !== null) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    this.socket?.close();
    this.socket = null;
    for (const l of this.statusListeners) l(false);
  }

  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  sendInvite(toUsername: string, fromName: string, roomCode: string) {
    const sock = new PartySocket({
      host: PARTYKIT_HOST,
      room: `invite-${toUsername.toLowerCase()}`,
    });
    sock.addEventListener('open', () => {
      sock.send(JSON.stringify({ type: 'invite', fromName, roomCode } satisfies InviteMessage));
      setTimeout(() => sock.close(), 3000);
    });
  }

  clearPendingInvite() {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: 'clear-invite' }));
    }
  }

  onInvite(listener: InviteListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  onStatus(listener: StatusListener): () => void {
    this.statusListeners.add(listener);
    return () => this.statusListeners.delete(listener);
  }
}

export const inviteClient = new InviteClient();
