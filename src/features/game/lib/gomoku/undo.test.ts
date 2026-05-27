/**
 * 悔棋 / 落子历史测试 — 运行: npx tsx src/lib/gomoku/undo.test.ts
 */
import { createEmptyBoard, placeStone } from "@/features/game/lib/gomoku/board";
import {
  popFullRound,
  rebuildBoardFromHistory,
  isHistoryConsistent,
} from "@/features/game/lib/gomoku/move-history";
import { PLAYER } from "@/shared/lib/constants";
import type { MoveRecord } from "@/features/game/lib/gomoku/types";

let passed = 0;
let failed = 0;

function assert(cond: boolean, msg: string) {
  if (cond) {
    passed++;
    console.log(`  ✓ ${msg}`);
  } else {
    failed++;
    console.error(`  ✗ ${msg}`);
  }
}

console.log("\n=== popFullRound：回退完整回合 ===");
{
  const moves: MoveRecord[] = [
    { pos: { row: 7, col: 7 }, color: PLAYER.human },
    { pos: { row: 7, col: 8 }, color: PLAYER.ai },
    { pos: { row: 8, col: 7 }, color: PLAYER.human },
    { pos: { row: 8, col: 8 }, color: PLAYER.ai },
  ];
  const { remaining, removed } = popFullRound(moves);
  assert(remaining.length === 2, "剩余 2 手");
  assert(removed.length === 2, "移除 2 手");
  assert(
    removed[0].pos.row === 8 && removed[1].pos.col === 8,
    "移除最后一回合（人类+AI）",
  );
}

console.log("\n=== rebuildBoardFromHistory ===");
{
  const moves: MoveRecord[] = [
    { pos: { row: 7, col: 7 }, color: PLAYER.human },
    { pos: { row: 7, col: 8 }, color: PLAYER.ai },
  ];
  const board = rebuildBoardFromHistory(moves);
  assert(board[7][7] === PLAYER.human, "人类子保留");
  assert(board[7][8] === PLAYER.ai, "AI 子保留");
  assert(board[7][9] === null, "空位正确");
}

console.log("\n=== 悔棋后棋盘一致 ===");
{
  let board = createEmptyBoard();
  const history: MoveRecord[] = [];
  const seq = [
    { row: 7, col: 7, color: PLAYER.human },
    { row: 7, col: 8, color: PLAYER.ai },
    { row: 8, col: 7, color: PLAYER.human },
    { row: 8, col: 8, color: PLAYER.ai },
  ] as const;
  for (const s of seq) {
    board = placeStone(board, s.row, s.col, s.color);
    history.push({ pos: { row: s.row, col: s.col }, color: s.color });
  }
  const { remaining } = popFullRound(history);
  const rebuilt = rebuildBoardFromHistory(remaining);
  assert(rebuilt[8][7] === null && rebuilt[8][8] === null, "最后一回合已清除");
  assert(rebuilt[7][7] === PLAYER.human && rebuilt[7][8] === PLAYER.ai, "先前回合保留");
}

console.log("\n=== 历史一致性 ===");
assert(isHistoryConsistent([], 0), "空盘一致");
assert(!isHistoryConsistent([{ pos: { row: 0, col: 0 }, color: "black" }], 2), "不一致检测");

console.log(`\n--- 结果: ${passed} 通过, ${failed} 失败 ---\n`);
if (failed > 0) process.exit(1);
