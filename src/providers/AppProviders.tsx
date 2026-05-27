"use client";

import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { PresenceProvider } from "@/features/presence/context/PresenceProvider";
import { SettingsProvider } from "@/features/profile/context/SettingsProvider";
import { PwaStandaloneInit } from "@/shared/components/pwa/PwaStandaloneInit";

/** 应用级 Provider 组合 — layout 唯一入口 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <PresenceProvider>
        <PwaStandaloneInit />
        <AuthGuard>{children}</AuthGuard>
      </PresenceProvider>
    </SettingsProvider>
  );
}

export { useSettings, useUserProfile, AVATAR_PRESETS } from "@/features/profile/context/SettingsProvider";
export { usePresence } from "@/features/presence/context/PresenceProvider";
