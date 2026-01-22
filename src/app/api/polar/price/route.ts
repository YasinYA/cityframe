import { NextResponse } from 'next/server';
import { Polar } from '@polar-sh/sdk';

export interface PriceData {
  id: string;
  name: string;
  description: string | null;
  amount: number;
  currency: string;
}

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: (process.env.POLAR_MODE as 'sandbox' | 'production') || 'sandbox',
});

export async function GET(): Promise<NextResponse<PriceData>> {
  const productId = process.env.POLAR_PRODUCT_ID;

  if (!productId || !process.env.POLAR_ACCESS_TOKEN) {
    // Return fallback if Polar not configured
    return NextResponse.json({
      id: 'fallback',
      name: 'Pro',
      description: 'Lifetime access to all features',
      amount: 9.99,
      currency: 'USD',
    });
  }

  try {
    const product = await polar.products.get({ id: productId });

    // Get the first price from the product
    const price = product.prices?.[0];

    // Handle different price types
    let amount = 9.99;
    let currency = 'USD';

    if (price && 'priceAmount' in price && price.priceAmount) {
      // Convert from cents to dollars
      amount = price.priceAmount / 100;
      currency = price.priceCurrency || 'USD';
    }

    return NextResponse.json(
      {
        id: product.id,
        name: product.name,
        description: product.description,
        amount,
        currency,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('Failed to fetch Polar product:', error);

    // Return fallback on error
    return NextResponse.json({
      id: 'fallback',
      name: 'Pro',
      description: 'Lifetime access to all features',
      amount: 9.99,
      currency: 'USD',
    });
  }
}
