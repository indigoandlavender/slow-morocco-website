import { NextResponse } from "next/server";
import { getSheetData } from "@/lib/sheets";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const testimonials = await getSheetData("Website_Testimonials");
    
    // Map to consistent format and filter published only
    const formattedTestimonials = testimonials
      .filter((t: any) => {
        const pub = String(t.Published || "").toLowerCase().trim();
        return pub === "true" || pub === "yes" || pub === "1";
      })
      .map((t: any) => ({
        id: t.Testimonial_ID || "",
        quote: t.Quote || "",
        author: t.Author || "",
        journeyTitle: t.Journey_Title || "",
        order: parseInt(t.Order) || 0,
      }))
      .sort((a: any, b: any) => a.order - b.order);

    return NextResponse.json({ success: true, testimonials: formattedTestimonials });
  } catch (error: any) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { success: false, testimonials: [], error: error.message },
      { status: 500 }
    );
  }
}
