import '@testing-library/jest-dom';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// Mock environment variables
vi.stubEnv('POLAR_ACCESS_TOKEN', 'test_token');
vi.stubEnv('POLAR_PRODUCT_ID', 'test_product_id');
vi.stubEnv('NEXT_PUBLIC_POLAR_PRODUCT_ID', 'test_product_id');
vi.stubEnv('POLAR_WEBHOOK_SECRET', 'test_webhook_secret');

// Default MSW handlers
export const handlers = [
  // Mock Polar price API
  http.get('/api/polar/price', () => {
    return HttpResponse.json({
      id: 'test_product_id',
      name: 'Pro',
      description: 'Lifetime access to all features',
      amount: 9.99,
      currency: 'USD',
    });
  }),

  // Mock Polar status API
  http.get('/api/polar/status', () => {
    return HttpResponse.json({
      isPro: false,
      purchasedAt: null,
      customerId: null,
    });
  }),

  http.post('/api/polar/status', () => {
    return HttpResponse.json({
      success: true,
      isPro: true,
      purchasedAt: new Date().toISOString(),
    });
  }),
];

export const server = setupServer(...handlers);

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Clean up after all tests
afterAll(() => server.close());
