"use client";

import { useEffect, useState } from "react";

import { formatCountdown } from "@/lib/utils";

export function useCountdown(expiresAt: string) {
  const [countdown, setCountdown] = useState(() => formatCountdown(expiresAt));

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCountdown(formatCountdown(expiresAt));
    }, 1000 * 30);

    return () => window.clearInterval(interval);
  }, [expiresAt]);

  return countdown;
}
