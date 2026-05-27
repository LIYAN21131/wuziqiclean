/**
 * AI 决策单元测试 — 运行: npx tsx src/lib/ai/ai.test.ts
 */
import { createEmptyBoard, placeStone } from "@/features/game/lib/gomoku/board";
import { findWinningMoves } from "@/features/ai/lib/evaluateBoard";
import { getBestMove, pickAiMove } from "@/features/ai/lib/getBestMove";
import { PLAYER } from "@/shared/lib/constants";
import type { Board, StoneColor } from "@/features/game/lib/gomoku/types";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ ${message}`);
  }
}

function lineHorizontal(
  board: Board,
  row: number,
  colStart: number,
  len: number,
  color: StoneColor,
): Board {
  let b = board;
  for (let i = 0; i < len; i++) {
    b = placeStone(b, row, colStart + i, color);
  }
  return b;
}

function posEq(a: { row: number; col: number }, b: { row: number; col: number }) {
  return a.row === b.row && a.col === b.col;
}

function includesMove(moves: { row: number; col: number }[], p: { row: number; col: number }) {
  return moves.some((m) => posEq(m, p));
}

console.log("\n=== AI 防守：拦截玩家四连 ===");
{
  let board = createEmptyBoard();
  board = lineHorizontal(board, 7, 5, 4, PLAYER.human);
  const move = pickAiMove(board, PLAYER.ai);
  const mustBlock = [{ row: 7, col: 4 }, { row: 7, col: 9 }];
  assert(
    mustBlock.some((p) => posEq(move, p)),
    `AI 应拦截四连，实际落点 (${move.row},${move.col})`,
  );
}

console.log("\n=== AI 进攻：一手成五 ===");
{
  let board = createEmptyBoard();
  board = lineHorizontal(board, 7, 5, 4, PLAYER.ai);
  const move = pickAiMove(board, PLAYER.ai);
  const winPoints = [{ row: 7, col: 4 }, { row: 7, col: 9 }];
  assert(
    winPoints.some((p) => posEq(move, p)),
    `AI 应完成五连，实际落点 (${move.row},${move.col})`,
  );
}

console.log("\n=== AI 防守：竖向四连 ===");
{
  let board = createEmptyBoard();
  for (let r = 4; r <= 7; r++) {
    board = placeStone(board, r, 8, PLAYER.human);
  }
  const move = pickAiMove(board, PLAYER.ai);
  assert(
    move.col === 8 && (move.row === 3 || move.row === 8),
    `AI 应拦截竖向四连，实际 (${move.row},${move.col})`,
  );
}

console.log("\n=== AI 防守：不可漏防活四威胁 ===");
{
  let board = createEmptyBoard();
  // 人类 ●●● 空 ● — 再下一手活四
  board = placeStone(board, 7, 6, PLAYER.human);
  board = placeStone(board, 7, 7, PLAYER.human);
  board = placeStone(board, 7, 8, PLAYER.human);
  board = placeStone(board, 7, 10, PLAYER.human);
  const humanWins = findWinningMoves(board, PLAYER.human);
  assert(humanWins.length > 0, "测试盘：人类应有一手成五");
  const move = pickAiMove(board, PLAYER.ai);
  assert(
    includesMove(humanWins, move),
    `AI 必须堵杀，实际 (${move.row},${move.col})`,
  );
}

console.log("\n=== AI 开局：天元附近 ===");
{
  const board = createEmptyBoard();
  const move = pickAiMove(board, PLAYER.ai);
  assert(move.row === 7 && move.col === 7, `空盘应下天元 (7,7)，实际 (${move.row},${move.col})`);
}

console.log("\n=== AI 进攻：延伸活三 ===");
{
  let board = createEmptyBoard();
  // AI 白棋 空 ●●● 空 在 row 7
  board = placeStone(board, 7, 6, PLAYER.ai);
  board = placeStone(board, 7, 7, PLAYER.ai);
  board = placeStone(board, 7, 8, PLAYER.ai);
  const move = pickAiMove(board, PLAYER.ai);
  const extendPoints = [{ row: 7, col: 5 }, { row: 7, col: 9 }];
  assert(
    extendPoints.some((p) => posEq(move, p)),
    `AI 应延伸活三，实际 (${move.row},${move.col})`,
  );
}

console.log("\n=== AI 决策：不送杀（有更好选择时）===");
{
  let board = createEmptyBoard();
  // 人类横向四连在 row 7
  board = lineHorizontal(board, 7, 5, 4, PLAYER.human);
  // AI 若不下 row7 而在别处下，应仍选堵点
  const decision = getBestMove(board, PLAYER.ai);
  assert(
    decision.reason === "block_win",
    `决策原因应为 block_win，实际 ${decision.reason}`,
  );
}

console.log("\n=== AI 稳定性：同局面同落点（无随机） ===");
{
  let board = createEmptyBoard();
  board = placeStone(board, 7, 7, PLAYER.human);
  board = placeStone(board, 8, 8, PLAYER.ai);
  board = placeStone(board, 7, 8, PLAYER.human);
  const m1 = pickAiMove(board, PLAYER.ai);
  const m2 = pickAiMove(board, PLAYER.ai);
  assert(posEq(m1, m2), "相同局面应得到确定性落点");
}

console.log(`\n--- 结果: ${passed} 通过, ${failed} 失败 ---\n`);
if (failed > 0) process.exit(1);
