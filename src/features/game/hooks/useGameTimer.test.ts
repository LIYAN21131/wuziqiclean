/**
 * 回合计时器单元测试 — 运行: npx tsx src/hooks/useGameTimer.test.ts
 */
import { getTimerUrgency, TIMER_WARN_CRITICAL, TIMER_WARN_ORANGE } from "@/features/game/hooks/useGameTimer";

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

console.log("\n=== 计时紧迫度 ===");
assert(getTimerUrgency(45) === "normal", "45s 为 normal");
assert(getTimerUrgency(TIMER_WARN_ORANGE) === "warning", "10s 为 warning");
assert(getTimerUrgency(TIMER_WARN_CRITICAL) === "critical", "5s 为 critical");
assert(getTimerUrgency(0) === "expired", "0s 为 expired");

console.log(`\n--- 结果: ${passed} 通过, ${failed} 失败 ---\n`);
if (failed > 0) process.exit(1);
