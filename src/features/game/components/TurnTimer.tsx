"use client";

import { cn } from "@/shared/lib/utils";
import type { TimerUrgency } from "@/features/game/hooks/useGameTimer";

type TurnTimerProps = {
  seconds: number;
  totalSeconds: number;
  active: boolean;
  urgency?: TimerUrgency;
  /** 当前计时方标签 */
  label?: string;
};

const RING_CIRCUMFERENCE = 176;

/** 回合倒计时 — 圆环进度 + 紧迫变色 + 临界闪烁 */
export function TurnTimer({
  seconds,
  totalSeconds,
  active,
  urgency = "normal",
  label,
}: TurnTimerProps) {
  const progress = totalSeconds > 0 ? (seconds / totalSeconds) * 100 : 0;
  const dash = (progress / 100) * RING_CIRCUMFERENCE;

  const ringColor =
    urgency === "expired"
      ? "text-loss"
      : urgency === "critical"
        ? "text-red-500"
        : urgency === "warning"
          ? "text-amber-500"
          : "text-primary";

  return (
    <div
      className={cn(
        "relative mx-1 flex h-[4.25rem] w-[4.25rem] shrink-0 flex-col items-center justify-center",
        !active && "opacity-45",
        urgency === "critical" && active && "animate-timer-critical",
        urgency === "expired" && "animate-timer-expired",
      )}
      role="timer"
      aria-live="polite"
      aria-label={label ? `${label} ${seconds} 秒` : `剩余 ${seconds} 秒`}
    >
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 64 64" aria-hidden>
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke="currentColor"
          className="text-surface-container-high"
          strokeWidth="3"
        />
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke="currentColor"
          className={cn("transition-all duration-1000 ease-linear", ringColor)}
          strokeWidth="3"
          strokeDasharray={`${dash} ${RING_CIRCUMFERENCE}`}
          strokeLinecap="round"
        />
      </svg>

      <span
        className={cn(
          "text-xl font-semibold tabular-nums transition-colors duration-300",
          ringColor,
        )}
      >
        {Math.max(0, seconds)}
      </span>

      {label && active && (
        <span className="absolute -bottom-4 text-[9px] font-medium text-secondary">
          {label}
        </span>
      )}

      {urgency === "warning" && active && (
        <span
          className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-amber-400/40"
          aria-hidden
        />
      )}
    </div>
  );
}
