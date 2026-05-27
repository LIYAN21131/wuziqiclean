"use client";

import { Avatar } from "@/shared/components/ui/Avatar";
import { AVATAR_PRESETS } from "@/features/profile/lib/settings/defaults";
import { cn } from "@/shared/lib/utils";

type AvatarPickerProps = {
  value: string;
  onChange: (avatarId: string) => void;
};

export function AvatarPicker({ value, onChange }: AvatarPickerProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {AVATAR_PRESETS.map((preset) => {
        const selected = value === preset.id;
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onChange(preset.id)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-2xl border p-3 transition-all active:scale-[0.98]",
              selected
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-outline-variant/40 bg-white/60 hover:border-primary/30",
            )}
          >
            <Avatar
              src={preset.url}
              alt={preset.label}
              size="xl"
              selected={selected}
            />
            <span
              className={cn(
                "text-sm font-semibold",
                selected ? "text-primary" : "text-on-surface",
              )}
            >
              {preset.label}
            </span>
            <span className="text-caption text-center leading-tight text-secondary">
              {preset.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
