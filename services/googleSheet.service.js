const { getAccessToken } = require("./googleAuth");

async function addToGoogleSheet(data) {
  const jwtToken = getAccessToken();

  // 1️⃣ JWT → Access Token
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwtToken,
    }),
  });

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  if (!accessToken) {
    throw new Error("Failed to get Google access token");
  }

  // 2️⃣ Append full row
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEET_ID}/values/'Contact-Leads'!A:G:append?valueInputOption=RAW`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: [[
          data.fullName || "",
          data.country || "",
          data.email || "",
          data.phone || "",
          data.company || "",
          data.subject || "",
          data.message || ""
        ]]
      }),
    }
  );

  console.log("✅ Google Sheet updated successfully");
}

module.exports = { addToGoogleSheet };