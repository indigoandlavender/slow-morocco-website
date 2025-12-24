import { NextResponse } from "next/server";
import { getSheetData, appendSheetData } from "@/lib/sheets";

export async function GET() {
  try {
    const proposals = await getSheetData("Proposals");
    return NextResponse.json({ success: true, proposals });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Generate proposal ID with timestamp for uniqueness
    const proposalId = `PRP-${Date.now()}`;
    
    // Build row matching Proposals sheet columns exactly:
    // proposal_ID, client_ID, client_Name, Country, heroImageUrl, heroTitle, heroBlurb,
    // startDate, endDate, days, nights, numGuests, totalPrice, formattedPrice,
    // routePoints, daysList, created_at
    const rowData = [
      proposalId,                                        // proposal_ID
      data.clientId || "",                               // client_ID
      data.clientName || "",                             // client_Name
      data.country || "",                                // Country
      data.heroImageUrl || "",                           // heroImageUrl
      data.heroTitle || "",                              // heroTitle
      data.heroBlurb || "",                              // heroBlurb
      data.startDate || "",                              // startDate
      data.endDate || "",                                // endDate
      data.days || "",                                   // days
      data.nights || "",                                 // nights
      data.numGuests || "",                              // numGuests
      data.totalPrice || "",                             // totalPrice
      data.formattedPrice || "",                         // formattedPrice
      JSON.stringify(data.routePoints || []),            // routePoints (JSON array)
      JSON.stringify(data.daysList || []),               // daysList (JSON array)
      new Date().toISOString(),                          // created_at
    ];

    await appendSheetData("Proposals", [rowData]);

    return NextResponse.json({
      success: true,
      proposalId,
      message: "Proposal created successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
