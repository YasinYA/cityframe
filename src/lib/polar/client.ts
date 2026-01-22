'use client';

import { PolarEmbedCheckout } from '@polar-sh/checkout/embed';

type EmbedCheckoutInstance = Awaited<ReturnType<typeof PolarEmbedCheckout.create>>;
let checkoutInstance: EmbedCheckoutInstance | null = null;

export interface CheckoutSuccessData {
  orderId?: string;
  customerId?: string;
  redirect?: boolean;
}

export interface OpenCheckoutOptions {
  checkoutUrl: string;
  theme?: 'light' | 'dark';
  onSuccess?: (data: CheckoutSuccessData) => void;
  onClose?: () => void;
}

export async function openPolarCheckout({
  checkoutUrl,
  theme = 'dark',
  onSuccess,
  onClose,
}: OpenCheckoutOptions): Promise<void> {
  // Close any existing checkout
  if (checkoutInstance) {
    checkoutInstance.close();
    checkoutInstance = null;
  }

  try {
    // Convert relative URL to absolute URL
    const fullUrl = checkoutUrl.startsWith('/')
      ? `${window.location.origin}${checkoutUrl}`
      : checkoutUrl;

    const checkout = await PolarEmbedCheckout.create(fullUrl, {
      theme,
    });

    checkoutInstance = checkout;

    checkout.addEventListener('success', (event: CustomEvent) => {
      const detail = event.detail || {};
      onSuccess?.({
        orderId: detail.orderId || detail.order_id,
        customerId: detail.customerId || detail.customer_id,
        redirect: detail.redirect,
      });
    });

    checkout.addEventListener('close', () => {
      checkoutInstance = null;
      onClose?.();
    });
  } catch (error) {
    console.error('Failed to open Polar checkout:', error);
    throw error;
  }
}

export function closePolarCheckout(): void {
  if (checkoutInstance) {
    checkoutInstance.close();
    checkoutInstance = null;
  }
}
