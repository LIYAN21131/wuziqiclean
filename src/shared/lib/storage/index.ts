/**
 * 统一 localStorage / sessionStorage 访问层
 * 所有持久化读写经此模块，便于后续接入服务端同步
 */
import { STORAGE_KEYS } from "@/shared/lib/constants";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function storageGet<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    // 兼容旧版未 JSON 序列化的 plain string / number
    const asNumber = Number(raw);
    if (!Number.isNaN(asNumber) && raw.trim() !== "") return asNumber as T;
    return raw as unknown as T;
  }
}

export function storageSet(key: string, value: unknown): void {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function storageRemove(key: string): void {
  if (!isBrowser()) return;
  localStorage.removeItem(key);
}

export function sessionGet(key: string): string | null {
  if (!isBrowser()) return null;
  return sessionStorage.getItem(key);
}

export function sessionSet(key: string, value: string): void {
  if (!isBrowser()) return;
  sessionStorage.setItem(key, value);
}

export function sessionRemove(key: string): void {
  if (!isBrowser()) return;
  sessionStorage.removeItem(key);
}

export { STORAGE_KEYS };
