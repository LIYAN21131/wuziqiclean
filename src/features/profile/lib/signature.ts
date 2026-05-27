/** 个人签名最大长度（支持中文、英文、Emoji） */
export const SIGNATURE_MAX_LENGTH = 48;

export const SIGNATURE_PLACEHOLDER = "写一句自己的棋谱座右铭…";

export const SIGNATURE_EXAMPLES = [
  "落子无悔",
  "专注 · 谋略 · 精进",
  "今天也要赢一局",
] as const;

/** 去除控制字符，保留 Emoji 与多语言文本 */
export function sanitizeSignature(raw: string): string {
  return raw
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .slice(0, SIGNATURE_MAX_LENGTH);
}

/** 从 storage 恢复时规范化签名 */
export function normalizeSignature(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  return sanitizeSignature(value.trim());
}

/** 展示用：空签名时返回 fallback，避免布局塌陷 */
export function resolveSignatureDisplay(
  signature: string | undefined,
  fallback: string,
): string {
  const trimmed = signature?.trim();
  return trimmed ? trimmed : fallback;
}

/** 单行截断时的最大可见字符（CSS line-clamp 为主，此为辅助） */
export function truncateSignature(text: string, max = SIGNATURE_MAX_LENGTH): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}
