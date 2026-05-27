"use client";

import { cn } from "@/shared/lib/utils";
import { DEFAULT_SETTINGS } from "@/features/profile/lib/settings/defaults";
import { resolveSignatureDisplay } from "@/features/profile/lib/signature";

type ProfileSignatureProps = {
  signature?: string;
  /** 空签名时的占位（默认使用全局默认签名） */
  fallback?: string;
  /** 单行截断 */
  lines?: 1 | 2;
  className?: string;
  /** 占位样式（较淡） */
  muted?: boolean;
};

/** 签名字号略小于昵称，支持换行/截断 */
export function ProfileSignature({
  signature,
  fallback = DEFAULT_SETTINGS.signature,
  lines = 1,
  className,
  muted = false,
}: ProfileSignatureProps) {
  const text = resolveSignatureDisplay(signature, fallback);

  return (
    <p
      className={cn(
        "min-w-0 break-words text-label leading-snug text-secondary",
        lines === 1 && "line-clamp-1",
        lines === 2 && "line-clamp-2",
        muted && "opacity-70",
        className,
      )}
      title={text}
    >
      {text}
    </p>
  );
}
