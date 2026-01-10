import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "@/lib/auth/config";

export type SessionResponse = {
  authenticated: boolean;
  user: {
    email: string;
    isPro: boolean;
  } | null;
};

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionEmail = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const proStatus = cookieStore.get("paddle_pro_status")?.value;

    if (!sessionEmail) {
      return NextResponse.json<SessionResponse>({
        authenticated: false,
        user: null,
      });
    }

    // Check Pro status from Paddle cookie
    const isPro = proStatus === "true";

    return NextResponse.json<SessionResponse>({
      authenticated: true,
      user: {
        email: sessionEmail,
        isPro,
      },
    });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json<SessionResponse>({
      authenticated: false,
      user: null,
    });
  }
}
