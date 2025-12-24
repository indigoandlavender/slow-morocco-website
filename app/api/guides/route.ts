import { NextResponse } from "next/server";
import { getSheetData } from "@/lib/sheets";

export async function GET() {
  try {
    const guides = await getSheetData("Website_Guides");
    return NextResponse.json({ success: true, guides });
  } catch (error: any) {
    console.error("Error fetching guides:", error);
    return NextResponse.json(
      { success: false, guides: [], error: error.message },
      { status: 500 }
    );
  }
}
