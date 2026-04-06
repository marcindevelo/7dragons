import { useState, useCallback, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useGameStore } from '../store/gameStore';
import { useMultiplayerStore } from '../store/multiplayerStore';
import { inviteClient } from '../network/inviteClient';

function OnlineBadge() {
  const [connected, setConnected] = useState(() => inviteClient.isConnected());
  useEffect(() => inviteClient.onStatus(setConnected), []);
  if (!connected) return null;
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/15 border border-green-500/30">
      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
      <span className="text-green-400 text-xs font-semibold">online</span>
    </div>
  );
}

type Mode = 'home' | 'local' | 'create' | 'join' | 'waiting';

export default function LobbyScreen() {
  const startGame = useGameStore(s => s.startGame);
  const [mode, setMode] = useState<Mode>('home');
  const [pendingMode, setPendingMode] = useState<'create' | 'join' | null>(null);
  const [playerCount, setPlayerCount] = useState(2);
  const [roomCodeInput, setRoomCodeInput] = useState('');

  const { isSignedIn, user } = useUser();
  const clerk = useClerk();
  const { signOut } = clerk;
  const onlineName = user?.username ?? '';

  const createRoom = useMultiplayerStore(s => s.createRoom);
  const joinRoom = useMultiplayerStore(s => s.joinRoom);
  const startOnlineGame = useMultiplayerStore(s => s.startGame);
  const disconnect = useMultiplayerStore(s => s.disconnect);
  const roomId = useMultiplayerStore(s => s.roomId);
  const lobbyPlayers = useMultiplayerStore(s => s.lobbyPlayers);
  const isConnecting = useMultiplayerStore(s => s.isConnecting);
  const error = useMultiplayerStore(s => s.error);
  const myPlayerId = useMultiplayerStore(s => s.myPlayerId);

  // isHost comes from the server (handles host transfer when original host disconnects)
  const isHost = lobbyPlayers.some(p => p.isHost && p.id === myPlayerId);

  function handleLocalStart() {
    const aiNames = Array.from({ length: playerCount - 1 }, (_, i) => `AI ${i + 1}`);
    startGame(['You', ...aiNames]);
  }

  function requireAuth(next: 'create' | 'join') {
    if (isSignedIn) {
      setMode(next);
    } else {
      setPendingMode(next);
      clerk.openSignIn();
    }
  }

  // After signing in, proceed to pending mode
  useEffect(() => {
    if (isSignedIn && pendingMode) {
      setMode(pendingMode);
      setPendingMode(null);
    }
  }, [isSignedIn, pendingMode]);

  function handleCreateRoom() {
    if (!onlineName.trim()) return;
    createRoom(onlineName.trim());
  }

  function handleJoinRoom() {
    if (!onlineName.trim() || !roomCodeInput.trim()) return;
    joinRoom(roomCodeInput.trim().toUpperCase(), onlineName.trim());
  }

  // Navigate to waiting room only when successfully joined (myPlayerId set by server)
  // OR when we're already in a room (e.g. after game restart)
  useEffect(() => {
    if (myPlayerId && roomId) setMode('waiting');
  }, [myPlayerId, roomId]);

  const [copied, setCopied] = useState(false);
  const [inviteNick, setInviteNick] = useState('');
  const [inviteSent, setInviteSent] = useState(false);
  const [pendingInvites, setPendingInvites] = useState<string[]>([]);
  const copyRoomCode = useCallback(() => {
    if (!roomId) return;
    navigator.clipboard.writeText(roomId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [roomId]);

  function handleDisconnect() {
    disconnect();
    setMode('home');
  }

  function handleInvite() {
    if (!inviteNick.trim() || !roomId || !onlineName) return;
    const nick = inviteNick.trim();
    inviteClient.sendInvite(nick, onlineName, roomId);
    setInviteSent(true);
    setPendingInvites(prev => prev.includes(nick) ? prev : [...prev, nick]);
    setTimeout(() => setInviteSent(false), 2500);
    setInviteNick('');
  }

  // ── Home ────────────────────────────────────────────────────────────────────
  if (mode === 'home') {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-8" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.58),rgba(0,0,0,0.58)),url(/bg.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <OnlineBadge />
        <img src="/logo.png" alt="Seven Dragons" className="w-64 h-auto drop-shadow-2xl" />
        {isSignedIn && (
          <div className="flex items-center gap-3">
            <span className="text-white/50 text-sm">Signed in as <span className="text-white font-semibold">{user.username}</span></span>
            <button onClick={() => clerk.openUserProfile()} className="text-white/30 hover:text-white/60 text-xs transition-colors">Edit profile</button>
            <button onClick={() => signOut()} className="text-white/30 hover:text-white/60 text-xs transition-colors">Sign out</button>
          </div>
        )}
        <div className="flex flex-col gap-3 w-64">
          <button
            onClick={() => setMode('local')}
            className="py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl text-lg tracking-wide transition-colors"
          >
            Start AI Game
          </button>
          <button
            onClick={() => requireAuth('create')}
            className="py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-lg tracking-wide transition-colors"
          >
            Create Online Room
          </button>
          <button
            onClick={() => requireAuth('join')}
            className="py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-lg tracking-wide transition-colors"
          >
            Join Room
          </button>
        </div>
      </div>
    );
  }

  // ── Local hot-seat ──────────────────────────────────────────────────────────
  if (mode === 'local') {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-8" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.58),rgba(0,0,0,0.58)),url(/bg.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <OnlineBadge />
        <img src="/logo.png" alt="Seven Dragons" className="w-64 h-auto drop-shadow-2xl" />
        <div className="flex flex-col gap-4 w-72">
          <label className="text-white/60 text-sm">AI opponents</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(n => (
              <button
                key={n}
                onClick={() => setPlayerCount(n + 1)}
                className={[
                  'flex-1 py-2 rounded-lg text-sm font-bold transition-colors',
                  playerCount === n + 1
                    ? 'bg-yellow-500 text-black'
                    : 'bg-white/10 text-white/60 hover:bg-white/20',
                ].join(' ')}
              >
                {n}
              </button>
            ))}
          </div>

          <button
            onClick={handleLocalStart}
            className="mt-2 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl text-lg tracking-wide transition-colors"
          >
            Start AI Game
          </button>
          <button
            onClick={() => setMode('home')}
            className="text-white/40 hover:text-white/70 text-sm transition-colors"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  // ── Create / Join ───────────────────────────────────────────────────────────
  if (mode === 'create' || mode === 'join') {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-8" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.58),rgba(0,0,0,0.58)),url(/bg.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <OnlineBadge />
        <img src="/logo.png" alt="Seven Dragons" className="w-64 h-auto drop-shadow-2xl" />
        <div className="flex flex-col gap-4 w-72">
          <div className="bg-white/5 rounded-lg px-3 py-2 flex items-center justify-between">
            <span className="text-white/40 text-xs">Playing as</span>
            <span className="text-white font-semibold text-sm">{onlineName}</span>
          </div>

          {mode === 'join' && (
            <>
              <label className="text-white/60 text-sm">Room code</label>
              <input
                value={roomCodeInput}
                onChange={e => setRoomCodeInput(e.target.value.toUpperCase())}
                className="bg-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:bg-white/20 transition-colors font-mono tracking-widest"
                placeholder="XXXXXX"
                maxLength={6}
              />
            </>
          )}

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            onClick={mode === 'create' ? handleCreateRoom : handleJoinRoom}
            disabled={isConnecting || !onlineName.trim() || (mode === 'join' && !roomCodeInput.trim())}
            className="mt-2 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl text-lg tracking-wide transition-colors"
          >
            {isConnecting ? 'Connecting…' : mode === 'create' ? 'Create Room' : 'Join Room'}
          </button>
          <button
            onClick={() => setMode('home')}
            className="text-white/40 hover:text-white/70 text-sm transition-colors"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  // ── Waiting room ────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-8" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.58),rgba(0,0,0,0.58)),url(/bg.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <OnlineBadge />
      <img src="/logo.png" alt="Seven Dragons" className="w-64 h-auto drop-shadow-2xl" />

      <div className="flex flex-col gap-4 w-80">
        <div className="bg-white/5 rounded-xl px-6 py-4 flex flex-col items-center gap-1">
          <span className="text-white/40 text-xs uppercase tracking-widest">Room code</span>
          <div className="flex items-center gap-3">
            <span className="text-white font-mono text-3xl tracking-widest font-bold">{roomId ?? '…'}</span>
            <button
              onClick={copyRoomCode}
              className="px-3 h-9 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-bold transition-colors flex items-center justify-center text-xs leading-none whitespace-nowrap"
            >
              {copied ? '✓ Copied' : 'Copy code'}
            </button>
          </div>
          <span className="text-white/30 text-xs">Share this code with other players</span>
        </div>

        <div className="bg-white/5 rounded-xl px-6 py-4 flex flex-col gap-2">
          <span className="text-white/40 text-xs uppercase tracking-widest mb-1">Players in room</span>
          {lobbyPlayers.map(p => (
            <div key={p.id} className="flex items-center gap-2">
              {p.isHost && <span className="text-yellow-400 text-xs">★</span>}
              <span className="text-white text-sm">{p.name}</span>
              {p.id === myPlayerId && <span className="text-white/30 text-xs">(you)</span>}
            </div>
          ))}
          {pendingInvites
            .filter(nick => !lobbyPlayers.some(p => p.name.toLowerCase() === nick.toLowerCase()))
            .map(nick => (
              <div key={nick} className="flex items-center gap-2">
                <span className="text-white/30 text-xs">⏳</span>
                <span className="text-white/50 text-sm">{nick}</span>
                <span className="text-white/30 text-xs">invite sent</span>
              </div>
            ))
          }
          {lobbyPlayers.length === 0 && pendingInvites.length === 0 && (
            <span className="text-white/30 text-sm">Waiting for players…</span>
          )}
        </div>

        {/* Invite by username */}
        <div className="bg-white/5 rounded-xl px-6 py-4 flex flex-col gap-2">
          <span className="text-white/40 text-xs uppercase tracking-widest mb-1">Invite player</span>
          <div className="flex gap-2">
            <input
              value={inviteNick}
              onChange={e => setInviteNick(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleInvite()}
              className="flex-1 bg-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:bg-white/20 transition-colors"
              placeholder="Username…"
            />
            <button
              onClick={handleInvite}
              disabled={!inviteNick.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors whitespace-nowrap"
            >
              {inviteSent ? '✓ Sent' : 'Invite'}
            </button>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        {isHost && (
          <button
            onClick={startOnlineGame}
            disabled={lobbyPlayers.length < 2}
            className="py-3 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold rounded-xl text-lg tracking-wide transition-colors"
          >
            Start Game ({lobbyPlayers.length} players)
          </button>
        )}
        {!isHost && (
          <p className="text-white/30 text-sm text-center">Waiting for host to start…</p>
        )}

        <button
          onClick={handleDisconnect}
          className="text-white/40 hover:text-white/70 text-sm transition-colors"
        >
          ← Leave room
        </button>
      </div>
    </div>
  );
}
