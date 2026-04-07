import { useMemo, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { useMultiplayerStore } from '../store/multiplayerStore';
import BoardArea from '../components/Board/BoardArea';
import HandBar from '../components/Hand/HandBar';
import ActionConfirm from '../components/ActionConfirm';
import BonusToast from '../components/BonusToast';
import TurnToast from '../components/TurnToast';
import PlayerLeftToast from '../components/PlayerLeftToast';
import Sidebar, { SidebarToggle } from '../components/Sidebar/Sidebar';
import RightSidebar, { RightSidebarToggle } from '../components/RightSidebar/RightSidebar';
import MobileTopBar from '../components/MobileTopBar';
import LobbyScreen from './LobbyScreen';
import WinBanner from '../components/WinOverlay';
import ActionTargeting from '../components/ActionTargeting';
import GameTutorial from '../components/GameTutorial';
import { isPlacementValid, adjacentEmptyPositions, validPlacements as computeValidPlacements } from '../engine/board';

export default function GamePage() {
  const state = useGameStore(s => s.state);
  const isMultiplayer = useGameStore(s => s.isMultiplayer);
  const selectedCardId = useGameStore(s => s.selectedCardId);
  const selectedRotation = useGameStore(s => s.selectedRotation);
  const pendingActionCardId = useGameStore(s => s.pendingActionCardId);
  const selectCard = useGameStore(s => s.selectCard);
  const rotateSelected = useGameStore(s => s.rotateSelected);
  const placeCard = useGameStore(s => s.placeCard);
  const stagingAction = useGameStore(s => s.stagingAction);
  const resolveAction = useGameStore(s => s.resolveAction);

  const myPlayerIndex = useMultiplayerStore(s => s.myPlayerIndex);

  // For move-card: track which board card was picked first
  const [moveFromKey, setMoveFromKey] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  const isPlayPhase = state?.phase === 'play';
  const isTargeting = state?.phase === 'action-targeting';
  const pendingAction = state?.pendingAction ?? null;

  // In singleplayer: only interact when it's the human player's turn (not AI)
  // In multiplayer: only interact when it's our player's turn
  const isMyTurn = !isMultiplayer
    ? !(state?.players[state.currentPlayerIndex]?.isAI ?? false)
    : myPlayerIndex === state?.currentPlayerIndex;

  // Valid placements for selected dragon card — filtered by current rotation
  const validPlacements = useMemo(() => {
    if (!state || !selectedCardId || !isPlayPhase) return [];
    const activePlayer = (isMultiplayer && myPlayerIndex !== null)
      ? state.players[myPlayerIndex]
      : state.players[state.currentPlayerIndex];
    const card = activePlayer.hand.find(c => c.id === selectedCardId);
    if (!card || card.type !== 'dragon') return [];
    return adjacentEmptyPositions(state.board).filter(pos =>
      isPlacementValid(state.board, card, pos, state.silverDragonColor, selectedRotation)
    );
  }, [state, selectedCardId, isPlayPhase, isMultiplayer, myPlayerIndex, selectedRotation]);

  // For move-card step 2: valid destinations for the picked card
  const moveDestinations = useMemo(() => {
    if (!state || pendingAction?.type !== 'move-card' || !moveFromKey) return [];
    const placed = state.board.get(moveFromKey);
    if (!placed) return [];
    // Build board without the card being moved
    const boardWithout = new Map(state.board);
    boardWithout.delete(moveFromKey);
    return computeValidPlacements(boardWithout, placed.card, state.silverDragonColor);
  }, [state, pendingAction, moveFromKey]);

  // Board cards targetable for zap/move (only when it's our turn)
  const targetablePosKeys = useMemo((): Set<string> | undefined => {
    if (!isTargeting || !pendingAction || !isMyTurn) return undefined;
    if (pendingAction.type === 'zap-card') return new Set(state!.board.keys());
    if (pendingAction.type === 'move-card' && !moveFromKey) return new Set(state!.board.keys());
    return undefined;
  }, [isTargeting, pendingAction, state, moveFromKey, isMyTurn]);

  if (!state) return <LobbyScreen />;

  const currentPlayer = state.players[state.currentPlayerIndex];
  // In multiplayer: show the hand of the local player (myPlayerIndex), not the current player
  const handPlayer = (isMultiplayer && myPlayerIndex !== null && myPlayerIndex >= 0)
    ? (state.players[myPlayerIndex] ?? currentPlayer)
    : state.players[0]; // in singleplayer, human is always index 0

  function handleSelectCard(id: string) {
    if (!isPlayPhase || !isMyTurn) return;
    const card = handPlayer.hand.find(c => c.id === id);
    if (!card) return;

    if (selectedCardId === id) {
      // Second click on selected dragon card: rotate 180°
      if (card.type === 'dragon') {
        rotateSelected();
      } else {
        selectCard(null);
      }
      return;
    }

    if (card.type === 'action') {
      stagingAction(id);
    } else {
      selectCard(id);
    }
  }

  function handleBoardCardClick(posKey: string) {
    if (!isTargeting || !pendingAction || !isMyTurn) return;

    if (pendingAction.type === 'zap-card') {
      resolveAction({ targetPosKey: posKey });
    }

    if (pendingAction.type === 'move-card') {
      if (!moveFromKey) {
        // Step 1: pick which card to move
        setMoveFromKey(posKey);
      }
    }
  }

  function handleDropZoneClick(pos: import('../engine/types').BoardPosition) {
    if (!isMyTurn) return;
    if (isPlayPhase && selectedCardId) {
      placeCard(pos);
      return;
    }
    if (isTargeting && pendingAction?.type === 'move-card' && moveFromKey) {
      // Step 2: place the moved card
      resolveAction({ targetPosKey: moveFromKey, toPos: pos });
      setMoveFromKey(null);
    }
  }

  // During move step 2, show destinations as drop zones (only when it's our turn)
  const showDropZones = isMyTurn && isTargeting && pendingAction?.type === 'move-card' && moveFromKey
    ? moveDestinations
    : isMyTurn && isPlayPhase && selectedCardId
      ? validPlacements
      : [];

  return (
    <div className="flex h-dvh select-none overflow-hidden" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.88),rgba(0,0,0,0.88)),url(/bg.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <SidebarToggle onClick={() => setSidebarOpen(v => !v)} />
      <RightSidebarToggle onClick={() => setRightSidebarOpen(v => !v)} />
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <MobileTopBar />
        <div data-tutorial="board" className="flex-1 relative overflow-hidden">
          <BoardArea
            board={state.board}
            silverColor={state.silverDragonColor}
            validPlacements={showDropZones}
            targetablePosKeys={targetablePosKeys}
            onDropZoneClick={handleDropZoneClick}
            onBoardCardClick={handleBoardCardClick}
          />
          {isTargeting && pendingAction && isMyTurn && (
            <ActionTargeting pendingAction={pendingAction} />
          )}
          <TurnToast />
          <PlayerLeftToast />
          <BonusToast />
        </div>
        {state.phase === 'ended' ? (
          <WinBanner />
        ) : pendingActionCardId ? (
          <ActionConfirm cardId={pendingActionCardId} />
        ) : (
          <div data-tutorial="hand" className="relative">
            {!isMyTurn && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 rounded-t-lg">
                <span className="text-white/60 text-sm font-medium">
                  {isMultiplayer ? `Waiting for ${currentPlayer.name}…` : `${currentPlayer.name} is thinking…`}
                </span>
              </div>
            )}
            <HandBar
              hand={handPlayer.hand}
              selectedCardId={selectedCardId}
              selectedRotation={selectedRotation}
              onSelectCard={handleSelectCard}
              cardSize={window.innerWidth < 640 ? 'sm' : 'md'}
            />
          </div>
        )}
      </div>
      <GameTutorial />
      <RightSidebar mobileOpen={rightSidebarOpen} onClose={() => setRightSidebarOpen(false)} />
    </div>
  );
}
