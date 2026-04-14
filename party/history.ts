import type * as Party from 'partykit/server';

export type GameRecord = {
  id: string;
  roomId: string;
  players: {
    name: string;
    goalColor: string;
    isWinner: boolean;
  }[];
  winnerName: string | null;
  winReason: 'seven-connected' | 'closest-count' | 'last-standing';
  startedAt: number;
  endedAt: number;
  playerCount: number;
  isAI: boolean;
};

export default class HistoryRoom implements Party.Server {
  constructor(readonly room: Party.Room) {}

  async onRequest(req: Party.Request): Promise<Response> {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json',
    };

    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    if (req.method === 'GET') {
      const index = (await this.room.storage.get<string[]>('game-index')) ?? [];
      const records: GameRecord[] = [];
      for (const id of index) {
        const rec = await this.room.storage.get<GameRecord>(`game:${id}`);
        if (rec) records.push(rec);
      }
      return new Response(JSON.stringify(records), { headers });
    }

    if (req.method === 'POST') {
      const record = (await req.json()) as GameRecord;
      if (!record.id) {
        return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400, headers });
      }
      await this.room.storage.put(`game:${record.id}`, record);
      const index = (await this.room.storage.get<string[]>('game-index')) ?? [];
      index.unshift(record.id);
      await this.room.storage.put('game-index', index);
      return new Response(JSON.stringify({ ok: true }), { headers });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  }
}

HistoryRoom satisfies Party.Worker;
