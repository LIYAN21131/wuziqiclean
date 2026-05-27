"use client";

import { applyFontTheme, readSettingsForTheme } from "@/shared/theme/font-theme";
import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

const LOGIN_PATH = "/";

/**
 * 路由切换时同步字号（登录页固定 16px，其余页面读取持久化设置）
 */
export function FontScaleController() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const stored = readSettingsForTheme();
    applyFontTheme(stored, { isLoginPage: pathname === LOGIN_PATH });
  }, [pathname]);

  return null;
}
