/**
 * 设计主题令牌 — 与 globals.css @theme 保持一致
 * 供 TS/组件引用，避免 magic string
 */
export const themeTokens = {
  colors: {
    primary: "#b7102a",
    primaryContainer: "#db313f",
    background: "#fcf8fb",
    surface: "#fcf8fb",
    onSurface: "#1b1b1d",
    secondary: "#5d5f5f",
    outline: "#8f6f6e",
    outlineVariant: "#e4bebc",
    loginPrimary: "#d42337",
    loginBg: "#fdf8f8",
    loss: "#4a5568",
  },
  radius: {
    card: "1rem",
    cardLg: "2rem",
    pill: "9999px",
  },
  spacing: {
    marginMobile: "1rem",
    section: "2.5rem",
  },
} as const;

export type ThemeTokens = typeof themeTokens;
