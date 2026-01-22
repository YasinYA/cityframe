import { Webhooks } from '@polar-sh/nextjs';
import { POLAR_CONFIG } from '@/lib/polar/config';

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
    });

    // Note: Pro status is set via cookies when user returns to success page
    // This webhook can be used for additional server-side tracking if needed
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
    // TODO: Handle refund - revoke Pro access if needed
  },
});
