import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import GamePage from './pages/GamePage';
import { useMultiplayerStore } from './store/multiplayerStore';
import { inviteClient, type InviteMessage } from './network/inviteClient';
import InviteBanner from './components/InviteBanner';

export default function App() {
  const rejoin = useMultiplayerStore(s => s.rejoin);
  const joinRoom = useMultiplayerStore(s => s.joinRoom);
  const { isSignedIn, user } = useUser();
  const [pendingInvite, setPendingInvite] = useState<InviteMessage | null>(null);

  // Reconnect to in-progress game on page reload
  useEffect(() => {
    const roomId = sessionStorage.getItem('7dragons_room');
    const name = sessionStorage.getItem('7dragons_name');
    if (roomId && name) {
      rejoin(roomId, name);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Connect to personal invite channel when signed in
  useEffect(() => {
    if (isSignedIn && user?.username) {
      inviteClient.connect(user.username);
      const unsub = inviteClient.onInvite(msg => setPendingInvite(msg));
      return () => {
        unsub();
        inviteClient.disconnect();
      };
    }
  }, [isSignedIn, user?.username]);

  function handleJoinInvite(roomCode: string) {
    setPendingInvite(null);
    if (user?.username) {
      joinRoom(roomCode, user.username);
    }
  }

  return (
    <>
      <InviteBanner
        invite={pendingInvite}
        onJoin={handleJoinInvite}
        onDismiss={() => setPendingInvite(null)}
      />
      <GamePage />
    </>
  );
}
