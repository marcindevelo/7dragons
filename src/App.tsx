import { useEffect } from 'react';
import GamePage from './pages/GamePage';
import { useMultiplayerStore } from './store/multiplayerStore';

export default function App() {
  const rejoin = useMultiplayerStore(s => s.rejoin);

  useEffect(() => {
    const roomId = sessionStorage.getItem('7dragons_room');
    const name = sessionStorage.getItem('7dragons_name');
    if (roomId && name) {
      rejoin(roomId, name);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <GamePage />;
}
