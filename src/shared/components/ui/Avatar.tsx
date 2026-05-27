"use client";

import { cn } from "@/shared/lib/utils";
import Image from "next/image";

export type AvatarSize = "sm" | "md" | "lg" | "xl";

const SIZE_PX: Record<AvatarSize, number> = {
  sm: 36,
  md: 48,
  lg: 56,
  xl: 64,
};

type AvatarProps = {
  src: string;
  alt?: string;
  size?: AvatarSize;
  className?: string;
  showStatusDot?: boolean;
  statusDotClassName?: string;
  selected?: boolean;
};

/**
 * 全局统一头像：正圆裁切、object-cover 防拉伸、尺寸规范
 */
export function Avatar({
  src,
  alt = "",
  size = "md",
  className,
  showStatusDot,
  statusDotClassName,
  selected,
}: AvatarProps) {
  const px = SIZE_PX[size];

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full bg-surface-container-highest",
        "ring-2 ring-white/80 shadow-md",
        selected && "ring-primary ring-offset-2 ring-offset-background",
        className,
      )}
      style={{ width: px, height: px }}
    >
      <Image
        src={src}
        alt={alt}
        width={px}
        height={px}
        className="h-full w-full object-cover object-[center_20%]"
        sizes={`${px}px`}
        unoptimized={src.startsWith("http")}
        draggable={false}
      />
      {showStatusDot && (
        <span
          className={cn(
            "absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white transition-all duration-500",
            statusDotClassName ?? "bg-primary",
          )}
        />
      )}
    </div>
  );
}
