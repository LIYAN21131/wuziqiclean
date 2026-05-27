"use client";

import { Icon } from "@/shared/components/ui/Icon";
import { cn } from "@/shared/lib/utils";
import Link from "next/link";

export type NavTab = "battle" | "room" | "rank" | "settings";

type BottomNavProps = {
  active: NavTab;
  className?: string;
  dimmed?: boolean;
};

const tabs: { id: NavTab; label: string; icon: string; href: string }[] = [
  { id: "battle", label: "对战", icon: "grid_4x4", href: "/lobby" },
  { id: "room", label: "房间", icon: "meeting_room", href: "/room" },
  { id: "rank", label: "排行", icon: "leaderboard", href: "/rank" },
  { id: "settings", label: "设置", icon: "settings", href: "/settings" },
];

export function BottomNav({ active, className, dimmed }: BottomNavProps) {
  return (
    <nav
      className={cn(
        "fixed bottom-0 z-50 flex h-20 w-full items-center justify-around border-t border-white/50 bg-surface/80 px-4 pb-safe backdrop-blur-xl shadow-[0_-10px_40px_rgba(0,0,0,0.04)]",
        dimmed && "pointer-events-none opacity-50",
        className,
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 transition-transform active:scale-90",
              isActive ? "font-semibold text-primary" : "text-secondary",
            )}
          >
            <Icon name={tab.icon} filled={isActive} className="text-2xl" />
            <span className="text-caption tracking-wide">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
