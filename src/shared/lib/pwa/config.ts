import { APP_NAME, GAME_TITLE } from "@/shared/lib/constants";

/** PWA / 移动端安装用主题色（与 manifest、登录页一致） */
export const PWA_THEME_COLOR = "#d42337";
export const PWA_BACKGROUND_COLOR = "#fdf8f8";

export const PWA_APP_NAME = APP_NAME;
export const PWA_SHORT_NAME = "五子棋";
export const PWA_DESCRIPTION = `专注 · 谋略 · 精进 — ${GAME_TITLE}人机对战`;

export const PWA_MANIFEST_PATH = "/manifest.json";
export const PWA_ICONS = {
  icon192: "/icons/icon-192.png",
  icon512: "/icons/icon-512.png",
  appleTouch: "/icons/apple-touch-icon.png",
  maskable512: "/icons/icon-maskable-512.png",
} as const;
