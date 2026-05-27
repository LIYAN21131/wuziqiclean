import { DEFAULT_SETTINGS } from "@/features/profile/lib/settings/defaults";
import {
  FONT_SIZE_SCALE,
  FONT_STYLE_FAMILIES,
  type FontSizePreset,
  type UserSettings,
} from "@/features/profile/lib/settings/types";
import { STORAGE_KEYS } from "@/shared/lib/constants";
import { storageGet } from "@/shared/lib/storage";

/** 根字号基准（px），所有 rem 字号据此缩放 */
export const FONT_ROOT_PX = 16;

export const LINE_HEIGHT_BY_SIZE: Record<FontSizePreset, number> = {
  sm: 1.52,
  md: 1.5,
  lg: 1.48,
};

export type ApplyFontThemeOptions = {
  isLoginPage: boolean;
};

/** 将用户字体设置应用到 documentElement（全局生效） */
export function applyFontTheme(
  settings: UserSettings,
  { isLoginPage }: ApplyFontThemeOptions,
): void {
  const root = document.documentElement;
  const scale = FONT_SIZE_SCALE[settings.fontSize];
  const lineHeight = LINE_HEIGHT_BY_SIZE[settings.fontSize];

  root.dataset.fontSize = settings.fontSize;
  root.dataset.fontStyle = settings.fontStyle;

  if (isLoginPage) {
    root.dataset.loginPage = "true";
    root.dataset.appScaled = "false";
    root.style.setProperty("--app-font-scale", "1");
    root.style.setProperty("--app-root-font-size", `${FONT_ROOT_PX}px`);
    root.style.setProperty("--app-line-height", "1.5");
    root.style.removeProperty("--app-font-family");
    root.style.fontSize = `${FONT_ROOT_PX}px`;
    return;
  }

  root.dataset.loginPage = "false";
  root.dataset.appScaled = "true";
  root.style.setProperty("--app-font-scale", String(scale));
  root.style.setProperty(
    "--app-root-font-size",
    `calc(${FONT_ROOT_PX}px * ${scale})`,
  );
  root.style.setProperty("--app-line-height", String(lineHeight));
  root.style.setProperty(
    "--app-font-family",
    FONT_STYLE_FAMILIES[settings.fontStyle],
  );
  root.style.fontSize = `calc(${FONT_ROOT_PX}px * ${scale})`;
}

/** 供 layout 内联脚本在首屏绘制前恢复字号，减少闪动 */
export function getFontBootstrapScript(): string {
  return `(function(){try{
    var p=location.pathname;
    if(p==="/"){document.documentElement.dataset.loginPage="true";document.documentElement.style.fontSize="16px";return;}
    var raw=localStorage.getItem(${JSON.stringify(STORAGE_KEYS.userSettings)});
    var s=raw?JSON.parse(raw):{};
    var scale=(${JSON.stringify(FONT_SIZE_SCALE)})[s.fontSize||"md"]||1;
    var lh=(${JSON.stringify(LINE_HEIGHT_BY_SIZE)})[s.fontSize||"md"]||1.5;
    var fam=(${JSON.stringify(FONT_STYLE_FAMILIES)})[s.fontStyle||"modern"];
    var el=document.documentElement;
    el.dataset.appScaled="true";
    el.dataset.loginPage="false";
    el.style.setProperty("--app-font-scale",String(scale));
    el.style.setProperty("--app-root-font-size","calc(16px * "+scale+")");
    el.style.setProperty("--app-line-height",String(lh));
    el.style.setProperty("--app-font-family",fam);
    el.style.fontSize="calc(16px * "+scale+")";
  }catch(e){}})();`;
}

export function readSettingsForTheme(): UserSettings {
  const parsed = storageGet<Partial<UserSettings> | null>(STORAGE_KEYS.userSettings, null);
  if (!parsed) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...parsed };
}
