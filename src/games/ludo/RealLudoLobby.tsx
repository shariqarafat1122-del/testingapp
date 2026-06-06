import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../../context/AuthContext';
import {
  LudoGame,
  createLudoGame,
  joinLudoGame,
  subscribeOpenLudoGames,
} from '../../firebase/RealLudo';
import toast from 'react-hot-toast';
import { calculateUsableBalance } from '../../utils/helpers';
import Background from './components/Background';
import Particles from './components/Particles';
import { COLOR_THEMES } from './constants/board';

const ENTRY_FEES = [10, 25, 50, 100, 250, 500];

const RealLudoLobby: React.FC = () => {
  const { user, wallet } = useAuth();
  const navigate = useNavigate();

  const [openGames, setOpenGames] = useState<LudoGame[]>([]);
  const [selectedFee, setSelectedFee] = useState(10);
  const [creating, setCreating] = useState(false);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  const usableBalance = wallet ? calculateUsableBalance(wallet) : 0;

  // Subscribe to open games
  useEffect(() => {
    return subscribeOpenLudoGames((games) => {
      setOpenGames(games.filter((g) => g.createdBy !== user?.uid));
    });
  }, [user?.uid]);

  // ── Create Game ─────────────────────────────────────────────────────
  const handleCreate = useCallback(async () => {
    if (!user) return;
    if (usableBalance < selectedFee) {
      toast.error(`Insufficient balance! Need ₹${selectedFee}`);
      return;
    }

    setCreating(true);
    try {
      const gameId = uuidv4();
      await createLudoGame(
        gameId,
        { uid: user.uid, name: user.name || 'Player', photoURL: user.photoURL || '' },
        selectedFee
      );
      toast.success('Table created!');
      navigate(`/games/RealLudo/${gameId}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create');
    } finally {
      setCreating(false);
    }
  }, [user, usableBalance, selectedFee, navigate]);

  // ── Join Game ───────────────────────────────────────────────────────
  const handleJoin = useCallback(async (game: LudoGame) => {
    if (!user) return;
    if (usableBalance < game.entryFee) {
      toast.error(`Insufficient balance! Need ₹${game.entryFee}`);
      return;
    }

    setJoiningId(game.id);
    try {
      await joinLudoGame(game.id, {
        uid: user.uid, name: user.name || 'Player', photoURL: user.photoURL || '',
      });
      navigate(`/games/RealLudo/${game.id}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to join');
    } finally {
      setJoiningId(null);
    }
  }, [user, usableBalance, navigate]);

  const prize = (selectedFee * 2 * 0.9).toFixed(0);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Background />
      <Particles />

      <div className="relative max-w-lg mx-auto px-4 pt-6 pb-10 z-10">
        {/* ── Header ───────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </motion.button>

          <div className="text-center">
            <motion.h1
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-2xl font-black text-white flex items-center gap-2"
            >
              🎲 <span style={{
                background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>Ludo Royale</span>
            </motion.h1>
            <p className="text-slate-500 text-xs mt-0.5">Real Money • 2 Players</p>
          </div>

          <div
            className="px-3 py-2 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(34,197,94,0.05))',
              border: '1px solid rgba(34,197,94,0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <p className="text-[9px] text-slate-500 leading-none mb-0.5">Balance</p>
            <p className="text-green-400 font-black text-sm leading-none">
              ₹{usableBalance.toFixed(0)}
            </p>
          </div>
        </div>

        {/* ── Create Table Card ─────────────────────────────────────── */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-5 mb-5 relative overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
          }}
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 opacity-50 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(239,68,68,0.03), transparent, rgba(34,197,94,0.03))',
            }}
          />

          <div className="relative z-10">
            <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
                style={{
                  background: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.1))',
                  border: '1px solid rgba(239,68,68,0.2)',
                }}>
                🔴
              </span>
              Create Table
              <span className="text-xs text-slate-500 font-normal ml-auto">
                You = Red
              </span>
            </h2>

            {/* Fee Buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
              {ENTRY_FEES.map((fee) => (
                <motion.button
                  key={fee}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setSelectedFee(fee)}
                  className="py-3 rounded-xl font-bold text-sm transition-all relative overflow-hidden"
                  style={{
                    background: selectedFee === fee
                      ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                      : 'rgba(255,255,255,0.06)',
                    color: selectedFee === fee ? 'white' : 'rgba(255,255,255,0.5)',
                    border: selectedFee === fee
                      ? '1px solid rgba(239,68,68,0.5)'
                      : '1px solid rgba(255,255,255,0.06)',
                    boxShadow: selectedFee === fee
                      ? '0 4px 18px rgba(239,68,68,0.35)'
                      : 'none',
                  }}
                >
                  {selectedFee === fee && (
                    <div className="absolute inset-0 opacity-30"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                        animation: 'shimmer 2s infinite',
                      }}
                    />
                  )}
                  <span className="relative z-10">₹{fee}</span>
                </motion.button>
              ))}
            </div>

            {/* Prize Info */}
            <div
              className="flex items-center justify-between px-4 py-3.5 rounded-xl mb-4"
              style={{
                background: 'linear-gradient(135deg, rgba(251,191,36,0.1), rgba(245,158,11,0.05))',
                border: '1px solid rgba(251,191,36,0.15)',
              }}
            >
              <div>
                <p className="text-slate-500 text-xs">Entry Fee</p>
                <p className="text-white font-bold text-lg">₹{selectedFee}</p>
              </div>
              <div className="text-center">
                <p className="text-slate-500 text-[10px]">Platform Fee</p>
                <p className="text-slate-400 text-xs">10%</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500 text-xs">You Win</p>
                <p className="text-amber-400 font-black text-xl">₹{prize}</p>
              </div>
            </div>

            {/* Insufficient balance warning */}
            <AnimatePresence>
              {usableBalance < selectedFee && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-3 overflow-hidden"
                  style={{
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.2)',
                  }}
                >
                  <span className="text-red-400 text-xs">
                    ⚠️ Insufficient balance. Add ₹{(selectedFee - usableBalance).toFixed(0)} more.
                  </span>
                  <button
                    onClick={() => navigate('/add-money')}
                    className="text-xs font-bold text-amber-400 ml-auto flex-shrink-0 underline"
                  >
                    Add
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Create button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleCreate}
              disabled={creating || usableBalance < selectedFee}
              className="w-full py-4 rounded-2xl font-black text-base text-white transition-all relative overflow-hidden"
              style={{
                background: creating || usableBalance < selectedFee
                  ? 'rgba(255,255,255,0.06)'
                  : 'linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)',
                boxShadow: creating || usableBalance < selectedFee
                  ? 'none'
                  : '0 6px 30px rgba(239,68,68,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
                color: creating || usableBalance < selectedFee
                  ? 'rgba(255,255,255,0.25)'
                  : 'white',
                border: '1px solid rgba(239,68,68,0.3)',
              }}
            >
              {!(creating || usableBalance < selectedFee) && (
                <div className="absolute inset-0 opacity-20"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    animation: 'shimmer 3s infinite',
                  }}
                />
              )}
              <span className="relative z-10">
                {creating ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >⏳</motion.span>
                    Creating...
                  </span>
                ) : (
                  `🎲 Create Table • ₹${selectedFee}`
                )}
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* ── Open Tables ─────────────────────────────────────────── */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-bold text-base flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
                style={{
                  background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.1))',
                  border: '1px solid rgba(34,197,94,0.2)',
                }}>
                🟢
              </span>
              Join Table
            </h2>
            <motion.span
              key={openGames.length}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              className="px-2.5 py-1 rounded-lg text-xs font-bold"
              style={{
                background: openGames.length > 0
                  ? 'rgba(34,197,94,0.1)'
                  : 'rgba(255,255,255,0.06)',
                color: openGames.length > 0 ? '#4ade80' : 'rgba(255,255,255,0.4)',
                border: `1px solid ${openGames.length > 0 ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              {openGames.length} open
            </motion.span>
          </div>

          <AnimatePresence mode="popLayout">
            {openGames.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-14 rounded-2xl"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px dashed rgba(255,255,255,0.06)',
                }}
              >
                <motion.div
                  animate={{ y: [0, -5, 0], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-5xl mb-3"
                >
                  🎲
                </motion.div>
                <p className="text-slate-500 text-sm font-medium">No open tables</p>
                <p className="text-slate-600 text-xs mt-1">
                  Create one and wait for an opponent!
                </p>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-3">
                {openGames.map((game, idx) => {
                  const gamePrize = Math.floor(game.pot * 2 * 0.9);
                  const canJoin = usableBalance >= game.entryFee;
                  const isJoining = joiningId === game.id;

                  return (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, x: -20 }}
                      transition={{ delay: idx * 0.05 }}
                      layout
                      className="flex items-center justify-between p-4 rounded-2xl"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      {/* Player info */}
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-white text-base"
                          style={{
                            background: 'linear-gradient(135deg, rgba(239,68,68,0.25), rgba(239,68,68,0.1))',
                            border: '1.5px solid rgba(239,68,68,0.3)',
                            boxShadow: '0 2px 8px rgba(239,68,68,0.1)',
                          }}
                        >
                          {game.player1?.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">
                            {game.player1?.name || 'Player'}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold"
                              style={{
                                background: 'rgba(239,68,68,0.15)',
                                color: '#f87171',
                                border: '1px solid rgba(239,68,68,0.2)',
                              }}>
                              🔴 Red
                            </span>
                            <span className="text-slate-700 text-[10px]">vs</span>
                            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold"
                              style={{
                                background: 'rgba(34,197,94,0.15)',
                                color: '#4ade80',
                                border: '1px solid rgba(34,197,94,0.2)',
                              }}>
                              🟢 You
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right side */}
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                          <p className="text-amber-400 font-black text-lg leading-none">
                            ₹{gamePrize}
                          </p>
                          <p className="text-slate-600 text-[10px]">prize pool</p>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.93 }}
                          onClick={() => handleJoin(game)}
                          disabled={isJoining || !canJoin}
                          className="px-4 py-2 rounded-xl font-bold text-xs text-white relative overflow-hidden"
                          style={{
                            background: isJoining || !canJoin
                              ? 'rgba(255,255,255,0.06)'
                              : 'linear-gradient(135deg, #22c55e, #16a34a)',
                            boxShadow: isJoining || !canJoin
                              ? 'none'
                              : '0 4px 16px rgba(34,197,94,0.4)',
                            color: isJoining || !canJoin
                              ? 'rgba(255,255,255,0.25)'
                              : 'white',
                            border: `1px solid ${isJoining || !canJoin ? 'rgba(255,255,255,0.06)' : 'rgba(34,197,94,0.3)'}`,
                          }}
                        >
                          {isJoining
                            ? '⏳ Joining...'
                            : !canJoin
                              ? '💰 Low Balance'
                              : `Join ₹${game.entryFee}`}
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── How it Works ─────────────────────────────────────────── */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 rounded-2xl p-5"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
            <span className="text-base">📋</span>
            How it Works
          </h3>
          <div className="space-y-2">
            {[
              { icon: '1️⃣', text: 'Create or join a table with entry fee' },
              { icon: '2️⃣', text: 'Roll dice and move your tokens home' },
              { icon: '3️⃣', text: 'First to bring all 4 tokens home wins!' },
              { icon: '💰', text: 'Winner gets 90% of the total pot' },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span className="text-sm flex-shrink-0">{step.icon}</span>
                <span className="text-slate-400 text-xs">{step.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Add money shortcut */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/add-money')}
            className="text-slate-500 text-xs underline underline-offset-4 hover:text-slate-400 transition-colors"
          >
            💳 Add Money to Wallet
          </button>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default RealLudoLobby;
