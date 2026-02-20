const express = require("express");
const router = express.Router();

const Contact = require("../models/contact"); // ✅ small letter OK

router.post("/contact", async (req, res) => {
  try {
    const data = new Contact(req.body);
    await data.save();

    console.log("✅ Saved to MongoDB");

    res.status(200).json({ message: "Saved to MongoDB" });

  } catch (err) {
    console.error("❌ Route Error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/contact", async (req, res) => {
  try {
    const data = await Contact.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
