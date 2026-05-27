"use client";

import { cn } from "@/shared/lib/utils";
import { useId } from "react";

/** 棋盘交叉点坐标（5×5 局部网格） */
const GRID = {
  min: 16,
  max: 64,
  step: 12,
} as const;

function gridPoint(index: number): number {
  return GRID.min + index * GRID.step;
}

type GomokuLogoProps = {
  /** 渲染尺寸（px），SVG 矢量不失真 */
  size?: number;
  className?: string;
  /** 入场 / 落子 / 发光动效 */
  animated?: boolean;
  /** 外圈光晕 */
  showGlow?: boolean;
};

/**
 * 五子棋 App Logo — 极简棋盘 + 黑白落子
 * 矢量 SVG，适配 Retina 与深浅背景
 */
export function GomokuLogo({
  size = 88,
  className,
  animated = true,
  showGlow = true,
}: GomokuLogoProps) {
  const uid = useId().replace(/:/g, "");
  const bgId = `gomoku-logo-bg-${uid}`;
  const glowId = `gomoku-logo-glow-${uid}`;
  const shadowId = `gomoku-logo-shadow-${uid}`;

  const lines = Array.from({ length: 5 }, (_, i) => gridPoint(i));

  return (
    <div
      className={cn(
        "gomoku-logo group relative flex shrink-0 items-center justify-center",
        animated && "animate-logo-enter",
        className,
      )}
      style={{ width: size, height: size }}
      role="img"
      aria-label="五子棋"
    >
      {showGlow && (
        <div
          className={cn(
            "pointer-events-none absolute inset-[6%] rounded-[22%] bg-login-primary/25 blur-lg",
            animated && "animate-logo-glow-ring",
          )}
          aria-hidden
        />
      )}

      <svg
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "relative h-full w-full drop-shadow-[0_8px_24px_rgba(212,35,55,0.28)]",
          animated && "transition-transform duration-500 ease-out group-hover:scale-[1.04]",
        )}
        aria-hidden
      >
        <defs>
          <linearGradient id={bgId} x1="8" y1="8" x2="72" y2="72" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ef4456" />
            <stop offset="0.45" stopColor="#d42337" />
            <stop offset="1" stopColor="#b01828" />
          </linearGradient>
          <radialGradient id={glowId} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform={`translate(${gridPoint(3)} ${gridPoint(2)}) scale(10)`}>
            <stop stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <filter id={shadowId} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="1.2" stdDeviation="1.2" floodColor="#000000" floodOpacity="0.35" />
          </filter>
          <filter id={`${shadowId}-soft`} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0.6" stdDeviation="0.6" floodColor="#000000" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* App 图标底板 */}
        <rect x="4" y="4" width="72" height="72" rx="17" fill={`url(#${bgId})`} />
        <rect
          x="4.5"
          y="4.5"
          width="71"
          height="71"
          rx="16.5"
          stroke="white"
          strokeOpacity="0.12"
          strokeWidth="1"
        />

        {/* 棋盘线 */}
        <g stroke="white" strokeOpacity="0.38" strokeWidth="0.75" strokeLinecap="round">
          {lines.map((pos) => (
            <g key={`g-${pos}`}>
              <line x1={GRID.min} y1={pos} x2={GRID.max} y2={pos} />
              <line x1={pos} y1={GRID.min} x2={pos} y2={GRID.max} />
            </g>
          ))}
        </g>

        {/* 天元 */}
        <circle cx="40" cy="40" r="1.3" fill="white" fillOpacity="0.45" />

        {/* 白子 — 对弈中 */}
        <g filter={`url(#${shadowId}-soft)`}>
          <circle cx={gridPoint(2)} cy={gridPoint(1)} r="4.1" fill="#f8f8fa" />
          <circle
            cx={gridPoint(2) - 1.2}
            cy={gridPoint(1) - 1.2}
            r="1.1"
            fill="white"
            fillOpacity="0.65"
          />
          <circle
            cx={gridPoint(4)}
            cy={gridPoint(2)}
            r="4.1"
            fill="#f4f4f6"
            stroke="#d8d8dc"
            strokeWidth="0.35"
          />
          <circle
            cx={gridPoint(4) - 1.1}
            cy={gridPoint(2) - 1.1}
            r="1"
            fill="white"
            fillOpacity="0.7"
          />
        </g>

        {/* 黑子 — 连三 */}
        <g filter={`url(#${shadowId})`}>
          <circle cx={gridPoint(0)} cy={gridPoint(2)} r="4.2" fill="#18181b" />
          <circle cx={gridPoint(1)} cy={gridPoint(2)} r="4.2" fill="#18181b" />
          <circle cx={gridPoint(2)} cy={gridPoint(2)} r="4.2" fill="#18181b" />
          <circle
            cx={gridPoint(1) - 1.3}
            cy={gridPoint(2) - 1.3}
            r="1.1"
            fill="white"
            fillOpacity="0.14"
          />
        </g>

        {/* 最新一手 — 落子动效 + 微光 */}
        <g
          className={cn(animated && "animate-logo-stone-drop")}
          style={{ transformOrigin: `${gridPoint(3)}px ${gridPoint(2)}px` }}
        >
          {animated && (
            <circle
              cx={gridPoint(3)}
              cy={gridPoint(2)}
              r="9"
              fill={`url(#${glowId})`}
              className="animate-logo-glow"
            />
          )}
          <circle cx={gridPoint(3)} cy={gridPoint(2)} r="4.25" fill="#141416" filter={`url(#${shadowId})`} />
          <circle
            cx={gridPoint(3) - 1.4}
            cy={gridPoint(2) - 1.4}
            r="1.15"
            fill="white"
            fillOpacity="0.18"
          />
        </g>
      </svg>
    </div>
  );
}
