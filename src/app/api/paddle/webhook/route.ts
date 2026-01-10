import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { cookies } from "next/headers";

interface PaddleWebhookEvent {
  event_type: string;
  event_id: string;
  occurred_at: string;
  data: {
    id: string;
    customer_id?: string;
    status?: string;
    custom_data?: Record<string, string>;
    items?: Array<{
      price: {
        id: string;
      };
    }>;
  };
}

function verifyPaddleSignature(
  rawBody: string,
  signature: string,
  webhookSecret: string
): boolean {
  try {
    // Paddle signature format: ts=timestamp;h1=hash
    const parts = signature.split(";");
    const timestamp = parts.find((p) => p.startsWith("ts="))?.split("=")[1];
    const hash = parts.find((p) => p.startsWith("h1="))?.split("=")[1];

    if (!timestamp || !hash) {
      return false;
    }

    // Build the signed payload
    const signedPayload = `${timestamp}:${rawBody}`;
    const expectedHash = crypto
      .createHmac("sha256", webhookSecret)
      .update(signedPayload)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(hash),
      Buffer.from(expectedHash)
    );
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("paddle-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing paddle-signature header" },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("PADDLE_WEBHOOK_SECRET not configured");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  if (!verifyPaddleSignature(rawBody, signature, webhookSecret)) {
    console.error("Paddle webhook signature verification failed");
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  let event: PaddleWebhookEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  try {
    switch (event.event_type) {
      case "transaction.completed": {
        await handleTransactionCompleted(event);
        break;
      }

      case "transaction.paid": {
        await handleTransactionPaid(event);
        break;
      }

      default:
        console.log(`Unhandled Paddle event type: ${event.event_type}`);
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

async function handleTransactionCompleted(event: PaddleWebhookEvent) {
  const customerId = event.data.customer_id;
  const transactionId = event.data.id;

  console.log(
    `Transaction completed: ${transactionId} for customer ${customerId}`
  );

  // Store the purchase in your database
  // For now, we'll store it via cookies on the client side
  // In production, you'd want to store this in a database linked to the customer
}

async function handleTransactionPaid(event: PaddleWebhookEvent) {
  const customerId = event.data.customer_id;
  const transactionId = event.data.id;

  console.log(
    `Transaction paid: ${transactionId} for customer ${customerId}`
  );
}
