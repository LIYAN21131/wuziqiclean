"use client";

import { FontScaleController } from "@/features/profile/components/FontScaleController";
import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import type { UserProfile } from "@/features/profile/lib/types";
import { DEFAULT_SETTINGS } from "@/features/profile/lib/settings/defaults";
import { getAvatarUrl, loadSettings, saveSettings } from "@/features/profile/lib/settings/storage";
import { applyFontTheme } from "@/shared/theme/font-theme";
import type { UserSettings } from "@/features/profile/lib/settings/types";

type SettingsContextValue = {
  settings: UserSettings;
  /** 派生的玩家资料 — 各页面统一使用，避免重复状态 */
  profile: UserProfile;
  avatarUrl: string;
  updateSettings: (patch: Partial<UserSettings>) => void;
  resetSettings: () => void;
  /** 客户端已完成 hydration / localStorage 恢复 */
  hydrated: boolean;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

function isLoginPath(): boolean {
  return typeof window !== "undefined" && window.location.pathname === "/";
}

function buildProfile(settings: UserSettings, avatarUrl: string): UserProfile {
  return {
    displayName: settings.displayName.trim() || DEFAULT_SETTINGS.displayName,
    signature: settings.signature,
    avatarId: settings.avatarId,
    avatarUrl,
  };
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);

  useLayoutEffect(() => {
    const loaded = loadSettings();
    setSettings(loaded);
    applyFontTheme(loaded, { isLoginPage: isLoginPath() });
    setHydrated(true);
  }, []);

  const updateSettings = useCallback((patch: Partial<UserSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveSettings(next);
      applyFontTheme(next, { isLoginPage: isLoginPath() });
      return next;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    saveSettings(DEFAULT_SETTINGS);
    applyFontTheme(DEFAULT_SETTINGS, { isLoginPage: isLoginPath() });
  }, []);

  const avatarUrl = useMemo(
    () => getAvatarUrl(settings.avatarId),
    [settings.avatarId],
  );

  const profile = useMemo(
    () => buildProfile(settings, avatarUrl),
    [settings, avatarUrl],
  );

  const value = useMemo(
    () => ({
      settings,
      profile,
      avatarUrl,
      updateSettings,
      resetSettings,
      hydrated,
    }),
    [settings, profile, avatarUrl, updateSettings, resetSettings, hydrated],
  );

  return (
    <SettingsContext.Provider value={value}>
      <FontScaleController />
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}

/** 玩家资料快捷 Hook — 签名/昵称/头像全局唯一来源 */
export function useUserProfile(): UserProfile {
  return useSettings().profile;
}

export { AVATAR_PRESETS } from "@/features/profile/lib/settings/defaults";
