"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PurchaseStatus } from "@/app/api/polar/status/route";

// Cache configuration
const CACHE_TTL = 60 * 1000; // 1 minute
let cachedStatus: PurchaseStatus | null = null;
let cacheTimestamp = 0;

export function useSubscription() {
  const [status, setStatus] = useState<PurchaseStatus>(() => {
    if (cachedStatus && Date.now() - cacheTimestamp < CACHE_TTL) {
      return cachedStatus;
    }
    return { isPro: false, purchasedAt: null, customerId: null };
  });
  const [isLoading, setIsLoading] = useState(() => {
    return !cachedStatus || Date.now() - cacheTimestamp >= CACHE_TTL;
  });
  const [error, setError] = useState<Error | null>(null);
  const fetchingRef = useRef(false);

  const fetchStatus = useCallback(async (force = false) => {
    if (fetchingRef.current) return;

    if (!force && cachedStatus && Date.now() - cacheTimestamp < CACHE_TTL) {
      setStatus(cachedStatus);
      setIsLoading(false);
      return;
    }

    try {
      fetchingRef.current = true;
      setIsLoading(true);
      const response = await fetch("/api/polar/status");
      if (response.ok) {
        const data: PurchaseStatus = await response.json();
        cachedStatus = data;
        cacheTimestamp = Date.now();
        setStatus(data);
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch subscription status"));
    } finally {
      setIsLoading(false);
      fetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return {
    isPro: status.isPro,
    purchasedAt: status.purchasedAt,
    isLoading,
    error,
    refresh: fetchStatus,
  };
}
