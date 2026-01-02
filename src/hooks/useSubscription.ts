"use client";

import { useAuth } from "./useAuth";

export function useSubscription() {
  const { user, isLoading } = useAuth();

  return {
    isPro: user?.isPro ?? false,
    isLoading,
    error: null,
    refresh: () => Promise.resolve(),
  };
}
