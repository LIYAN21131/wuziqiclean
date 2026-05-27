"use client";

import { RoomTab } from "@/features/lobby/components/RoomTab";
import { HomeShell } from "@/shared/components/layout/HomeShell";

export default function RoomPage() {
  return (
    <HomeShell title="我的房间" activeTab="room">
      <RoomTab />
    </HomeShell>
  );
}
