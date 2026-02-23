const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get("/test-sheet", async (req, res) => {
  try {
    const now = Math.floor(Date.now() / 1000);

    const token = jwt.sign(
      {
        iss: process.env.GOOGLE_CLIENT_EMAIL,
        scope: "https://www.googleapis.com/auth/spreadsheets",
        aud: "https://oauth2.googleapis.com/token",
        iat: now,
        exp: now + 3600,
      },
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      { algorithm: "RS256" }
    );

    // 1️⃣ Get access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: token,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return res.status(500).json(tokenData);
    }

    // 2️⃣ Append test row
    const sheetRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEET_ID}/values/'Contact-Leads'!A:G:append?valueInputOption=RAW`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: [[
            "FINAL TEST",
            "India",
            "test@gmail.com",
            "9999999999",
            "Test Company",
            "Test Subject",
            "Test Message"
          ]]
        }),
      }
    );

    const result = await sheetRes.json();

    return res.json({
      success: true,
      result,
    });

  } catch (err) {
    console.error("❌ TEST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;