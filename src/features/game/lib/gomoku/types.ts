export type StoneColor = "black" | "white";

export type Cell = StoneColor | null;

export type Board = Cell[][];

export type Position = { row: number; col: number };

/** 有序落子记录（悔棋 / 回放） */
export type MoveRecord = {
  pos: Position;
  color: StoneColor;
};

export type GameStatus = "playing" | "won" | "lost" | "draw";

export type GameResult = {
  status: Exclude<GameStatus, "playing">;
  winner: StoneColor | null;
  winningLine: Position[];
};

export type GameMode = "pve";
