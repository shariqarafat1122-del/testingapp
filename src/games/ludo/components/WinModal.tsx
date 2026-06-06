import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WinModalProps {
  won: boolean;
  winnerName: string;
  prize: number;
  entryFee: number;
  onPlayAgain: () => void;
  onLobby: () => void;
}

const WinModal: React.FC<WinModalProps> = ({
  won, winnerName, prize, entryFee, onPlayAgain, onLobby,
}) => {
  // Confetti effect
  useEffect(() => {
    if (!won) return;

    const container = document.createElement('div');
    container.style.cssText = `
      position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden;
    `;
    const colors = ['#ef4444', '#22c55e', '#ffd700', '#a855f7', '#3b82f6', '#ec4899'];

    for (let i = 0; i < 100; i++) {
      const p = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 12 + 4;
      const isRect = Math.random() > 0.5;
      p.style.cssText = `
        position:absolute;top:-30px;
        left:${Math.random() * 100}%;
        width:${size}px;height:${isRect ? size * 2 : size}px;
        background:${color};
        border-radius:${isRect ? '2px' : '50%'};
        animation:confetti-fall ${Math.random() * 3 + 2}s ${Math.random() * 2}s linear forwards;
        transform:rotate(${Math.random() * 360}deg);
        opacity:0.9;
      `;
      container.appendChild(p);
    }

    const style = document.createElement('style');
    style.textContent = `
      @keyframes confetti-fall {
        0% { transform: translateY(-30px) rotate(0deg) scale(1); opacity: 1; }
        25% { transform: translateY(25vh) rotate(180deg) translateX(${Math.random() > 0.5 ? '' : '-'}30px) scale(0.9); }
        50% { transform: translateY(50vh) rotate(360deg) translateX(${Math.random() > 0.5 ? '-' : ''}20px) scale(0.8); }
        100% { transform: translateY(110vh) rotate(720deg) scale(0.3); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(container);

    const timer = setTimeout(() => {
      container.remove();
      style.remove();
    }, 6000);

    return () => {
      clearTimeout(timer);
      container.remove();
      style.remove();
    };
  }, [won]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <motion.div
        initial={{ scale: 0.3, opacity: 0, rotateY: 90 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        transition={{ type: 'spring', damping: 12, stiffness: 150, delay: 0.2 }}
        className="w-full max-w-sm rounded-3xl overflow-hidden relative"
        style={{
          background: won
            ? 'linear-gradient(160deg, #052e16, #14532d, #166534, #15803d)'
            : 'linear-gradient(160deg, #1e1b4b, #312e81, #3730a3)',
          border: `2px solid ${won ? 'rgba(34,197,94,0.4)' : 'rgba(129,140,248,0.3)'}`,
          boxShadow: won
            ? '0 25px 80px rgba(34,197,94,0.3), 0 0 100px rgba(34,197,94,0.1) inset'
            : '0 25px 80px rgba(99,102,241,0.2)',
        }}
      >
        {/* Top accent */}
        <div
          style={{
            height: 4,
            background: won
              ? 'linear-gradient(90deg, #22c55e, #86efac, #fbbf24, #86efac, #22c55e)'
              : 'linear-gradient(90deg, #6366f1, #a78bfa, #6366f1)',
          }}
        />

        {/* Glow orbs */}
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20 blur-3xl"
          style={{ background: won ? '#22c55e' : '#6366f1' }} />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full opacity-20 blur-3xl"
          style={{ background: won ? '#fbbf24' : '#818cf8' }} />

        <div className="relative p-8 text-center">
          {/* Trophy / Sad icon */}
          <motion.div
            animate={
              won
                ? {
                    rotate: [0, -10, 10, -8, 6, 0],
                    scale: [1, 1.15, 1.1, 1.12, 1],
                    y: [0, -5, 0],
                  }
                : { scale: [1, 0.95, 1], y: [0, 3, 0] }
            }
            transition={{ duration: 2.5, repeat: Infinity }}
            className="text-7xl mb-5"
          >
            {won ? '🏆' : '😔'}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-black mb-2"
            style={{
              color: won ? '#86efac' : '#c4b5fd',
              textShadow: `0 0 40px ${won ? 'rgba(34,197,94,0.5)' : 'rgba(139,92,246,0.5)'}`,
            }}
          >
            {won ? 'VICTORY!' : 'DEFEATED'}
          </motion.h1>

          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white/60 text-sm mb-6"
          >
            {won
              ? '🎉 Outstanding performance!'
              : `${winnerName} takes this round`}
          </motion.p>

          {/* Prize / Loss card */}
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="rounded-2xl p-5 mb-7 relative overflow-hidden"
            style={{
              background: 'rgba(0,0,0,0.35)',
              border: `1px solid ${won ? 'rgba(251,191,36,0.3)' : 'rgba(239,68,68,0.2)'}`,
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Shimmer */}
            {won && (
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.3), transparent)',
                  animation: 'shimmer 2.5s infinite',
                }}
              />
            )}

            <div className="relative z-10">
              {won ? (
                <>
                  <p className="text-white/50 text-xs mb-2 tracking-wider uppercase">
                    Prize Credited
                  </p>
                  <motion.p
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
                    className="text-4xl font-black text-amber-400"
                  >
                    +₹{prize}
                  </motion.p>
                  <p className="text-green-400 text-xs mt-2 flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                    Added to winning balance
                  </p>
                </>
              ) : (
                <>
                  <p className="text-white/50 text-xs mb-2 tracking-wider uppercase">
                    Entry Fee Lost
                  </p>
                  <p className="text-3xl font-black text-red-400">
                    -₹{entryFee}
                  </p>
                  <p className="text-white/30 text-xs mt-2">
                    Better luck next time!
                  </p>
                </>
              )}
            </div>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col gap-3"
          >
            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02 }}
              onClick={onPlayAgain}
              className="w-full py-4 rounded-2xl font-black text-base text-white relative overflow-hidden"
              style={{
                background: won
                  ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                  : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                boxShadow: won
                  ? '0 6px 30px rgba(34,197,94,0.4)'
                  : '0 6px 30px rgba(124,58,237,0.4)',
              }}
            >
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  animation: 'shimmer 3s infinite',
                }}
              />
              <span className="relative z-10">🎲 Play Again</span>
            </motion.button>

            <button
              onClick={onLobby}
              className="w-full py-3.5 rounded-2xl font-semibold text-white/50 text-sm transition-colors hover:text-white/70"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              🏠 Back to Lobby
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WinModal;
