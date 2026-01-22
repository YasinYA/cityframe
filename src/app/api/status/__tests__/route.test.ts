import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock database queries
const mockFindFirst = vi.fn();
const mockFindMany = vi.fn();

vi.mock('@/lib/db/client', () => ({
  db: {
    query: {
      jobs: {
        findFirst: (...args: unknown[]) => mockFindFirst(...args),
      },
      images: {
        findMany: (...args: unknown[]) => mockFindMany(...args),
      },
    },
  },
}));

// Mock database schema
vi.mock('@/lib/db/schema', () => ({
  jobs: { id: 'id' },
  images: { jobId: 'jobId' },
}));

// Mock drizzle-orm
vi.mock('drizzle-orm', () => ({
  eq: vi.fn((a, b) => ({ field: a, value: b })),
}));

// Mock BullMQ
const mockGetQueueJob = vi.fn();
vi.mock('@/lib/queue/bullmq', () => ({
  getQueueJob: (...args: unknown[]) => mockGetQueueJob(...args),
}));

import { GET } from '../[jobId]/route';

describe('GET /api/status/[jobId]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when job not found', async () => {
    mockFindFirst.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/status/non-existent-id');

    const response = await GET(request, { params: Promise.resolve({ jobId: 'non-existent-id' }) });
    expect(response.status).toBe(404);

    const data = await response.json();
    expect(data.error).toBe('Job not found');
  });

  it('returns job status for pending job', async () => {
    mockFindFirst.mockResolvedValue({
      id: 'job-123',
      status: 'pending',
      style: 'midnight-gold',
      devices: ['iphone'],
      errorMessage: null,
      createdAt: new Date('2024-01-15T10:00:00Z'),
      completedAt: null,
    });

    const request = new NextRequest('http://localhost:3000/api/status/job-123');

    const response = await GET(request, { params: Promise.resolve({ jobId: 'job-123' }) });
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.id).toBe('job-123');
    expect(data.status).toBe('pending');
    expect(data.progress).toBe(0);
    expect(data.style).toBe('midnight-gold');
    expect(data.devices).toEqual(['iphone']);
    expect(data.images).toEqual([]);
  });

  it('returns job status with progress for processing job', async () => {
    mockFindFirst.mockResolvedValue({
      id: 'job-123',
      status: 'processing',
      style: 'midnight-gold',
      devices: ['iphone'],
      errorMessage: null,
      createdAt: new Date('2024-01-15T10:00:00Z'),
      completedAt: null,
    });

    mockGetQueueJob.mockResolvedValue({
      progress: 45,
    });

    const request = new NextRequest('http://localhost:3000/api/status/job-123');

    const response = await GET(request, { params: Promise.resolve({ jobId: 'job-123' }) });
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.status).toBe('processing');
    expect(data.progress).toBe(45);
  });

  it('returns 0 progress when queue job not found', async () => {
    mockFindFirst.mockResolvedValue({
      id: 'job-123',
      status: 'processing',
      style: 'midnight-gold',
      devices: ['iphone'],
      errorMessage: null,
      createdAt: new Date('2024-01-15T10:00:00Z'),
      completedAt: null,
    });

    mockGetQueueJob.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/status/job-123');

    const response = await GET(request, { params: Promise.resolve({ jobId: 'job-123' }) });
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.progress).toBe(0);
  });

  it('returns images for completed job', async () => {
    mockFindFirst.mockResolvedValue({
      id: 'job-123',
      status: 'completed',
      style: 'midnight-gold',
      devices: ['iphone', 'desktop'],
      errorMessage: null,
      createdAt: new Date('2024-01-15T10:00:00Z'),
      completedAt: new Date('2024-01-15T10:01:00Z'),
    });

    mockFindMany.mockResolvedValue([
      { device: 'iphone', width: 1170, height: 2532 },
      { device: 'desktop', width: 3840, height: 2160 },
    ]);

    const request = new NextRequest('http://localhost:3000/api/status/job-123');

    const response = await GET(request, { params: Promise.resolve({ jobId: 'job-123' }) });
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.status).toBe('completed');
    expect(data.images).toHaveLength(2);
    expect(data.images[0]).toEqual({ device: 'iphone', width: 1170, height: 2532 });
    expect(data.images[1]).toEqual({ device: 'desktop', width: 3840, height: 2160 });
  });

  it('returns error message for failed job', async () => {
    mockFindFirst.mockResolvedValue({
      id: 'job-123',
      status: 'failed',
      style: 'midnight-gold',
      devices: ['iphone'],
      errorMessage: 'Generation timed out',
      createdAt: new Date('2024-01-15T10:00:00Z'),
      completedAt: null,
    });

    const request = new NextRequest('http://localhost:3000/api/status/job-123');

    const response = await GET(request, { params: Promise.resolve({ jobId: 'job-123' }) });
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.status).toBe('failed');
    expect(data.error).toBe('Generation timed out');
  });

  it('returns 500 on database error', async () => {
    mockFindFirst.mockRejectedValue(new Error('Database connection failed'));

    const request = new NextRequest('http://localhost:3000/api/status/job-123');

    const response = await GET(request, { params: Promise.resolve({ jobId: 'job-123' }) });
    expect(response.status).toBe(500);

    const data = await response.json();
    expect(data.error).toBe('Failed to check status');
  });
});
