"use client";

import { StitchHeader } from "@/shared/components/layout/StitchHeader";
import { BottomNav, type NavTab } from "@/shared/components/layout/BottomNav";
import type { ReactNode } from "react";

type HomeShellProps = {
  title: string;
  activeTab: NavTab;
  children: ReactNode;
  showMenu?: boolean;
};

/** 原型大厅壳层：水印 + 顶栏 + 内容 + 底栏 */
export function HomeShell({
  title,
  activeTab,
  children,
  showMenu = true,
}: HomeShellProps) {
  return (
    <div className="relative min-h-app bg-background">
      <div className="watermark-ly" aria-hidden>
        LY制作
      </div>
      <StitchHeader title={title} showMenu={showMenu} showPlayerChip />
      <main className="relative z-10 mx-auto min-h-app max-w-xl px-4 px-safe pb-nav-safe pt-[calc(6rem+env(safe-area-inset-top,0px))]">
        {children}
      </main>
      <BottomNav active={activeTab} />
    </div>
  );
}
