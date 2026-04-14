const PARTYKIT_HOST = import.meta.env.VITE_PARTYKIT_HOST ?? 'localhost:1999';

export type GameRecord = {
  id: string;
  roomId: string;
  players: { name: string; goalColor: string; isWinner: boolean }[];
  winnerName: string | null;
  winReason: 'seven-connected' | 'closest-count' | 'last-standing';
  startedAt: number;
  endedAt: number;
  playerCount: number;
  isAI: boolean;
};

export async function fetchGameHistory(): Promise<GameRecord[]> {
  const protocol = PARTYKIT_HOST.startsWith('localhost') ? 'http' : 'https';
  const res = await fetch(`${protocol}://${PARTYKIT_HOST}/parties/history/global`);
  if (!res.ok) throw new Error(`History fetch failed: ${res.status}`);
  return res.json();
}

export async function saveGameRecord(record: GameRecord): Promise<void> {
  const protocol = PARTYKIT_HOST.startsWith('localhost') ? 'http' : 'https';
  await fetch(`${protocol}://${PARTYKIT_HOST}/parties/history/global`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  });
}
