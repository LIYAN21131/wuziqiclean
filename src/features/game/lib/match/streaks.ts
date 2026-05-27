import { STORAGE_KEYS } from "@/shared/lib/constants";
import { storageGet, storageSet } from "@/shared/lib/storage";

export function getWinStreak(): number {
  return storageGet<number>(STORAGE_KEYS.winStreak, 0);
}

export function getBestStreak(): number {
  return storageGet<number>(STORAGE_KEYS.bestStreak, 0);
}

/** 对局结束后更新连胜 / 最佳连胜 */
export function updateStreaksOnGameEnd(playerWon: boolean): { winStreak: number; bestStreak: number } {
  if (playerWon) {
    const winStreak = getWinStreak() + 1;
    storageSet(STORAGE_KEYS.winStreak, winStreak);
    const prevBest = getBestStreak();
    const bestStreak = Math.max(prevBest, winStreak);
    if (bestStreak > prevBest) {
      storageSet(STORAGE_KEYS.bestStreak, bestStreak);
    }
    return { winStreak, bestStreak };
  }
  storageSet(STORAGE_KEYS.winStreak, 0);
  return { winStreak: 0, bestStreak: getBestStreak() };
}
