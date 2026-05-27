import { AI_THINK_MAX_MS, AI_THINK_MIN_MS } from "@/shared/lib/constants";
import type { Board, Position, StoneColor } from "@/features/game/lib/gomoku/types";
import { getBestMove, pickAiMove } from "./getBestMove";

export { getBestMove, pickAiMove } from "./getBestMove";
export { evaluateBoardPosition, evaluateMove, findWinningMoves } from "./evaluateBoard";
export { PatternType, PATTERN_WEIGHTS } from "./scorePatterns";

/** AI 思考延迟 300ms ~ 1200ms（随机） */
export function getAiThinkDelay(): number {
  return AI_THINK_MIN_MS + Math.random() * (AI_THINK_MAX_MS - AI_THINK_MIN_MS);
}

/** 异步包装：UI 展示「思考中」后再返回落点 */
export async function computeAiMoveAsync(
  board: Board,
  aiColor: StoneColor,
): Promise<Position> {
  await new Promise((resolve) => setTimeout(resolve, getAiThinkDelay()));
  return pickAiMove(board, aiColor);
}

/** 调试：返回落点及决策原因 */
export async function computeAiMoveWithReasonAsync(
  board: Board,
  aiColor: StoneColor,
) {
  await new Promise((resolve) => setTimeout(resolve, getAiThinkDelay()));
  return getBestMove(board, aiColor);
}
