import { google } from "googleapis";

/**
 * Appends a row to the configured Google Sheet using a service account.
 * Setup steps are documented in .env.example — the short version:
 * 1) Create a service account in Google Cloud Console, enable Sheets API.
 * 2) Share the target sheet with the service account's client_email.
 * 3) Put the client_email + private_key + sheet id in .env
 */
export async function appendLeadToSheet(row: {
  name: string;
  email: string;
  phone: string;
  interestedIn: string;
  message?: string;
  createdAt: Date;
}) {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    key: (process.env.GOOGLE_SHEETS_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${process.env.GOOGLE_SHEET_TAB || "Leads"}!A:F`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          row.createdAt.toISOString(),
          row.name,
          row.email,
          row.phone,
          row.interestedIn,
          row.message || "",
        ],
      ],
    },
  });
}
