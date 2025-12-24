import { NextResponse } from "next/server";
import { getSheetData, updateSheetRow } from "@/lib/sheets";

// GET - Fetch single quote by client ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = params.id;
    const quotes = await getSheetData("Quotes");
    
    // Find quote by Client_ID
    const quoteRow = quotes.find((q: any) => q.Client_ID === clientId);
    
    if (!quoteRow) {
      return NextResponse.json(
        { success: false, error: "Quote not found" },
        { status: 404 }
      );
    }

    // Map to clean structure
    const quote = {
      clientId: quoteRow.Client_ID || "",
      firstName: quoteRow.First_Name || "",
      lastName: quoteRow.Last_Name || "",
      email: quoteRow.Email || "",
      phone: quoteRow.WhatsApp_Number || "",
      countryCode: quoteRow.WhatsApp_Country_Code ? `+${quoteRow.WhatsApp_Country_Code}` : "+1",
      country: quoteRow.Country || "",
      journeyInterest: quoteRow.Journey_Interest || "",
      startDate: quoteRow.Start_Date || "",
      endDate: quoteRow.End_Date || "",
      startCity: quoteRow.Start_City || "",
      endCity: quoteRow.End_City || "",
      days: quoteRow.Days || "",
      nights: quoteRow.Nights || "",
      travelers: quoteRow.Number_Travelers || "",
      language: quoteRow.Language || "",
      budget: quoteRow.Budget || "",
      hospitalityLevel: quoteRow.Hospitality_Level || "",
      requests: quoteRow.Requests || "",
      status: quoteRow.Status || "NEW",
      proposalUrl: quoteRow.Proposal_URL || "",
      createdDate: quoteRow.Created_Date || "",
      notes: quoteRow.Notes || "",
    };

    return NextResponse.json({ success: true, quote });
  } catch (error: any) {
    console.error("Quote fetch error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update quote
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = params.id;
    const body = await request.json();
    
    const quotes = await getSheetData("Quotes");
    const rowIndex = quotes.findIndex((q: any) => q.Client_ID === clientId);
    
    if (rowIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Quote not found" },
        { status: 404 }
      );
    }

    // Build updated row (matching Quotes sheet columns)
    const updatedRow = [
      clientId,                                          // Client_ID
      body.firstName || "",                              // First_Name
      body.lastName || "",                               // Last_Name
      body.email || "",                                  // Email
      (body.countryCode || "").replace("+", ""),         // WhatsApp_Country_Code
      body.phone || "",                                  // WhatsApp_Number
      body.journeyInterest || "",                        // Journey_Interest
      body.startDate || "",                              // Start_Date
      body.endDate || "",                                // End_Date
      body.days || "",                                   // Days
      body.nights || "",                                 // Nights
      body.language || "",                               // Language
      body.hospitalityLevel || "",                       // Hospitality_Level
      "",                                                // Dream_Experience
      body.requests || "",                               // Requests
      "",                                                // Hear_About_Us
      body.travelers || "",                              // Number_Travelers
      body.budget || "",                                 // Budget
      body.startCity || "",                              // Start_City
      body.endCity || "",                                // End_City
      "",                                                // Journey_Type
      body.status || "NEW",                              // Status
      "",                                                // Itinerary_Doc_Link
      body.proposalUrl || "",                            // Proposal_URL
      quotes[rowIndex].Created_Date || "",               // Created_Date (preserve)
      new Date().toISOString(),                          // Last_Updated
      body.notes || "",                                  // Notes
      body.country || "",                                // Country
    ];

    // Row index is 0-based from data, but sheet is 1-based and has header row
    await updateSheetRow("Quotes", rowIndex + 2, updatedRow);

    return NextResponse.json({ success: true, message: "Quote updated" });
  } catch (error: any) {
    console.error("Quote update error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete quote (mark as cancelled or actually delete)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const clientId = params.id;
    const quotes = await getSheetData("Quotes");
    const rowIndex = quotes.findIndex((q: any) => q.Client_ID === clientId);
    
    if (rowIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Quote not found" },
        { status: 404 }
      );
    }

    // For now, just mark as CANCELLED instead of deleting
    const existingRow = quotes[rowIndex];
    const updatedRow = [
      existingRow.Client_ID,
      existingRow.First_Name,
      existingRow.Last_Name,
      existingRow.Email,
      existingRow.WhatsApp_Country_Code,
      existingRow.WhatsApp_Number,
      existingRow.Journey_Interest,
      existingRow.Start_Date,
      existingRow.End_Date,
      existingRow.Days,
      existingRow.Nights,
      existingRow.Language,
      existingRow.Hospitality_Level,
      existingRow.Dream_Experience,
      existingRow.Requests,
      existingRow.Hear_About_Us,
      existingRow.Number_Travelers,
      existingRow.Budget,
      existingRow.Start_City,
      existingRow.End_City,
      existingRow.Journey_Type,
      "CANCELLED",                                       // Status
      existingRow.Itinerary_Doc_Link,
      existingRow.Proposal_URL,
      existingRow.Created_Date,
      new Date().toISOString(),                          // Last_Updated
      existingRow.Notes,
      existingRow.Country,
    ];

    await updateSheetRow("Quotes", rowIndex + 2, updatedRow);

    return NextResponse.json({ success: true, message: "Quote cancelled" });
  } catch (error: any) {
    console.error("Quote delete error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
