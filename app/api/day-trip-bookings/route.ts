import { NextResponse } from "next/server";
import { appendSheetData } from "@/lib/sheets";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const {
      tripSlug,
      tripTitle,
      tripDate,
      guests,
      basePriceMAD,
      addons,
      addonsPriceMAD,
      totalMAD,
      totalEUR,
      guestName,
      guestEmail,
      guestPhone,
      pickupLocation,
      notes,
      paypalTransactionId,
    } = body;

    // Generate booking ID
    const timestamp = Date.now();
    const bookingId = `DT-${timestamp}`;
    const createdAt = new Date().toISOString();

    // Prepare row for Google Sheets
    const row = [
      bookingId,
      createdAt,
      tripSlug,
      tripTitle,
      tripDate,
      guests,
      basePriceMAD,
      addons, // comma-separated addon names
      addonsPriceMAD,
      totalMAD,
      totalEUR,
      guestName,
      guestEmail,
      guestPhone,
      pickupLocation,
      notes,
      paypalTransactionId,
      "confirmed",
    ];

    // Append to Day_Trip_Bookings sheet
    await appendSheetData("Day_Trip_Bookings", [row]);

    return NextResponse.json({
      success: true,
      bookingId,
      message: "Booking confirmed",
    });
  } catch (error: any) {
    console.error("Day trip booking error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
