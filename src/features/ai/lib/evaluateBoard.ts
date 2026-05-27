import { boardSize, getCandidateMoves, isInBounds, placeStone } from "@/features/game/lib/gomoku/board";
import { applyMove, canPlayAt } from "@/features/game/lib/gomoku/game-engine";
import type { Board, Position, StoneColor } from "@/features/game/lib/gomoku/types";
import {
  analyzePointPatterns,
  PatternType,
  PATTERN_WEIGHTS,
  type MovePatternAnalysis,
} from "./scorePatterns";

export type MoveScore = {
  position: Position;
  /** 进攻分（AI 自身棋型） */
  attack: number;
  /** 防守分（阻止对手在此落子的价值） */
  defense: number;
  /** 综合分 */
  total: number;
  /** 落子后是否给对手一手必胜 */
  allowsOpponentWin: boolean;
  analysis: MovePatternAnalysis;
  defenseAnalysis: MovePatternAnalysis;
};

/** 查找所有一手成五的落点 */
export function findWinningMoves(board: Board, color: StoneColor): Position[] {
  const wins: Position[] = [];
  for (const move of getCandidateMoves(board)) {
    if (!canPlayAt(board, move.row, move.col)) continue;
    const { result } = applyMove(board, move, color);
    if (result?.winner === color) wins.push(move);
  }
  return wins;
}

/** 查找对手下一手能形成的活四落点（高威胁） */
export function findLiveFourThreats(board: Board, color: StoneColor): Position[] {
  const threats: Position[] = [];
  for (const move of getCandidateMoves(board)) {
    if (!canPlayAt(board, move.row, move.col)) continue;
    const simulated = placeStone(board, move.row, move.col, color);
    const { liveFourCount, hasFive } = analyzePointPatterns(
      simulated,
      move.row,
      move.col,
      color,
    );
    if (hasFive || liveFourCount > 0) threats.push(move);
  }
  return threats;
}

/** 落子后是否让对手下一手直接获胜 */
export function moveAllowsOpponentWin(
  board: Board,
  move: Position,
  aiColor: StoneColor,
): boolean {
  const opponent: StoneColor = aiColor === "black" ? "white" : "black";
  const after = placeStone(board, move.row, move.col, aiColor);
  return findWinningMoves(after, opponent).length > 0;
}

/**
 * 评估单步落子的进攻/防守价值。
 * 模拟在 (row,col) 落子后分析棋型，不修改原棋盘。
 */
export function evaluateMove(
  board: Board,
  move: Position,
  color: StoneColor,
): MoveScore {
  const { row, col } = move;
  const opponent: StoneColor = color === "black" ? "white" : "black";

  const attackBoard = placeStone(board, row, col, color);
  const analysis = analyzePointPatterns(attackBoard, row, col, color);

  const defenseBoard = placeStone(board, row, col, opponent);
  const defenseAnalysis = analyzePointPatterns(defenseBoard, row, col, opponent);

  const attack = analysis.score;
  let defense = defenseAnalysis.score;

  // 冲四/活四威胁额外加权（防守侧更敏感）
  if (defenseAnalysis.patterns.some((p) => p === PatternType.RUSH_FOUR)) {
    defense += PATTERN_WEIGHTS[PatternType.RUSH_FOUR] * 0.5;
  }
  if (defenseAnalysis.liveFourCount > 0) {
    defense += PATTERN_WEIGHTS[PatternType.LIVE_FOUR];
  }

  const allowsOpponentWin = moveAllowsOpponentWin(board, move, color);

  // 给对手留一手必胜 — 极大惩罚（除非无法避免）
  const penalty = allowsOpponentWin ? PATTERN_WEIGHTS[PatternType.FIVE] * 0.8 : 0;

  // 进攻略低于防守权重，确保优先拦截
  const total = attack + defense * 1.08 - penalty;

  return {
    position: move,
    attack,
    defense,
    total,
    allowsOpponentWin,
    analysis,
    defenseAnalysis,
  };
}

/** 局势评估：当前棋盘对某颜色的整体分数（用于后续 Minimax 叶子节点） */
export function evaluateBoardPosition(board: Board, color: StoneColor): number {
  const opponent: StoneColor = color === "black" ? "white" : "black";
  const size = boardSize(board);
  let selfScore = 0;
  let oppScore = 0;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] === color) {
        selfScore += analyzePointPatterns(board, r, c, color).score * 0.15;
      } else if (board[r][c] === opponent) {
        oppScore += analyzePointPatterns(board, r, c, opponent).score * 0.15;
      }
    }
  }

  return selfScore - oppScore;
}

/** 靠近已有棋子的距离加成 + 天元倾向，避免边缘乱下 */
export function proximityBonus(board: Board, move: Position): number {
  const size = boardSize(board);
  let minDist = Infinity;
  let stoneCount = 0;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!board[r][c]) continue;
      stoneCount++;
      const d = Math.max(Math.abs(r - move.row), Math.abs(c - move.col));
      minDist = Math.min(minDist, d);
    }
  }

  if (stoneCount === 0) {
    const mid = (size - 1) / 2;
    return 120 - Math.abs(move.row - mid) - Math.abs(move.col - mid);
  }

  // 距离已有棋子越近越好（候选集已限制在 radius 2 内）
  let bonus = minDist === 1 ? 40 : minDist === 2 ? 20 : 0;

  // 轻微惩罚贴边（无邻居时）
  const edgeDist =
    Math.min(move.row, move.col, size - 1 - move.row, size - 1 - move.col);
  if (edgeDist <= 1 && minDist > 1) bonus -= 30;

  return bonus;
}

/** 稳定排序用的 tie-break key（确定性，非随机） */
export function moveTieBreak(board: Board, move: Position): number {
  const size = boardSize(board);
  const mid = (size - 1) / 2;
  const centerBias = 100 - Math.abs(move.row - mid) - Math.abs(move.col - mid);
  return centerBias + proximityBonus(board, move) * 0.1;
}

/** 判断某点是否在棋盘边缘 */
export function isEdgeCell(board: Board, move: Position, margin = 1): boolean {
  const size = boardSize(board);
  return (
    move.row <= margin ||
    move.col <= margin ||
    move.row >= size - 1 - margin ||
    move.col >= size - 1 - margin
  );
}

/** 过滤远离棋局的边缘落点（当已有棋子时） */
export function filterMeaningfulMoves(board: Board, moves: Position[]): Position[] {
  const size = boardSize(board);
  let hasStones = false;
  for (let r = 0; r < size && !hasStones; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c]) {
        hasStones = true;
        break;
      }
    }
  }
  if (!hasStones) return moves;

  return moves.filter((m) => {
    if (!isEdgeCell(board, m)) return true;
    // 边缘点仅当紧邻已有棋子时保留
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = m.row + dr;
        const nc = m.col + dc;
        if (isInBounds(nr, nc, size) && board[nr][nc]) return true;
      }
    }
    return false;
  });
}
