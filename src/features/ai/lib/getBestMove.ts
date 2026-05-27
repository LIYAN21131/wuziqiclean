import { getCandidateMoves } from "@/features/game/lib/gomoku/board";
import { canPlayAt } from "@/features/game/lib/gomoku/game-engine";
import type { Board, Position, StoneColor } from "@/features/game/lib/gomoku/types";
import {
  evaluateMove,
  filterMeaningfulMoves,
  findLiveFourThreats,
  findWinningMoves,
  moveTieBreak,
  proximityBonus,
  type MoveScore,
} from "./evaluateBoard";
import { PatternType, PATTERN_WEIGHTS } from "./scorePatterns";

export type AiDecision = {
  move: Position;
  reason:
    | "win"
    | "block_win"
    | "create_live_four"
    | "block_live_four"
    | "best_score";
  score: number;
};

function opponentOf(color: StoneColor): StoneColor {
  return color === "black" ? "white" : "black";
}

function posKey(p: Position): string {
  return `${p.row},${p.col}`;
}

function pickBestByScore(scored: MoveScore[], board: Board): Position {
  scored.sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total;
    return moveTieBreak(board, b.position) - moveTieBreak(board, a.position);
  });
  return scored[0].position;
}

/**
 * 在必须防守点中，选同时具有进攻价值的点（如冲四反杀）。
 */
function pickBestBlock(
  board: Board,
  blockPoints: Position[],
  aiColor: StoneColor,
): Position {
  if (blockPoints.length === 1) return blockPoints[0];

  const scored = blockPoints.map((p) => evaluateMove(board, p, aiColor));
  return pickBestByScore(scored, board);
}

/**
 * AI 核心决策 — 优先级：
 * 1. 立即获胜
 * 2. 阻止对手立即获胜
 * 3. 创造活四
 * 4. 阻止对手活四
 * 5. 综合棋型评分（进攻 + 防守 - 送杀惩罚）
 *
 * 设计为纯函数，便于后续接入 Minimax / Alpha-Beta。
 */
export function getBestMove(board: Board, aiColor: StoneColor): AiDecision {
  const opponent = opponentOf(aiColor);
  const mid = Math.floor(board.length / 2);
  const fallback: Position = { row: mid, col: mid };

  // --- 1. 立即获胜 ---
  const winMoves = findWinningMoves(board, aiColor);
  if (winMoves.length > 0) {
    return {
      move: pickBestBlock(board, winMoves, aiColor),
      reason: "win",
      score: PATTERN_WEIGHTS[PatternType.FIVE],
    };
  }

  // --- 2. 阻止对手立即获胜（绝不允许漏防） ---
  const blockMoves = findWinningMoves(board, opponent);
  if (blockMoves.length > 0) {
    return {
      move: pickBestBlock(board, blockMoves, aiColor),
      reason: "block_win",
      score: PATTERN_WEIGHTS[PatternType.FIVE],
    };
  }

  const rawCandidates = getCandidateMoves(board).filter((m) =>
    canPlayAt(board, m.row, m.col),
  );
  const candidates = filterMeaningfulMoves(board, rawCandidates);

  if (candidates.length === 0) {
    return { move: fallback, reason: "best_score", score: 0 };
  }

  const scored: MoveScore[] = candidates.map((m) => evaluateMove(board, m, aiColor));

  // --- 3. 创造活四（下一手必胜） ---
  const liveFourMoves = scored.filter(
    (s) => s.analysis.liveFourCount > 0 && !s.allowsOpponentWin,
  );
  if (liveFourMoves.length > 0) {
    const move = pickBestByScore(liveFourMoves, board);
    return {
      move,
      reason: "create_live_four",
      score: PATTERN_WEIGHTS[PatternType.LIVE_FOUR],
    };
  }

  // --- 4. 阻止对手一手活四 ---
  const oppLiveFour = findLiveFourThreats(board, opponent);
  if (oppLiveFour.length > 0) {
    const blockSet = new Set(oppLiveFour.map(posKey));
    const blockingScored = scored.filter((s) => blockSet.has(posKey(s.position)));
    if (blockingScored.length > 0) {
      return {
        move: pickBestByScore(blockingScored, board),
        reason: "block_live_four",
        score: PATTERN_WEIGHTS[PatternType.LIVE_FOUR],
      };
    }
    // 威胁点不在候选集时，直接防最近威胁点
    return {
      move: pickBestBlock(board, oppLiveFour, aiColor),
      reason: "block_live_four",
      score: PATTERN_WEIGHTS[PatternType.LIVE_FOUR],
    };
  }

  // --- 5. 综合评分：优先无送杀的高分点 ---
  const safe = scored.filter((s) => !s.allowsOpponentWin);
  const pool = safe.length > 0 ? safe : scored;

  // 加入距离加成
  for (const s of pool) {
    s.total += proximityBonus(board, s.position);
  }

  const best = pickBestByScore(pool, board);
  const bestEntry = pool.find((s) => posKey(s.position) === posKey(best))!;

  return {
    move: best,
    reason: "best_score",
    score: bestEntry.total,
  };
}

/** 对外统一入口（同步） */
export function pickAiMove(board: Board, aiColor: StoneColor): Position {
  return getBestMove(board, aiColor).move;
}
