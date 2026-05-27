"use client";

import { RankTab } from "@/features/lobby/components/RankTab";
import { HomeShell } from "@/shared/components/layout/HomeShell";

export default function RankPage() {
  return (
    <HomeShell title="排行榜" activeTab="rank">
      <RankTab />
    </HomeShell>
  );
}
