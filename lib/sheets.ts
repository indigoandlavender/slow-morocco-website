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
