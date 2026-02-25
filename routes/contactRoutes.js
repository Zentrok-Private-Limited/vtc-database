const express = require("express");
const router = express.Router();

const Contact = require("../models/contact");
const { addToGoogleSheet } = require("../services/googleSheet.service");

router.post("/contact", async (req, res) => {
  try {
    // 1️⃣ MongoDB FIRST
    const data = new Contact(req.body);
    await data.save();
    console.log("✅ Saved to MongoDB");

    // 2️⃣ Google Sheet OPTIONAL (non-blocking)
    await addToGoogleSheet(req.body);
    console.log("✅ Google Sheet updated");

    // 3️⃣ Client response
    return res.status(200).json({
      success: true,
      message: "Saved successfully ✅"
    });

  } catch (err) {
    console.error("❌ ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
      stack: err.stack
    });
  } atus(500).json({ error: "Database error" });
});

module.exports = router;