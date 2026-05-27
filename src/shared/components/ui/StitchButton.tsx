"use client";

import { Icon } from "@/shared/components/ui/Icon";
import { cn } from "@/shared/lib/utils";
import type { ReactNode } from "react";

type StitchButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "dark" | "ghost";
  className?: string;
  icon?: string;
  disabled?: boolean;
};

/** 原型统一主按钮：高 56px、全圆角、主色阴影 */
export function StitchButton({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className,
  icon,
  disabled,
}: StitchButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "btn-scale-safe flex h-14 w-full items-center justify-center gap-2 rounded-full text-lg font-semibold transition-all active:scale-95",
        variant === "primary" &&
          "bg-primary text-on-primary shadow-lg shadow-primary/25 hover:bg-primary/95",
        variant === "dark" &&
          "bg-on-surface text-white hover:opacity-90",
        variant === "ghost" &&
          "border border-outline-variant bg-white/80 text-on-surface hover:bg-surface-container-low",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      {children}
      {icon && <Icon name={icon} />}
    </button>
  );
}
