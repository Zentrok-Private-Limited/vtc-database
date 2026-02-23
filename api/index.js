const express = require("express");
const mongoose = require("mongoose");

const app = express();

/* =========================
   ✅ HARD CORS FIX (FINAL)
   ========================= */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://www.vtc.co.in");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // 🔥 Preflight request yahin khatam
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  next();
});

app.use(express.json());

/* =========================
   ✅ MONGODB (SERVERLESS SAFE)
   ========================= */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
    }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// 🔥 DB middleware AFTER preflight
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

/* =========================
   ROUTES
   ========================= */
const contactRoutes = require("./routes/contactRoutes");
const testSheet = require("./routes/testsheet");

app.use("/api", contactRoutes);
app.use("/api", testSheet);

app.get("/", (req, res) => {
  res.send("VTC Backend running on Vercel 🚀");
});

module.exports = app;