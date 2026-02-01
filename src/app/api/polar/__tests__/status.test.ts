import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock next/headers cookies
const mockCookies = new Map<string, string>();

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: (name: string) => {
      const value = mockCookies.get(name);
      return value ? { value } : undefined;
    },
    set: vi.fn((name: string, value: string) => {
      mockCookies.set(name, value);
    }),
  })),
}));

// Mock Polar server verification
const mockVerifyOrderOwnership = vi.fn();
vi.mock('@/lib/polar/server', () => ({
  verifyOrderOwnership: (...args: unknown[]) => mockVerifyOrderOwnership(...args),
}));

import { GET, POST } from '../status/route';

describe('GET /api/polar/status', () => {
  beforeEach(() => {
    mockCookies.clear();
  });

  it('returns isPro: false when no cookies are set', async () => {
    const response = await GET();
    const data = await response.json();

    expect(data).toEqual({
      isPro: false,
      purchasedAt: null,
      customerId: null,
    });
  });

  it('returns isPro: true when pro status cookie is set', async () => {
    mockCookies.set('polar_pro_status', 'true');
    mockCookies.set('polar_customer_id', 'cust_123');
    mockCookies.set('polar_purchased_at', '2024-01-15T10:00:00.000Z');

    const response = await GET();
    const data = await response.json();

    expect(data).toEqual({
      isPro: true,
      purchasedAt: '2024-01-15T10:00:00.000Z',
      customerId: 'cust_123',
    });
  });

  it('returns isPro: false when cookie value is not "true"', async () => {
    mockCookies.set('polar_pro_status', 'false');

    const response = await GET();
    const data = await response.json();

    expect(data.isPro).toBe(false);
  });
});

describe('POST /api/polar/status', () => {
  beforeEach(() => {
    mockCookies.clear();
    mockVerifyOrderOwnership.mockReset();
  });

  it('sets pro status cookies when order is verified', async () => {
    // Mock successful verification
    mockVerifyOrderOwnership.mockResolvedValue({
      id: 'order_789',
      customerId: 'cust_456',
      customerEmail: 'test@example.com',
      productId: 'prod_123',
      status: 'paid',
      paidAt: new Date('2024-01-15T10:00:00.000Z'),
    });

    const request = new NextRequest('http://localhost:3000/api/polar/status', {
      method: 'POST',
      body: JSON.stringify({
        customerId: 'cust_456',
        orderId: 'order_789',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.isPro).toBe(true);
    expect(data.purchasedAt).toBe('2024-01-15T10:00:00.000Z');
    expect(mockVerifyOrderOwnership).toHaveBeenCalledWith('order_789', 'cust_456');
  });

  it('returns 403 when order verification fails', async () => {
    // Mock failed verification
    mockVerifyOrderOwnership.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/polar/status', {
      method: 'POST',
      body: JSON.stringify({
        customerId: 'fake_customer',
        orderId: 'fake_order',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toContain('Order verification failed');
    expect(mockVerifyOrderOwnership).toHaveBeenCalledWith('fake_order', 'fake_customer');
  });

  it('returns 403 when customer ID does not match order', async () => {
    // Mock verification returning null due to customer mismatch
    mockVerifyOrderOwnership.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/polar/status', {
      method: 'POST',
      body: JSON.stringify({
        customerId: 'wrong_customer',
        orderId: 'order_789',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(403);
  });

  it('returns 400 when customerId is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/polar/status', {
      method: 'POST',
      body: JSON.stringify({
        orderId: 'order_789',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Missing customerId or orderId');
  });

  it('returns 400 when orderId is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/polar/status', {
      method: 'POST',
      body: JSON.stringify({
        customerId: 'cust_456',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Missing customerId or orderId');
  });

  it('returns 500 on JSON parse error', async () => {
    const request = new NextRequest('http://localhost:3000/api/polar/status', {
      method: 'POST',
      body: 'invalid json',
    });

    const response = await POST(request);

    expect(response.status).toBe(500);
  });
});
