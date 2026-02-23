const express = require("express");
const mongoose = require("mongoose");

const app = express();

/* ======================
   ✅ HARD CORS (Vercel Safe)
   ====================== */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://www.vtc.co.in");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  next();
});

app.use(express.json());

/* ======================
   ✅ MongoDB (Serverless Safe)
   ====================== */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, { bufferCommands: false })
      .then(m => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// 🔥 DB middleware AFTER CORS
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

/* ======================
   ROUTES
   ====================== */
const contactRoutes = require("../routes/contactRoutes");
app.use("/api", contactRoutes);

/* ======================
   ROOT
   ====================== */
app.get("/", (req, res) => {
  res.send("VTC Backend running on Vercel 🚀");
});

module.exports = app;