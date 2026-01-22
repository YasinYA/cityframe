// Polar.sh configuration

export const POLAR_CONFIG = {
  organizationSlug: 'cityframe',
  server: (process.env.POLAR_MODE || 'sandbox') as 'sandbox' | 'production',
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  productId: process.env.POLAR_PRODUCT_ID!,
};

export const getSuccessUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/success?source=polar`;
};

export const getReturnUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/pricing`;
};
