const { google } = require("googleapis");
const path = require("path");

const auth = new google.auth.GoogleAuth({
  keyFile: path.resolve(
    __dirname,
    "..",
    process.env.GOOGLE_CREDENTIALS_PATH
  ),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

async function addToGoogleSheet(data) {
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A:H", // or Contact-Leads!A:H
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          data.fullName,
          data.country,
          data.email,
          data.phone,
          data.company,
          data.subject,
          data.message,
          new Date().toLocaleString()
        ]]
      }
    });

    console.log("✅ Google Sheet write success");
  } catch (err) {
    console.error("❌ Google Sheet Error:", err);
    throw err;
  }
}

module.exports = { addToGoogleSheet };