import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock sharp
vi.mock('sharp', () => {
  const mockSharpInstance = {
    metadata: vi.fn().mockResolvedValue({ width: 1024, height: 1024 }),
    resize: vi.fn().mockReturnThis(),
    png: vi.fn().mockReturnThis(),
    toBuffer: vi.fn().mockResolvedValue(Buffer.from('fake-image-data')),
  };
  return {
    default: function sharp() {
      return mockSharpInstance;
    },
  };
});

// Mock replicate
vi.mock('replicate', () => {
  return {
    default: class Replicate {
      run = vi.fn().mockResolvedValue('https://example.com/upscaled.png');
    },
  };
});

// Mock next/headers
vi.mock('next/headers', () => ({
  headers: vi.fn(() => new Headers()),
}));

// Mock auth
vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue({
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
        },
      }),
    },
  },
}));

// Mock rate limiting
vi.mock('@/lib/redis/rateLimit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({
    allowed: true,
    remaining: 10,
    resetAt: Date.now() + 3600,
    limit: 20,
  }),
  getRateLimitHeaders: vi.fn().mockReturnValue({}),
}));

// Mock fetch for upscaled image download
const mockFetch = vi.fn();
global.fetch = mockFetch;

import { POST } from '../route';

// Create a minimal valid PNG (1x1 pixel)
const MINIMAL_PNG = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, // PNG signature
  0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
  0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1 dimensions
  0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, // RGB color type
  0xde, 0x00, 0x00, 0x00, 0x0c, 0x49, 0x44, 0x41, // IDAT chunk
  0x54, 0x08, 0xd7, 0x63, 0xf8, 0x00, 0x00, 0x00,
  0x01, 0x00, 0x01, 0x5c, 0xcd, 0xff, 0xa2, 0x00,
  0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, // IEND chunk
  0x42, 0x60, 0x82,
]);

const VALID_IMAGE_BASE64 = `data:image/png;base64,${MINIMAL_PNG.toString('base64')}`;

describe('POST /api/generate-wallpaper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      arrayBuffer: async () => MINIMAL_PNG.buffer,
    });
  });

  it('returns 400 when image is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/generate-wallpaper', {
      method: 'POST',
      body: JSON.stringify({
        style: 'midnight-gold',
        devices: ['iphone'],
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toBe('Missing required fields: image, devices');
  });

  it('returns 400 when devices is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/generate-wallpaper', {
      method: 'POST',
      body: JSON.stringify({
        image: VALID_IMAGE_BASE64,
        style: 'midnight-gold',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toBe('Missing required fields: image, devices');
  });

  it('returns 400 when devices array is empty', async () => {
    const request = new NextRequest('http://localhost:3000/api/generate-wallpaper', {
      method: 'POST',
      body: JSON.stringify({
        image: VALID_IMAGE_BASE64,
        style: 'midnight-gold',
        devices: [],
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toBe('Missing required fields: image, devices');
  });

  it('successfully generates wallpapers for single device', async () => {
    const request = new NextRequest('http://localhost:3000/api/generate-wallpaper', {
      method: 'POST',
      body: JSON.stringify({
        image: VALID_IMAGE_BASE64,
        style: 'midnight-gold',
        devices: ['iphone'],
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.wallpapers).toBeDefined();
    expect(data.wallpapers).toHaveLength(1);
    expect(data.wallpapers[0].device).toBe('iphone');
    expect(data.wallpapers[0].width).toBe(1170);
    expect(data.wallpapers[0].height).toBe(2532);
    expect(data.wallpapers[0].url).toMatch(/^data:image\/png;base64,/);
  });

  it('successfully generates wallpapers for multiple devices', async () => {
    const request = new NextRequest('http://localhost:3000/api/generate-wallpaper', {
      method: 'POST',
      body: JSON.stringify({
        image: VALID_IMAGE_BASE64,
        style: 'midnight-gold',
        devices: ['iphone', 'desktop'],
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.wallpapers).toHaveLength(2);

    const devices = data.wallpapers.map((w: { device: string }) => w.device);
    expect(devices).toContain('iphone');
    expect(devices).toContain('desktop');
  });

  it('returns 500 for unknown device type', async () => {
    const request = new NextRequest('http://localhost:3000/api/generate-wallpaper', {
      method: 'POST',
      body: JSON.stringify({
        image: VALID_IMAGE_BASE64,
        style: 'midnight-gold',
        devices: ['unknown-device'],
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(500);

    const data = await response.json();
    expect(data.error).toBe('Unknown device: unknown-device');
  });

  it('accepts different crop positions', async () => {
    const cropPositions = ['center', 'top', 'bottom', 'left', 'right'];

    for (const cropPosition of cropPositions) {
      const request = new NextRequest('http://localhost:3000/api/generate-wallpaper', {
        method: 'POST',
        body: JSON.stringify({
          image: VALID_IMAGE_BASE64,
          style: 'midnight-gold',
          devices: ['iphone'],
          cropPosition,
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    }
  });

  it('defaults to center crop position', async () => {
    const request = new NextRequest('http://localhost:3000/api/generate-wallpaper', {
      method: 'POST',
      body: JSON.stringify({
        image: VALID_IMAGE_BASE64,
        style: 'midnight-gold',
        devices: ['iphone'],
        // No cropPosition specified
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.wallpapers).toBeDefined();
  });

  it('returns 500 on JSON parse error', async () => {
    const request = new NextRequest('http://localhost:3000/api/generate-wallpaper', {
      method: 'POST',
      body: 'invalid json',
    });

    const response = await POST(request);
    expect(response.status).toBe(500);
  });

  it('generates all supported device types', async () => {
    const allDevices = ['iphone', 'android', 'tablet', 'tablet-landscape', 'desktop', 'ultrawide'];

    const request = new NextRequest('http://localhost:3000/api/generate-wallpaper', {
      method: 'POST',
      body: JSON.stringify({
        image: VALID_IMAGE_BASE64,
        style: 'midnight-gold',
        devices: allDevices,
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.wallpapers).toHaveLength(6);
  });

  it('returns 401 when not authenticated', async () => {
    // Import to get access to the mock
    const { auth } = await import('@/lib/auth');
    vi.mocked(auth.api.getSession).mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost:3000/api/generate-wallpaper', {
      method: 'POST',
      body: JSON.stringify({
        image: VALID_IMAGE_BASE64,
        style: 'midnight-gold',
        devices: ['iphone'],
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);

    const data = await response.json();
    expect(data.error).toContain('Authentication required');
  });

  it('returns 429 when rate limited', async () => {
    const { checkRateLimit } = await import('@/lib/redis/rateLimit');
    vi.mocked(checkRateLimit).mockResolvedValueOnce({
      allowed: false,
      remaining: 0,
      resetAt: Date.now() + 3600,
      limit: 50,
    });

    const request = new NextRequest('http://localhost:3000/api/generate-wallpaper', {
      method: 'POST',
      body: JSON.stringify({
        image: VALID_IMAGE_BASE64,
        style: 'midnight-gold',
        devices: ['iphone'],
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(429);

    const data = await response.json();
    expect(data.error).toContain('Too many requests');
  });

  it('returns 400 when image is too large', async () => {
    // Create a large image string (over 10MB)
    const largeImage = 'data:image/png;base64,' + 'A'.repeat(11 * 1024 * 1024);

    const request = new NextRequest('http://localhost:3000/api/generate-wallpaper', {
      method: 'POST',
      body: JSON.stringify({
        image: largeImage,
        style: 'midnight-gold',
        devices: ['iphone'],
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toContain('Image too large');
  });
});
