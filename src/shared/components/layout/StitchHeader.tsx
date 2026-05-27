"use client";

import { Avatar } from "@/shared/components/ui/Avatar";
import { Icon } from "@/shared/components/ui/Icon";
import { PlayerProfileCard } from "@/features/profile/components/PlayerProfileCard";
import { useSettings } from "@/features/profile/context/SettingsProvider";
import { cn } from "@/shared/lib/utils";

type StitchHeaderProps = {
  title: string;
  onBack?: () => void;
  showMenu?: boolean;
  centerTitle?: boolean;
  /** 头像旁展示昵称 + 签名 */
  showPlayerChip?: boolean;
  className?: string;
};

/** 原型顶栏：毛玻璃 + 底阴影 + 16px 高度 */
export function StitchHeader({
  title,
  onBack,
  showMenu = true,
  centerTitle = false,
  showPlayerChip = false,
  className,
}: StitchHeaderProps) {
  const { avatarUrl, settings } = useSettings();

  return (
    <header
      className={cn(
        "fixed top-0 z-50 flex h-16 w-full items-center border-b border-white/50 bg-surface/80 px-4 pt-safe backdrop-blur-xl",
        "shadow-[0_10px_40px_rgba(0,0,0,0.04)]",
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-xl items-center justify-between">
        <div className="flex w-10 justify-start">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="text-primary transition-transform active:scale-95"
              aria-label="返回"
            >
              <Icon name="arrow_back" />
            </button>
          ) : showMenu ? (
            <button
              type="button"
              className="text-primary transition-transform active:scale-95"
              aria-label="菜单"
            >
              <Icon name="menu" />
            </button>
          ) : (
            <span className="w-6" />
          )}
        </div>

        <h1
          className={cn(
            "text-primary tracking-tight",
            centerTitle
              ? "absolute left-1/2 -translate-x-1/2 text-headline-mobile"
              : "text-headline-mobile",
          )}
        >
          {title}
        </h1>

        <div className={cn("flex justify-end", showPlayerChip ? "min-w-[7.5rem]" : "w-10")}>
          {showPlayerChip ? (
            <PlayerProfileCard variant="mini" />
          ) : (
            <Avatar src={avatarUrl} alt={settings.displayName} size="sm" />
          )}
        </div>
      </div>
    </header>
  );
}
