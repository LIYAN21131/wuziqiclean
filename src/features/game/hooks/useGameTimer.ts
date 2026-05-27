"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TURN_TIMER_SECONDS } from "@/shared/lib/constants";

export type TurnOwner = "human" | "ai" | null;

export type TimerUrgency = "normal" | "warning" | "critical" | "expired";

export const TIMER_WARN_ORANGE = 10;
export const TIMER_WARN_CRITICAL = 5;

export function getTimerUrgency(secondsLeft: number): TimerUrgency {
  if (secondsLeft <= 0) return "expired";
  if (secondsLeft <= TIMER_WARN_CRITICAL) return "critical";
  if (secondsLeft <= TIMER_WARN_ORANGE) return "warning";
  return "normal";
}

export type UseGameTimerOptions = {
  enabled: boolean;
  turnOwner: TurnOwner;
  paused?: boolean;
  initialSeconds?: number;
  totalSeconds?: number;
  onHumanTimeout: () => void;
  onAiTimeout: () => void;
};

export type UseGameTimerResult = {
  secondsLeft: number;
  totalSeconds: number;
  urgency: TimerUrgency;
  reset: (seconds?: number) => void;
  turnOwner: TurnOwner;
};

/**
 * 五子棋回合倒计时 — 单 interval，回合切换自动重置
 */
export function useGameTimer({
  enabled,
  turnOwner,
  paused = false,
  initialSeconds,
  totalSeconds = TURN_TIMER_SECONDS,
  onHumanTimeout,
  onAiTimeout,
}: UseGameTimerOptions): UseGameTimerResult {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds ?? totalSeconds);
  const timeoutFiredRef = useRef(false);
  const turnOwnerRef = useRef<TurnOwner>(turnOwner);
  const prevTurnRef = useRef<TurnOwner | undefined>(undefined);
  const callbacksRef = useRef({ onHumanTimeout, onAiTimeout });
  const hydratedInitialRef = useRef(initialSeconds);

  callbacksRef.current = { onHumanTimeout, onAiTimeout };

  useEffect(() => {
    turnOwnerRef.current = turnOwner;
  }, [turnOwner]);

  useEffect(() => {
    if (!enabled || !turnOwner) return;

    const isTurnChange =
      prevTurnRef.current !== undefined && prevTurnRef.current !== turnOwner;

    if (isTurnChange) {
      timeoutFiredRef.current = false;
      setSecondsLeft(totalSeconds);
    } else if (
      prevTurnRef.current === undefined &&
      hydratedInitialRef.current !== undefined
    ) {
      setSecondsLeft(hydratedInitialRef.current);
    }

    prevTurnRef.current = turnOwner;
  }, [turnOwner, enabled, totalSeconds]);

  useEffect(() => {
    if (!enabled) {
      prevTurnRef.current = undefined;
      timeoutFiredRef.current = false;
    }
  }, [enabled]);

  const reset = useCallback(
    (seconds = totalSeconds) => {
      timeoutFiredRef.current = false;
      hydratedInitialRef.current = seconds;
      setSecondsLeft(seconds);
    },
    [totalSeconds],
  );

  useEffect(() => {
    if (!enabled || paused || !turnOwner) return;

    const id = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 0) return 0;
        if (prev <= 1) {
          if (!timeoutFiredRef.current) {
            timeoutFiredRef.current = true;
            const owner = turnOwnerRef.current;
            if (owner === "human") callbacksRef.current.onHumanTimeout();
            else if (owner === "ai") callbacksRef.current.onAiTimeout();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [enabled, paused, turnOwner]);

  return {
    secondsLeft,
    totalSeconds,
    urgency: getTimerUrgency(secondsLeft),
    reset,
    turnOwner,
  };
}
