"use client";

import { useSettings } from "@/features/profile/context/SettingsProvider";
import {
  SIGNATURE_EXAMPLES,
  SIGNATURE_MAX_LENGTH,
  SIGNATURE_PLACEHOLDER,
  sanitizeSignature,
} from "@/features/profile/lib/signature";
import { cn } from "@/shared/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";

type SignatureInputProps = {
  className?: string;
  /** 输入过程中实时预览（设置页资料卡） */
  onPreviewChange?: (value: string) => void;
};

/** 卡片化签名输入 — 本地即时预览 + 防抖写入全局，避免输入卡顿 */
export function SignatureInput({ className, onPreviewChange }: SignatureInputProps) {
  const { settings, updateSettings } = useSettings();
  const [local, setLocal] = useState(settings.signature);
  const [focused, setFocused] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocal(settings.signature);
  }, [settings.signature]);

  const commit = useCallback(
    (value: string) => {
      const next = sanitizeSignature(value);
      updateSettings({ signature: next });
    },
    [updateSettings],
  );

  const handleChange = (value: string) => {
    const next = sanitizeSignature(value);
    setLocal(next);
    onPreviewChange?.(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => commit(next), 280);
  };

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    [],
  );

  const handleBlur = () => {
    setFocused(false);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    commit(local);
  };

  const remaining = SIGNATURE_MAX_LENGTH - local.length;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between gap-2">
        <label htmlFor="signature" className="text-sm font-semibold text-on-surface">
          个人签名
        </label>
        <span
          className={cn(
            "text-caption tabular-nums transition-colors",
            remaining <= 8 ? "text-primary" : "text-secondary",
          )}
        >
          {local.length}/{SIGNATURE_MAX_LENGTH}
        </span>
      </div>

      <div
        className={cn(
          "glass-card overflow-hidden rounded-2xl border transition-all duration-300",
          focused
            ? "border-primary/60 shadow-[0_0_0_3px_rgba(183,16,42,0.12)]"
            : "border-white/60",
        )}
      >
        <textarea
          id="signature"
          rows={3}
          value={local}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          maxLength={SIGNATURE_MAX_LENGTH}
          placeholder={SIGNATURE_PLACEHOLDER}
          className={cn(
            "w-full resize-none bg-transparent px-4 py-3.5 text-sm leading-relaxed text-on-surface",
            "placeholder:text-secondary/50 outline-none",
          )}
          aria-describedby="signature-hints"
        />
        <div className="border-t border-white/40 bg-surface-container-low/40 px-4 py-2.5">
          <p id="signature-hints" className="text-caption text-secondary">
            支持中文、英文与 Emoji · 修改后全应用即时同步
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {SIGNATURE_EXAMPLES.map((sample) => (
          <button
            key={sample}
            type="button"
            onClick={() => {
              setLocal(sample);
              commit(sample);
            }}
            className="rounded-full border border-outline-variant/60 bg-white/70 px-3 py-1.5 text-caption text-secondary transition-all hover:border-primary/40 hover:text-primary active:scale-95"
          >
            {sample}
          </button>
        ))}
      </div>
    </div>
  );
}
