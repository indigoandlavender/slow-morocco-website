import { NextResponse } from "next/server";
import { unsubscribeFromNewsletter } from "@/lib/sheets";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Handle GET request (direct link clicks)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/newsletter/unsubscribe?error=missing_token", request.url));
  }

  const result = await unsubscribeFromNewsletter(token);

  if (result.success) {
    return NextResponse.redirect(new URL("/newsletter/unsubscribe?success=true", request.url));
  } else {
    return NextResponse.redirect(new URL(`/newsletter/unsubscribe?error=${encodeURIComponent(result.message)}`, request.url));
  }
}

// Handle POST request (form submission)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { success: false, message: "Invalid request." },
        { status: 400 }
      );
    }

    const result = await unsubscribeFromNewsletter(token);

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error) {
    console.error("Error in unsubscribe API:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
