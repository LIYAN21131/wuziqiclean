"use client";

import { Icon } from "@/shared/components/ui/Icon";
import { MAX_UNDO_PER_GAME } from "@/shared/lib/constants";
import { cn } from "@/shared/lib/utils";

type GameActionBarProps = {
  onUndo: () => void;
  onResign: () => void;
  undoRemaining: number;
  undoMax?: number;
  undoDisabled?: boolean;
  undoDisabledReason?: string;
  isUndoAnimating?: boolean;
};

/** 底部操作栏 — 悔棋带剩余次数、认输等 */
export function GameActionBar({
  onUndo,
  onResign,
  undoRemaining,
  undoMax = MAX_UNDO_PER_GAME,
  undoDisabled,
  undoDisabledReason,
  isUndoAnimating,
}: GameActionBarProps) {
  const exhausted = undoRemaining <= 0;
  const undoBlocked = undoDisabled || exhausted || isUndoAnimating;

  const undoLabel = exhausted
    ? "已用完"
    : `悔棋 ${undoRemaining}/${undoMax}`;

  const actions = [
    {
      key: "undo",
      label: undoLabel,
      subLabel: exhausted ? "悔棋次数已用完" : undefined,
      icon: "undo",
      onClick: onUndo,
      disabled: undoBlocked,
      title: undoDisabledReason ?? (exhausted ? "悔棋次数已用完" : undefined),
    },
    {
      key: "resign",
      label: "认输",
      icon: "flag",
      onClick: onResign,
      disabled: false,
    },
    {
      key: "board",
      label: "对弈",
      icon: "grid_4x4",
      active: true,
      disabled: false,
    },
    {
      key: "chat",
      label: "发消息",
      icon: "chat_bubble",
      disabled: true,
    },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/50 bg-surface/90 pb-safe backdrop-blur-xl shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
      <div className="mx-auto flex max-w-lg items-end justify-around px-2 py-3">
        {actions.map((action) => (
          <button
            key={action.key}
            type="button"
            disabled={action.disabled}
            title={"title" in action ? action.title : undefined}
            onClick={"onClick" in action ? action.onClick : undefined}
            className={cn(
              "group flex min-w-[4.75rem] flex-col items-center gap-0.5 transition-all",
              action.disabled
                ? "cursor-not-allowed opacity-40"
                : "text-primary active:scale-95",
              action.key === "undo" &&
                !action.disabled &&
                "hover:-translate-y-0.5",
            )}
          >
            <span
              className={cn(
                "relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300",
                "active" in action && action.active && "bg-primary/15",
                action.key === "undo" &&
                  !action.disabled &&
                  "bg-primary/8 group-hover:bg-primary/15 group-hover:shadow-[0_4px_16px_rgba(183,16,42,0.15)]",
                action.key === "undo" && isUndoAnimating && "animate-pulse",
                action.key === "undo" && exhausted && "bg-surface-container-high",
              )}
            >
              <Icon
                name={action.icon}
                filled={"active" in action && action.active}
                className="text-2xl"
              />
              {action.key === "undo" && !exhausted && undoRemaining < undoMax && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-white shadow-sm">
                  {undoRemaining}
                </span>
              )}
            </span>
            <span
              className={cn(
                "max-w-[5rem] truncate text-center text-label font-medium leading-tight",
                action.key === "undo" && exhausted && "text-secondary",
              )}
            >
              {action.label}
            </span>
            {"subLabel" in action && action.subLabel && (
              <span className="max-w-[5.5rem] truncate text-[9px] leading-none text-secondary/80">
                {action.subLabel}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
