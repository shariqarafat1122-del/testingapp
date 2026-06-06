import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LudoDice from './LudoDice';

interface BottomBarProps {
  diceValue: number | null;
  canRoll: boolean;
  rolling: boolean;
  isMyTurn: boolean;
  consecutiveSixes: number;
  status: string;
  opponentName: string;
  movableCount: number;
  onRoll: () => void;
  onLeave: () => void;
}

const QUICK_EMOJIS = ['👍', '😂', '😤', '🎉', '💪', '🤦', '👏', '🔥'];

const BottomBar: React.FC<BottomBarProps> = React.memo(({
  diceValue,
  canRoll,
  rolling,
  isMyTurn,
  consecutiveSixes,
  status,
  opponentName,
  movableCount,
  onRoll,
  onLeave,
}) => {
  const [showEmojis, setShowEmojis] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [sentEmoji, setSentEmoji] = useState<string | null>(null);

  const handleEmoji = useCallback((emoji: string) => {
    setSentEmoji(emoji);
    setShowEmojis(false);
    setTimeout(() => setSentEmoji(null), 2000);
  }, []);

  return (
    <div className="relative">
      {/* Floating emoji display */}
      <AnimatePresence>
        {sentEmoji && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1.5, y: -40 }}
            exit={{ opacity: 0, y: -80, scale: 2 }}
            transition={{ duration: 1.5 }}
            className="absolute left-1/2 -translate-x-1/2 -top-10 text-4xl pointer-events-none z-50"
          >
            {sentEmoji}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emoji picker popup */}
      <AnimatePresence>
        {showEmojis && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-3 rounded-2xl z-40"
            style={{
              background: 'rgba(15,15,30,0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 -8px 30px rgba(0,0,0,0.5)',
            }}
          >
            {QUICK_EMOJIS.map((emoji) => (
              <motion.button
                key={emoji}
                whileTap={{ scale: 0.8 }}
                whileHover={{ scale: 1.2 }}
                onClick={() => handleEmoji(emoji)}
                className="text-2xl p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                {emoji}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main bar */}
      <div
        className="flex items-center justify-between px-3 py-3 rounded-2xl"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Left side - info & actions */}
        <div className="flex flex-col gap-1.5">
          {/* Status info */}
          {consecutiveSixes > 0 && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-orange-400 text-[11px] font-bold flex items-center gap-1"
            >
              🔥 {consecutiveSixes}× Six!
            </motion.p>
          )}

          <p className="text-slate-500 text-[11px]">
            {status === 'playing'
              ? isMyTurn
                ? movableCount > 0
                  ? '👆 Select a token'
                  : canRoll
                    ? '🎲 Roll dice'
                    : '⏳ No moves'
                : `⌛ ${opponentName}'s turn`
              : status === 'finished'
                ? '🏆 Game over'
                : '⏳ Waiting...'}
          </p>

          {/* Action buttons */}
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowEmojis(prev => !prev)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
              style={{
                background: showEmojis
                  ? 'rgba(251,191,36,0.15)'
                  : 'rgba(255,255,255,0.06)',
                border: `1px solid ${showEmojis ? 'rgba(251,191,36,0.3)' : 'rgba(255,255,255,0.08)'}`,
              }}
            >
              😊
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowChat(prev => !prev)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              💬
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onLeave}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
              style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.15)',
              }}
            >
              🚪
            </motion.button>
          </div>
        </div>

        {/* Center - Dice */}
        <div className="flex-shrink-0">
          <LudoDice
            value={diceValue || 1}
            size={canRoll || rolling ? 64 : 52}
            rolling={rolling}
            canRoll={canRoll}
            disabled={!canRoll && !diceValue}
            onRoll={onRoll}
          />
        </div>
      </div>
    </div>
  );
});

BottomBar.displayName = 'BottomBar';
export default BottomBar;
