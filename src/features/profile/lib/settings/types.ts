export type FontSizePreset = "sm" | "md" | "lg";
export type FontStylePreset = "modern" | "classic" | "rounded";

export type UserSettings = {
  displayName: string;
  /** 个人签名 — 全局同步展示 */
  signature: string;
  avatarId: string;
  fontSize: FontSizePreset;
  fontStyle: FontStylePreset;
};

export const FONT_SIZE_SCALE: Record<FontSizePreset, number> = {
  sm: 0.9,
  md: 1,
  lg: 1.12,
};

export const FONT_STYLE_FAMILIES: Record<FontStylePreset, string> = {
  modern: '"Hanken Grotesk", ui-sans-serif, system-ui, sans-serif',
  classic: '"Noto Serif SC", "Songti SC", Georgia, serif',
  rounded: '"Nunito", "Hanken Grotesk", ui-rounded, sans-serif',
};
