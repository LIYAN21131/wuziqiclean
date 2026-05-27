"use client";

import { Avatar } from "@/shared/components/ui/Avatar";
import { ProfileSignature } from "@/features/profile/components/ProfileSignature";
import { OnlineStatusBadge, usePresenceDotClassName } from "@/features/presence/components/OnlineStatusBadge";
import { useUserProfile } from "@/features/profile/context/SettingsProvider";
import { cn } from "@/shared/lib/utils";

type PlayerProfileCardProps = {
  variant?: "card" | "compact" | "mini";
  className?: string;
  signatureOverride?: string;
  trailing?: React.ReactNode;
  /** 显示全局在线状态（默认 true） */
  showOnlineStatus?: boolean;
  /** 覆盖在线状态点（如对局中显示绿色） */
  statusDotClassName?: string;
  showStatusDot?: boolean;
  subtitle?: string;
};

/**
 * 全局统一的玩家资料卡 — 昵称 + 签名 + 头像
 * 所有页面通过 useUserProfile 读取同一份资料
 */
export function PlayerProfileCard({
  variant = "card",
  className,
  signatureOverride,
  trailing,
  showOnlineStatus = true,
  statusDotClassName,
  showStatusDot = true,
  subtitle,
}: PlayerProfileCardProps) {
  const profile = useUserProfile();
  const signature = signatureOverride ?? profile.signature;
  const presenceDot = usePresenceDotClassName();
  const dotClass = statusDotClassName ?? (showOnlineStatus ? presenceDot : undefined);

  if (variant === "mini") {
    return (
      <div className={cn("flex min-w-0 items-center gap-2", className)}>
        <div className="min-w-0 flex-1 text-right">
          <p className="truncate text-xs font-semibold text-on-surface">
            {profile.displayName}
          </p>
          <ProfileSignature signature={signature} lines={1} className="text-[10px] leading-tight" />
          {showOnlineStatus && variant === "mini" && (
            <OnlineStatusBadge dotOnly size="sm" className="mt-0.5 justify-end" />
          )}
        </div>
        <Avatar
          src={profile.avatarUrl}
          alt={profile.displayName}
          size="sm"
          showStatusDot={showStatusDot && showOnlineStatus}
          statusDotClassName={dotClass}
        />
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "glass-card flex items-center gap-4 rounded-2xl border border-white/60 p-4",
          "shadow-[0_8px_32px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(183,16,42,0.06)]",
          className,
        )}
      >
        <Avatar
          src={profile.avatarUrl}
          alt={profile.displayName}
          size="lg"
          showStatusDot={showStatusDot && showOnlineStatus}
          statusDotClassName={dotClass}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-bold text-on-surface">
            {profile.displayName}
          </p>
          <ProfileSignature signature={signature} lines={2} className="mt-0.5" />
          {showOnlineStatus && (
            <OnlineStatusBadge size="sm" className="mt-1.5" />
          )}
          {subtitle && (
            <p className="mt-1 text-xs font-medium text-primary">{subtitle}</p>
          )}
        </div>
        {trailing}
      </div>
    );
  }

  return (
    <section
      className={cn(
        "glass-card rounded-2xl border-2 border-primary/20 p-5",
        "shadow-[0_10px_40px_rgba(183,16,42,0.06)]",
        className,
      )}
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
        个人资料
      </p>
      <div className="flex items-start gap-4">
        <Avatar
          src={profile.avatarUrl}
          alt={profile.displayName}
          size="lg"
          showStatusDot={showStatusDot && showOnlineStatus}
          statusDotClassName={dotClass}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-bold text-on-surface">
            {profile.displayName}
          </p>
          <ProfileSignature signature={signature} lines={2} className="mt-1" />
          {showOnlineStatus && (
            <OnlineStatusBadge size="sm" className="mt-2" />
          )}
          {subtitle && (
            <p className="mt-2 text-xs text-secondary">{subtitle}</p>
          )}
        </div>
        {trailing}
      </div>
    </section>
  );
}
