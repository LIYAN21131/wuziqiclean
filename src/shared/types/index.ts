/** 对局相关类型 — 与 lib/gomoku/types 解耦 UI 层 */
export type { Board, Cell, StoneColor, Position, MoveRecord, GameStatus, GameResult } from "@/features/game/lib/gomoku/types";

export type GameEndReason = "normal" | "human_timeout" | "ai_timeout" | "resign";

export type { MatchRecord, ActiveMatch } from "@/features/game/lib/match/types";

export type { UserProfile } from "@/features/profile/lib/types";

export type { OnlineStatus } from "@/features/presence/lib/types";
