import { NextResponse } from "next/server";
import { getSheetData } from "@/lib/sheets";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const proposalId = url.searchParams.get("id");
    
    if (!proposalId) {
      return NextResponse.json(
        { success: false, error: "Proposal ID required" },
        { status: 400 }
      );
    }
    
    const proposals = await getSheetData("Proposals");
    
    // Find the proposal by ID
    const proposal = proposals.find((p: any) => p.proposal_ID === proposalId);
    
    if (!proposal) {
      return NextResponse.json(
        { success: false, error: "Proposal not found" },
        { status: 404 }
      );
    }
    
    // Parse JSON fields
    let routePoints = [];
    let daysList = [];
    
    try {
      routePoints = typeof proposal.routePoints === "string" 
        ? JSON.parse(proposal.routePoints) 
        : proposal.routePoints || [];
    } catch (e) {
      console.warn("Failed to parse routePoints:", e);
    }
    
    try {
      daysList = typeof proposal.daysList === "string" 
        ? JSON.parse(proposal.daysList) 
        : proposal.daysList || [];
    } catch (e) {
      console.warn("Failed to parse daysList:", e);
    }
    
    // Transform to the format expected by the proposal page
    const transformedProposal = {
      id: proposal.proposal_ID,
      journeyTitle: proposal.heroTitle || "Your Morocco Journey",
      arcDescription: proposal.heroBlurb || "",
      clientName: proposal.client_Name || "",
      heroImage: proposal.heroImageUrl || "",
      price: proposal.formattedPrice || proposal.totalPrice || "",
      numGuests: proposal.numGuests || 2,
      startDate: proposal.startDate || "",
      endDate: proposal.endDate || "",
      routePoints: routePoints,
      days: daysList.map((day: any) => ({
        dayNumber: day.dayNumber || 1,
        date: day.date || "",
        title: day.toCity || day.title || `Day ${day.dayNumber}`,
        fromCity: day.fromCity || "",
        toCity: day.toCity || "",
        description: day.description || "",
        imageUrl: day.imageUrl || "",
        durationHours: day.durationHours || "",
        activities: day.activities || "",
        difficultyLevel: day.difficultyLevel || "",
        meals: day.meals || "",
        accommodationName: day.accommodationName || "",
      })),
    };
    
    return NextResponse.json({
      success: true,
      proposal: transformedProposal,
    });
  } catch (error: any) {
    console.error("Error fetching proposal:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
