const { google } = require("googleapis");

const auth = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"), // 🔥 MUST
  ["https://www.googleapis.com/auth/spreadsheets"]
);

const sheets = google.sheets({ version: "v4", auth });

async function addToGoogleSheet(data) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "Contact-Leads!A1",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[
        data.fullName,
        data.email,
        data.phone,
        data.company,
        data.message,
        new Date().toLocaleString()
      ]]
    }
  });
}

module.exports = { addToGoogleSheet };