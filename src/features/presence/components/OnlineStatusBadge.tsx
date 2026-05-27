"use client";

import { usePresence } from "@/features/presence/context/PresenceProvider";
import { PRESENCE_DOT_CLASS } from "@/features/presence/lib/types";
import { cn } from "@/shared/lib/utils";

type OnlineStatusBadgeProps = {
  className?: string;
  /** 仅显示圆点 */
  dotOnly?: boolean;
  size?: "sm" | "md";
};

/** 全局在线状态徽章 — 绿点在线 / 灰点离线 */
export function OnlineStatusBadge({
  className,
  dotOnly = false,
  size = "md",
}: OnlineStatusBadgeProps) {
  const { status, label } = usePresence();
  const isOnline = status === "online";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 transition-opacity duration-500",
        className,
      )}
    >
      <span
        className={cn(
          "shrink-0 rounded-full border-2 border-white transition-all duration-500",
          size === "sm" ? "h-2 w-2" : "h-2.5 w-2.5",
          PRESENCE_DOT_CLASS[status],
          isOnline && "animate-presence-pulse",
        )}
        aria-hidden
      />
      {!dotOnly && (
        <span
          className={cn(
            "text-caption font-medium transition-colors duration-500",
            isOnline ? "text-emerald-600" : "text-secondary",
          )}
        >
          {label}
        </span>
      )}
    </span>
  );
}

/** 供 Avatar 使用的在线状态点 className */
export function usePresenceDotClassName(): string {
  const { status } = usePresence();
  return cn(
    PRESENCE_DOT_CLASS[status],
    status === "online" && "animate-presence-pulse",
  );
}
