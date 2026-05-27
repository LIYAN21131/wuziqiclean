import { isInBounds } from "@/features/game/lib/gomoku/board";
import type { Board, StoneColor } from "@/features/game/lib/gomoku/types";

/** 五子棋棋型枚举 — 权重由 PATTERN_WEIGHTS 定义 */
export enum PatternType {
  /** 五连（必胜） */
  FIVE = "FIVE",
  /** 活四：两端皆空，下一手必成五 */
  LIVE_FOUR = "LIVE_FOUR",
  /** 冲四：一端被挡，落子即五 */
  RUSH_FOUR = "RUSH_FOUR",
  /** 死四：两端被挡，无直接威胁 */
  DEAD_FOUR = "DEAD_FOUR",
  /** 活三：两端皆空，可发展为活四 */
  LIVE_THREE = "LIVE_THREE",
  /** 眠三：一端被挡的三连 */
  SLEEP_THREE = "SLEEP_THREE",
  /** 活二：两端皆空 */
  LIVE_TWO = "LIVE_TWO",
  /** 眠二 */
  SLEEP_TWO = "SLEEP_TWO",
  NONE = "NONE",
}

/**
 * 棋型权重表（活四 > 冲四 > 活三 > 眠三 > 活二）
 * 数值留足梯度，便于后续 Minimax 复用。
 */
export const PATTERN_WEIGHTS: Readonly<Record<PatternType, number>> = {
  [PatternType.FIVE]: 10_000_000,
  [PatternType.LIVE_FOUR]: 500_000,
  [PatternType.RUSH_FOUR]: 50_000,
  [PatternType.DEAD_FOUR]: 2_000,
  [PatternType.LIVE_THREE]: 8_000,
  [PatternType.SLEEP_THREE]: 800,
  [PatternType.LIVE_TWO]: 300,
  [PatternType.SLEEP_TWO]: 50,
  [PatternType.NONE]: 0,
};

/** 双活三、双冲四等复合威胁加成 */
export const COMBO_BONUSES = {
  doubleLiveThree: 45_000,
  doubleRushFour: 120_000,
  liveFourPlusLiveThree: 60_000,
} as const;

const DIRECTIONS: [number, number][] = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
];

/** 根据连子数与开放端数量归类棋型 */
export function classifyLine(count: number, openEnds: number): PatternType {
  if (count >= 5) return PatternType.FIVE;
  if (count === 4) {
    if (openEnds === 2) return PatternType.LIVE_FOUR;
    if (openEnds === 1) return PatternType.RUSH_FOUR;
    return PatternType.DEAD_FOUR;
  }
  if (count === 3) {
    if (openEnds === 2) return PatternType.LIVE_THREE;
    if (openEnds === 1) return PatternType.SLEEP_THREE;
    return PatternType.NONE;
  }
  if (count === 2) {
    if (openEnds === 2) return PatternType.LIVE_TWO;
    if (openEnds === 1) return PatternType.SLEEP_TWO;
    return PatternType.NONE;
  }
  return PatternType.NONE;
}

/**
 * 分析 (row,col) 在单一方向上的棋型。
 * 调用前须保证 board[row][col] === color。
 */
export function analyzeDirection(
  board: Board,
  row: number,
  col: number,
  dr: number,
  dc: number,
  color: StoneColor,
): PatternType {
  const size = board.length;
  let count = 1;
  let openEnds = 0;

  let r = row + dr;
  let c = col + dc;
  while (isInBounds(r, c, size) && board[r][c] === color) {
    count++;
    r += dr;
    c += dc;
  }
  if (isInBounds(r, c, size) && board[r][c] === null) openEnds++;

  r = row - dr;
  c = col - dc;
  while (isInBounds(r, c, size) && board[r][c] === color) {
    count++;
    r -= dr;
    c -= dc;
  }
  if (isInBounds(r, c, size) && board[r][c] === null) openEnds++;

  return classifyLine(count, openEnds);
}

export type MovePatternAnalysis = {
  patterns: PatternType[];
  score: number;
  liveFourCount: number;
  rushFourCount: number;
  liveThreeCount: number;
  hasFive: boolean;
};

/** 统计复合棋型加成 */
export function applyComboBonuses(analysis: Omit<MovePatternAnalysis, "score">): number {
  let bonus = 0;
  if (analysis.liveThreeCount >= 2) bonus += COMBO_BONUSES.doubleLiveThree;
  if (analysis.rushFourCount >= 2) bonus += COMBO_BONUSES.doubleRushFour;
  if (analysis.liveFourCount >= 1 && analysis.liveThreeCount >= 1) {
    bonus += COMBO_BONUSES.liveFourPlusLiveThree;
  }
  return bonus;
}

/** 在已落子棋盘上分析某点四个方向的棋型（不模拟落子） */
export function analyzePointPatterns(
  board: Board,
  row: number,
  col: number,
  color: StoneColor,
): MovePatternAnalysis {
  const patterns: PatternType[] = [];
  let baseScore = 0;

  for (const [dr, dc] of DIRECTIONS) {
    const p = analyzeDirection(board, row, col, dr, dc, color);
    patterns.push(p);
    baseScore += PATTERN_WEIGHTS[p];
  }

  const liveFourCount = patterns.filter((p) => p === PatternType.LIVE_FOUR).length;
  const rushFourCount = patterns.filter(
    (p) => p === PatternType.RUSH_FOUR || p === PatternType.DEAD_FOUR,
  ).length;
  const liveThreeCount = patterns.filter((p) => p === PatternType.LIVE_THREE).length;
  const hasFive = patterns.some((p) => p === PatternType.FIVE);

  const combo = applyComboBonuses({
    patterns,
    liveFourCount,
    rushFourCount,
    liveThreeCount,
    hasFive,
  });

  return {
    patterns,
    score: baseScore + combo,
    liveFourCount,
    rushFourCount,
    liveThreeCount,
    hasFive,
  };
}

export { DIRECTIONS };
