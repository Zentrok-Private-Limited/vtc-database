const express = require("express");
const router = express.Router();

const Contact = require("../models/contact");
const { addToGoogleSheet } = require("../services/googleSheet.service");

router.post("/contact", async (req, res) => {
  try {
    const data = new Contact(req.body);
    await data.save();

    await addToGoogleSheet(req.body);

    res.status(200).json({
      message: "Saved to MongoDB & Google Sheet ✅"
    });

  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;