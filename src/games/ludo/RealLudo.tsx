import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameLogic } from './hooks/useGameLogic';
import { useBoardSize } from './hooks/useBoardSize';
import Background from './components/Background';
import Particles from './components/Particles';
import TopHeader from './components/TopHeader';
import PlayerPanel from './components/PlayerPanel';
import LudoBoard from './components/LudoBoard';
import BottomBar from './components/BottomBar';
import WinModal from './components/WinModal';
import LeaveModal from './components/LeaveModal';
import { LudoPlayerState } from './types';

const RealLudo: React.FC = () => {
  const {
    game, loading, rolling, errMsg, toastMsg,
    showLeave, setShowLeave, showWin,
    myColor, isMyTurn, myPlayerState, opponentState,
    movableIds, canRoll, prize, won, gameId,
    handleRoll, handleTokenClick, handleLeaveConfirm,
    navigate, user,
  } = useGameLogic();

  const boardSize = useBoardSize();

  // ── Loading State ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #070714, #0f172a)' }}>
        <Background />
        <div className="text-center relative z-10">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="text-6xl mb-4"
          >
            🎲
          </motion.div>
          <motion.p
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-slate-400 text-sm font-medium"
          >
            Loading game...
          </motion.p>
        </div>
      </div>
    );
  }

  // ── Game Not Found ──────────────────────────────────────────────────
  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #070714, #0f172a)' }}>
        <Background />
        <div className="text-center relative z-10">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-white font-bold text-lg mb-2">Game not found</p>
          <p className="text-slate-500 text-sm mb-6">This game may have ended or been removed.</p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/games/RealLudoLobby')}
            className="px-8 py-3.5 rounded-2xl font-bold text-white"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
            }}
          >
            Back to Lobby
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col select-none relative overflow-hidden">
      <Background />
      <Particles />

      <div
        className="relative flex flex-col w-full max-w-lg mx-auto min-h-screen z-10"
        style={{ padding: '8px 12px 12px' }}
      >
        {/* ── Top Header ──────────────────────────────────────────── */}
        <TopHeader
          gameId={gameId || ''}
          prize={prize}
          playerName={myPlayerState?.name || 'Player'}
          isOnline={myPlayerState?.isOnline ?? true}
          onLeave={() => setShowLeave(true)}
        />

        {/* ── Player Panels ───────────────────────────────────────── */}
        <div className="flex gap-2 mb-2">
          <PlayerPanel
            player={myPlayerState as LudoPlayerState | null}
            isActive={isMyTurn!}
            isMe
            diceValue={isMyTurn ? game.diceValue : null}
            position="left"
          />
          <div className="flex items-center justify-center px-1.5"
            style={{
              color: 'rgba(255,255,255,0.15)',
              fontSize: 10,
              fontWeight: 900,
              letterSpacing: 2,
            }}>
            VS
          </div>
          <PlayerPanel
            player={opponentState as LudoPlayerState | null}
            isActive={!isMyTurn && game.status === 'playing'}
            isMe={false}
            diceValue={!isMyTurn ? game.diceValue : null}
            position="right"
          />
        </div>

        {/* ── Status Message ──────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${game.activePlayer}-${game.diceRolled}-${game.status}`}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="text-center mb-2"
            style={{ minHeight: 24 }}
          >
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {game.status === 'waiting'
                ? '⏳ Waiting for opponent to join...'
                : game.status === 'finished'
                  ? `🏆 Game over — ${game.winnerName} wins!`
                  : isMyTurn
                    ? game.diceRolled
                      ? movableIds.length > 0
                        ? '👆 Tap a glowing token to move'
                        : '⏳ No moves available — skipping...'
                      : '🎲 Your turn! Roll the dice'
                    : `⌛ Waiting for ${opponentState?.name || 'opponent'}...`}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Toast */}
        <AnimatePresence>
          {toastMsg && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              className="text-center mb-2 px-4 py-2 mx-auto rounded-full"
              style={{
                background: 'rgba(251,191,36,0.15)',
                border: '1px solid rgba(251,191,36,0.25)',
                maxWidth: 'fit-content',
              }}
            >
              <span className="text-amber-400 font-bold text-sm">{toastMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {errMsg && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center text-xs text-red-400 mb-1 px-3 py-1.5 mx-auto rounded-lg"
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.15)',
                maxWidth: 'fit-content',
              }}
            >
              {errMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Board ───────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-center"
          style={{ flex: 1, minHeight: 0, paddingTop: 4, paddingBottom: 4 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
          >
            <LudoBoard
              game={game}
              myColor={myColor}
              movableIds={movableIds}
              boardSize={boardSize}
              onTokenClick={handleTokenClick}
            />
          </motion.div>
        </div>

        {/* ── Bottom Action Bar ─────────────────────────────────── */}
        <div className="mt-2">
          <BottomBar
            diceValue={game.diceValue}
            canRoll={canRoll!}
            rolling={rolling}
            isMyTurn={isMyTurn!}
            consecutiveSixes={game.consecutiveSixes}
            status={game.status}
            opponentName={opponentState?.name || 'Opponent'}
            movableCount={movableIds.length}
            onRoll={handleRoll}
            onLeave={() => setShowLeave(true)}
          />
        </div>
      </div>

      {/* ── Win Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showWin && game.status === 'finished' && (
          <WinModal
            won={won!}
            winnerName={game.winnerName || 'Opponent'}
            prize={prize}
            entryFee={game.entryFee}
            onPlayAgain={() => navigate('/games/RealLudoLobby')}
            onLobby={() => navigate('/games/RealLudoLobby')}
          />
        )}
      </AnimatePresence>

      {/* ── Leave Modal ───────────────────────────────────────────── */}
      <AnimatePresence>
        {showLeave && (
          <LeaveModal
            pot={game.pot}
            onConfirm={handleLeaveConfirm}
            onCancel={() => setShowLeave(false)}
          />
        )}
      </AnimatePresence>

      {/* Global animations */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default RealLudo;
