import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock the store
const mockStartGeneration = vi.fn();
const mockReset = vi.fn();

const defaultStoreState = {
  jobStatus: 'idle' as const,
  jobProgress: 0,
  generatedImages: [] as Array<{ device: string; url: string }>,
  error: null as string | null,
  startGeneration: mockStartGeneration,
  reset: mockReset,
  selectedStyle: 'midnight-gold',
  selectedDevices: ['iphone'],
  mapInstance: {} as unknown, // Mock map instance as truthy
};

let mockStoreState = { ...defaultStoreState };

vi.mock('@/lib/store', () => ({
  useAppStore: () => mockStoreState,
}));

// Mock useAuth hook
const mockUseAuth = vi.fn();
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock SignInModal
vi.mock('@/components/auth/SignInModal', () => ({
  SignInModal: ({ open }: { open: boolean }) =>
    open ? <div data-testid="sign-in-modal">Sign In Modal</div> : null,
}));

// Mock DEVICE_PRESETS
vi.mock('@/lib/map/styles', () => ({
  DEVICE_PRESETS: {
    iphone: { id: 'iphone', name: 'iPhone', width: 1170, height: 2532, description: 'iPhone' },
    desktop: { id: 'desktop', name: 'Desktop', width: 3840, height: 2160, description: 'Desktop' },
  },
}));

import { GenerateButton } from '../GenerateButton';

describe('GenerateButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStoreState = { ...defaultStoreState };

    // Default: user is authenticated
    mockUseAuth.mockReturnValue({
      authenticated: true,
      isLoading: false,
    });

    // Ensure NEXT_PUBLIC_PRELAUNCH is not set
    vi.stubEnv('NEXT_PUBLIC_PRELAUNCH', 'false');
  });

  describe('Default State (Authenticated)', () => {
    it('renders "Generate Wallpaper" button when authenticated', () => {
      render(<GenerateButton />);

      expect(screen.getByRole('button', { name: /Generate Wallpaper/i })).toBeInTheDocument();
    });

    it('calls startGeneration when clicked', () => {
      render(<GenerateButton />);

      const button = screen.getByRole('button', { name: /Generate Wallpaper/i });
      fireEvent.click(button);

      expect(mockStartGeneration).toHaveBeenCalled();
    });
  });

  describe('Not Authenticated State', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        authenticated: false,
        isLoading: false,
      });
    });

    it('renders "Sign in to Generate" button', () => {
      render(<GenerateButton />);

      expect(screen.getByRole('button', { name: /Sign in to Generate/i })).toBeInTheDocument();
    });

    it('shows sign in modal when clicked', () => {
      render(<GenerateButton />);

      const button = screen.getByRole('button', { name: /Sign in to Generate/i });
      fireEvent.click(button);

      expect(screen.getByTestId('sign-in-modal')).toBeInTheDocument();
    });

    it('shows free preview message', () => {
      render(<GenerateButton />);

      expect(screen.getByText(/Free preview/i)).toBeInTheDocument();
    });
  });

  describe('Auth Loading State', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        authenticated: false,
        isLoading: true,
      });
    });

    it('shows loading state', () => {
      render(<GenerateButton />);

      expect(screen.getByRole('button', { name: /Loading.../i })).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('Map Not Ready State', () => {
    beforeEach(() => {
      mockStoreState = {
        ...defaultStoreState,
        mapInstance: null,
      };
    });

    it('shows "Loading map..." when map is not ready', () => {
      render(<GenerateButton />);

      expect(screen.getByRole('button', { name: /Loading map.../i })).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('Pending/Processing State', () => {
    it('shows progress bar when pending', () => {
      mockStoreState = {
        ...defaultStoreState,
        jobStatus: 'pending',
        jobProgress: 10,
      };

      render(<GenerateButton />);

      expect(screen.getByText(/Starting generation.../i)).toBeInTheDocument();
    });

    it('shows progress percentage when processing', () => {
      mockStoreState = {
        ...defaultStoreState,
        jobStatus: 'processing',
        jobProgress: 45,
      };

      render(<GenerateButton />);

      expect(screen.getByText(/Generating wallpaper.*45%/i)).toBeInTheDocument();
    });

    it('shows plural "wallpapers" when multiple devices selected', () => {
      mockStoreState = {
        ...defaultStoreState,
        jobStatus: 'processing',
        jobProgress: 50,
        selectedDevices: ['iphone', 'desktop'],
      };

      render(<GenerateButton />);

      expect(screen.getByText(/Generating wallpapers.*50%/i)).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('shows error message', () => {
      mockStoreState = {
        ...defaultStoreState,
        error: 'Network timeout occurred',
      };

      render(<GenerateButton />);

      expect(screen.getByText('Generation Failed')).toBeInTheDocument();
      expect(screen.getByText('Network timeout occurred')).toBeInTheDocument();
    });

    it('shows "Try Again" button in error state', () => {
      mockStoreState = {
        ...defaultStoreState,
        error: 'Some error',
      };

      render(<GenerateButton />);

      expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
    });

    it('calls reset when "Try Again" clicked', () => {
      mockStoreState = {
        ...defaultStoreState,
        error: 'Some error',
      };

      render(<GenerateButton />);

      const button = screen.getByRole('button', { name: /Try Again/i });
      fireEvent.click(button);

      expect(mockReset).toHaveBeenCalled();
    });
  });

  describe('Completed State', () => {
    beforeEach(() => {
      mockStoreState = {
        ...defaultStoreState,
        jobStatus: 'completed',
        generatedImages: [
          { device: 'iphone', url: 'data:image/png;base64,fake-image-data' },
        ],
      };
    });

    it('shows download button when completed', () => {
      render(<GenerateButton />);

      expect(screen.getByRole('button', { name: /Download Wallpaper$/i })).toBeInTheDocument();
    });

    it('shows plural "Wallpapers" when multiple images', () => {
      mockStoreState = {
        ...defaultStoreState,
        jobStatus: 'completed',
        generatedImages: [
          { device: 'iphone', url: 'data:image/png;base64,fake-image-data' },
          { device: 'desktop', url: 'data:image/png;base64,fake-image-data' },
        ],
      };

      render(<GenerateButton />);

      expect(screen.getByRole('button', { name: /Download Wallpapers/i })).toBeInTheDocument();
    });

    it('shows "Generate Another" button', () => {
      render(<GenerateButton />);

      expect(screen.getByRole('button', { name: /Generate Another/i })).toBeInTheDocument();
    });

    it('calls reset when "Generate Another" clicked', () => {
      render(<GenerateButton />);

      const button = screen.getByRole('button', { name: /Generate Another/i });
      fireEvent.click(button);

      expect(mockReset).toHaveBeenCalled();
    });

    it('opens download dialog when download button clicked', () => {
      render(<GenerateButton />);

      const downloadButton = screen.getByRole('button', { name: /Download Wallpaper$/i });
      fireEvent.click(downloadButton);

      expect(screen.getByText(/Wallpapers Ready!/i)).toBeInTheDocument();
    });

    it('shows device info in download dialog', () => {
      render(<GenerateButton />);

      // Open dialog
      const downloadButton = screen.getByRole('button', { name: /Download Wallpaper$/i });
      fireEvent.click(downloadButton);

      expect(screen.getByText('iPhone')).toBeInTheDocument();
      expect(screen.getByText('1170 × 2532')).toBeInTheDocument();
    });

    it('shows "Download All" button when multiple images', () => {
      mockStoreState = {
        ...defaultStoreState,
        jobStatus: 'completed',
        generatedImages: [
          { device: 'iphone', url: 'data:image/png;base64,fake-image-data' },
          { device: 'desktop', url: 'data:image/png;base64,fake-image-data' },
        ],
      };

      render(<GenerateButton />);

      // Open dialog
      const downloadButton = screen.getByRole('button', { name: /Download Wallpapers/i });
      fireEvent.click(downloadButton);

      expect(screen.getByRole('button', { name: /Download All \(2\)/i })).toBeInTheDocument();
    });
  });
});
