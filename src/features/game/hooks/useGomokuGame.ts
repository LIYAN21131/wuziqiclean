"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { computeAiMoveAsync } from "@/features/ai/lib/gomoku-ai";
import { getCandidateMoves, createEmptyBoard } from "@/features/game/lib/gomoku/board";
import {
  getLastMoveFromHistory,
  inferHistoryFromBoard,
  isHistoryConsistent,
  popFullRound,
  rebuildBoardFromHistory,
} from "@/features/game/lib/gomoku/move-history";
import { applyMove, canPlayAt, mapResultForPlayer } from "@/features/game/lib/gomoku/game-engine";
import { MAX_UNDO_PER_GAME, PLAYER, TURN_TIMER_SECONDS } from "@/shared/lib/constants";
import { useGameTimer, type TurnOwner } from "@/features/game/hooks/useGameTimer";
import {
  clearPersistedGame,
  loadPersistedGame,
  savePersistedGame,
} from "@/features/game/lib/match/game-persistence";
import {
  setActiveMatch,
  updateActiveMatchProgress,
  clearActiveAndArchive,
  getActiveMatch,
} from "@/features/game/lib/match/session-store";
import { updateStreaksOnGameEnd } from "@/features/game/lib/match/streaks";
import type { MatchRecord } from "@/features/game/lib/match/types";
import type { Board, GameStatus, MoveRecord, Position, StoneColor } from "@/features/game/lib/gomoku/types";
import type { GameEndReason } from "@/shared/types";
import { randomMatchId } from "@/shared/lib/utils";

export type { GameEndReason };

const UNDO_ANIM_MS = 320;

type UseGomokuGameOptions = {
  onGameEnd?: (record: MatchRecord) => void;
};

export function useGomokuGame({ onGameEnd }: UseGomokuGameOptions = {}) {
  const [ready, setReady] = useState(false);
  const [board, setBoard] = useState<Board>(() => createEmptyBoard());
  const [moveHistory, setMoveHistory] = useState<MoveRecord[]>([]);
  const [undoCount, setUndoCount] = useState(0);
  const [currentTurn, setCurrentTurn] = useState<StoneColor>(PLAYER.human);
  const [status, setStatus] = useState<GameStatus>("playing");
  const [winningLine, setWinningLine] = useState<Position[]>([]);
  const [lastMove, setLastMove] = useState<Position | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isUndoAnimating, setIsUndoAnimating] = useState(false);
  const [retractingPositions, setRetractingPositions] = useState<Position[]>([]);
  const [undoToast, setUndoToast] = useState<string | null>(null);
  const [matchId, setMatchId] = useState(() => randomMatchId());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showResultModal, setShowResultModal] = useState(false);
  const [endReason, setEndReason] = useState<GameEndReason>("normal");
  const [timerBootstrap, setTimerBootstrap] = useState<number | undefined>(undefined);

  const aiLock = useRef(false);
  const undoLock = useRef(false);
  const moveCountRef = useRef(0);
  const moveHistoryRef = useRef<MoveRecord[]>([]);
  const undoCountRef = useRef(0);
  const elapsedRef = useRef(0);
  const matchIdRef = useRef(matchId);
  const statusRef = useRef(status);
  const turnSecondsRef = useRef(TURN_TIMER_SECONDS);

  const humanColor = PLAYER.human;
  const aiColor = PLAYER.ai;
  const opponentName = "Sophia L.";

  moveCountRef.current = moveCount;
  moveHistoryRef.current = moveHistory;
  undoCountRef.current = undoCount;
  elapsedRef.current = elapsedSeconds;
  matchIdRef.current = matchId;
  statusRef.current = status;

  const undoRemaining = MAX_UNDO_PER_GAME - undoCount;

  useEffect(() => {
    const active = getActiveMatch();
    const saved = loadPersistedGame();
    if (active && saved && saved.matchId === active.matchId) {
      setBoard(saved.board);
      setMatchId(saved.matchId);
      matchIdRef.current = saved.matchId;
      setCurrentTurn(saved.currentTurn);
      setStatus(saved.status);
      setWinningLine(saved.winningLine);
      setLastMove(saved.lastMove);
      setMoveCount(saved.moveCount);
      moveCountRef.current = saved.moveCount;
      setElapsedSeconds(saved.elapsedSeconds);
      elapsedRef.current = saved.elapsedSeconds;
      setTimerBootstrap(saved.turnSecondsLeft);
      setShowResultModal(saved.showResultModal);
      setUndoCount(saved.undoCount ?? 0);
      undoCountRef.current = saved.undoCount ?? 0;

      let history = saved.moveHistory ?? [];
      if (!isHistoryConsistent(history, saved.moveCount) && saved.moveCount > 0) {
        history = inferHistoryFromBoard(saved.board, humanColor);
      }
      setMoveHistory(history);
      moveHistoryRef.current = history;
    } else {
      const id = randomMatchId();
      setMatchId(id);
      matchIdRef.current = id;
      setTimerBootstrap(TURN_TIMER_SECONDS);
      setActiveMatch({
        matchId: id,
        opponent: opponentName,
        status: "playing",
        startedAt: Date.now(),
        moveCount: 0,
      });
    }
    setReady(true);
  }, [humanColor]);

  const finishGame = useCallback(
    (
      playerStatus: "won" | "lost" | "draw",
      line: Position[],
      finalMoveCount?: number,
      reason: GameEndReason = "normal",
    ) => {
      if (statusRef.current !== "playing") return;

      const moves = finalMoveCount ?? moveCountRef.current;
      const elapsed = elapsedRef.current;

      statusRef.current = playerStatus;
      setStatus(playerStatus);
      setWinningLine(line);
      setEndReason(reason);
      setShowResultModal(true);
      setIsAiThinking(false);
      setIsUndoAnimating(false);
      setRetractingPositions([]);
      aiLock.current = false;
      undoLock.current = false;

      const result: MatchRecord["result"] =
        playerStatus === "won" ? "win" : playerStatus === "lost" ? "loss" : "draw";

      clearActiveAndArchive({
        id: matchIdRef.current,
        opponent: opponentName,
        result,
        durationSeconds: elapsed,
        moveCount: moves,
        finishedAt: Date.now(),
      });
      clearPersistedGame();
      onGameEnd?.({
        id: matchIdRef.current,
        opponent: opponentName,
        result,
        durationSeconds: elapsed,
        moveCount: moves,
        finishedAt: Date.now(),
      });

      if (playerStatus === "won") {
        updateStreaksOnGameEnd(true);
      } else if (playerStatus === "lost") {
        updateStreaksOnGameEnd(false);
      }
    },
    [onGameEnd],
  );

  const handleHumanTimeout = useCallback(() => {
    finishGame("lost", [], moveCountRef.current, "human_timeout");
  }, [finishGame]);

  const handleAiTimeout = useCallback(() => {
    finishGame("won", [], moveCountRef.current, "ai_timeout");
  }, [finishGame]);

  const turnOwner = useMemo((): TurnOwner => {
    if (!ready || status !== "playing" || isUndoAnimating) return null;
    if (isAiThinking || currentTurn === aiColor) return "ai";
    if (currentTurn === humanColor) return "human";
    return null;
  }, [ready, status, isAiThinking, isUndoAnimating, currentTurn, aiColor, humanColor]);

  const {
    secondsLeft: turnSecondsLeft,
    urgency: timerUrgency,
    turnOwner: timerTurnOwner,
    totalSeconds: totalTurnSeconds,
    reset: resetTimer,
  } = useGameTimer({
    enabled: ready && status === "playing",
    turnOwner,
    paused: showResultModal || isUndoAnimating,
    initialSeconds: timerBootstrap,
    onHumanTimeout: handleHumanTimeout,
    onAiTimeout: handleAiTimeout,
  });

  turnSecondsRef.current = turnSecondsLeft;

  useEffect(() => {
    if (!ready || status !== "playing") return;
    savePersistedGame({
      matchId: matchIdRef.current,
      board,
      currentTurn,
      status,
      winningLine,
      lastMove,
      moveCount,
      moveHistory,
      undoCount,
      elapsedSeconds,
      turnSecondsLeft,
      showResultModal,
    });
    updateActiveMatchProgress(moveCount);
  }, [
    ready,
    board,
    currentTurn,
    status,
    winningLine,
    lastMove,
    moveCount,
    moveHistory,
    undoCount,
    elapsedSeconds,
    turnSecondsLeft,
    showResultModal,
  ]);

  const resetGame = useCallback(() => {
    aiLock.current = false;
    undoLock.current = false;
    statusRef.current = "playing";
    const newId = randomMatchId();
    const empty = createEmptyBoard();
    setMatchId(newId);
    matchIdRef.current = newId;
    setBoard(empty);
    setMoveHistory([]);
    moveHistoryRef.current = [];
    setUndoCount(0);
    undoCountRef.current = 0;
    setCurrentTurn(PLAYER.human);
    setStatus("playing");
    setWinningLine([]);
    setLastMove(null);
    setMoveCount(0);
    moveCountRef.current = 0;
    setIsAiThinking(false);
    setIsUndoAnimating(false);
    setRetractingPositions([]);
    setUndoToast(null);
    setElapsedSeconds(0);
    elapsedRef.current = 0;
    setShowResultModal(false);
    setEndReason("normal");
    resetTimer(TURN_TIMER_SECONDS);
    setActiveMatch({
      matchId: newId,
      opponent: opponentName,
      status: "playing",
      startedAt: Date.now(),
      moveCount: 0,
    });
    savePersistedGame({
      matchId: newId,
      board: empty,
      currentTurn: PLAYER.human,
      status: "playing",
      winningLine: [],
      lastMove: null,
      moveCount: 0,
      moveHistory: [],
      undoCount: 0,
      elapsedSeconds: 0,
      turnSecondsLeft: TURN_TIMER_SECONDS,
      showResultModal: false,
    });
  }, [resetTimer]);

  const runAiTurn = useCallback(
    async (currentBoard: Board, movesSoFar: number, historyAfterHuman: MoveRecord[]) => {
      if (aiLock.current || statusRef.current !== "playing") return;
      aiLock.current = true;
      setIsAiThinking(true);

      try {
        const move = await computeAiMoveAsync(currentBoard, aiColor);
        if (statusRef.current !== "playing" || undoLock.current) return;

        const { board: nextBoard, result } = applyMove(currentBoard, move, aiColor);
        const aiRecord: MoveRecord = { pos: move, color: aiColor };
        const newHistory = [...historyAfterHuman, aiRecord];
        const newCount = movesSoFar + 1;
        moveCountRef.current = newCount;
        moveHistoryRef.current = newHistory;
        setBoard(nextBoard);
        setMoveHistory(newHistory);
        setLastMove(move);
        setMoveCount(newCount);

        if (result) {
          const mapped = mapResultForPlayer(result, humanColor);
          finishGame(mapped.playerStatus, mapped.winningLine, newCount, "normal");
        } else {
          setCurrentTurn(humanColor);
        }
      } finally {
        setIsAiThinking(false);
        aiLock.current = false;
      }
    },
    [aiColor, humanColor, finishGame],
  );

  const playHumanMove = useCallback(
    (row: number, col: number) => {
      if (
        statusRef.current !== "playing" ||
        currentTurn !== humanColor ||
        isAiThinking ||
        isUndoAnimating ||
        undoLock.current ||
        turnSecondsRef.current <= 0 ||
        !canPlayAt(board, row, col)
      ) {
        return;
      }

      const move: Position = { row, col };
      const { board: nextBoard, result } = applyMove(board, move, humanColor);
      const humanRecord: MoveRecord = { pos: move, color: humanColor };
      const newHistory = [...moveHistoryRef.current, humanRecord];
      const newCount = moveCount + 1;
      moveCountRef.current = newCount;
      moveHistoryRef.current = newHistory;
      setBoard(nextBoard);
      setMoveHistory(newHistory);
      setLastMove(move);
      setMoveCount(newCount);
      setWinningLine([]);

      if (result) {
        const mapped = mapResultForPlayer(result, humanColor);
        finishGame(mapped.playerStatus, mapped.winningLine, newCount, "normal");
        return;
      }

      setCurrentTurn(aiColor);
      void runAiTurn(nextBoard, newCount, newHistory);
    },
    [
      board,
      currentTurn,
      finishGame,
      humanColor,
      aiColor,
      isAiThinking,
      isUndoAnimating,
      moveCount,
      runAiTurn,
    ],
  );

  const canUndo = useMemo(() => {
    return (
      ready &&
      status === "playing" &&
      !isAiThinking &&
      !isUndoAnimating &&
      !undoLock.current &&
      undoRemaining > 0 &&
      moveHistory.length >= 2 &&
      currentTurn === humanColor
    );
  }, [
    ready,
    status,
    isAiThinking,
    isUndoAnimating,
    undoRemaining,
    moveHistory.length,
    currentTurn,
    humanColor,
  ]);

  const undoDisabledReason = useMemo(() => {
    if (status !== "playing") return "对局已结束";
    if (isAiThinking) return "AI 思考中";
    if (isUndoAnimating) return "悔棋进行中";
    if (undoRemaining <= 0) return "悔棋次数已用完";
    if (moveHistory.length < 2) return "尚无完整回合可悔";
    if (currentTurn !== humanColor) return "请等待 AI 落子";
    return undefined;
  }, [
    status,
    isAiThinking,
    isUndoAnimating,
    undoRemaining,
    moveHistory.length,
    currentTurn,
    humanColor,
  ]);

  const validMoves = useMemo(() => {
    if (
      !ready ||
      status !== "playing" ||
      currentTurn !== humanColor ||
      isAiThinking ||
      isUndoAnimating ||
      turnSecondsLeft <= 0
    ) {
      return [];
    }
    return getCandidateMoves(board);
  }, [
    board,
    currentTurn,
    humanColor,
    isAiThinking,
    isUndoAnimating,
    ready,
    status,
    turnSecondsLeft,
  ]);

  useEffect(() => {
    if (!ready || status !== "playing") return;
    const id = setInterval(() => {
      setElapsedSeconds((s) => {
        const next = s + 1;
        elapsedRef.current = next;
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [ready, status]);

  const resign = useCallback(() => {
    if (statusRef.current !== "playing") return;
    finishGame("lost", [], moveCountRef.current, "resign");
  }, [finishGame]);

  const applyUndoState = useCallback(
    (remaining: MoveRecord[]) => {
      const nextBoard = rebuildBoardFromHistory(remaining);
      const len = remaining.length;
      moveHistoryRef.current = remaining;
      moveCountRef.current = len;
      setBoard(nextBoard);
      setMoveHistory(remaining);
      setMoveCount(len);
      setLastMove(getLastMoveFromHistory(remaining));
      setCurrentTurn(humanColor);
      setWinningLine([]);
      setStatus("playing");
      statusRef.current = "playing";
      resetTimer(TURN_TIMER_SECONDS);
    },
    [humanColor, resetTimer],
  );

  const undoLast = useCallback(() => {
    if (
      undoLock.current ||
      statusRef.current !== "playing" ||
      isAiThinking ||
      undoCountRef.current >= MAX_UNDO_PER_GAME ||
      moveHistoryRef.current.length < 2 ||
      currentTurn !== humanColor
    ) {
      return;
    }

    undoLock.current = true;
    setIsUndoAnimating(true);

    const { remaining, removed } = popFullRound(moveHistoryRef.current);
    if (removed.length < 2) {
      undoLock.current = false;
      setIsUndoAnimating(false);
      return;
    }

    setRetractingPositions(removed.map((m) => m.pos));

    window.setTimeout(() => {
      const newUndoCount = undoCountRef.current + 1;
      undoCountRef.current = newUndoCount;
      setUndoCount(newUndoCount);
      applyUndoState(remaining);
      setRetractingPositions([]);
      setIsUndoAnimating(false);
      undoLock.current = false;
      setUndoToast(`悔棋成功 · 剩余 ${MAX_UNDO_PER_GAME - newUndoCount} 次`);
    }, UNDO_ANIM_MS);
  }, [isAiThinking, currentTurn, humanColor, applyUndoState]);

  const dismissUndoToast = useCallback(() => setUndoToast(null), []);

  return {
    ready,
    board,
    currentTurn,
    status,
    winningLine,
    lastMove,
    moveCount,
    moveHistory,
    undoCount,
    undoRemaining,
    maxUndo: MAX_UNDO_PER_GAME,
    canUndo,
    undoDisabledReason,
    isAiThinking,
    isUndoAnimating,
    retractingPositions,
    undoToast,
    dismissUndoToast,
    matchId,
    elapsedSeconds,
    showResultModal,
    setShowResultModal,
    endReason,
    turnSecondsLeft,
    timerUrgency,
    timerTurnOwner,
    totalTurnSeconds,
    validMoves,
    playHumanMove,
    resetGame,
    resign,
    undoLast,
    humanColor,
    aiColor,
  };
}
