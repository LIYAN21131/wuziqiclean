export const APP_NAME = "LY的五子棋";
export const GAME_TITLE = "禅意五子棋";

export const BOARD_SIZE = 15;

export const PLAYER = {
  human: "black" as const,
  ai: "white" as const,
};

export const AI_THINK_MIN_MS = 300;
export const AI_THINK_MAX_MS = 1200;

export const TURN_TIMER_SECONDS = 45;

/** 每局最多悔棋次数（非全局累计） */
export const MAX_UNDO_PER_GAME = 3;

export const STORAGE_KEYS = {
  winStreak: "gomoku_win_streak",
  bestStreak: "gomoku_best_streak",
  displayName: "gomoku_display_name",
  userSettings: "gomoku_user_settings",
  activeMatch: "gomoku_active_match",
  matchHistory: "gomoku_match_history",
  gameState: "gomoku_game_state",
  authSession: "gomoku_auth_session",
} as const;

export const DEMO_LOGIN = {
  username: "test",
  password: "password",
} as const;
