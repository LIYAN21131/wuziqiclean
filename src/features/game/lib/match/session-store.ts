import { STORAGE_KEYS } from "@/shared/lib/constants";
import { storageGet, storageRemove, storageSet } from "@/shared/lib/storage";
import type { ActiveMatch, MatchRecord } from "./types";

const MAX_HISTORY = 20;

export function getActiveMatch(): ActiveMatch | null {
  return storageGet<ActiveMatch | null>(STORAGE_KEYS.activeMatch, null);
}

export function setActiveMatch(match: ActiveMatch | null): void {
  if (match) {
    storageSet(STORAGE_KEYS.activeMatch, match);
  } else {
    storageRemove(STORAGE_KEYS.activeMatch);
  }
}

export function updateActiveMatchProgress(moveCount: number): void {
  const active = getActiveMatch();
  if (!active) return;
  setActiveMatch({ ...active, moveCount });
}

export function getMatchHistory(): MatchRecord[] {
  return storageGet<MatchRecord[]>(STORAGE_KEYS.matchHistory, []);
}

export function addMatchRecord(record: MatchRecord): void {
  const history = getMatchHistory();
  history.unshift(record);
  storageSet(STORAGE_KEYS.matchHistory, history.slice(0, MAX_HISTORY));
}

export function clearActiveAndArchive(record: MatchRecord): void {
  setActiveMatch(null);
  addMatchRecord(record);
}
