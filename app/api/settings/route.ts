import { NextResponse } from "next/server";
import { getSheetData } from "@/lib/sheets";

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Convert Google Drive sharing URL to direct image URL
function convertGoogleDriveUrl(url: string): string {
  if (!url) return "";
  
  // Already a non-Google-Drive URL
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
    // Use thumbnail URL - more reliable than uc?export=view
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1920`;
  }
  
  return url;
}

export async function GET() {
  try {
    const settingsData = await getSheetData("Website_Settings");
    
    // Convert array of {Key, Value} to object
    const settings: { [key: string]: string } = {};
    settingsData.forEach((row: any) => {
      if (row.Key) {
        let value = row.Value || "";
        
        // Convert Google Drive URLs for image fields
        if (row.Key.includes("image") || row.Key.includes("Image")) {
          value = convertGoogleDriveUrl(value);
        }
        
        settings[row.Key] = value;
      }
    });

    const response = NextResponse.json({
      success: true,
      settings,
    });
    
    // Prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error: any) {
    console.error("Settings fetch error:", error);
    return NextResponse.json(
      { success: false, settings: {}, error: error.message },
      { status: 500 }
    );
  }
}
