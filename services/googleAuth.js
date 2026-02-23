const jwt = require("jsonwebtoken");

function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);

  const payload = {
    iss: process.env.GOOGLE_CLIENT_EMAIL,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const token = jwt.sign(
    payload,
    process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    { algorithm: "RS256" }
  );

  return token;
}

module.exports = { getAccessToken };