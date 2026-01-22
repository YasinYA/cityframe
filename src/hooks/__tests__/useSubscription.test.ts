import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('useSubscription', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();

    // Reset fetch mock for each test
    mockFetch.mockReset();
  });

  it('fetches subscription status on mount', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        isPro: false,
        purchasedAt: null,
        customerId: null,
      }),
    });

    const { useSubscription } = await import('../useSubscription');
    const { result } = renderHook(() => useSubscription());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isPro).toBe(false);
  });

  it('returns isPro false for free users', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        isPro: false,
        purchasedAt: null,
        customerId: null,
      }),
    });

    const { useSubscription } = await import('../useSubscription');
    const { result } = renderHook(() => useSubscription());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isPro).toBe(false);
    expect(result.current.purchasedAt).toBeNull();
  });

  it('returns correct initial state', async () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

    const { useSubscription } = await import('../useSubscription');
    const { result } = renderHook(() => useSubscription());

    // Default values before fetch completes
    expect(result.current.isPro).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('exposes refresh function', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        isPro: false,
        purchasedAt: null,
        customerId: null,
      }),
    });

    const { useSubscription } = await import('../useSubscription');
    const { result } = renderHook(() => useSubscription());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.refresh).toBe('function');
  });
});
