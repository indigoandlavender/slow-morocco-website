import { NextResponse } from "next/server";
import { getSheetData } from "@/lib/sheets";

// Convert Google Drive sharing URL to direct image URL
function convertDriveUrl(url: string): string {
  if (!url) return "";
  
  // Already a direct URL (not Google Drive)
  if (!url.includes("drive.google.com")) {
    return url;
  }
  
  // Extract file ID from various Google Drive URL formats
  let fileId = "";
  
  // Format: https://drive.google.com/file/d/FILE_ID/view
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    fileId = fileMatch[1];
  }
  
  // Format: https://drive.google.com/open?id=FILE_ID
  const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (openMatch) {
    fileId = openMatch[1];
  }
  
  // Format: https://drive.google.com/uc?id=FILE_ID
  const ucMatch = url.match(/\/uc\?.*id=([a-zA-Z0-9_-]+)/);
  if (ucMatch) {
    fileId = ucMatch[1];
  }
  
  if (fileId) {
    // Return direct thumbnail URL (works for public files)
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`;
  }
  
  return url;
}

export async function GET() {
  try {
    // Fetch Content_Library tab from Google Sheets
    const contentData = await getSheetData("Content_Library");

    // Map to your actual column names from the sheet:
    // Hero_Image_URL, Hero_Title, Hero_Blurb, Route_ID, Day_Number, From_City, To_City, 
    // Day_Title, Route_Description, Image_URL_1, Duration_Hours, Highlights, Activities,
    // Difficulty_Level, Meals, Accommodation_Type, Practical_Information, Region, Sub_Region, Notes_Internal
    
    const contentBlocks = contentData.map((row: any, index: number) => ({
      id: row.Route_ID || `content-${index}`,
      // Day content - use day-specific fields only
      cityName: row.To_City || row.From_City || "",
      dayTitle: row.Day_Title || "",
      description: row.Route_Description || "",
      imageUrl: convertDriveUrl(row.Image_URL_1 || ""),
      // Hero content - separate fields
      heroImageUrl: convertDriveUrl(row.Hero_Image_URL || ""),
      heroTitle: row.Hero_Title || "",
      heroBlurb: row.Hero_Blurb || "",
      // Route info
      fromCity: row.From_City || "",
      toCity: row.To_City || "",
      dayNumber: row.Day_Number || "",
      highlights: row.Highlights || "",
      activities: row.Activities || "",
      meals: row.Meals || "",
      accommodationType: row.Accommodation_Type || "",
      region: row.Region || "",
      subRegion: row.Sub_Region || "",
      durationHours: row.Duration_Hours || "",
      difficultyLevel: row.Difficulty_Level || "",
      practicalInfo: row.Practical_Information || "",
    }));

    // Filter out completely empty entries - keep rows with hero OR day content
    const validBlocks = contentBlocks.filter((block: any) => 
      block.cityName || block.dayTitle || block.description || block.toCity ||
      block.heroTitle || block.heroBlurb || block.heroImageUrl
    );

    return NextResponse.json({
      success: true,
      contentBlocks: validBlocks,
      debug: {
        totalRows: contentData.length,
        validBlocks: validBlocks.length,
        sampleColumns: contentData.length > 0 ? Object.keys(contentData[0]) : []
      }
    });
  } catch (error: any) {
    console.error("Content Library fetch error:", error);
    return NextResponse.json(
      { success: false, error: error.message, contentBlocks: [] },
      { status: 500 }
    );
  }
}
