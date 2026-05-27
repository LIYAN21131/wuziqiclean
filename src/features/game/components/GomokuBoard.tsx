"use client";

import { BOARD_SIZE } from "@/shared/lib/constants";
import {
  BOARD_VIEW_PADDING,
  BOARD_VIEW_SIZE,
  clientToViewBox,
  getStoneRadius,
  intersectionToView,
  snapToIntersection,
} from "@/features/game/lib/gomoku/board-geometry";
import type { Board, Position, StoneColor } from "@/features/game/lib/gomoku/types";
import { cn } from "@/shared/lib/utils";
import { useCallback, useRef, useState } from "react";

type GomokuBoardProps = {
  board: Board;
  lastMove: Position | null;
  winningLine: Position[];
  currentTurn: StoneColor;
  humanColor: StoneColor;
  validMoves?: Position[];
  disabled?: boolean;
  /** 悔棋撤回动画中的棋子位置 */
  retractingPositions?: Position[];
  onIntersectionClick: (row: number, col: number) => void;
};

function isRetracting(retracting: Position[], row: number, col: number) {
  return retracting.some((p) => p.row === row && p.col === col);
}

function isWinningCell(line: Position[], row: number, col: number) {
  return line.some((p) => p.row === row && p.col === col);
}

const STAR_POINTS = [3, 7, 11];

export function GomokuBoard({
  board,
  lastMove,
  winningLine,
  currentTurn,
  humanColor,
  validMoves = [],
  disabled,
  retractingPositions = [],
  onIntersectionClick,
}: GomokuBoardProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverCell, setHoverCell] = useState<Position | null>(null);
  const lastPlaceAtRef = useRef(0);
  const size = board.length || BOARD_SIZE;
  const stoneR = getStoneRadius(size);

  const canInteract = !disabled && currentTurn === humanColor;
  const validSet = new Set(validMoves.map((p) => `${p.row},${p.col}`));

  const resolveIntersection = useCallback(
    (clientX: number, clientY: number) => {
      const svg = svgRef.current;
      if (!svg) return null;
      const { x, y } = clientToViewBox(clientX, clientY, svg);
      return snapToIntersection(x, y, size);
    },
    [size],
  );

  const handlePointerMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!canInteract) {
        setHoverCell(null);
        return;
      }
      const snapped = resolveIntersection(clientX, clientY);
      if (!snapped || board[snapped.row][snapped.col]) {
        setHoverCell(null);
        return;
      }
      setHoverCell(snapped);
    },
    [board, canInteract, resolveIntersection],
  );

  const handlePlace = useCallback(
    (clientX: number, clientY: number) => {
      if (!canInteract) return;
      const snapped = resolveIntersection(clientX, clientY);
      if (!snapped || board[snapped.row][snapped.col]) return;
      onIntersectionClick(snapped.row, snapped.col);
      setHoverCell(null);
    },
    [board, canInteract, onIntersectionClick, resolveIntersection],
  );

  const gridLines: React.ReactNode[] = [];
  for (let i = 0; i < size; i++) {
    const start = intersectionToView(0, i, size);
    const end = intersectionToView(size - 1, i, size);
    const startH = intersectionToView(i, 0, size);
    const endH = intersectionToView(i, size - 1, size);
    gridLines.push(
      <line
        key={`v-${i}`}
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke="#8f6f6e"
        strokeOpacity={0.55}
        strokeWidth={0.22}
        pointerEvents="none"
      />,
      <line
        key={`h-${i}`}
        x1={startH.x}
        y1={startH.y}
        x2={endH.x}
        y2={endH.y}
        stroke="#8f6f6e"
        strokeOpacity={0.55}
        strokeWidth={0.22}
        pointerEvents="none"
      />,
    );
  }

  return (
    <div className="relative w-full max-w-[min(100vw-2rem,440px)]">
      <div
        className={cn(
          "overflow-hidden rounded-2xl border border-outline/25 shadow-[0_12px_48px_rgba(0,0,0,0.08)]",
          "bg-gradient-to-br from-[#f8f0e6] via-[#f5ebe0] to-[#efe4d8]",
        )}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${BOARD_VIEW_SIZE} ${BOARD_VIEW_SIZE}`}
          className={cn(
            "block w-full touch-none select-none",
            canInteract ? "cursor-crosshair" : "cursor-default",
          )}
          style={{ aspectRatio: "1" }}
          onPointerLeave={() => setHoverCell(null)}
          onPointerMove={(e) => {
            if (e.pointerType === "touch") return;
            handlePointerMove(e.clientX, e.clientY);
          }}
          onPointerUp={(e) => {
            if (e.button !== 0 && e.pointerType === "mouse") return;
            const now = Date.now();
            if (now - lastPlaceAtRef.current < 320) return;
            lastPlaceAtRef.current = now;
            handlePlace(e.clientX, e.clientY);
          }}
          role="grid"
          aria-label="五子棋棋盘"
        >
          <rect
            x={0}
            y={0}
            width={BOARD_VIEW_SIZE}
            height={BOARD_VIEW_SIZE}
            fill="transparent"
          />

          <rect
            x={BOARD_VIEW_PADDING - 0.5}
            y={BOARD_VIEW_PADDING - 0.5}
            width={BOARD_VIEW_SIZE - 2 * BOARD_VIEW_PADDING + 1}
            height={BOARD_VIEW_SIZE - 2 * BOARD_VIEW_PADDING + 1}
            fill="none"
            stroke="#8f6f6e"
            strokeOpacity={0.4}
            strokeWidth={0.35}
            rx={0.8}
            pointerEvents="none"
          />

          {gridLines}

          {STAR_POINTS.flatMap((r) =>
            STAR_POINTS.map((c) => {
              const { x, y } = intersectionToView(r, c, size);
              return (
                <circle
                  key={`star-${r}-${c}`}
                  cx={x}
                  cy={y}
                  r={0.55}
                  fill="#1b1b1d"
                  fillOpacity={0.75}
                  pointerEvents="none"
                />
              );
            }),
          )}

          {/* 扩大点击热区（透明交叉点） */}
          {canInteract &&
            Array.from({ length: size }, (_, r) =>
              Array.from({ length: size }, (_, c) => {
                if (board[r][c]) return null;
                const { x, y } = intersectionToView(r, c, size);
                const isValid = validSet.has(`${r},${c}`);
                const isHover = hoverCell?.row === r && hoverCell?.col === c;
                return (
                  <circle
                    key={`hit-${r}-${c}`}
                    cx={x}
                    cy={y}
                    r={stoneR * 0.95}
                    fill="transparent"
                    className={cn(isValid && !isHover && "fill-primary/8")}
                  />
                );
              }),
            )}

          {canInteract &&
            validMoves.map(({ row, col }) => {
              const { x, y } = intersectionToView(row, col, size);
              return (
                <circle
                  key={`hint-${row}-${col}`}
                  cx={x}
                  cy={y}
                  r={stoneR * 0.22}
                  fill="#b7102a"
                  fillOpacity={0.35}
                  pointerEvents="none"
                  className="animate-pulse"
                />
              );
            })}

          {board.map((row, r) =>
            row.map((cell, c) => {
              if (!cell) return null;
              const { x, y } = intersectionToView(r, c, size);
              const isLast = lastMove?.row === r && lastMove?.col === c;
              const isWin = isWinningCell(winningLine, r, c);
              const isRetract = isRetracting(retractingPositions, r, c);

              return (
                <g key={`stone-${r}-${c}`} pointerEvents="none">
                  <circle
                    key={isLast ? `last-${r}-${c}` : `stone-${r}-${c}`}
                    cx={x}
                    cy={y}
                    r={stoneR}
                    fill={cell === "black" ? "#1b1b1d" : "#ffffff"}
                    stroke={cell === "white" ? "#8f6f6e" : "none"}
                    strokeWidth={cell === "white" ? 0.15 : 0}
                    className={cn(
                      isRetract && "animate-stone-retract",
                      isLast && !isRetract && "animate-stone-drop",
                      isLast && !isRetract && "drop-shadow-[0_0_6px_rgba(183,16,42,0.5)]",
                      isWin && "stroke-[#b7102a] stroke-[0.35]",
                      !isLast && !isRetract && cell === "black" && "drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]",
                    )}
                    style={{
                      filter: !isLast
                        ? cell === "black"
                          ? "drop-shadow(0 1px 2px rgba(0,0,0,0.35))"
                          : "drop-shadow(0 1px 2px rgba(0,0,0,0.12))"
                        : undefined,
                    }}
                  />
                  <circle
                    cx={x - stoneR * 0.25}
                    cy={y - stoneR * 0.25}
                    r={stoneR * 0.2}
                    fill="white"
                    opacity={cell === "black" ? 0.12 : 0.35}
                  />
                </g>
              );
            }),
          )}

          {canInteract && hoverCell && (
            <circle
              cx={intersectionToView(hoverCell.row, hoverCell.col, size).x}
              cy={intersectionToView(hoverCell.row, hoverCell.col, size).y}
              r={stoneR}
              fill="#1b1b1d"
              fillOpacity={0.28}
              stroke="#1b1b1d"
              strokeOpacity={0.45}
              strokeWidth={0.15}
              pointerEvents="none"
            />
          )}
        </svg>
      </div>
      <p className="mt-2 text-center text-caption tracking-wide text-secondary/80">
        点击交叉点落子 · 传统 {size}×{size} 棋盘
      </p>
    </div>
  );
}
