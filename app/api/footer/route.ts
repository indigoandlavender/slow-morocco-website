import { NextResponse } from "next/server";
import { getNexusData, getSheetData } from "@/lib/sheets";

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SITE_ID = process.env.SITE_ID || "slow-morocco";

// Convert Google Drive sharing URL to direct image URL
function convertGoogleDriveUrl(url: string): string {
  if (!url) return "";
  if (!url.includes("drive.google.com")) return url;
  
  let fileId = "";
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) fileId = fileMatch[1];
  
  const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (openMatch) fileId = openMatch[1];
  
  if (fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1920`;
  }
  return url;
}

export async function GET() {
  try {
    // Get footer links from Nexus
    const footerLinks = await getNexusData("Nexus_Footer_Links");
    const siteLinks = footerLinks.filter((link: any) => link.brand_id === SITE_ID);
    
    // Get site info from Nexus Sites tab
    const sites = await getNexusData("Sites");
    const siteInfo = sites.find((s: any) => s.site_id === SITE_ID) || {};
    
    // Get newsletter config from Website_Settings (brand-specific, not Nexus)
    let newsletterConfig = {
      show: true,
      backgroundImage: "",
      title: "Notes from Morocco",
      description: "Quiet. Irregular. Real.",
      brandName: siteInfo.site_name || "Slow Morocco",
    };
    
    try {
      const settingsData = await getSheetData("Website_Settings");
      const settingsMap: { [key: string]: string } = {};
      settingsData.forEach((row: any) => {
        if (row.Key) settingsMap[row.Key] = row.Value || "";
      });
      
      newsletterConfig = {
        show: settingsMap.newsletter_show !== "false",
        backgroundImage: convertGoogleDriveUrl(settingsMap.newsletter_background_image) || newsletterConfig.backgroundImage,
        title: settingsMap.newsletter_title || newsletterConfig.title,
        description: settingsMap.newsletter_description || newsletterConfig.description,
        brandName: settingsMap.site_name || siteInfo.site_name || "Slow Morocco",
      };
    } catch (e) {
      console.warn("Could not fetch Website_Settings for newsletter:", e);
    }
    
    // Get legal pages from Nexus
    const legalPages = await getNexusData("Nexus_Legal_Pages");
    const siteLegalPages = legalPages.filter((p: any) => 
      !p.brand_id || p.brand_id === SITE_ID || p.brand_id === "all"
    );

    // Group links by column
    const columnMap: { [key: number]: any } = {};
    siteLinks.forEach((link: any) => {
      const colNum = parseInt(link.column_number) || 1;
      if (!columnMap[colNum]) {
        columnMap[colNum] = {
          number: colNum,
          title: link.column_title || "",
          links: [],
        };
      }
      columnMap[colNum].links.push({
        order: parseInt(link.link_order) || 0,
        label: link.link_label || "",
        href: link.link_href || null,
        type: link.link_type || "link",
      });
    });

    // Sort links within each column
    Object.values(columnMap).forEach((col: any) => {
      col.links.sort((a: any, b: any) => a.order - b.order);
    });

    // Convert to sorted array
    const columns = Object.values(columnMap).sort((a: any, b: any) => a.number - b.number);

    // Build legal links
    const legal = siteLegalPages
      .filter((p: any) => p.page_slug && p.page_title)
      .map((p: any) => ({
        label: p.page_title,
        href: `/${p.page_slug}`,
      }));

    // Fallback legal if Nexus is empty
    const finalLegal = legal.length > 0 ? legal : [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Disclaimer", href: "/disclaimer" },
      { label: "Intellectual Property", href: "/intellectual-property" },
    ];

    // Build contact column from Website_Settings
    let contactLinks: any[] = [];
    try {
      const settingsData = await getSheetData("Website_Settings");
      const settingsMap: { [key: string]: string } = {};
      settingsData.forEach((row: any) => {
        if (row.Key) settingsMap[row.Key] = row.Value || "";
      });
      
      // Build contact links from settings
      if (settingsMap.contact_address_line1) {
        contactLinks.push({ order: 1, label: settingsMap.contact_address_line1, href: null, type: "address" });
      }
      if (settingsMap.contact_address_line2) {
        contactLinks.push({ order: 2, label: settingsMap.contact_address_line2, href: null, type: "address" });
      }
      if (settingsMap.contact_email) {
        contactLinks.push({ order: 3, label: settingsMap.contact_email, href: `mailto:${settingsMap.contact_email}`, type: "email" });
      }
      if (settingsMap.social_pinterest) {
        contactLinks.push({ order: 4, label: "Pinterest", href: settingsMap.social_pinterest, type: "social" });
      }
      if (settingsMap.social_instagram) {
        contactLinks.push({ order: 5, label: "Instagram", href: settingsMap.social_instagram, type: "social" });
      }
      if (settingsMap.social_youtube) {
        contactLinks.push({ order: 6, label: "YouTube", href: settingsMap.social_youtube, type: "social" });
      }
    } catch (e) {
      console.warn("Could not fetch Website_Settings for contact info:", e);
    }

    // Get site name for "About [Country]" column title
    const countryName = newsletterConfig.brandName.replace('Slow ', '') || 'Us';

    // Fallback columns if Nexus is empty
    const finalColumns = columns.length > 0 ? columns : [
      {
        number: 1,
        title: "Contact",
        links: contactLinks.length > 0 ? contactLinks : [
          { order: 1, label: "Contact us", href: "/contact", type: "link" },
        ],
      },
      {
        number: 2,
        title: "About Us",
        links: [
          { order: 1, label: "What We Offer", href: "/about", type: "link" },
          { order: 2, label: "Contact Us", href: "/contact", type: "link" },
        ],
      },
      {
        number: 3,
        title: "Journeys",
        links: [
          { order: 1, label: "Plan Your Trip", href: "/plan-your-trip", type: "link" },
          { order: 2, label: "What's Included", href: "/whats-included", type: "link" },
          { order: 3, label: "Cancellation Policy", href: "/cancellation-policy", type: "link" },
          { order: 4, label: "FAQ", href: "/faq", type: "link" },
        ],
      },
      {
        number: 4,
        title: `About ${countryName}`,
        links: [
          { order: 1, label: "Visa Info", href: "/visa-info", type: "link" },
          { order: 2, label: "Health & Safety", href: "/health-safety", type: "link" },
          { order: 3, label: "Travel Insurance", href: "/travel-insurance", type: "link" },
        ],
      },
    ];

    const footerData = {
      brandId: SITE_ID,
      newsletter: newsletterConfig,
      columns: finalColumns,
      legal: finalLegal,
      copyright: {
        year: new Date().getFullYear(),
        name: siteInfo.site_name || "Slow Morocco",
      },
    };

    const response = NextResponse.json({
      success: true,
      data: footerData,
    });
    
    // Prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error: any) {
    console.error("Footer fetch error:", error);
    
    // Return fallback on error - no image
    return NextResponse.json({
      success: true,
      data: {
        brandId: SITE_ID,
        newsletter: {
          show: true,
          backgroundImage: "",
          title: "Notes from Morocco",
          description: "Quiet. Irregular. Real.",
          brandName: "Slow Morocco",
        },
        columns: [
          {
            number: 1,
            title: "Contact",
            links: [
              { order: 1, label: "35 Derb Fhal Zfriti", href: null, type: "address" },
              { order: 2, label: "Marrakech Morocco", href: null, type: "address" },
              { order: 3, label: "+212 6 18 07 04 50", href: "https://wa.me/212618070450", type: "whatsapp" },
            ],
          },
        ],
        legal: [
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Terms of Service", href: "/terms" },
          { label: "Disclaimer", href: "/disclaimer" },
        ],
        copyright: {
          year: new Date().getFullYear(),
          name: "Slow Morocco",
        },
      },
    });
  }
}
