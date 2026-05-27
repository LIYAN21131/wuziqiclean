"use client";

import { Icon } from "@/shared/components/ui/Icon";
import { cn } from "@/shared/lib/utils";
import { useEffect } from "react";

type UndoToastProps = {
  message: string | null;
  onDismiss: () => void;
};

/** 悔棋成功 / 提示浮层 */
export function UndoToast({ message, onDismiss }: UndoToastProps) {
  useEffect(() => {
    if (!message) return;
    const id = window.setTimeout(onDismiss, 2200);
    return () => window.clearTimeout(id);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div
      className={cn(
        "fixed left-1/2 top-24 z-[70] -translate-x-1/2",
        "animate-[fadeIn_0.25s_ease-out]",
      )}
      role="status"
    >
      <div className="glass flex items-center gap-2 rounded-full border border-white/60 px-4 py-2.5 shadow-lg">
        <Icon name="undo" className="text-lg text-primary" />
        <span className="text-sm font-medium text-on-surface">{message}</span>
      </div>
    </div>
  );
}
