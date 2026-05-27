import { createEmptyBoard, placeStone } from "@/features/game/lib/gomoku/board";
import type { Board, MoveRecord, Position, StoneColor } from "@/features/game/lib/gomoku/types";

/** 从落子历史重建棋盘 */
export function rebuildBoardFromHistory(moves: MoveRecord[]): Board {
  let board = createEmptyBoard();
  for (const { pos, color } of moves) {
    board = placeStone(board, pos.row, pos.col, color);
  }
  return board;
}

/** 悔棋：回退一个完整回合（人类 + AI 各一步） */
export function popFullRound(moves: MoveRecord[]): {
  remaining: MoveRecord[];
  removed: MoveRecord[];
} {
  if (moves.length < 2) {
    return { remaining: moves, removed: [] };
  }
  return {
    remaining: moves.slice(0, -2),
    removed: moves.slice(-2),
  };
}

/** 历史最后一手 */
export function getLastMoveFromHistory(moves: MoveRecord[]): Position | null {
  if (moves.length === 0) return null;
  return moves[moves.length - 1].pos;
}

/** 校验历史与棋盘手数一致 */
export function isHistoryConsistent(moves: MoveRecord[], moveCount: number): boolean {
  return moves.length === moveCount;
}

/** 从棋盘推断历史（仅用于旧存档迁移，按行列扫描交替色） */
export function inferHistoryFromBoard(board: Board, humanColor: StoneColor): MoveRecord[] {
  const aiColor: StoneColor = humanColor === "black" ? "white" : "black";
  const stones: Position[] = [];
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c]) stones.push({ row: r, col: c });
    }
  }
  return stones.map((pos, i) => ({
    pos,
    color: i % 2 === 0 ? humanColor : aiColor,
  }));
}
