"use client";

import { useEffect } from "react";

/** 检测 standalone 模式，为 html 添加类名以启用全屏样式 */
export function PwaStandaloneInit() {
  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari 添加到主屏幕
      ("standalone" in window.navigator &&
        (window.navigator as Navigator & { standalone?: boolean }).standalone === true);

    if (standalone) {
      document.documentElement.classList.add("pwa-standalone");
      document.documentElement.dataset.pwaStandalone = "true";
    }

    const mq = window.matchMedia("(display-mode: standalone)");
    const onChange = () => {
      if (mq.matches) {
        document.documentElement.classList.add("pwa-standalone");
        document.documentElement.dataset.pwaStandalone = "true";
      } else {
        document.documentElement.classList.remove("pwa-standalone");
        delete document.documentElement.dataset.pwaStandalone;
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return null;
}
