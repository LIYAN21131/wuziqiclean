import { isInBounds } from "./board";
import type { Board, Position, StoneColor } from "./types";

const DIRECTIONS: [number, number][] = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
];

export function getWinningLine(
  board: Board,
  row: number,
  col: number,
  color: StoneColor,
  winLength = 5,
): Position[] | null {
  if (board[row][col] !== color) return null;

  for (const [dr, dc] of DIRECTIONS) {
    const line: Position[] = [{ row, col }];
    let r = row + dr;
    let c = col + dc;
    const size = board.length;

    while (isInBounds(r, c, size) && board[r][c] === color) {
      line.push({ row: r, col: c });
      r += dr;
      c += dc;
    }

    r = row - dr;
    c = col - dc;
    while (isInBounds(r, c, size) && board[r][c] === color) {
      line.unshift({ row: r, col: c });
      r -= dr;
      c -= dc;
    }

    if (line.length >= winLength) return line;
  }

  return null;
}

export function checkWin(
  board: Board,
  row: number,
  col: number,
  color: StoneColor,
): Position[] | null {
  return getWinningLine(board, row, col, color);
}

export function isBoardFull(board: Board): boolean {
  return board.every((row) => row.every((cell) => cell !== null));
}

export function countLineScore(
  board: Board,
  row: number,
  col: number,
  dr: number,
  dc: number,
  color: StoneColor,
): number {
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

  return scorePattern(count, openEnds);
}

function scorePattern(count: number, openEnds: number): number {
  if (count >= 5) return 100_000;
  if (count === 4) {
    if (openEnds === 2) return 10_000;
    if (openEnds === 1) return 1_000;
    return 100;
  }
  if (count === 3) {
    if (openEnds === 2) return 500;
    if (openEnds === 1) return 50;
    return 10;
  }
  if (count === 2 && openEnds === 2) return 20;
  if (count === 2 && openEnds === 1) return 5;
  return count;
}
