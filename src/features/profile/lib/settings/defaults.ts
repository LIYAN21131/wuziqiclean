import type { UserSettings } from "./types";

export type AvatarPreset = {
  id: string;
  label: string;
  url: string;
  /** 用于无障碍与风格说明 */
  description: string;
};

export const DEFAULT_SETTINGS: UserSettings = {
  displayName: "魏大师",
  signature: "专注 · 谋略 · 精进",
  avatarId: "monk",
  fontSize: "md",
  fontStyle: "modern",
};

/** 与原型一致的禅意游戏头像体系 */
export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: "monk",
    label: "禅意",
    description: "沉稳男棋手 · 默认角色",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBG0fQkW2U4EyWU5g0T7nI5m8FfFPOvt7g2t01tkbpHS_tSqWQ2xgxxX5eSqtKFUSBo6Pcyq4gqJ4FB5mdF9h1bSwShvvxZSPWUDXtP3uQ3y9EEJJHHdz3Fjdb9ICnQnSCqEplZfilNtCsO2KaLm8Txu24u1NaF5e-yl4BhfBIHFtiIMczZPTD3PHp31F6d-RhSqTMSerwFp8k6nuuNtx3EaEz0ZZiqQ0dGo3K6opuKeEg6WmEMyhRhfhVzd7ibkb91Sdg4I0xrunIP",
  },
  {
    id: "sophia",
    label: "清雅",
    description: "现代简洁女棋手 · 大厅官方角色",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAS8gmb4zN1QCNjqnXgDHzowSz1nzkbxu_fh-tntn2LIFXpl33f3DiTHDaoF4BOweetwOD5LT5dB2_FJI7Y60p1Cj1fpqzzKGKCAfNb7sb0tEH6IyntN0PT98YqAUIg9ewi0TKhreJ8W0LoRk_OM50A87-7GcMuSFcXJZWjhfLIJZp6nXv5GokzQ4DD3YYjsWrRkyfV6VFJMASi_ydHHj3QAHZlcGSySE--nY0Nd89rvk-SHpng8JMi9YzJEmt08eOp58ymN_Hsw9ce",
  },
  {
    id: "master",
    label: "大师",
    description: "资深棋手形象",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAS8gmb4zN1QCNjqnXgDHzowSz1nzkbxu_fh-tntn2LIFXpl33f3DiTHDaoF4BOweetwOD5LT5dB2_FJI7Y60p1Cj1fpqzzKGKCAfNb7sb0tEH6IyntN0PT98YqAUIg9ewi0TKhreJ8W0LoRk_OM50A87-7GcMuSFcXJZWjhfLIJZp6nXv5GokzQ4DD3YYjsWrRkyfV6VFJMASi_ydHHj3QAHZlcGSySE--nY0Nd89rvk-SHpng8JMi9YzJEmt08eOp58ymN_Hsw9ce",
  },
  {
    id: "ai",
    label: "AI",
    description: "Zen AI 对手",
    url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBG0fQkW2U4EyWU5g0T7nI5m8FfFPOvt7g2t01tkbpHS_tSqWQ2xgxxX5eSqtKFUSBo6Pcyq4gqJ4FB5mdF9h1bSwShvvxZSPWUDXtP3uQ3y9EEJJHHdz3Fjdb9ICnQnSCqEplZfilNtCsO2KaLm8Txu24u1NaF5e-yl4BhfBIHFtiIMczZPTD3PHp31F6d-RhSqTMSerwFp8k6nuuNtx3EaEz0ZZiqQ0dGo3K6opuKeEg6WmEMyhRhfhVzd7ibkb91Sdg4I0xrunIP",
  },
];

export function getAvatarPresetById(id: string): AvatarPreset {
  return AVATAR_PRESETS.find((a) => a.id === id) ?? AVATAR_PRESETS[0];
}
