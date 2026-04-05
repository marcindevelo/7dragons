import PartySocket from 'partysocket';

const PARTYKIT_HOST = import.meta.env.VITE_PARTYKIT_HOST ?? 'localhost:1999';

export type InviteMessage = {
  type: 'invite';
  fromName: string;
  roomCode: string;
};

type Listener = (msg: InviteMessage) => void;

class InviteClient {
  private socket: PartySocket | null = null;
  private listeners = new Set<Listener>();

  // Connect to own invite channel (call when user logs in)
  connect(username: string) {
    this.disconnect();
    this.socket = new PartySocket({
      host: PARTYKIT_HOST,
      room: `invite-${username.toLowerCase()}`,
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
    this.socket?.close();
    this.socket = null;
  }

  // Send invite to another user's channel
  sendInvite(toUsername: string, fromName: string, roomCode: string) {
    const sock = new PartySocket({
      host: PARTYKIT_HOST,
      room: `invite-${toUsername.toLowerCase()}`,
    });
    sock.addEventListener('open', () => {
      sock.send(JSON.stringify({ type: 'invite', fromName, roomCode } satisfies InviteMessage));
      // Close after sending
      setTimeout(() => sock.close(), 3000);
    });
  }

  onInvite(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export const inviteClient = new InviteClient();
