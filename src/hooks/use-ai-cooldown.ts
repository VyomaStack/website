"use client";

import { useCallback, useEffect, useState } from "react";

const COOLDOWN_SECONDS = 30;

export function useAiCooldown() {
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const isRateLimitError = useCallback((message: string) => {
    return (
      message.toLowerCase().includes("rate limit") ||
      message.toLowerCase().includes("free tier")
    );
  }, []);

  function triggerCooldown() {
    setCooldown(COOLDOWN_SECONDS);
  }

  return {
    cooldown,
    canRequest: cooldown === 0,
    isRateLimitError,
    triggerCooldown,
    cooldownLabel:
      cooldown > 0 ? `Wait ${cooldown}s` : undefined,
  };
}
