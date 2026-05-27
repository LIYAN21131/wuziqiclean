"use client";

import { GameOverModal } from "@/features/game/components/GameOverModal";
import { Icon } from "@/shared/components/ui/Icon";
import Link from "next/link";
import { useState } from "react";

type ScreenKey = "login" | "lobby" | "game" | "win" | "loss";

const screens: {
  key: ScreenKey;
  title: string;
  desc: string;
  href?: string;
  iframe?: string;
}[] = [
  {
    key: "login",
    title: "登录",
    desc: "原型 _1 · LY的五子棋",
    href: "/",
    iframe: "/",
  },
  {
    key: "lobby",
    title: "新建对局",
    desc: "原型 _4 · 大厅与人机入口",
    href: "/lobby",
    iframe: "/lobby",
  },
  {
    key: "game",
    title: "对弈",
    desc: "原型 _2 · 15×15 人机对战",
    href: "/game",
    iframe: "/game",
  },
];

function PhoneFrame({
  title,
  desc,
  href,
  src,
  children,
}: {
  title: string;
  desc: string;
  href?: string;
  src?: string;
  children?: React.ReactNode;
}) {
  return (
    <article className="flex flex-col gap-3">
      <div className="flex items-end justify-between gap-2 px-1">
        <div>
          <h2 className="text-lg font-semibold text-on-surface">{title}</h2>
          <p className="text-xs text-secondary">{desc}</p>
        </div>
        {href && (
          <Link
            href={href}
            target="_blank"
            className="flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
          >
            全屏打开
            <Icon name="open_in_new" className="text-sm" />
          </Link>
        )}
      </div>
      <div className="mx-auto w-full max-w-[390px]">
        <div className="rounded-[2rem] border-[10px] border-on-surface/90 bg-on-surface p-2 shadow-[0_24px_80px_rgba(0,0,0,0.12)]">
          <div className="mb-1 flex justify-center">
            <span className="h-1 w-16 rounded-full bg-on-surface/30" />
          </div>
          <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[1.25rem] bg-background">
            {src ? (
              <iframe
                title={title}
                src={src}
                className="h-full w-full border-0"
                loading="lazy"
              />
            ) : (
              children
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function PreviewPage() {
  const [modalDemo, setModalDemo] = useState<"win" | "loss" | null>("win");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-surface-container-low to-background">
      <header className="sticky top-0 z-50 border-b border-white/50 bg-surface/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Zenith Gomoku
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-on-surface">
              界面预览
            </h1>
            <p className="mt-1 text-sm text-secondary">
              所有主要页面一览 · 演示账号 test / password
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary shadow-lg shadow-primary/20 transition-transform active:scale-95"
            >
              进入应用
            </Link>
            <Link
              href="/game"
              className="rounded-full border border-outline-variant bg-white px-5 py-2.5 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-low"
            >
              直接开始对局
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <section className="mb-10 rounded-2xl border border-white/60 bg-white/60 p-6 backdrop-blur-sm">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
            Stitch 高保真对照
          </h2>
          <ul className="mt-3 grid gap-2 text-sm text-secondary sm:grid-cols-2">
            <li>
              <span className="font-medium text-on-surface">_1</span> 登录 · 点阵背景 ·
              #D42337
            </li>
            <li>
              <span className="font-medium text-on-surface">_4</span> 大厅 · 棋盘选择 ·
              固定「开始游戏」
            </li>
            <li>
              <span className="font-medium text-on-surface">_2</span> 对弈 · 玩家条 ·
              倒计时 · 底栏操作
            </li>
            <li>
              <span className="font-medium text-on-surface">_3 / _5</span> 胜负结算弹窗
            </li>
          </ul>
        </section>

        <section className="mb-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {screens.map((s) => (
            <PhoneFrame
              key={s.key}
              title={s.title}
              desc={s.desc}
              href={s.href}
              src={s.iframe}
            />
          ))}
        </section>

        <section className="mb-8">
          <h2 className="mb-2 text-xl font-semibold text-on-surface">结算弹窗</h2>
          <p className="mb-6 text-sm text-secondary">
            原型 _3 胜利 · 原型 _5 失败 — 点击下方切换预览
          </p>
          <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
            <PhoneFrame title="你赢了！" desc="原型 _3">
              <div className="relative flex h-full items-center justify-center bg-black/10 p-4">
                <div className="glass w-full max-w-[280px] rounded-[2rem] p-6 text-center shadow-xl">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-container">
                    <Icon
                      name="emoji_events"
                      filled
                      className="text-3xl text-on-primary-container"
                    />
                  </div>
                  <p className="text-2xl font-bold text-primary">你赢了！</p>
                  <p className="mt-1 text-xs text-secondary">大师，胜利属于你。</p>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-center text-sm">
                    <div className="rounded-2xl bg-surface-container-low/80 py-2">
                      <p className="text-caption text-primary">用时</p>
                      <p className="font-semibold">12:45</p>
                    </div>
                    <div className="rounded-2xl bg-surface-container-low/80 py-2">
                      <p className="text-caption text-primary">步数</p>
                      <p className="font-semibold">42</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="mt-4 w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-white"
                  >
                    再来一局
                  </button>
                </div>
              </div>
            </PhoneFrame>

            <PhoneFrame title="再接再厉！" desc="原型 _5">
              <div className="relative flex h-full items-center justify-center bg-black/10 p-4">
                <div className="glass w-full max-w-[280px] rounded-[2rem] p-6 text-center shadow-xl">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-loss">
                    <Icon
                      name="sentiment_dissatisfied"
                      filled
                      className="text-3xl text-white"
                    />
                  </div>
                  <p className="text-2xl font-bold text-loss">再接再厉！</p>
                  <p className="mt-1 text-xs text-secondary">
                    遗憾，这局对手更胜一筹。
                  </p>
                  <button
                    type="button"
                    className="mt-6 w-full rounded-full bg-loss py-2.5 text-sm font-semibold text-white"
                  >
                    再来一局
                  </button>
                </div>
              </div>
            </PhoneFrame>
          </div>

          <div className="mt-8 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => setModalDemo("win")}
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white"
            >
              交互预览 · 胜利
            </button>
            <button
              type="button"
              onClick={() => setModalDemo("loss")}
              className="rounded-full bg-loss px-4 py-2 text-sm font-medium text-white"
            >
              交互预览 · 失败
            </button>
            {modalDemo && (
              <button
                type="button"
                onClick={() => setModalDemo(null)}
                className="rounded-full border border-outline-variant px-4 py-2 text-sm text-secondary"
              >
                关闭弹窗
              </button>
            )}
          </div>
        </section>
      </main>

      {modalDemo && (
        <GameOverModal
          open
          won={modalDemo === "win"}
          elapsedSeconds={765}
          moveCount={42}
          onPlayAgain={() => setModalDemo(null)}
          onViewBoard={() => setModalDemo(null)}
          onClose={() => setModalDemo(null)}
        />
      )}
    </div>
  );
}
