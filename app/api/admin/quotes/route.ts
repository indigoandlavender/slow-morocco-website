import { NextResponse } from "next/server";
import { getSheetData, appendSheetData } from "@/lib/sheets";

export async function GET() {
  try {
    const quotes = await getSheetData("Quotes");
    
    // Filter out the header row that contains dropdown options
    const validQuotes = quotes.filter((q: any) => 
      q.Client_ID && 
      q.Client_ID !== "Client_ID" && 
      !q.Client_ID.includes(",") // Skip rows with comma-separated values (dropdown options)
    );

    // Sort by Created_Date descending (newest first)
    validQuotes.sort((a: any, b: any) => {
      const dateA = a.Created_Date ? new Date(a.Created_Date).getTime() : 0;
      const dateB = b.Created_Date ? new Date(b.Created_Date).getTime() : 0;
      return dateB - dateA;
    });

    return NextResponse.json({
      success: true,
      quotes: validQuotes,
    });
  } catch (error: any) {
    console.error("Error fetching quotes:", error);
    return NextResponse.json(
      { success: false, quotes: [], error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new quote
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Generate Client_ID
    const year = new Date().getFullYear();
    const quotes = await getSheetData("Quotes");
    const existingIds = quotes.map((q: any) => q.Client_ID).filter((id: string) => id?.startsWith(`SM-${year}`));
    const nextNum = existingIds.length + 1;
    const clientId = `SM-${year}-${String(nextNum).padStart(3, '0')}`;
    
    // Build row matching Quotes sheet columns exactly:
    // Client_ID, First_Name, Last_Name, Country, Email, WhatsApp_Country_Code, WhatsApp_Number,
    // Journey_Interest, Start_Date, End_Date, Days, Nights, Language, Hospitality_Level,
    // Dream_Experience, Requests, Hear_About_Us, Number_Travelers, Budget, Start_City,
    // End_City, Journey_Type, Status, Itinerary_Doc_Link, Proposal_URL, Created_Date,
    // Last_Updated, Notes
    const newRow = [
      clientId,                                          // Client_ID
      body.firstName || "",                              // First_Name
      body.lastName || "",                               // Last_Name
      body.country || "",                                // Country
      body.email || "",                                  // Email
      body.whatsAppCountryCode || "",                    // WhatsApp_Country_Code
      body.phone || "",                                  // WhatsApp_Number
      body.journeyInterest || "",                        // Journey_Interest
      body.startDate || "",                              // Start_Date
      body.endDate || "",                                // End_Date
      body.days || "",                                   // Days
      body.nights || "",                                 // Nights
      body.language || "",                               // Language
      body.hospitalityLevel || "",                       // Hospitality_Level
      body.dreamExperience || "",                        // Dream_Experience
      body.requests || "",                               // Requests
      body.hearAboutUs || "",                            // Hear_About_Us
      body.travelers || "",                              // Number_Travelers
      body.budget || "",                                 // Budget
      body.startCity || "",                              // Start_City
      body.endCity || "",                                // End_City
      body.journeyType || "",                            // Journey_Type
      "NEW",                                             // Status
      "",                                                // Itinerary_Doc_Link
      "",                                                // Proposal_URL
      new Date().toISOString(),                          // Created_Date
      new Date().toISOString(),                          // Last_Updated
      body.notes || "",                                  // Notes
    ];

    await appendSheetData("Quotes", [newRow]);

    return NextResponse.json({ success: true, clientId });
  } catch (error: any) {
    console.error("Error creating quote:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
