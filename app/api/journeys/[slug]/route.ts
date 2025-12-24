import { NextResponse } from "next/server";
import { getSheetData, convertDriveUrl } from "@/lib/sheets";

// CORS headers for cross-origin requests (e.g., from Riad di Siena)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    
    // Get all journeys
    const journeys = await getSheetData("Website_Journeys");
    
    // Find the specific journey by slug
    const journeyData = journeys.find(
      (j: any) => j.Slug === slug || j.Slug === decodeURIComponent(slug)
    );

    if (!journeyData) {
      return NextResponse.json(
        { success: false, error: "Journey not found" },
        { status: 404 }
      );
    }

    // Format journey data
    const journey = {
      slug: journeyData.Slug || "",
      title: journeyData.Title || "",
      duration: journeyData.Duration_Days ? `${journeyData.Duration_Days}-Day` : "",
      durationDays: parseInt(journeyData.Duration_Days) || 0,
      description: journeyData.Short_Description || "",
      arcDescription: journeyData.Arc_Description || "",
      heroImage: convertDriveUrl(journeyData.Hero_Image_URL || ""),
      price: journeyData.Price_USD || "",
      startCity: journeyData.Start_City || "",
      focus: journeyData.Focus_Type || "",
      journeyId: journeyData.Journey_ID || "",
    };

    // Get Route_Sequence and parse into array of Route_IDs
    const routeSequence = journeyData.Route_Sequence || "";
    const routeIds = routeSequence
      .split(",")
      .map((id: string) => id.trim())
      .filter((id: string) => id.length > 0);

    // Get Content_Library for route data
    const contentLibrary = await getSheetData("Content_Library");
    
    // Build itinerary from Route_Sequence
    const itinerary = routeIds.map((routeId: string, index: number) => {
      // Find the route in Content_Library by Route_ID
      const route = contentLibrary.find((r: any) => r.Route_ID === routeId);
      
      if (!route) {
        return {
          dayNumber: index + 1,
          cityName: "",
          fromCity: "",
          toCity: "",
          description: `Route ${routeId} not found`,
          imageUrl: "",
          travelTime: "",
          difficulty: "",
          activities: "",
          meals: "",
          routeType: "",
        };
      }

      const rawImageUrl = route.Image_URL_1 || "";
      
      return {
        dayNumber: index + 1,
        cityName: route.To_City || "",
        fromCity: route.From_City || "",
        toCity: route.To_City || "",
        description: route.Route_Narrative || "",
        imageUrl: convertDriveUrl(rawImageUrl),
        travelTime: route.Travel_Time_Hours || "",
        difficulty: route.Difficulty_Level || "",
        activities: route.Activities || "",
        meals: route.Meals || "",
        routeType: route.Route_Type || "",
      };
    });

    return NextResponse.json({
      success: true,
      journey,
      itinerary,
    }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("Journey detail fetch error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
