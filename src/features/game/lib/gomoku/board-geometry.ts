import { BOARD_SIZE } from "@/shared/lib/constants";
import type { Position } from "./types";

/** SVG viewBox 边距（与网格线留白一致） */
export const BOARD_VIEW_PADDING = 8;

/** 标准 15×15 棋盘在 viewBox 中的总尺寸 */
export const BOARD_VIEW_SIZE = 100;

/**
 * 第 n 条线与第 n 个交叉点的间距（共 size 个交叉点，size-1 段间距）
 */
export function getGridStep(size: number = BOARD_SIZE): number {
  const inner = BOARD_VIEW_SIZE - BOARD_VIEW_PADDING * 2;
  return inner / (size - 1);
}

/** 交叉点 (row,col) 在 viewBox 坐标系中的圆心 */
export function intersectionToView(
  row: number,
  col: number,
  size: number = BOARD_SIZE,
): { x: number; y: number } {
  const step = getGridStep(size);
  return {
    x: BOARD_VIEW_PADDING + col * step,
    y: BOARD_VIEW_PADDING + row * step,
  };
}

/** 将指针坐标（viewBox）吸附到最近交叉点 */
export function snapToIntersection(
  viewX: number,
  viewY: number,
  size: number = BOARD_SIZE,
  snapRadiusRatio = 0.42,
): Position | null {
  const step = getGridStep(size);
  const maxDist = step * snapRadiusRatio;

  let best: Position | null = null;
  let bestDist = Infinity;

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const { x, y } = intersectionToView(row, col, size);
      const dist = Math.hypot(viewX - x, viewY - y);
      if (dist < bestDist) {
        bestDist = dist;
        best = { row, col };
      }
    }
  }

  if (!best || bestDist > maxDist) return null;
  return best;
}

/** 屏幕坐标 → viewBox 坐标 */
export function clientToViewBox(
  clientX: number,
  clientY: number,
  svg: SVGSVGElement,
): { x: number; y: number } {
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const ctm = svg.getScreenCTM();
  if (!ctm) return { x: 0, y: 0 };
  const transformed = pt.matrixTransform(ctm.inverse());
  return { x: transformed.x, y: transformed.y };
}

/** 棋子半径（viewBox 单位） */
export function getStoneRadius(size: number = BOARD_SIZE): number {
  return getGridStep(size) * 0.42;
}
