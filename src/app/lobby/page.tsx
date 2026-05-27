"use client";

import { BattleTab } from "@/features/lobby/components/BattleTab";
import { HomeShell } from "@/shared/components/layout/HomeShell";

export default function LobbyPage() {
  return (
    <HomeShell title="新建对局" activeTab="battle">
      <BattleTab />
    </HomeShell>
  );
}
