const express = require("express");
const router = express.Router();
const Contact = require("../models/contact");
const { addToGoogleSheet } = require("../services/googleSheet.service");
router.post("/contact", async (req, res) => {
  try {
    // ✅ 1. MongoDB FIRST (critical) 
    const data = new Contact(req.body);
    await data.save(); console.log("✅ Saved to MongoDB");
    // ✅ 2. Google Sheet OPTIONAL (non-blocking) 
    addToGoogleSheet(req.body).then(() =>
      console.log("✅ Google Sheet updated"))
      .catch(err => { console.error("❌ GOOGLE SHEET ERROR FULL:", err); });
    // ✅ 3. Client ko success turant bhejo 
    return res.status(200).json({ message: "Saved successfully ✅" });
  }
  catch (err) {
    console.error("❌ MongoDB ERROR:", err);
    return res.status(500).json({ error: "Database error" });
  }
});
module.exports = router; const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express(); app.use(cors()); app.use(express.json());
// ✅ GLOBAL CACHE (serverless safe) 
let cached = global.mongoose;
if (!cached) { cached = global.mongoose = { conn: null, promise: null }; }
async function connectDB() {
  if (cached.conn)
    return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, { bufferCommands: false, })
      .then((mongoose) => mongoose);
  } cached.conn = await cached.promise; return cached.conn;
}
// ✅ ENSURE DB CONNECTED BEFORE ROUTES 
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
});
// Routes
const contactRoutes = require("../routes/contactRoutes");
app.use("/api", contactRoutes);
app.get("/", (req, res) => { res.send("VTC Backend running on Vercel 🚀"); });
module.exports = app;