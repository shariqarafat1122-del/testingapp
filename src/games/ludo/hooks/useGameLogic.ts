import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import {
  LudoGame, PlayerSlot,
  subscribeLudoGame, rollDice, moveTokenOnBoard,
  skipTurn, updatePlayerOnline, forfeitGame,
  getMovableTokens,
} from '../../../firebase/RealLudo';
import { LudoColor } from '../types';

export function useGameLogic() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [game, setGame] = useState<LudoGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [rolling, setRolling] = useState(false);
  const [movingToken, setMovingToken] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showLeave, setShowLeave] = useState(false);
  const [showWin, setShowWin] = useState(false);
  const [winShown, setWinShown] = useState(false);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  }, []);

  // ── Derived State ───────────────────────────────────────────────────
  const mySlot: PlayerSlot | null = useMemo(() => {
    if (!game || !user) return null;
    if (game.player1?.uid === user.uid) return 'player1';
    if (game.player2?.uid === user.uid) return 'player2';
    return null;
  }, [game, user]);

  const myColor: LudoColor | null = useMemo(
    () => (mySlot ? (game?.[mySlot]?.color as LudoColor) ?? null : null),
    [mySlot, game]
  );

  const isMyTurn = game?.activePlayer === mySlot;
  const myPlayerState = mySlot && game ? game[mySlot] : null;
  const opponentSlot: PlayerSlot = mySlot === 'player1' ? 'player2' : 'player1';
  const opponentState = game ? game[opponentSlot] : null;

  const movableIds: number[] = useMemo(() => {
    if (!isMyTurn || !game?.diceRolled || !game.diceValue || !myPlayerState) return [];
    return getMovableTokens(myPlayerState.tokens, game.diceValue);
  }, [isMyTurn, game?.diceRolled, game?.diceValue, myPlayerState]);

  // ── Subscribe ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!gameId) return;
    return subscribeLudoGame(gameId, (g) => {
      setGame(g);
      setLoading(false);
    });
  }, [gameId]);

  // ── Show win modal ──────────────────────────────────────────────────
  useEffect(() => {
    if (game?.status === 'finished' && !winShown) {
      setWinShown(true);
      setTimeout(() => setShowWin(true), 800);
    }
  }, [game?.status, winShown]);

  // ── Online status ───────────────────────────────────────────────────
  useEffect(() => {
    if (!gameId || !mySlot) return;
    updatePlayerOnline(gameId, mySlot, true);
    const handleVis = () => updatePlayerOnline(gameId, mySlot, !document.hidden);
    document.addEventListener('visibilitychange', handleVis);
    return () => {
      document.removeEventListener('visibilitychange', handleVis);
      updatePlayerOnline(gameId!, mySlot, false);
    };
  }, [gameId, mySlot]);

  // ── Auto skip when no moves ─────────────────────────────────────────
  useEffect(() => {
    if (
      !game || !gameId || !isMyTurn || !game.diceRolled ||
      movingToken || movableIds.length > 0 || game.diceValue === null
    ) return;
    const t = setTimeout(() => {
      skipTurn(gameId, game.activePlayer!).catch(() => {});
    }, 2000);
    return () => clearTimeout(t);
  }, [game?.diceRolled, movableIds.length, isMyTurn, gameId, movingToken]);

  // ── Roll Dice ───────────────────────────────────────────────────────
  const handleRoll = useCallback(async () => {
    if (!gameId || !mySlot || !user || rolling || !isMyTurn || game?.diceRolled || game?.status !== 'playing')
      return;
    setRolling(true);
    setErrMsg(null);
    try {
      await rollDice(gameId, mySlot, user.uid);
    } catch (e: any) {
      setErrMsg(e.message);
    } finally {
      setTimeout(() => setRolling(false), 700);
    }
  }, [gameId, mySlot, user, rolling, isMyTurn, game?.diceRolled, game?.status]);

  // ── Move Token ──────────────────────────────────────────────────────
  const handleTokenClick = useCallback(
    async (color: LudoColor, tokenId: number) => {
      if (
        !gameId || !mySlot || !user || !isMyTurn || !game?.diceRolled ||
        movingToken || color !== myColor || !movableIds.includes(tokenId)
      ) return;

      setMovingToken(true);
      setErrMsg(null);
      try {
        const { captured, won } = await moveTokenOnBoard(gameId, mySlot, user.uid, tokenId);
        if (captured) showToast('💥 Captured! +Bonus turn');
        if (won) showToast('🏆 All tokens home!');
      } catch (e: any) {
        setErrMsg(e.message);
      } finally {
        setMovingToken(false);
      }
    },
    [gameId, mySlot, user, isMyTurn, game?.diceRolled, movingToken, myColor, movableIds, showToast]
  );

  // ── Leave / Forfeit ─────────────────────────────────────────────────
  const handleLeaveConfirm = useCallback(async () => {
    if (!gameId || !user) return;
    setShowLeave(false);
    await forfeitGame(gameId, user.uid).catch(console.error);
    navigate('/games/RealLudoLobby');
  }, [gameId, user, navigate]);

  const canRoll = isMyTurn && !game?.diceRolled && game?.status === 'playing' && !rolling;
  const prize = Math.floor((game?.pot || 0) * 0.9);
  const won = game?.winnerId === user?.uid;

  return {
    game, loading, rolling, movingToken, errMsg, toastMsg,
    showLeave, setShowLeave, showWin, setShowWin,
    mySlot, myColor, isMyTurn, myPlayerState, opponentState,
    movableIds, canRoll, prize, won, gameId,
    handleRoll, handleTokenClick, handleLeaveConfirm,
    navigate, user,
  };
}
