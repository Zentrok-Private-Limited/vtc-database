const express = require("express");
const router = express.Router();

const Contact = require("../models/contact");
const { addToGoogleSheet } = require("../services/googleSheet.service");

router.post("/contact", async (req, res) => {
  try {
    // ✅ 1. MongoDB FIRST (critical)
    const data = new Contact(req.body);
    await data.save();

    console.log("✅ Saved to MongoDB");

    // ✅ 2. Google Sheet OPTIONAL (non-blocking)
    addToGoogleSheet(req.body)
      .then(() => console.log("✅ Saved to Google Sheet"))
      .catch(err => console.error("⚠ Google Sheet failed:", err.message));

    // ✅ 3. Client ko success turant bhejo
    return res.status(200).json({
      message: "Saved successfully ✅"
    });

  } catch (err) {
    console.error("❌ MongoDB ERROR:", err);
    return res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;