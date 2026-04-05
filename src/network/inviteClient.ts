import PartySocket from 'partysocket';

const PARTYKIT_HOST = import.meta.env.VITE_PARTYKIT_HOST ?? 'localhost:1999';

export type InviteMessage = {
  type: 'invite';
  fromName: string;
  roomCode: string;
};

type InviteListener = (msg: InviteMessage) => void;
type StatusListener = (connected: boolean) => void;
type RawListener = (entry: RawEntry) => void;

export type RawEntry = {
  ts: string;     // HH:MM:SS
  dir: 'in' | 'out';
  raw: string;
};

const MAX_LOG = 20;

class InviteClient {
  private socket: PartySocket | null = null;
  private listeners = new Set<InviteListener>();
  private statusListeners = new Set<StatusListener>();
  private rawListeners = new Set<RawListener>();
  private pingInterval: ReturnType<typeof setInterval> | null = null;
  private _log: RawEntry[] = [];

  private _pushLog(entry: RawEntry) {
    this._log = [...this._log.slice(-(MAX_LOG - 1)), entry];
    for (const l of this.rawListeners) l(entry);
  }

  getLog(): RawEntry[] { return this._log; }

  // Connect to own invite channel (call when user logs in)
  connect(username: string) {
    this.disconnect();
    this._open(username);

    // Every 5 seconds: reconnect if socket is not open
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
      this._pushLog({ ts: _ts(), dir: 'in', raw: '[connected]' });
      for (const l of this.statusListeners) l(true);
    });
    this.socket.addEventListener('close', () => {
      this._pushLog({ ts: _ts(), dir: 'in', raw: '[disconnected]' });
      for (const l of this.statusListeners) l(false);
    });
    this.socket.addEventListener('message', (e: MessageEvent) => {
      this._pushLog({ ts: _ts(), dir: 'in', raw: e.data as string });
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

  // Send invite to another user's channel
  sendInvite(toUsername: string, fromName: string, roomCode: string) {
    const sock = new PartySocket({
      host: PARTYKIT_HOST,
      room: `invite-${toUsername.toLowerCase()}`,
    });
    sock.addEventListener('open', () => {
      const payload = JSON.stringify({ type: 'invite', fromName, roomCode } satisfies InviteMessage);
      this._pushLog({ ts: _ts(), dir: 'out', raw: `→ invite-${toUsername.toLowerCase()}: ${payload}` });
      sock.send(payload);
      setTimeout(() => sock.close(), 3000);
    });
  }

  onInvite(listener: InviteListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  onStatus(listener: StatusListener): () => void {
    this.statusListeners.add(listener);
    return () => this.statusListeners.delete(listener);
  }

  onRaw(listener: RawListener): () => void {
    this.rawListeners.add(listener);
    return () => this.rawListeners.delete(listener);
  }
}

function _ts(): string {
  return new Date().toTimeString().slice(0, 8);
}

export const inviteClient = new InviteClient();
