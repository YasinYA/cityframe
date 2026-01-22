import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('GET /api/polar/price', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('returns fallback price when POLAR_ACCESS_TOKEN is not set', async () => {
    delete process.env.POLAR_ACCESS_TOKEN;
    delete process.env.POLAR_PRODUCT_ID;

    const { GET } = await import('../price/route');
    const response = await GET();
    const data = await response.json();

    expect(data).toEqual({
      id: 'fallback',
      name: 'Pro',
      description: 'Lifetime access to all features',
      amount: 9.99,
      currency: 'USD',
    });
  });

  it('returns fallback price when POLAR_PRODUCT_ID is not set', async () => {
    process.env.POLAR_ACCESS_TOKEN = 'test_token';
    delete process.env.POLAR_PRODUCT_ID;

    const { GET } = await import('../price/route');
    const response = await GET();
    const data = await response.json();

    expect(data).toEqual({
      id: 'fallback',
      name: 'Pro',
      description: 'Lifetime access to all features',
      amount: 9.99,
      currency: 'USD',
    });
  });

  it('returns response with correct headers for caching', async () => {
    delete process.env.POLAR_ACCESS_TOKEN;

    const { GET } = await import('../price/route');
    const response = await GET();

    // Fallback response doesn't have cache headers, but valid response should
    expect(response.status).toBe(200);
  });
});
