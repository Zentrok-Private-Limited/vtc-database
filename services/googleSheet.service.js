async function addToGoogleSheet(data) {
  try {
    const client = await auth.getClient();

    const sheets = google.sheets({ version: "v4", auth: client });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "VTC-Contact!A:D",
      valueInputOption: "RAW",
      requestBody: {
        values: [[
          data.fullName || "",
          data.country || "",
          data.email || "",
          data.phone || "",
          data.company || "",
          data.subject || "",
          data.message || ""
        ]]
      }
    });
  } catch (err) {
    console.error("❌ Google Sheet Service Error:", err);
    throw err;
  }
}

module.exports = { addToGoogleSheet };