import { Webhooks } from '@polar-sh/nextjs';
import { eq } from 'drizzle-orm';
import { POLAR_CONFIG } from '@/lib/polar/config';
import { db } from '@/lib/db/client';
import { purchases } from '@/lib/db/schema';

export const POST = Webhooks({
  webhookSecret: POLAR_CONFIG.webhookSecret,
  onPayload: async (payload) => {
    console.log('Polar webhook received:', payload.type);
  },
  onOrderPaid: async (payload) => {
    const { data } = payload;
    console.log('Order paid:', {
      orderId: data.id,
      customerId: data.customerId,
      productId: data.productId,
      email: data.customer?.email,
    });

    try {
      // Store purchase in database
      const orderId = data.id;
      if (!orderId) {
        console.error('[Webhook] Order ID is missing');
        return;
      }

      await db.insert(purchases).values({
        orderId,
        customerId: data.customerId ?? 'anonymous',
        customerEmail: data.customer?.email ?? 'unknown',
        productId: data.productId ?? 'unknown',
        status: 'paid',
        paidAt: new Date(),
      }).onConflictDoUpdate({
        target: purchases.orderId,
        set: {
          status: 'paid',
          paidAt: new Date(),
          updatedAt: new Date(),
        },
      });

      console.log(`[Webhook] Purchase recorded for order ${data.id}`);
    } catch (error) {
      console.error('[Webhook] Failed to record purchase:', error);
      // Don't throw - we don't want to fail the webhook
    }
  },
  onOrderCreated: async (payload) => {
    const { data } = payload;
    console.log('Order created:', {
      orderId: data.id,
      customerId: data.customerId,
    });
  },
  onOrderRefunded: async (payload) => {
    const { data } = payload;
    console.log('Order refunded:', {
      orderId: data.id,
      customerId: data.customerId,
    });

    const orderId = data.id;
    if (!orderId) {
      console.error('[Webhook] Order ID is missing for refund');
      return;
    }

    try {
      // Mark purchase as refunded in database
      await db.update(purchases)
        .set({
          status: 'refunded',
          refundedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(purchases.orderId, orderId));

      console.log(`[Webhook] Purchase refunded for order ${data.id}`);
    } catch (error) {
      console.error('[Webhook] Failed to record refund:', error);
      // Don't throw - we don't want to fail the webhook
    }
  },
});
