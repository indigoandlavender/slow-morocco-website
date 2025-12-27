import { google } from "googleapis";

// Convert Google Drive URLs to thumbnail format for reliable image loading
export function convertDriveUrl(url: string): string {
  if (!url) return "";
  
  let fileId: string | null = null;
  
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
  const ucMatch = url.match(/uc\?.*id=([a-zA-Z0-9_-]+)/);
  if (ucMatch) {
    fileId = ucMatch[1];
  }
  
  if (fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
  }
  
  return url;
}

const getGoogleSheetsClient = () => {
  const base64Creds = process.env.GOOGLE_SERVICE_ACCOUNT_BASE64;
  if (!base64Creds) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_BASE64 is not set");
  }

  const credentials = JSON.parse(
    Buffer.from(base64Creds, "base64").toString("utf-8")
  );

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
};

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const NEXUS_SHEET_ID = process.env.NEXUS_SHEET_ID;

export async function getSheetData(tabName: string) {
  const sheets = getGoogleSheetsClient();
  
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${tabName}!A1:ZZ`,
    });

    const rows = response.data.values || [];
    if (rows.length === 0) return [];

    const headers = rows[0];
    return rows.slice(1).map((row) => {
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || "";
      });
      return obj;
    });
  } catch (error: any) {
    console.error(`Error fetching sheet "${tabName}":`, error.message);
    return [];
  }
}

// Fetch data from Nexus database
export async function getNexusData(tabName: string) {
  const sheets = getGoogleSheetsClient();
  
  if (!NEXUS_SHEET_ID) {
    console.error("NEXUS_SHEET_ID is not set");
    return [];
  }
  
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: NEXUS_SHEET_ID,
      range: `${tabName}!A1:ZZ`,
    });

    const rows = response.data.values || [];
    if (rows.length === 0) return [];

    const headers = rows[0];
    return rows.slice(1).map((row) => {
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || "";
      });
      return obj;
    });
  } catch (error: any) {
    console.error(`Error fetching Nexus sheet "${tabName}":`, error.message);
    return [];
  }
}

export async function appendSheetData(tabName: string, values: any[][]) {
  const sheets = getGoogleSheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${tabName}!A:ZZ`,
    valueInputOption: "RAW",
    requestBody: {
      values,
    },
  });
}

export async function updateSheetRow(
  tabName: string,
  rowIndex: number,
  values: any[]
) {
  const sheets = getGoogleSheetsClient();
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${tabName}!A${rowIndex}:ZZ${rowIndex}`,
    valueInputOption: "RAW",
    requestBody: {
      values: [values],
    },
  });
}

export async function getNextId(prefix: string, tabName: string) {
  const data = await getSheetData(tabName);
  const existingIds = data
    .map((row: any) => row.id || "")
    .filter((id: string) => id.startsWith(prefix))
    .map((id: string) => parseInt(id.replace(prefix, ""), 10))
    .filter((num: number) => !isNaN(num));

  const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
  return `${prefix}${String(maxId + 1).padStart(3, "0")}`;
}

// ============================================
// NEWSLETTER SUBSCRIPTION SYSTEM
// ============================================

const SITE_ID = process.env.SITE_ID || "slow-morocco";

// Brand name mapping for newsletter
const BRAND_NAMES: Record<string, string> = {
  'slow-morocco': 'Slow Morocco',
  'slow-namibia': 'Slow Namibia',
  'slow-turkiye': 'Slow Türkiye',
  'slow-tunisia': 'Slow Tunisia',
  'slow-mauritius': 'Slow Mauritius',
  'riad-di-siena': 'Riad di Siena',
  'dancing-with-lions': 'Dancing with Lions',
  'slow-world': 'Slow World',
};

// Generate random unsubscribe token
function generateUnsubscribeToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Subscribe to newsletter
export async function subscribeToNewsletter(
  email: string,
  brand?: string
): Promise<{ success: boolean; message: string; isResubscribe?: boolean }> {
  if (!NEXUS_SHEET_ID) {
    console.error("[Newsletter] NEXUS_SHEET_ID not configured");
    return { success: false, message: "Configuration error" };
  }

  const brandName = brand || BRAND_NAMES[SITE_ID] || SITE_ID;
  
  console.log("[Newsletter] Subscribing:", { email, brandName, SITE_ID, NEXUS_SHEET_ID });

  try {
    const sheets = getGoogleSheetsClient();

    // Check if already subscribed
    const existingRows = await sheets.spreadsheets.values.get({
      spreadsheetId: NEXUS_SHEET_ID,
      range: "Newsletter_Subscribers!A1:F",
    });

    const rows = existingRows.data.values || [];
    const headers = rows[0] || [];
    const emailIndex = headers.indexOf("email");
    const brandIndex = headers.indexOf("brand");
    const statusIndex = headers.indexOf("status");

    // Find existing subscription for this email + brand
    let existingRowIndex = -1;
    let existingStatus = "";
    
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][emailIndex]?.toLowerCase() === email.toLowerCase() && 
          rows[i][brandIndex] === brandName) {
        existingRowIndex = i;
        existingStatus = rows[i][statusIndex];
        break;
      }
    }

    const now = new Date().toISOString();
    const token = generateUnsubscribeToken();

    if (existingRowIndex > 0) {
      if (existingStatus === "active") {
        console.log("[Newsletter] Already subscribed:", email);
        return { success: true, message: "You're already subscribed." };
      }
      
      // Reactivate subscription
      console.log("[Newsletter] Reactivating subscription:", email);
      await sheets.spreadsheets.values.update({
        spreadsheetId: NEXUS_SHEET_ID,
        range: `Newsletter_Subscribers!D${existingRowIndex + 1}`,
        valueInputOption: "RAW",
        requestBody: {
          values: [["active"]],
        },
      });
      
      return { success: true, message: "Welcome back.", isResubscribe: true };
    }

    // New subscription
    console.log("[Newsletter] Adding new subscription:", email);
    await sheets.spreadsheets.values.append({
      spreadsheetId: NEXUS_SHEET_ID,
      range: "Newsletter_Subscribers!A:F",
      valueInputOption: "RAW",
      requestBody: {
        values: [[email, brandName, now, "active", token, ""]],
      },
    });

    console.log("[Newsletter] Successfully subscribed:", email);
    return { success: true, message: "You're in." };
  } catch (error) {
    console.error("[Newsletter] Error subscribing:", error);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}

// Unsubscribe from newsletter
export async function unsubscribeFromNewsletter(
  token: string
): Promise<{ success: boolean; message: string }> {
  if (!NEXUS_SHEET_ID) {
    return { success: false, message: "Configuration error" };
  }

  try {
    const sheets = getGoogleSheetsClient();

    const existingRows = await sheets.spreadsheets.values.get({
      spreadsheetId: NEXUS_SHEET_ID,
      range: "Newsletter_Subscribers!A1:F",
    });

    const rows = existingRows.data.values || [];
    const headers = rows[0] || [];
    const tokenIndex = headers.indexOf("unsubscribe_token");
    const statusIndex = headers.indexOf("status");

    // Find subscription by token
    let rowIndex = -1;
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][tokenIndex] === token) {
        rowIndex = i;
        break;
      }
    }

    if (rowIndex < 0) {
      return { success: false, message: "Invalid or expired link." };
    }

    if (rows[rowIndex][statusIndex] === "unsubscribed") {
      return { success: true, message: "You've already been removed." };
    }

    // Update status and add unsubscribed_at timestamp
    const now = new Date().toISOString();
    await sheets.spreadsheets.values.update({
      spreadsheetId: NEXUS_SHEET_ID,
      range: `Newsletter_Subscribers!D${rowIndex + 1}:F${rowIndex + 1}`,
      valueInputOption: "RAW",
      requestBody: {
        values: [["unsubscribed", rows[rowIndex][tokenIndex], now]],
      },
    });

    return { success: true, message: "You've been removed." };
  } catch (error) {
    console.error("[Newsletter] Error unsubscribing:", error);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}

// ============================================
// PLACES SYSTEM (3-level hierarchy)
// ============================================

// Level 1: Regions (Cities, Mountains, Coastal, Desert)
export interface Region {
  slug: string;
  title: string;
  subtitle: string;
  heroImage: string;
  description: string;
  order: string;
}

export async function getRegions(): Promise<Region[]> {
  try {
    const sheets = getGoogleSheetsClient();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Regions!A:F',
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) return [];

    const headers = rows[0];
    const regions = rows.slice(1).map((row: any[]) => {
      const region: Record<string, string> = {};
      headers.forEach((header: string, index: number) => {
        region[header] = row[index] || '';
      });
      return region as unknown as Region;
    });

    return regions.sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999));
  } catch (error) {
    console.error('Error fetching regions:', error);
    return [];
  }
}

export async function getRegionBySlug(slug: string): Promise<Region | null> {
  const regions = await getRegions();
  return regions.find((r) => r.slug === slug) || null;
}

// Level 2: Destinations (Marrakech, Fes, etc. - containers)
export interface Destination {
  slug: string;
  title: string;
  subtitle: string;
  region: string;
  heroImage: string;
  heroCaption: string;
  excerpt: string;
  body: string;
  published: string;
  featured: string;
  order: string;
}

export async function getDestinations(): Promise<Destination[]> {
  try {
    const sheets = getGoogleSheetsClient();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Destinations!A:K',
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) return [];

    const headers = rows[0];
    const destinations = rows.slice(1).map((row: any[]) => {
      const dest: Record<string, string> = {};
      headers.forEach((header: string, index: number) => {
        let value = row[index] || '';
        if (typeof value === 'string') {
          value = value.replace(/<br>/g, '\n');
        }
        dest[header] = value;
      });
      return dest as unknown as Destination;
    });

    return destinations.filter((d) => {
      const pub = String(d.published || '').toLowerCase().trim();
      return pub === 'true' || pub === 'yes' || pub === '1';
    });
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return [];
  }
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  const destinations = await getDestinations();
  return destinations.find((d) => d.slug === slug) || null;
}

export async function getDestinationsByRegion(regionSlug: string): Promise<Destination[]> {
  const destinations = await getDestinations();
  return destinations
    .filter((d) => {
      const regions = d.region.split(',').map(r => r.trim().toLowerCase());
      return regions.includes(regionSlug.toLowerCase());
    })
    .sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999));
}

// Level 3: Places (Palais Bahia, Jardin Majorelle - actual attractions)
export interface Place {
  slug: string;
  title: string;
  destination: string;
  category: string;
  address: string;
  opening_hours: string;
  fees: string;
  notes: string;
  heroImage: string;
  heroCaption: string;
  excerpt: string;
  body: string;
  sources: string;
  tags: string;
  published: string;
  featured: string;
  order: string;
}

export async function getPlaces(): Promise<Place[]> {
  try {
    const sheets = getGoogleSheetsClient();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Places!A:Q',
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) return [];

    const headers = rows[0];
    const places = rows.slice(1).map((row: any[]) => {
      const place: Record<string, string> = {};
      headers.forEach((header: string, index: number) => {
        let value = row[index] || '';
        if (typeof value === 'string') {
          value = value.replace(/<br>/g, '\n');
        }
        place[header] = value;
      });
      return place as unknown as Place;
    });

    return places.filter((p) => {
      const pub = String(p.published || '').toLowerCase().trim();
      return pub === 'true' || pub === 'yes' || pub === '1';
    });
  } catch (error) {
    console.error('Error fetching places:', error);
    return [];
  }
}

export async function getPlaceBySlug(slug: string): Promise<Place | null> {
  const places = await getPlaces();
  return places.find((p) => p.slug === slug) || null;
}

export async function getPlacesByDestination(destinationSlug: string): Promise<Place[]> {
  const places = await getPlaces();
  return places
    .filter((p) => p.destination.toLowerCase() === destinationSlug.toLowerCase())
    .sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999));
}

export async function getFeaturedPlaces(): Promise<Place[]> {
  const places = await getPlaces();
  return places
    .filter((p) => {
      const featured = String(p.featured || '').toLowerCase().trim();
      return featured === 'true' || featured === 'yes' || featured === '1';
    })
    .sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999));
}

export interface PlaceImage {
  place_slug: string;
  image_order: number;
  image_url: string;
  caption: string;
}

export async function getPlaceImages(slug: string): Promise<PlaceImage[]> {
  try {
    const sheets = getGoogleSheetsClient();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Place_Images!A:D',
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) return [];

    const images = rows.slice(1)
      .map((row: any[]) => ({
        place_slug: row[0] || '',
        image_order: parseInt(row[1]) || 0,
        image_url: row[2] || '',
        caption: row[3] || '',
      }))
      .filter((img) => img.place_slug === slug && img.image_url)
      .sort((a, b) => a.image_order - b.image_order);

    return images;
  } catch (error) {
    console.error('Error fetching place images:', error);
    return [];
  }
}
