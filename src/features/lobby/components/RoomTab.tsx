"use client";

import { Icon } from "@/shared/components/ui/Icon";
import { PlayerProfileCard } from "@/features/profile/components/PlayerProfileCard";
import { OnlineStatusBadge } from "@/features/presence/components/OnlineStatusBadge";
import { getActiveMatch, getMatchHistory } from "@/features/game/lib/match/session-store";
import type { MatchRecord } from "@/features/game/lib/match/types";
import { formatDuration } from "@/shared/lib/utils";
import { cn } from "@/shared/lib/utils";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

function ResultBadge({ result }: { result: MatchRecord["result"] }) {
  const map = {
    win: { label: "胜", className: "bg-primary/15 text-primary" },
    loss: { label: "负", className: "bg-loss/15 text-loss" },
    draw: { label: "平", className: "bg-secondary/15 text-secondary" },
  };
  const { label, className } = map[result];
  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold", className)}>
      {label}
    </span>
  );
}

export function RoomTab() {
  const [active, setActive] = useState<ReturnType<typeof getActiveMatch>>(null);
  const [history, setHistory] = useState<MatchRecord[]>([]);

  const refresh = useCallback(() => {
    setActive(getActiveMatch());
    setHistory(getMatchHistory());
  }, []);

  useEffect(() => {
    refresh();
    const onFocus = () => refresh();
    const onVis = () => {
      if (document.visibilityState === "visible") refresh();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [refresh]);

  return (
    <div className="space-y-6">
      <PlayerProfileCard
        variant="compact"
        subtitle={active ? "正在对战" : undefined}
        trailing={
          active ? (
            <span className="animate-pulse-soft shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              LIVE
            </span>
          ) : undefined
        }
      />

      <section className="glass-card overflow-hidden rounded-2xl border border-white/50 p-5">
        {active && (
          <Link
            href="/game"
            className="block rounded-2xl border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10 p-4 transition-all hover:border-primary hover:shadow-md active:scale-[0.99]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  对局进行中
                </p>
                <p className="mt-1 font-semibold text-on-surface">
                  对手 · {active.opponent}
                </p>
                <p className="mt-0.5 text-xs text-secondary">
                  对局 #{active.matchId} · 已下 {active.moveCount} 手
                </p>
              </div>
              <Icon name="play_circle" filled className="text-4xl text-primary" />
            </div>
          </Link>
        )}

        {!active && (
          <p className="rounded-xl bg-surface-container-low/80 px-4 py-3 text-sm text-secondary">
            暂无进行中的对局，去
            <Link href="/lobby" className="mx-1 font-medium text-primary hover:underline">
              对战
            </Link>
            开始新一局吧。
          </p>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-on-surface">最近对局</h2>
          <OnlineStatusBadge dotOnly size="sm" />
        </div>
        {history.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center text-sm text-secondary">
            暂无对局记录
          </div>
        ) : (
          <ul className="space-y-3">
            {history.map((m, i) => (
              <li
                key={`${m.id}-${m.finishedAt}`}
                className={cn(
                  "glass-card flex items-center gap-4 rounded-2xl border border-white/50 p-4 transition-all hover:shadow-md",
                  i === 0 && "animate-[fadeIn_0.4s_ease-out]",
                )}
              >
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-container-high">
                  <Icon name="grid_4x4" className="text-2xl text-primary/70" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium text-on-surface">vs {m.opponent}</p>
                    <ResultBadge result={m.result} />
                  </div>
                  <p className="text-xs text-secondary">
                    #{m.id} · {formatDuration(m.durationSeconds)} · {m.moveCount} 手 ·{" "}
                    {new Date(m.finishedAt).toLocaleString("zh-CN", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
