/** 玩家连接状态（全局 Presence） */
export type OnlineStatus = "online" | "offline";

export type PresenceState = {
  status: OnlineStatus;
  /** 上次活动时间戳 */
  lastActiveAt: number;
};

export const PRESENCE_LABELS: Record<OnlineStatus, string> = {
  online: "在线中",
  offline: "已离线",
};

/** 无操作超过此时间自动离线（5 分钟） */
export const PRESENCE_IDLE_MS = 5 * 60 * 1000;

/** 活动检测节流间隔 */
export const PRESENCE_ACTIVITY_THROTTLE_MS = 2_000;

/** 在线状态点样式 */
export const PRESENCE_DOT_CLASS: Record<OnlineStatus, string> = {
  online: "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.55)]",
  offline: "bg-secondary/45",
};
