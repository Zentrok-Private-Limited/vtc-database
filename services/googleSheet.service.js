const { google } = require("googleapis");
const { GoogleAuth } = require("google-auth-library");

const auth = new GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

async function addToGoogleSheet(data) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client });

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "Contact-Lead!A:D",
    valueInputOption: "RAW",
    requestBody: {
      values: [[
        data.name || "",
        data.email || "",
        data.phone || "",
        data.message || ""
      ]]
    }
  });
}

module.exports = { addToGoogleSheet };