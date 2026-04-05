import type * as Party from 'partykit/server';

// Simple notification relay — room ID = username of the recipient.
// Anyone can send a message; it gets broadcast to all connections in the room.
export default class NotifRoom implements Party.Server {
  constructor(readonly room: Party.Room) {}

  onMessage(raw: string, _sender: Party.Connection) {
    this.room.broadcast(raw);
  }
}

NotifRoom satisfies Party.Worker;
