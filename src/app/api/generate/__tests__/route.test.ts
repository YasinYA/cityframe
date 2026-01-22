import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock auth
const mockGetSession = vi.fn();
vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: (...args: unknown[]) => mockGetSession(...args),
    },
  },
}));

// Mock next/headers
vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

// Mock database
const mockInsert = vi.fn().mockReturnValue({
  values: vi.fn().mockResolvedValue(undefined),
});
vi.mock('@/lib/db/client', () => ({
  db: {
    insert: (...args: unknown[]) => mockInsert(...args),
  },
}));

// Mock database schema
vi.mock('@/lib/db/schema', () => ({
  jobs: {},
}));

// Mock BullMQ
const mockAddGenerationJob = vi.fn().mockResolvedValue(undefined);
vi.mock('@/lib/queue/bullmq', () => ({
  addGenerationJob: (...args: unknown[]) => mockAddGenerationJob(...args),
}));

// Mock rate limiting
const mockCheckRateLimit = vi.fn();
vi.mock('@/lib/redis/rateLimit', () => ({
  checkRateLimit: (...args: unknown[]) => mockCheckRateLimit(...args),
  getRateLimitHeaders: vi.fn().mockReturnValue({}),
}));

// Mock uuid
vi.mock('uuid', () => ({
  v4: () => 'test-job-id-123',
}));

import { POST } from '../route';

const validRequestBody = {
  location: {
    lat: 40.7128,
    lng: -74.006,
    zoom: 12,
    bearing: 0,
    pitch: 0,
  },
  style: 'midnight-gold',
  devices: ['iphone'],
};

describe('POST /api/generate', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default: rate limits allow requests
    mockCheckRateLimit.mockResolvedValue({ allowed: true, remaining: 5 });

    // Default: user is authenticated
    mockGetSession.mockResolvedValue({
      user: {
        id: 'user-123',
        email: 'test@example.com',
      },
    });
  });

  it('returns 429 when IP rate limit exceeded', async () => {
    mockCheckRateLimit.mockResolvedValueOnce({ allowed: false, remaining: 0 });

    const request = new NextRequest('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify(validRequestBody),
    });

    const response = await POST(request);
    expect(response.status).toBe(429);

    const data = await response.json();
    expect(data.error).toContain('Too many generation requests');
  });

  it('returns 401 when not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify(validRequestBody),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);

    const data = await response.json();
    expect(data.error).toContain('Authentication required');
  });

  it('returns 401 when session has no email', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'user-123' }, // No email
    });

    const request = new NextRequest('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify(validRequestBody),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
  });

  it('returns 429 when user rate limit exceeded', async () => {
    // First call (IP check) passes, second call (user check) fails
    mockCheckRateLimit
      .mockResolvedValueOnce({ allowed: true, remaining: 5 })
      .mockResolvedValueOnce({ allowed: false, remaining: 0 });

    const request = new NextRequest('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify(validRequestBody),
    });

    const response = await POST(request);
    expect(response.status).toBe(429);

    const data = await response.json();
    expect(data.error).toContain("reached the hourly generation limit");
  });

  it('returns 400 when location is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        style: 'midnight-gold',
        devices: ['iphone'],
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toContain('Missing required fields');
  });

  it('returns 400 when style is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        location: validRequestBody.location,
        devices: ['iphone'],
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toContain('Missing required fields');
  });

  it('returns 400 when devices is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        location: validRequestBody.location,
        style: 'midnight-gold',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toContain('Missing required fields');
  });

  it('returns 400 when devices is empty', async () => {
    const request = new NextRequest('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        location: validRequestBody.location,
        style: 'midnight-gold',
        devices: [],
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('returns 400 when location has invalid lat type', async () => {
    const request = new NextRequest('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        location: {
          lat: 'invalid',
          lng: -74.006,
          zoom: 12,
        },
        style: 'midnight-gold',
        devices: ['iphone'],
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toContain('Invalid location format');
  });

  it('returns 400 when location has invalid lng type', async () => {
    const request = new NextRequest('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        location: {
          lat: 40.7128,
          lng: 'invalid',
          zoom: 12,
        },
        style: 'midnight-gold',
        devices: ['iphone'],
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('returns 400 when location has invalid zoom type', async () => {
    const request = new NextRequest('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        location: {
          lat: 40.7128,
          lng: -74.006,
          zoom: 'high',
        },
        style: 'midnight-gold',
        devices: ['iphone'],
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('successfully creates generation job', async () => {
    const request = new NextRequest('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify(validRequestBody),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.jobId).toBe('test-job-id-123');
    expect(data.status).toBe('pending');
    expect(data.message).toContain('generation started');
  });

  it('creates job in database with correct values', async () => {
    const request = new NextRequest('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify(validRequestBody),
    });

    await POST(request);

    expect(mockInsert).toHaveBeenCalled();
    const insertCall = mockInsert.mock.results[0];
    expect(insertCall.value.values).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'test-job-id-123',
        userId: 'user-123',
        status: 'pending',
        style: 'midnight-gold',
        devices: ['iphone'],
      })
    );
  });

  it('adds job to BullMQ queue', async () => {
    const request = new NextRequest('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify(validRequestBody),
    });

    await POST(request);

    expect(mockAddGenerationJob).toHaveBeenCalledWith(
      expect.objectContaining({
        jobId: 'test-job-id-123',
        location: validRequestBody.location,
        style: 'midnight-gold',
        devices: ['iphone'],
      })
    );
  });

  it('handles AI options correctly', async () => {
    const requestWithAI = {
      ...validRequestBody,
      ai: {
        enabled: true,
        upscale: true,
        upscaleFactor: 4,
        enhanceStyle: false,
      },
    };

    const request = new NextRequest('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify(requestWithAI),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.message).toContain('AI enhancement');
  });

  it('sets default bearing and pitch when not provided', async () => {
    const requestWithoutBearingPitch = {
      location: {
        lat: 40.7128,
        lng: -74.006,
        zoom: 12,
        // No bearing or pitch
      },
      style: 'midnight-gold',
      devices: ['iphone'],
    };

    const request = new NextRequest('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify(requestWithoutBearingPitch),
    });

    await POST(request);

    const insertCall = mockInsert.mock.results[0];
    expect(insertCall.value.values).toHaveBeenCalledWith(
      expect.objectContaining({
        location: expect.objectContaining({
          bearing: 0,
          pitch: 0,
        }),
      })
    );
  });

  it('returns 500 on unexpected error', async () => {
    mockInsert.mockReturnValue({
      values: vi.fn().mockRejectedValue(new Error('Database error')),
    });

    const request = new NextRequest('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify(validRequestBody),
    });

    const response = await POST(request);
    expect(response.status).toBe(500);

    const data = await response.json();
    expect(data.error).toBe('Failed to start generation');
  });
});
