"use client";

import { Avatar } from "@/shared/components/ui/Avatar";
import { Icon } from "@/shared/components/ui/Icon";
import { ProfileSignature } from "@/features/profile/components/ProfileSignature";
import { usePresenceDotClassName } from "@/features/presence/components/OnlineStatusBadge";
import { getAvatarPresetById } from "@/features/profile/lib/settings/defaults";
import { cn } from "@/shared/lib/utils";

type PlayerBarProps = {
  isHuman: boolean;
  name: string;
  signature?: string;
  isActive: boolean;
  turnLabel?: string;
  avatarUrl?: string;
  showOnlineStatus?: boolean;
};

const AI_AVATAR_URL = getAvatarPresetById("sophia").url;

/** 原型 _2 玩家信息条 */
export function PlayerBar({
  isHuman,
  name,
  signature,
  isActive,
  turnLabel,
  avatarUrl,
  showOnlineStatus = false,
}: PlayerBarProps) {
  const src = avatarUrl ?? (isHuman ? getAvatarPresetById("master").url : AI_AVATAR_URL);
  const presenceDot = usePresenceDotClassName();

  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 items-center gap-2",
        !isHuman && "flex-row-reverse",
      )}
    >
      <div className="relative shrink-0">
        <Avatar
          src={src}
          alt={name}
          size="md"
          showStatusDot={isHuman && showOnlineStatus}
          statusDotClassName={presenceDot}
        />
        {isActive && !showOnlineStatus && (
          <span className="absolute -left-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-primary" />
        )}
        {isActive && showOnlineStatus && (
          <span className="absolute -left-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-primary" />
        )}
      </div>
      <div
        className={cn(
          "glass-card min-w-0 rounded-2xl px-3 py-2 transition-all duration-300",
          isActive && "turn-glow border-2 border-primary",
          !isActive && "border border-white/60 opacity-85",
        )}
      >
        <p className="truncate text-sm font-semibold text-on-surface">{name}</p>
        {isHuman && signature && (
          <ProfileSignature
            signature={signature}
            lines={1}
            className="text-[10px] leading-tight opacity-90"
          />
        )}
        {isActive && turnLabel && (
          <p className="text-xs font-medium text-primary">{turnLabel}</p>
        )}
      </div>
    </div>
  );
}

export function AiThinkingBadge() {
  return (
    <div className="flex items-center gap-1 rounded-full bg-surface-container-low px-3 py-1 text-xs text-secondary">
      <Icon name="smart_toy" className="text-base text-primary" />
      <span>AI 思考中…</span>
    </div>
  );
}
