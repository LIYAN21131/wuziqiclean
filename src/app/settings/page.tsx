"use client";

import { SettingsTab } from "@/features/lobby/components/SettingsTab";
import { HomeShell } from "@/shared/components/layout/HomeShell";

export default function SettingsPage() {
  return (
    <HomeShell title="设置" activeTab="settings">
      <SettingsTab />
    </HomeShell>
  );
}
