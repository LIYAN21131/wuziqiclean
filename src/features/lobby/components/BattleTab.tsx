"use client";

import { PlayerProfileCard } from "@/features/profile/components/PlayerProfileCard";
import { StitchButton } from "@/shared/components/ui/StitchButton";
import { Icon } from "@/shared/components/ui/Icon";
import { BOARD_SIZE } from "@/shared/lib/constants";
import { cn } from "@/shared/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

/** 原型 _4：新建对局页 */
export function BattleTab() {
  const router = useRouter();
  const [pveSelected, setPveSelected] = useState(true);

  return (
    <>
      <div className="space-y-10 pb-36">
        <PlayerProfileCard variant="compact" subtitle="准备就绪 · 随时开局" />

        <section className="space-y-6">
          <h2 className="text-headline-mobile text-on-surface">棋盘大小</h2>
          <button
            type="button"
            className="glass-card flex w-full flex-col items-center justify-center gap-3 rounded-[2rem] border-2 border-primary p-10 shadow-[0_10px_40px_rgba(0,0,0,0.04)] transition-transform active:scale-[0.98]"
          >
            <Icon name="grid_4x4" filled className="text-4xl text-primary" />
            <span className="text-xl font-medium text-on-surface">
              {BOARD_SIZE} x {BOARD_SIZE}
            </span>
            <span className="text-label font-semibold uppercase tracking-widest text-primary">
              标准
            </span>
          </button>
        </section>

        <section className="space-y-6">
          <h2 className="text-headline-mobile text-on-surface">人机对战</h2>
          <button
            type="button"
            onClick={() => setPveSelected(true)}
            className={cn(
              "glass-card w-full rounded-[2rem] p-6 text-left transition-all active:scale-[0.98]",
              pveSelected
                ? "border-2 border-primary bg-white shadow-sm"
                : "border border-white/50 bg-transparent opacity-80",
            )}
          >
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors",
                  pveSelected ? "bg-primary text-white" : "bg-primary/10 text-primary",
                )}
              >
                <Icon name="smart_toy" className="text-2xl" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-lg font-semibold text-on-surface">开始人机对战</p>
                <p className="mt-1 text-sm text-secondary">
                  与 AI 一较高下 · 您执黑先手
                </p>
              </div>
              <div
                className={cn(
                  "mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2",
                  pveSelected ? "border-primary" : "border-outline-variant",
                )}
              >
                <div
                  className={cn(
                    "h-3 w-3 rounded-full bg-primary transition-opacity",
                    pveSelected ? "opacity-100" : "opacity-0",
                  )}
                />
              </div>
            </div>
          </button>
        </section>

        <section className="space-y-6">
          <div className="glass-card relative overflow-hidden rounded-[2rem] border border-white/50 bg-gradient-to-br from-white to-surface-container/30 p-10 text-center">
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-primary">
                <Icon name="group_add" className="text-3xl" />
                <h3 className="text-headline-mobile">邀请好友</h3>
              </div>
              <p className="max-w-xs text-body-lg text-secondary">
                分享您的私人房间代码，向高手发起挑战。
              </p>
              <button
                type="button"
                disabled
                className="mt-2 cursor-not-allowed rounded-full bg-on-surface px-6 py-2.5 text-label font-semibold tracking-wide text-white opacity-50"
              >
                发送邀请
              </button>
            </div>
            <Icon
              name="person_pin_circle"
              className="pointer-events-none absolute -bottom-8 -right-8 text-[10rem] text-primary/[0.05]"
            />
          </div>
        </section>
      </div>

      {/* 原型固定底栏：开始游戏（位于底部导航上方） */}
      <div className="fixed bottom-20 left-0 right-0 z-40 border-t border-white/30 bg-surface/80 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto max-w-xl">
          <StitchButton
            icon="arrow_forward"
            onClick={() => router.push("/game")}
          >
            开始游戏
          </StitchButton>
        </div>
      </div>
    </>
  );
}
