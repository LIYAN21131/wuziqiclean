import { STORAGE_KEYS } from "@/shared/lib/constants";
import { sessionGet, sessionRemove, sessionSet } from "@/shared/lib/storage";

export function setLoggedIn(username: string): void {
  sessionSet(STORAGE_KEYS.authSession, username);
}

export function clearLoggedIn(): void {
  sessionRemove(STORAGE_KEYS.authSession);
}

export function isLoggedIn(): boolean {
  return !!sessionGet(STORAGE_KEYS.authSession);
}

export function getLoggedInUser(): string | null {
  return sessionGet(STORAGE_KEYS.authSession);
}
