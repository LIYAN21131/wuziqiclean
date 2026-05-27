import { BOARD_SIZE } from "@/shared/lib/constants";
import type { Board, Cell, Position, StoneColor } from "./types";

export function createEmptyBoard(size = BOARD_SIZE): Board {
  return Array.from({ length: size }, () =>
    Array.from<Cell>({ length: size }).fill(null),
  );
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

export function isInBounds(row: number, col: number, size = BOARD_SIZE): boolean {
  return row >= 0 && row < size && col >= 0 && col < size;
}

export function boardSize(board: Board): number {
  return board.length;
}

export function getCell(board: Board, row: number, col: number): Cell {
  return board[row]?.[col] ?? null;
}

export function isEmpty(board: Board, row: number, col: number): boolean {
  return getCell(board, row, col) === null;
}

export function placeStone(
  board: Board,
  row: number,
  col: number,
  color: StoneColor,
): Board {
  const next = cloneBoard(board);
  next[row][col] = color;
  return next;
}

/** Cells within Chebyshev distance of any occupied intersection. */
export function getCandidateMoves(board: Board, radius = 2): Position[] {
  const size = boardSize(board);
  const occupied: Position[] = [];

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c]) occupied.push({ row: r, col: c });
    }
  }

  if (occupied.length === 0) {
    const mid = Math.floor(size / 2);
    return [{ row: mid, col: mid }];
  }

  const seen = new Set<string>();
  const moves: Position[] = [];

  for (const { row, col } of occupied) {
    for (let dr = -radius; dr <= radius; dr++) {
      for (let dc = -radius; dc <= radius; dc++) {
        const nr = row + dr;
        const nc = col + dc;
        const key = `${nr},${nc}`;
        if (!isInBounds(nr, nc, size) || board[nr][nc] || seen.has(key)) continue;
        seen.add(key);
        moves.push({ row: nr, col: nc });
      }
    }
  }

  return moves;
}
