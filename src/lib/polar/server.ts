import { Polar } from '@polar-sh/sdk';
import { eq, and } from 'drizzle-orm';
import { POLAR_CONFIG } from './config';
import { db } from '@/lib/db/client';
import { purchases } from '@/lib/db/schema';

// Server-side Polar client
let polarClient: Polar | null = null;

function getPolarClient(): Polar {
  if (!polarClient) {
    if (!POLAR_CONFIG.accessToken) {
      throw new Error('POLAR_ACCESS_TOKEN is not configured');
    }
    polarClient = new Polar({
      accessToken: POLAR_CONFIG.accessToken,
      server: POLAR_CONFIG.server,
    });
  }
  return polarClient;
}

export interface VerifiedOrder {
  id: string;
  customerId: string;
  customerEmail: string;
  productId: string;
  status: string;
  paidAt: Date | null;
}

/**
 * Verify an order exists and is paid via Polar API
 * Returns order details if valid, null if not found or not paid
 */
export async function verifyOrder(orderId: string): Promise<VerifiedOrder | null> {
  try {
    const polar = getPolarClient();
    const order = await polar.orders.get({ id: orderId });

    if (!order) {
      console.log(`[Polar] Order not found: ${orderId}`);
      return null;
    }

    // Check if order is paid
    if (order.status !== 'paid') {
      console.log(`[Polar] Order not paid: ${orderId}, status: ${order.status}`);
      return null;
    }

    return {
      id: order.id,
      customerId: order.customerId ?? 'anonymous',
      customerEmail: order.customer.email ?? 'unknown',
      productId: order.productId ?? 'unknown',
      status: order.status,
      paidAt: order.createdAt ? new Date(order.createdAt) : null,
    };
  } catch (error) {
    console.error('[Polar] Error verifying order:', error);
    return null;
  }
}

/**
 * Verify that a customer ID matches the order
 */
export async function verifyOrderOwnership(
  orderId: string,
  customerId: string
): Promise<VerifiedOrder | null> {
  const order = await verifyOrder(orderId);

  if (!order) {
    return null;
  }

  if (order.customerId !== customerId) {
    console.log(`[Polar] Customer ID mismatch: expected ${order.customerId}, got ${customerId}`);
    return null;
  }

  return order;
}

/**
 * Check if a customer has a valid (non-refunded) purchase in our database
 * Returns the purchase if valid, null if not found or refunded
 */
export async function checkPurchaseStatus(customerId: string): Promise<{
  isValid: boolean;
  orderId: string | null;
  status: string | null;
  refundedAt: Date | null;
}> {
  try {
    const purchase = await db.query.purchases.findFirst({
      where: eq(purchases.customerId, customerId),
      orderBy: (purchases, { desc }) => [desc(purchases.createdAt)],
    });

    if (!purchase) {
      return { isValid: false, orderId: null, status: null, refundedAt: null };
    }

    return {
      isValid: purchase.status === 'paid',
      orderId: purchase.orderId,
      status: purchase.status,
      refundedAt: purchase.refundedAt,
    };
  } catch (error) {
    console.error('[Polar] Error checking purchase status:', error);
    return { isValid: false, orderId: null, status: null, refundedAt: null };
  }
}

/**
 * Check if a specific order is valid (paid and not refunded)
 */
export async function checkOrderStatus(orderId: string): Promise<{
  isValid: boolean;
  status: string | null;
  refundedAt: Date | null;
}> {
  try {
    const purchase = await db.query.purchases.findFirst({
      where: eq(purchases.orderId, orderId),
    });

    if (!purchase) {
      // Order not in DB yet - might be new, check with Polar API
      return { isValid: false, status: null, refundedAt: null };
    }

    return {
      isValid: purchase.status === 'paid',
      status: purchase.status,
      refundedAt: purchase.refundedAt,
    };
  } catch (error) {
    console.error('[Polar] Error checking order status:', error);
    return { isValid: false, status: null, refundedAt: null };
  }
}
