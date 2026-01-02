import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/config";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSucceeded(paymentIntent);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const customerId = session.customer as string;
  const paymentStatus = session.payment_status;

  console.log(`Checkout completed for customer ${customerId}, payment status: ${paymentStatus}`);

  if (paymentStatus === "paid") {
    // Mark customer as Pro in their metadata
    await stripe.customers.update(customerId, {
      metadata: {
        pro: "true",
        purchasedAt: new Date().toISOString(),
      },
    });
    console.log(`Customer ${customerId} upgraded to Pro (lifetime)`);
  }
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const customerId = paymentIntent.customer as string;

  if (customerId) {
    console.log(`Payment succeeded for customer ${customerId}`);

    // Ensure Pro status is set
    await stripe.customers.update(customerId, {
      metadata: {
        pro: "true",
        purchasedAt: new Date().toISOString(),
      },
    });
  }
}
