import React from 'react';
import { motion } from 'framer-motion';

interface LeaveModalProps {
  pot: number;
  onConfirm: () => void;
  onCancel: () => void;
}

const LeaveModal: React.FC<LeaveModalProps> = ({ pot, onConfirm, onCancel }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{
      background: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(12px)',
    }}
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.8, opacity: 0, y: 20 }}
      transition={{ type: 'spring', damping: 15, stiffness: 200 }}
      className="w-full max-w-xs rounded-3xl p-6 text-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #1a0a2e, #2d1b4e, #1e1145)',
        border: '1px solid rgba(239,68,68,0.3)',
        boxShadow: '0 20px 60px rgba(239,68,68,0.15)',
      }}
    >
      {/* Top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: 'linear-gradient(90deg, transparent, #ef4444, transparent)',
        }}
      />

      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-5xl mb-4"
      >
        ⚠️
      </motion.div>

      <h2 className="text-xl font-black text-white mb-2">
        Leave Game?
      </h2>
      <p className="text-white/50 text-sm mb-5 leading-relaxed">
        Leaving will forfeit the game and your opponent will win the prize pool.
      </p>

      {pot > 0 && (
        <div
          className="rounded-xl py-3 px-4 mb-5"
          style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.2)',
          }}
        >
          <p className="text-red-400 font-bold text-base">
            You forfeit ₹{Math.floor(pot * 0.9)}
          </p>
          <p className="text-red-400/50 text-xs mt-0.5">
            Prize goes to opponent
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onCancel}
          className="flex-1 py-3.5 rounded-2xl font-bold text-white/70 text-sm"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          Stay
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onConfirm}
          className="flex-1 py-3.5 rounded-2xl font-black text-white text-sm"
          style={{
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            boxShadow: '0 4px 20px rgba(239,68,68,0.4)',
          }}
        >
          Leave
        </motion.button>
      </div>
    </motion.div>
  </motion.div>
);

export default LeaveModal;
