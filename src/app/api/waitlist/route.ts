import { NextRequest, NextResponse } from "next/server";

// Simple email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Listmonk API integration
async function addToListmonk(email: string, name?: string): Promise<{ success: boolean; error?: string }> {
  const listmonkUrl = process.env.LISTMONK_URL;
  const apiUser = process.env.LISTMONK_API_USER;
  const apiToken = process.env.LISTMONK_API_TOKEN;
  const listId = process.env.LISTMONK_LIST_ID;

  if (!listmonkUrl || !apiUser || !apiToken || !listId) {
    console.warn("[Waitlist] Listmonk not configured, skipping integration");
    return { success: true };
  }

  const credentials = Buffer.from(`${apiUser}:${apiToken}`).toString("base64");

  try {
    const response = await fetch(`${listmonkUrl}/api/subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${credentials}`,
      },
      body: JSON.stringify({
        email,
        name: name || email.split("@")[0],
        status: "enabled",
        lists: [parseInt(listId, 10)],
        preconfirm_subscriptions: true,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle duplicate subscriber (already exists)
      if (response.status === 409 || data.message?.includes("exists")) {
        console.log(`[Waitlist] Subscriber already exists: ${email}`);
        return { success: true };
      }
      console.error("[Waitlist] Listmonk error:", data);
      return { success: false, error: data.message || "Failed to add subscriber" };
    }

    console.log(`[Waitlist] Successfully added to Listmonk: ${email}`);
    return { success: true };
  } catch (error) {
    console.error("[Waitlist] Listmonk request failed:", error);
    return { success: false, error: "Failed to connect to mailing list" };
  }
}

// Simple name validation
function isValidName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 100;
}

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (!isValidName(name)) {
      return NextResponse.json(
        { error: "Please enter a valid name (2-100 characters)" },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Add to Listmonk
    const result = await addToListmonk(email.trim(), name.trim());

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to join waitlist" },
        { status: 500 }
      );
    }

    console.log(`[Waitlist] New signup: ${name ? `${name} (${email})` : email}`);

    return NextResponse.json(
      { success: true, message: "Successfully joined the waitlist" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Waitlist] Error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
