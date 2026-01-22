import { Checkout } from '@polar-sh/nextjs';
import { POLAR_CONFIG, getSuccessUrl, getReturnUrl } from '@/lib/polar/config';

export const GET = Checkout({
  accessToken: POLAR_CONFIG.accessToken,
  successUrl: getSuccessUrl(),
  returnUrl: getReturnUrl(),
  server: POLAR_CONFIG.server,
  theme: 'dark',
});
