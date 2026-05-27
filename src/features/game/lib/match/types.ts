export type MatchResult = "win" | "loss" | "draw";

export type MatchRecord = {
  id: string;
  opponent: string;
  result: MatchResult;
  durationSeconds: number;
  moveCount: number;
  finishedAt: number;
};

export type ActiveMatch = {
  matchId: string;
  opponent: string;
  status: "playing";
  startedAt: number;
  moveCount: number;
};

export type PlayerPresence = "playing" | "idle";
