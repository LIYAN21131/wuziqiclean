import { normalizeSignature } from "@/features/profile/lib/signature";
import { STORAGE_KEYS } from "@/shared/lib/constants";
import { storageGet, storageSet } from "@/shared/lib/storage";
import { AVATAR_PRESETS, DEFAULT_SETTINGS, getAvatarPresetById } from "./defaults";
import type { UserSettings } from "./types";

export function loadSettings(): UserSettings {
  const parsed = storageGet<Partial<UserSettings> | null>(STORAGE_KEYS.userSettings, null);
  if (!parsed) return { ...DEFAULT_SETTINGS };
  const avatarId = AVATAR_PRESETS.some((a) => a.id === parsed.avatarId)
    ? parsed.avatarId!
    : DEFAULT_SETTINGS.avatarId;
  const signature = normalizeSignature(parsed.signature, DEFAULT_SETTINGS.signature);
  return { ...DEFAULT_SETTINGS, ...parsed, avatarId, signature };
}

export function saveSettings(settings: UserSettings): void {
  const normalized: UserSettings = {
    ...settings,
    signature: normalizeSignature(settings.signature, DEFAULT_SETTINGS.signature),
    displayName: settings.displayName.trim() || DEFAULT_SETTINGS.displayName,
  };
  storageSet(STORAGE_KEYS.userSettings, normalized);
  storageSet(STORAGE_KEYS.displayName, normalized.displayName);
}

export function getAvatarUrl(avatarId: string): string {
  return getAvatarPresetById(avatarId).url;
}

/** 登录成功后合并 displayName，保留其余设置 */
export function mergeDisplayNameOnLogin(username: string): void {
  const base = storageGet<Partial<UserSettings>>(STORAGE_KEYS.userSettings, {});
  const displayName = username === "test" ? "魏大师" : username;
  storageSet(STORAGE_KEYS.userSettings, { ...base, displayName });
}
