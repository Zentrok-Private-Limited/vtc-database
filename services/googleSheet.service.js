const { google } = require("googleapis");
const { JWT } = require("google-auth-library");

const auth = new JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

async function addToGoogleSheet(data) {
  try {
    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "VTC-Contact!A1", // 🔥 THIS IS THE FIX
      valueInputOption: "RAW",
      requestBody: {
        values: [[
          data.fullName || "",
          data.country || "",
          data.email || "",
          data.phone || "",
          data.company || "",
          data.subject || "",
          data.message || "",
          new Date().toLocaleString("en-IN")
        ]]
      }
    });

    console.log("✅ Sheet updated successfully");

  } catch (err) {
    console.error("❌ Google Sheet Service Error:", err.message);
    throw err;
  }
}

module.exports = { addToGoogleSheet };