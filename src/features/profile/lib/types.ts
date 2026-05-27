/** 全局统一的玩家资料模型（由 SettingsProvider 派生） */
export type UserProfile = {
  displayName: string;
  signature: string;
  avatarId: string;
  avatarUrl: string;
};
