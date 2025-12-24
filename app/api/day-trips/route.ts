import { NextResponse } from "next/server";
import { getSheetData, convertDriveUrl } from "@/lib/sheets";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const dayTrips = await getSheetData("Day_Trips");
    const addons = await getSheetData("Day_Trip_Addons");
    const settings = await getSheetData("Website_Settings");
    
    // Get hero image from settings
    const heroSetting = settings.find((s: any) => s.Key === "day_trips_hero_image");
    const heroImage = heroSetting ? convertDriveUrl(heroSetting.Value || "") : "";
    
    // Format day trips
    const formattedTrips = dayTrips
      .filter((t: any) => {
        const pub = String(t.Published || "").toLowerCase().trim();
        return pub === "true" || pub === "yes" || pub === "1";
      })
      .map((t: any) => ({
        slug: t.Slug || "",
        routeId: t.Route_ID || "",
        title: t.Title || "",
        shortDescription: t.Short_Description || "",
        durationHours: parseInt(t.Duration_Hours) || 0,
        priceMAD: parseFloat(t.Final_Price_MAD) || 0,
        priceEUR: parseFloat(t.Final_Price_EUR) || 0,
        departureCity: t.Departure_City || "Marrakech",
        category: t.Category || "",
        heroImage: convertDriveUrl(t.Hero_Image_URL || ""),
        includes: (t.Includes || "").split("|").filter(Boolean),
        excludes: (t.Excludes || "").split("|").filter(Boolean),
        meetingPoint: t.Meeting_Point || "",
      }));

    // Format addons
    const formattedAddons = addons
      .filter((a: any) => {
        const pub = String(a.Published || "").toLowerCase().trim();
        return pub === "true" || pub === "yes" || pub === "1";
      })
      .map((a: any) => ({
        id: a.Addon_ID || "",
        name: a.Addon_Name || "",
        description: a.Description || "",
        priceMAD: parseFloat(a.Final_Price_MAD_PP) || 0,
        priceEUR: parseFloat(a.Final_Price_EUR_PP) || 0,
        appliesTo: (a.Applies_To || "").split("|").filter(Boolean),
      }));

    return NextResponse.json({
      success: true,
      heroImage,
      dayTrips: formattedTrips,
      addons: formattedAddons,
    });
  } catch (error: any) {
    console.error("Day trips fetch error:", error);
    return NextResponse.json(
      { success: false, heroImage: "", dayTrips: [], addons: [], error: error.message },
      { status: 500 }
    );
  }
}
