const express = require("express");
const router = express.Router();

const Contact = require("../models/contact");
const { addToGoogleSheet } = require("../services/googleSheet.service"); // ✅ THIS WAS MISSING

// POST contact form
router.post("/contact", async (req, res) => {
  try {
    const data = new Contact(req.body);
    await data.save();
    console.log("✅ Saved to MongoDB");

    // await addToGoogleSheet(req.body);  
    console.log("✅ addToGoogleSheet called");

    res.status(200).json({ message: "Saved to MongoDB & Google Sheet" });
  } catch (err) {
    console.error("❌ Route Error:", err);
    res.status(500).json({ error: "Failed to save data" });
  }
});

// GET all contacts
router.get("/contact", async (req, res) => {
  try {
    const data = await Contact.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

module.exports = router;