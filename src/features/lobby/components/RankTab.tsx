"use client";

import { Icon } from "@/shared/components/ui/Icon";
import { PlayerProfileCard } from "@/features/profile/components/PlayerProfileCard";

const MOCK_RANKS = [
  { rank: 1, name: "棋圣·无名", score: 2840 },
  { rank: 2, name: "Zen Master", score: 2712 },
  { rank: 3, name: "魏大师", score: 2650 },
  { rank: 4, name: "Sophia L.", score: 2588 },
  { rank: 5, name: "落子无悔", score: 2510 },
  { rank: 6, name: "黑白之间", score: 2445 },
  { rank: 7, name: "天元一击", score: 2390 },
  { rank: 8, name: "静水流深", score: 2312 },
];

export function RankTab() {
  return (
    <div className="relative space-y-6">
      <PlayerProfileCard variant="compact" subtitle="排行榜暂未开放 · 先积累胜场吧" />

      <div className="pointer-events-none select-none blur-[6px] opacity-40">
        <ul className="space-y-2">
          {MOCK_RANKS.map((item) => (
            <li
              key={item.rank}
              className="glass-card flex items-center gap-4 rounded-2xl px-4 py-3"
            >
              <span className="w-6 text-center font-bold text-primary">{item.rank}</span>
              <span className="flex-1 font-medium">{item.name}</span>
              <span className="text-sm text-secondary">{item.score}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <div className="glass mb-6 flex h-20 w-20 items-center justify-center rounded-full shadow-lg">
          <Icon name="lock" filled className="text-4xl text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-on-surface">排行榜功能暂未开放</h2>
        <p className="mt-2 max-w-xs text-secondary">敬请期待 · 全服棋力排名即将上线</p>
        <div className="mt-6 flex items-center gap-2 rounded-full bg-surface-container-high px-4 py-2 text-xs font-semibold text-secondary">
          <Icon name="leaderboard" className="text-primary" />
          赛季排位 · 开发中
        </div>
      </div>
    </div>
  );
}
