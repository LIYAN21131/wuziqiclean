import { placeStone, getCandidateMoves } from "./board";
import { checkWin, isBoardFull } from "./win-check";
import type { Board, GameResult, Position, StoneColor } from "./types";

export function applyMove(
  board: Board,
  position: Position,
  color: StoneColor,
): { board: Board; result: GameResult | null } {
  const { row, col } = position;
  const nextBoard = placeStone(board, row, col, color);
  const winningLine = checkWin(nextBoard, row, col, color);

  if (winningLine) {
    return {
      board: nextBoard,
      result: { status: "won", winner: color, winningLine },
    };
  }

  if (isBoardFull(nextBoard)) {
    return {
      board: nextBoard,
      result: { status: "draw", winner: null, winningLine: [] },
    };
  }

  return { board: nextBoard, result: null };
}

export function canPlayAt(board: Board, row: number, col: number): boolean {
  return (
    row >= 0 &&
    row < board.length &&
    col >= 0 &&
    col < board[0].length &&
    board[row][col] === null
  );
}

export function getLegalMoves(board: Board): Position[] {
  return getCandidateMoves(board).filter(({ row, col }) => canPlayAt(board, row, col));
}

/** Map engine win result to human-centric status. */
export function mapResultForPlayer(
  result: GameResult,
  humanColor: StoneColor,
): GameResult & { playerStatus: "won" | "lost" | "draw" } {
  if (result.status === "draw") {
    return { ...result, playerStatus: "draw" };
  }
  const playerWon = result.winner === humanColor;
  return {
    ...result,
    status: playerWon ? "won" : "lost",
    playerStatus: playerWon ? "won" : "lost",
  };
}
