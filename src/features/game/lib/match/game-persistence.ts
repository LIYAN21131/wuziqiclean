import { STORAGE_KEYS } from "@/shared/lib/constants";
import { storageGet, storageRemove, storageSet } from "@/shared/lib/storage";
import type { Board, GameStatus, MoveRecord, Position, StoneColor } from "@/features/game/lib/gomoku/types";

export type PersistedGameState = {
  matchId: string;
  board: Board;
  currentTurn: StoneColor;
  status: GameStatus;
  winningLine: Position[];
  lastMove: Position | null;
  moveCount: number;
  moveHistory?: MoveRecord[];
  undoCount?: number;
  elapsedSeconds: number;
  turnSecondsLeft: number;
  showResultModal: boolean;
};

export function loadPersistedGame(): PersistedGameState | null {
  return storageGet<PersistedGameState | null>(STORAGE_KEYS.gameState, null);
}

export function savePersistedGame(state: PersistedGameState): void {
  storageSet(STORAGE_KEYS.gameState, state);
}

export function clearPersistedGame(): void {
  storageRemove(STORAGE_KEYS.gameState);
}
