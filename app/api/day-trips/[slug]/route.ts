import { NextResponse } from "next/server";
import { getSheetData, convertDriveUrl } from "@/lib/sheets";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Get day trips
    const dayTrips = await getSheetData("Day_Trips");
    const addons = await getSheetData("Day_Trip_Addons");
    const contentLibrary = await getSheetData("Content_Library");
    
    // Find the specific day trip
    const tripData = dayTrips.find(
      (t: any) => t.Slug === slug || t.Slug === decodeURIComponent(slug)
    );

    if (!tripData) {
      return NextResponse.json(
        { success: false, error: "Day trip not found" },
        { status: 404 }
      );
    }

    // Get the route narrative from Content_Library
    const routeId = tripData.Route_ID || "";
    const routeData = contentLibrary.find((r: any) => r.Route_ID === routeId);

    // Format day trip
    const dayTrip = {
      slug: tripData.Slug || "",
      routeId: routeId,
      title: tripData.Title || "",
      shortDescription: tripData.Short_Description || "",
      durationHours: parseInt(tripData.Duration_Hours) || 0,
      priceMAD: parseFloat(tripData.Final_Price_MAD) || 0,
      priceEUR: parseFloat(tripData.Final_Price_EUR) || 0,
      departureCity: tripData.Departure_City || "Marrakech",
      category: tripData.Category || "",
      heroImage: convertDriveUrl(tripData.Hero_Image_URL || ""),
      includes: (tripData.Includes || "").split("|").filter(Boolean),
      excludes: (tripData.Excludes || "").split("|").filter(Boolean),
      meetingPoint: tripData.Meeting_Point || "",
      // From Content_Library
      narrative: routeData?.Route_Narrative || "",
      fromCity: routeData?.From_City || "Marrakech",
      toCity: routeData?.To_City || "",
      viaCities: routeData?.Via_Cities || "",
      travelTime: routeData?.Travel_Time_Hours || "",
      activities: routeData?.Activities || "",
      difficulty: routeData?.Difficulty_Level || "",
      region: routeData?.Region || "",
      routeImage: convertDriveUrl(routeData?.Image_URL_1 || ""),
    };

    // Get applicable addons for this trip
    const applicableAddons = addons
      .filter((a: any) => {
        const pub = String(a.Published || "").toLowerCase().trim();
        if (!(pub === "true" || pub === "yes" || pub === "1")) return false;
        
        const appliesTo = (a.Applies_To || "").split("|");
        return appliesTo.includes(slug);
      })
      .map((a: any) => ({
        id: a.Addon_ID || "",
        name: a.Addon_Name || "",
        description: a.Description || "",
        priceMAD: parseFloat(a.Final_Price_MAD_PP) || 0,
        priceEUR: parseFloat(a.Final_Price_EUR_PP) || 0,
      }));

    return NextResponse.json({
      success: true,
      dayTrip,
      addons: applicableAddons,
    });
  } catch (error: any) {
    console.error("Day trip detail fetch error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
