/**
 * 棋盘几何单元校验（可用 npx tsx 运行）
 */
import { snapToIntersection, intersectionToView } from "./board-geometry";

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

const center = intersectionToView(7, 7);
const snapped = snapToIntersection(center.x, center.y);
assert(snapped?.row === 7 && snapped?.col === 7, "中心点应吸附到天元");

const nearSnap = snapToIntersection(center.x + 0.5, center.y);
assert(nearSnap?.row === 7 && nearSnap?.col === 7, "轻微偏移仍应吸附到天元");

const far = snapToIntersection(0, 0);
assert(far === null, "棋盘外不应吸附");

console.log("board-geometry: all passed");
