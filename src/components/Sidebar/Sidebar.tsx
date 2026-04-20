import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useMultiplayerStore } from '../../store/multiplayerStore';
import { SILVER_COLOR_BG, PANEL_BG } from '../Card/colors';
import type { DragonColor } from '../../engine/types';
import HelpModal from '../HelpModal';
import LangSwitcher from '../LangSwitcher';
import { useTranslation } from '../../i18n/LanguageContext';

export function SidebarToggle({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="sm:hidden fixed bottom-20 left-3 z-40 w-9 h-9 rounded-full bg-black/70 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white transition-colors"
    >
      ☰
    </button>
  );
}

const GOAL_BORDER: Record<DragonColor, string> = {
  red:   'border-red-600',
  gold:  'border-yellow-500',
  blue:  'border-blue-600',
  green: 'border-green-600',
  black: 'border-zinc-500',
};

const GOAL_TEXT: Record<DragonColor, string> = {
  red:   'text-red-400',
  gold:  'text-yellow-400',
  blue:  'text-blue-400',
  green: 'text-green-400',
  black: 'text-zinc-400',
};

export default function Sidebar({ mobileOpen, onClose }: { mobileOpen?: boolean; onClose?: () => void }) {
  const { t } = useTranslation();
  const state = useGameStore(s => s.state);
  const isMultiplayer = useGameStore(s => s.isMultiplayer);
  const goToLobby = useGameStore(s => s.goToLobby);
  const myPlayerIndex = useMultiplayerStore(s => s.myPlayerIndex);
  const sendQuit = useMultiplayerStore(s => s.sendQuit);
  const [showHelp, setShowHelp] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  if (!state) return null;

  const currentPlayer = state.players[state.currentPlayerIndex];
  // In multiplayer: "my" player is myPlayerIndex, not currentPlayerIndex
  const myPlayer = (isMultiplayer && myPlayerIndex !== null && myPlayerIndex >= 0)
    ? (state.players[myPlayerIndex] ?? currentPlayer)
    : state.players[0]; // in singleplayer, human is always index 0
  const myGoal = state.goals.find(g => g.id === myPlayer.goalId);
  const otherPlayers = state.players.filter(p => p.id !== myPlayer.id);
  const topDiscard = state.discardPile[state.discardPile.length - 1] ?? null;
  const silverBg = SILVER_COLOR_BG[state.silverDragonColor];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="sm:hidden fixed inset-0 z-40 bg-black/60"
          onClick={onClose}
        />
      )}
    <aside className={[
      'flex flex-col overflow-hidden border-white/10',
      // Desktop: static in layout
      'sm:relative sm:w-[196px] sm:shrink-0 sm:border-r sm:translate-x-0',
      // Mobile: fixed drawer
      'fixed top-0 left-0 h-full w-[220px] z-50 bg-black/90 backdrop-blur-md border-r transition-transform duration-300',
      mobileOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0',
    ].join(' ')}>


      {/* Draw pile + Discard */}
      <div data-tutorial="draw-pile" className="px-4 pt-4">
        <div className="flex gap-2">
          <div className="flex-1 flex flex-col items-center">
            <p className="text-[#96a3b7] text-[10px] font-bold tracking-widest mb-1 text-center">{t('sidebar.drawPile')}</p>
            <button
              disabled
              className="bg-[#0c0f15] border border-[#333c4a] cursor-default rounded-lg w-full h-[72px] flex flex-col items-center justify-center"
            >
              <span className="text-[#eff1f5] text-2xl font-bold leading-none">{state.deck.length}</span>
              <span className="text-[#96a3b7] text-[9px] mt-0.5">{t('sidebar.cardsLeft')}</span>
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <p className="text-[#96a3b7] text-[10px] font-bold tracking-widest mb-1 text-center">{t('sidebar.discard')}</p>
            <div className={[
              'border rounded-lg w-full h-[72px] flex flex-col items-center justify-center overflow-hidden',
              topDiscard ? 'border-red-600 bg-[#0c0f15]' : 'border-[#333c4a] bg-[#0c0f15]',
            ].join(' ')}>
              {topDiscard ? (
                <>
                  <span className="text-[#eff1f5] text-[10px] font-semibold text-center leading-tight px-1">
                    {topDiscard.action.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </span>
                  <span className="text-[22px] mt-1">↔</span>
                </>
              ) : (
                <span className="text-[#96a3b7] text-[9px]">{t('sidebar.empty')}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Silver Dragon */}
      <div className="px-4 pt-4">
        <div className="bg-[#0c0f15] border border-[#a8a9ad] rounded-lg px-3 py-2">
          <p className="text-[#96a3b7] text-[9px] font-bold tracking-widest mb-2">{t('sidebar.silverQueen')}</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full shrink-0" style={silverBg} />
            <span className="text-[#eff1f5] text-xs font-semibold">
              {t('sidebar.currently')}: {state.silverDragonColor === 'all' ? t('color.all') : t('color.' + state.silverDragonColor)}
            </span>
          </div>
        </div>
      </div>

      {/* Opponents */}
      {otherPlayers.length > 0 && (
        <div data-tutorial="opponents" className="px-4 pt-4">
          <p className="text-[#96a3b7] text-[10px] font-bold tracking-widest mb-2">{t('sidebar.opponents')}</p>
          <div className="flex flex-col gap-1.5">
            {otherPlayers.map(p => (
              <div key={p.id} className="bg-[#191f28] rounded-lg px-3 py-2 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#2a3342] flex items-center justify-center shrink-0">
                  <span className="text-[#96a3b7] text-xs font-bold">{p.name[0].toUpperCase()}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[#eff1f5] text-xs font-semibold leading-none truncate">{p.name}</p>
                  <p className="text-[#96a3b7] text-[10px] mt-0.5">
                    {('handCount' in p ? (p as { handCount: number }).handCount : p.hand.length)} {t('sidebar.cardsGoal')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Your Goal */}
      {myGoal && (
        <div data-tutorial="goal" className="px-4 pt-4">
          <p className="text-[#96a3b7] text-[10px] font-bold tracking-widest mb-2">{t('sidebar.yourGoal')}</p>
          <div className={['bg-[#141921] border rounded-xl p-3 flex items-center gap-3', GOAL_BORDER[myGoal.color]].join(' ')}>
            <div className="w-8 h-8 rounded-full shrink-0" style={PANEL_BG[myGoal.color]} />
            <div>
              <p className={['font-bold text-base leading-none', GOAL_TEXT[myGoal.color]].join(' ')}>
                {t('color.' + myGoal.color)}
              </p>
              <p className="text-[#96a3b7] text-[10px] mt-0.5">{t('sidebar.connect7', { color: t('color.' + myGoal.color) })}</p>
            </div>
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Help + Leave Game + Lang */}
      <div className="px-4 pb-4 pt-3 flex flex-col gap-2">
        <button
          onClick={() => setShowHelp(true)}
          className="w-full py-2 rounded-lg border border-white/10 bg-white/5 text-white/50 text-xs font-semibold hover:bg-white/10 hover:text-white/70 transition-colors"
        >
          {t('sidebar.help')}
        </button>
        <button
          onClick={() => setShowLeaveConfirm(true)}
          className="w-full py-2 rounded-lg border border-red-800 bg-red-950/40 text-red-400 text-xs font-semibold hover:bg-red-900/40 hover:border-red-600 transition-colors"
        >
          {t('sidebar.leaveGame')}
        </button>
        <div className="flex justify-center pt-1">
          <LangSwitcher />
        </div>
      </div>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

      {showLeaveConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-white/20 rounded-2xl p-6 shadow-2xl max-w-xs w-full mx-4 flex flex-col gap-4">
            <div>
              <p className="text-white font-bold text-base leading-tight">{t('sidebar.leaveTitle')}</p>
              <p className="text-white/50 text-sm mt-1">
                {isMultiplayer
                  ? t('sidebar.leaveDesc')
                  : t('sidebar.leaveDescLocal')}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowLeaveConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors"
              >
                {t('sidebar.stay')}
              </button>
              <button
                onClick={() => { setShowLeaveConfirm(false); isMultiplayer ? sendQuit() : goToLobby(); }}
                className="flex-1 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold text-sm transition-colors"
              >
                {t('sidebar.leave')}
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
    </>
  );
}
