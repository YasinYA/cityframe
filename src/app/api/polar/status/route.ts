import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export interface PurchaseStatus {
  isPro: boolean;
  purchasedAt: string | null;
  customerId: string | null;
}

const PRO_STATUS_COOKIE = 'polar_pro_status';
const CUSTOMER_ID_COOKIE = 'polar_customer_id';
const PURCHASED_AT_COOKIE = 'polar_purchased_at';

// 10 years in seconds for lifetime access
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 10;

export async function GET(): Promise<NextResponse<PurchaseStatus>> {
  const cookieStore = await cookies();

  const isPro = cookieStore.get(PRO_STATUS_COOKIE)?.value === 'true';
  const customerId = cookieStore.get(CUSTOMER_ID_COOKIE)?.value || null;
  const purchasedAt = cookieStore.get(PURCHASED_AT_COOKIE)?.value || null;

  return NextResponse.json({
    isPro,
    purchasedAt,
    customerId,
  });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { customerId, orderId } = body;

    if (!customerId || !orderId) {
      return NextResponse.json(
        { error: 'Missing customerId or orderId' },
        { status: 400 }
      );
    }

    const purchasedAt = new Date().toISOString();
    const cookieStore = await cookies();

    cookieStore.set(PRO_STATUS_COOKIE, 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });

    cookieStore.set(CUSTOMER_ID_COOKIE, customerId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });

    cookieStore.set(PURCHASED_AT_COOKIE, purchasedAt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });

    return NextResponse.json({
      success: true,
      isPro: true,
      purchasedAt,
    });
  } catch (error) {
    console.error('Error updating Pro status:', error);
    return NextResponse.json(
      { error: 'Failed to update Pro status' },
      { status: 500 }
    );
  }
}
