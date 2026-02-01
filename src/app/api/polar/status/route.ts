import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyOrderOwnership, checkOrderStatus } from '@/lib/polar/server';

export interface PurchaseStatus {
  isPro: boolean;
  purchasedAt: string | null;
  customerId: string | null;
}

const PRO_STATUS_COOKIE = 'polar_pro_status';
const CUSTOMER_ID_COOKIE = 'polar_customer_id';
const PURCHASED_AT_COOKIE = 'polar_purchased_at';
const ORDER_ID_COOKIE = 'polar_order_id';

// 10 years in seconds for lifetime access
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 10;

export async function GET(): Promise<NextResponse<PurchaseStatus>> {
  const cookieStore = await cookies();

  const cookieIsPro = cookieStore.get(PRO_STATUS_COOKIE)?.value === 'true';
  const customerId = cookieStore.get(CUSTOMER_ID_COOKIE)?.value || null;
  const purchasedAt = cookieStore.get(PURCHASED_AT_COOKIE)?.value || null;
  const orderId = cookieStore.get(ORDER_ID_COOKIE)?.value || null;

  // If user has Pro cookie, verify the order hasn't been refunded
  let isPro = cookieIsPro;
  if (cookieIsPro && orderId) {
    const orderStatus = await checkOrderStatus(orderId);
    if (orderStatus.status === 'refunded') {
      // Order was refunded - clear Pro cookies
      isPro = false;
      console.log(`[Pro Status] Order ${orderId} was refunded, revoking Pro access`);

      // Clear the cookies
      cookieStore.delete(PRO_STATUS_COOKIE);
      cookieStore.delete(CUSTOMER_ID_COOKIE);
      cookieStore.delete(PURCHASED_AT_COOKIE);
      cookieStore.delete(ORDER_ID_COOKIE);
    }
  }

  return NextResponse.json({
    isPro,
    purchasedAt: isPro ? purchasedAt : null,
    customerId: isPro ? customerId : null,
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

    // SECURITY: Verify the order with Polar API before granting Pro status
    const verifiedOrder = await verifyOrderOwnership(orderId, customerId);

    if (!verifiedOrder) {
      console.warn(`[Pro Status] Failed to verify order: ${orderId} for customer: ${customerId}`);
      return NextResponse.json(
        { error: 'Order verification failed. Please contact support if this persists.' },
        { status: 403 }
      );
    }

    console.log(`[Pro Status] Verified order ${orderId} for ${verifiedOrder.customerEmail}`);

    const purchasedAt = verifiedOrder.paidAt?.toISOString() || new Date().toISOString();
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

    // Store order ID for refund tracking
    cookieStore.set(ORDER_ID_COOKIE, orderId, {
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
