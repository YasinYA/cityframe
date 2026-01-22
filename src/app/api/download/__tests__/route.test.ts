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
  images: { jobId: 'jobId', device: 'device' },
}));

// Mock drizzle-orm
vi.mock('drizzle-orm', () => ({
  eq: vi.fn((a, b) => ({ field: a, value: b })),
  and: vi.fn((...conditions) => ({ and: conditions })),
}));

import { GET } from '../[jobId]/route';

const mockImageData = Buffer.from('fake-png-image-data').toString('base64');

describe('GET /api/download/[jobId]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when job not found', async () => {
    mockFindFirst.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/download/non-existent-id');

    const response = await GET(request, { params: Promise.resolve({ jobId: 'non-existent-id' }) });
    expect(response.status).toBe(404);

    const data = await response.json();
    expect(data.error).toBe('Job not found');
  });

  it('returns 400 when job is not completed', async () => {
    mockFindFirst.mockResolvedValue({
      id: 'job-123',
      status: 'processing',
    });

    const request = new NextRequest('http://localhost:3000/api/download/job-123');

    const response = await GET(request, { params: Promise.resolve({ jobId: 'job-123' }) });
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toBe('Job not completed yet');
  });

  it('returns 404 when no images found for job', async () => {
    mockFindFirst.mockResolvedValue({
      id: 'job-123',
      status: 'completed',
    });

    mockFindMany.mockResolvedValue([]);

    const request = new NextRequest('http://localhost:3000/api/download/job-123');

    const response = await GET(request, { params: Promise.resolve({ jobId: 'job-123' }) });
    expect(response.status).toBe(404);

    const data = await response.json();
    expect(data.error).toBe('No images found for this job');
  });

  it('returns download info for all images', async () => {
    mockFindFirst.mockResolvedValue({
      id: 'job-123',
      status: 'completed',
    });

    mockFindMany.mockResolvedValue([
      { device: 'iphone', width: 1170, height: 2532, imageData: mockImageData },
      { device: 'desktop', width: 3840, height: 2160, imageData: mockImageData },
    ]);

    const request = new NextRequest('http://localhost:3000/api/download/job-123');

    const response = await GET(request, { params: Promise.resolve({ jobId: 'job-123' }) });
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.jobId).toBe('job-123');
    expect(data.downloads).toHaveLength(2);
    expect(data.downloads[0].device).toBe('iphone');
    expect(data.downloads[0].width).toBe(1170);
    expect(data.downloads[0].height).toBe(2532);
    expect(data.downloads[0].dataUrl).toMatch(/^data:image\/png;base64,/);
    expect(data.downloads[1].device).toBe('desktop');
  });

  it('filters by device when device query param provided', async () => {
    mockFindFirst.mockResolvedValue({
      id: 'job-123',
      status: 'completed',
    });

    mockFindMany.mockResolvedValue([
      { device: 'iphone', width: 1170, height: 2532, imageData: mockImageData },
    ]);

    const request = new NextRequest('http://localhost:3000/api/download/job-123?device=iphone');

    const response = await GET(request, { params: Promise.resolve({ jobId: 'job-123' }) });
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.downloads).toHaveLength(1);
    expect(data.downloads[0].device).toBe('iphone');
  });

  it('returns direct binary download when download=true and single device', async () => {
    mockFindFirst.mockResolvedValue({
      id: 'job-123',
      status: 'completed',
    });

    mockFindMany.mockResolvedValue([
      { device: 'iphone', width: 1170, height: 2532, imageData: mockImageData },
    ]);

    const request = new NextRequest('http://localhost:3000/api/download/job-123?device=iphone&download=true');

    const response = await GET(request, { params: Promise.resolve({ jobId: 'job-123' }) });
    expect(response.status).toBe(200);

    // Check headers for binary download
    expect(response.headers.get('Content-Type')).toBe('image/png');
    expect(response.headers.get('Content-Disposition')).toContain('attachment');
    expect(response.headers.get('Content-Disposition')).toContain('wallpaper-iphone-1170x2532.png');
    expect(response.headers.get('Content-Length')).toBeDefined();
  });

  it('returns JSON when download=true but multiple images', async () => {
    mockFindFirst.mockResolvedValue({
      id: 'job-123',
      status: 'completed',
    });

    mockFindMany.mockResolvedValue([
      { device: 'iphone', width: 1170, height: 2532, imageData: mockImageData },
      { device: 'desktop', width: 3840, height: 2160, imageData: mockImageData },
    ]);

    // No device filter, so multiple images returned
    const request = new NextRequest('http://localhost:3000/api/download/job-123?download=true');

    const response = await GET(request, { params: Promise.resolve({ jobId: 'job-123' }) });
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.downloads).toHaveLength(2);
  });

  it('returns 500 on database error', async () => {
    mockFindFirst.mockRejectedValue(new Error('Database connection failed'));

    const request = new NextRequest('http://localhost:3000/api/download/job-123');

    const response = await GET(request, { params: Promise.resolve({ jobId: 'job-123' }) });
    expect(response.status).toBe(500);

    const data = await response.json();
    expect(data.error).toBe('Failed to get downloads');
  });

  it('handles different job statuses correctly', async () => {
    const statuses = ['pending', 'processing', 'failed'];

    for (const status of statuses) {
      mockFindFirst.mockResolvedValue({
        id: 'job-123',
        status,
      });

      const request = new NextRequest('http://localhost:3000/api/download/job-123');
      const response = await GET(request, { params: Promise.resolve({ jobId: 'job-123' }) });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Job not completed yet');
    }
  });
});
