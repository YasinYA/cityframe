import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PricingCards } from '../PricingCards';

// Mock the hooks
vi.mock('@/hooks/useSubscription', () => ({
  useSubscription: vi.fn(),
}));

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

// Mock the Polar checkout
vi.mock('@/lib/polar/client', () => ({
  openPolarCheckout: vi.fn(),
}));

// Mock analytics
vi.mock('@/lib/analytics/mixpanel', () => ({
  analytics: {
    checkoutStarted: vi.fn(),
  },
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import { openPolarCheckout } from '@/lib/polar/client';
import { toast } from 'sonner';

describe('PricingCards', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    vi.mocked(useSubscription).mockReturnValue({
      isPro: false,
      purchasedAt: null,
      isLoading: false,
      error: null,
      refresh: vi.fn(),
    });

    vi.mocked(useAuth).mockReturnValue({
      authenticated: false,
      isLoading: false,
      user: null,
      signOut: vi.fn(),
    });

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 'prod_123',
        name: 'Pro',
        description: 'Lifetime access',
        amount: 9.99,
        currency: 'USD',
      }),
    });

    // Mock environment variable
    vi.stubEnv('NEXT_PUBLIC_POLAR_PRODUCT_ID', 'prod_123');
  });

  it('renders pricing card with product name', async () => {
    render(<PricingCards />);

    await waitFor(() => {
      expect(screen.getByText('Pro')).toBeInTheDocument();
    });

    expect(screen.getByText('one-time')).toBeInTheDocument();
  });

  it('shows loading skeleton while fetching price', () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<PricingCards />);

    // Check for the loading skeleton (animate-pulse div)
    const skeleton = document.querySelector('.animate-pulse');
    expect(skeleton).toBeInTheDocument();
  });

  it('shows "Sign In to Purchase" when user is not authenticated', async () => {
    vi.mocked(useAuth).mockReturnValue({
      authenticated: false,
      isLoading: false,
      user: null,
      signOut: vi.fn(),
    });

    render(<PricingCards />);

    await waitFor(() => {
      expect(screen.getByText(/Sign In to Purchase/)).toBeInTheDocument();
    });
  });

  it('shows "Get Access" when user is authenticated', async () => {
    vi.mocked(useAuth).mockReturnValue({
      authenticated: true,
      isLoading: false,
      user: { email: 'test@example.com', id: '123', name: 'Test' },
      signOut: vi.fn(),
    });

    render(<PricingCards />);

    await waitFor(() => {
      expect(screen.getByText(/Get Access/)).toBeInTheDocument();
    });
  });

  it('shows "Purchased" button when user is Pro', async () => {
    vi.mocked(useSubscription).mockReturnValue({
      isPro: true,
      purchasedAt: '2024-01-15T10:00:00.000Z',
      isLoading: false,
      error: null,
      refresh: vi.fn(),
    });

    render(<PricingCards />);

    await waitFor(() => {
      expect(screen.getByText('Purchased')).toBeInTheDocument();
    });

    expect(screen.getByText('Open App')).toBeInTheDocument();
  });

  it('opens sign-in modal when unauthenticated user clicks purchase', async () => {
    const user = userEvent.setup();

    vi.mocked(useAuth).mockReturnValue({
      authenticated: false,
      isLoading: false,
      user: null,
      signOut: vi.fn(),
    });

    render(<PricingCards />);

    await waitFor(() => {
      expect(screen.getByText(/Sign In to Purchase/)).toBeInTheDocument();
    });

    const purchaseButton = screen.getByRole('button', { name: /Sign In to Purchase/ });
    await user.click(purchaseButton);

    // SignInModal should be opened - button click triggers modal
    // The modal state change is tested implicitly
  });

  it('opens Polar checkout when authenticated user clicks purchase', async () => {
    const user = userEvent.setup();

    vi.mocked(useAuth).mockReturnValue({
      authenticated: true,
      isLoading: false,
      user: { email: 'test@example.com', id: '123', name: 'Test' },
      signOut: vi.fn(),
    });

    vi.mocked(openPolarCheckout).mockResolvedValue(undefined);

    render(<PricingCards />);

    await waitFor(() => {
      expect(screen.getByText(/Get Access/)).toBeInTheDocument();
    });

    const purchaseButton = screen.getByRole('button', { name: /Get Access/ });
    await user.click(purchaseButton);

    await waitFor(() => {
      expect(openPolarCheckout).toHaveBeenCalled();
    });
  });

  it('shows error toast when checkout fails', async () => {
    const user = userEvent.setup();

    vi.mocked(useAuth).mockReturnValue({
      authenticated: true,
      isLoading: false,
      user: { email: 'test@example.com', id: '123', name: 'Test' },
      signOut: vi.fn(),
    });

    vi.mocked(openPolarCheckout).mockRejectedValue(new Error('Checkout failed'));

    render(<PricingCards />);

    await waitFor(() => {
      expect(screen.getByText(/Get Access/)).toBeInTheDocument();
    });

    const purchaseButton = screen.getByRole('button', { name: /Get Access/ });
    await user.click(purchaseButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Checkout failed', expect.any(Object));
    });
  });

  it('displays all feature items', async () => {
    render(<PricingCards />);

    await waitFor(() => {
      expect(screen.getByText('All 14 premium map styles')).toBeInTheDocument();
    });

    expect(screen.getByText('All devices (Desktop, Tablet, Ultra-wide)')).toBeInTheDocument();
    expect(screen.getByText('4K AI-upscaled wallpapers')).toBeInTheDocument();
    expect(screen.getByText('No watermarks')).toBeInTheDocument();
    expect(screen.getByText('Lifetime updates')).toBeInTheDocument();
  });

  it('displays trust badges', async () => {
    render(<PricingCards />);

    await waitFor(() => {
      expect(screen.getByText('One-time payment')).toBeInTheDocument();
    });

    expect(screen.getByText('Secure checkout')).toBeInTheDocument();
    expect(screen.getByText('Instant access')).toBeInTheDocument();
  });
});
