"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  PRESENCE_ACTIVITY_THROTTLE_MS,
  PRESENCE_IDLE_MS,
  PRESENCE_LABELS,
  type OnlineStatus,
} from "@/features/presence/lib/types";

type PresenceContextValue = {
  status: OnlineStatus;
  label: string;
  isOnline: boolean;
  /** 手动标记活动（通常由全局监听器自动调用） */
  pingActivity: () => void;
  /** 强制设为在线（如返回页面） */
  setOnline: () => void;
};

const PresenceContext = createContext<PresenceContextValue | null>(null);

export function PresenceProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<OnlineStatus>("online");
  const lastActiveRef = useRef(Date.now());
  const lastPingRef = useRef(0);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleIdleCheck = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      const elapsed = Date.now() - lastActiveRef.current;
      if (elapsed >= PRESENCE_IDLE_MS) {
        setStatus("offline");
      } else {
        scheduleIdleCheck();
      }
    }, PRESENCE_IDLE_MS);
  }, []);

  const setOnline = useCallback(() => {
    lastActiveRef.current = Date.now();
    setStatus("online");
    scheduleIdleCheck();
  }, [scheduleIdleCheck]);

  const pingActivity = useCallback(() => {
    const now = Date.now();
    if (now - lastPingRef.current < PRESENCE_ACTIVITY_THROTTLE_MS) return;
    lastPingRef.current = now;
    lastActiveRef.current = now;
    setStatus((prev) => (prev === "offline" ? "online" : prev));
    scheduleIdleCheck();
  }, [scheduleIdleCheck]);

  useEffect(() => {
    setOnline();

    const events = ["mousedown", "keydown", "touchstart", "scroll", "pointerdown"] as const;
    const onActivity = () => pingActivity();

    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));

    const onVisibility = () => {
      if (document.visibilityState === "visible") setOnline();
    };
    const onFocus = () => setOnline();

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);

    return () => {
      events.forEach((e) => window.removeEventListener(e, onActivity));
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [pingActivity, setOnline]);

  const value = useMemo(
    () => ({
      status,
      label: PRESENCE_LABELS[status],
      isOnline: status === "online",
      pingActivity,
      setOnline,
    }),
    [status, pingActivity, setOnline],
  );

  return (
    <PresenceContext.Provider value={value}>{children}</PresenceContext.Provider>
  );
}

export function usePresence() {
  const ctx = useContext(PresenceContext);
  if (!ctx) throw new Error("usePresence must be used within PresenceProvider");
  return ctx;
}
