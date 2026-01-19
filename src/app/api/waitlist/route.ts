import { NextRequest, NextResponse } from "next/server";

// Simple email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

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

    // TODO: Integrate with your preferred email service
    // Options: Resend, Mailchimp, ConvertKit, Buttondown, etc.
    //
    // Example with Resend Audiences:
    // await resend.contacts.create({
    //   email,
    //   audienceId: process.env.RESEND_AUDIENCE_ID,
    // });
    //
    // Example with Mailchimp:
    // await mailchimp.lists.addListMember(listId, { email_address: email, status: "subscribed" });

    // For now, log to console (check your server logs)
    console.log(`[Waitlist] New signup: ${email}`);

    // You could also store to database:
    // await db.insert(waitlist).values({ email, createdAt: new Date() });

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
