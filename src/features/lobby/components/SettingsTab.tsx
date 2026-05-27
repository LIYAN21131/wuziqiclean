"use client";



import { AvatarPicker } from "@/features/profile/components/AvatarPicker";

import { SignatureInput } from "@/features/profile/components/SignatureInput";

import { PlayerProfileCard } from "@/features/profile/components/PlayerProfileCard";

import { Icon } from "@/shared/components/ui/Icon";

import { useSettings } from "@/features/profile/context/SettingsProvider";

import {

  FONT_STYLE_FAMILIES,

  type FontSizePreset,

  type FontStylePreset,

} from "@/features/profile/lib/settings/types";

import { clearLoggedIn } from "@/features/auth/lib/session";

import { cn } from "@/shared/lib/utils";

import { useRouter } from "next/navigation";
import { useState } from "react";



const FONT_SIZES: { id: FontSizePreset; label: string }[] = [

  { id: "sm", label: "小" },

  { id: "md", label: "标准" },

  { id: "lg", label: "大" },

];



const FONT_STYLES: { id: FontStylePreset; label: string; sample: string }[] = [

  { id: "modern", label: "现代", sample: "禅意五子棋 Modern" },

  { id: "classic", label: "古典", sample: "禅意五子棋 Classic" },

  { id: "rounded", label: "圆润", sample: "禅意五子棋 Rounded" },

];



export function SettingsTab() {

  const router = useRouter();

  const { settings, updateSettings, resetSettings } = useSettings();
  const [previewSignature, setPreviewSignature] = useState<string | undefined>();

  return (
    <div className="space-y-8">
      <PlayerProfileCard
        variant="card"
        signatureOverride={previewSignature}
        subtitle="修改下方资料后，全应用实时同步"
      />



      <section className="space-y-3">

        <label htmlFor="displayName" className="text-sm font-semibold text-on-surface">

          玩家名称

        </label>

        <input

          id="displayName"

          value={settings.displayName}

          onChange={(e) => updateSettings({ displayName: e.target.value })}

          maxLength={16}

          className="glass-card w-full rounded-2xl border border-white/60 bg-white/80 px-4 py-3 outline-none transition-all focus:border-primary focus:shadow-[0_0_0_3px_rgba(183,16,42,0.12)]"

          placeholder="输入昵称"

        />

      </section>



      <SignatureInput onPreviewChange={setPreviewSignature} />



      <section className="space-y-3">

        <p className="text-sm font-semibold text-on-surface">头像</p>

        <p className="text-label text-secondary">

          选择与游戏大厅风格统一的官方角色形象，全局即时生效

        </p>

        <AvatarPicker

          value={settings.avatarId}

          onChange={(avatarId) => updateSettings({ avatarId })}

        />

      </section>



      <section className="space-y-3">

        <p className="text-sm font-semibold text-on-surface">字体大小</p>

        <p className="text-label text-secondary">

          调整后全局界面（除登录页）将立即同步，刷新后仍保留

        </p>

        <div className="flex gap-2">

          {FONT_SIZES.map((f) => (

            <button

              key={f.id}

              type="button"

              onClick={() => updateSettings({ fontSize: f.id })}

              className={cn(

                "btn-scale-safe flex-1 rounded-full py-2.5 text-sm font-medium transition-colors",

                settings.fontSize === f.id

                  ? "bg-primary text-on-primary"

                  : "bg-surface-container-high text-secondary",

              )}

            >

              {f.label}

            </button>

          ))}

        </div>

      </section>



      <section className="space-y-3">

        <p className="text-sm font-semibold text-on-surface">界面字体风格</p>

        <div className="space-y-2">

          {FONT_STYLES.map((f) => (

            <button

              key={f.id}

              type="button"

              onClick={() => updateSettings({ fontStyle: f.id })}

              className={cn(

                "w-full rounded-2xl border px-4 py-3 text-left transition-all active:scale-[0.99]",

                settings.fontStyle === f.id

                  ? "border-primary bg-primary/5"

                  : "border-outline-variant/50 bg-white/60",

              )}

              style={{ fontFamily: FONT_STYLE_FAMILIES[f.id] }}

            >

              <span className="text-xs text-secondary">{f.label}</span>

              <p className="font-medium text-on-surface">{f.sample}</p>

            </button>

          ))}

        </div>

      </section>



      <button

        type="button"

        onClick={resetSettings}

        className="flex w-full items-center justify-center gap-2 rounded-full border border-outline-variant py-3 text-sm text-secondary hover:bg-surface-container-low"

      >

        <Icon name="restart_alt" />

        恢复默认设置

      </button>



      <button

        type="button"

        onClick={() => {

          clearLoggedIn();

          router.replace("/");

        }}

        className="flex w-full items-center justify-center gap-2 rounded-full border border-primary/30 py-3 text-sm font-medium text-primary hover:bg-primary/5"

      >

        <Icon name="logout" />

        退出登录

      </button>

    </div>

  );

}


