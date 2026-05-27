"use client";

import { Icon } from "@/shared/components/ui/Icon";
import { getBestStreak } from "@/features/game/lib/match/streaks";
import { cn, formatDuration } from "@/shared/lib/utils";
import type { GameEndReason } from "@/shared/types";
import { useEffect, useState } from "react";

type GameOverModalProps = {
  open: boolean;
  won: boolean;
  draw?: boolean;
  endReason?: GameEndReason;
  elapsedSeconds: number;
  moveCount: number;
  onPlayAgain: () => void;
  onViewBoard: () => void;
  onClose: () => void;
};

function getEndMessage(won: boolean, draw: boolean | undefined, endReason: GameEndReason) {
  if (draw) return "势均力敌，再来一局分出胜负。";
  if (won) {
    if (endReason === "ai_timeout") return "AI 超时，胜利属于你。";
    return "大师，胜利属于你。";
  }
  if (endReason === "human_timeout") return "时间耗尽，本局判负。";
  if (endReason === "resign") return "你已认输，下次再战。";
  return "遗憾，这局对手更胜一筹。";
}

function getEndTitle(won: boolean, draw: boolean | undefined, endReason: GameEndReason) {
  if (draw) return "平局";
  if (won) {
    if (endReason === "ai_timeout") return "AI 超时！";
    return "你赢了！";
  }
  if (endReason === "human_timeout") return "时间到！";
  return "再接再厉！";
}

function StatCard({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-3xl border border-white/60 bg-surface-container-low/50 p-4",
        className,
      )}
    >
      <span className="mb-1 text-caption font-semibold uppercase tracking-widest text-primary/80">
        {label}
      </span>
      <span className="text-2xl font-semibold text-on-surface">{value}</span>
    </div>
  );
}

export function GameOverModal({
  open,
  won,
  draw,
  endReason = "normal",
  elapsedSeconds,
  moveCount,
  onPlayAgain,
  onViewBoard,
  onClose,
}: GameOverModalProps) {
  const [bestStreak, setBestStreak] = useState(0);

  useEffect(() => {
    if (open) setBestStreak(getBestStreak());
  }, [open]);

  if (!open) return null;

  const isWin = won && !draw;
  const isDraw = draw;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/15 p-4 backdrop-blur-[6px]">
      <div
        className={cn(
          "glass relative flex w-full max-w-[340px] flex-col items-center rounded-[2.5rem] p-8 animate-modal-in",
          isWin
            ? "shadow-[0_20px_60px_rgba(183,16,42,0.15)]"
            : "shadow-[0_20px_60px_rgba(74,85,104,0.15)]",
        )}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 text-secondary/60 transition-colors hover:text-primary active:scale-95"
          aria-label="关闭"
        >
          <Icon name="close" className="text-xl" />
        </button>

        <div
          className={cn(
            "mb-6 flex h-20 w-20 items-center justify-center rounded-full shadow-inner animate-pulse-soft",
            isWin ? "bg-primary-container" : "bg-loss",
          )}
        >
          <Icon
            name={isDraw ? "handshake" : isWin ? "emoji_events" : "sentiment_dissatisfied"}
            filled
            className={cn("text-[2.5rem]", isWin ? "text-on-primary-container" : "text-white")}
          />
        </div>

        <h2
          className={cn(
            "mb-1 text-center text-3xl font-bold tracking-tight",
            isWin ? "text-primary" : "text-loss",
          )}
        >
          {getEndTitle(isWin, isDraw, endReason)}
        </h2>
        <p className="mb-8 text-center text-secondary opacity-80">
          {getEndMessage(isWin, isDraw, endReason)}
        </p>

        <div className="mb-8 grid w-full grid-cols-2 gap-3">
          <StatCard label="用时" value={formatDuration(elapsedSeconds)} />
          <StatCard label="步数" value={String(moveCount)} />
          <StatCard
            label="最高连胜"
            value={String(bestStreak)}
            className="relative col-span-2 overflow-hidden"
          />
        </div>

        <div className="w-full space-y-3">
          <button
            type="button"
            onClick={onPlayAgain}
            className={cn(
              "btn-scale-safe flex h-14 w-full items-center justify-center gap-2 rounded-full text-lg font-semibold text-white shadow-lg transition-transform active:scale-95",
              isWin ? "bg-primary shadow-primary/30" : "bg-loss shadow-loss/30",
            )}
          >
            <Icon name="replay" />
            再来一局
          </button>
          <button
            type="button"
            onClick={onViewBoard}
            className="flex h-14 w-full items-center justify-center rounded-full bg-surface-container-highest/50 font-medium text-on-surface-variant transition-all hover:bg-surface-dim active:scale-95"
          >
            查看棋盘
          </button>
        </div>
      </div>
    </div>
  );
}
