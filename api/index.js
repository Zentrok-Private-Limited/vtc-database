const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* =======================
   ✅ CORS CONFIG (FIXED)
   ======================= */
app.use(cors({
  origin: [
    "https://www.vtc.co.in",
    "https://vtc.co.in"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 🔥 Preflight request handle (MOST IMPORTANT)
app.options("*", cors());

app.use(express.json());

/* =======================
   ✅ MONGODB (SERVERLESS SAFE)
   ======================= */
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

/* =======================
   ✅ ROUTES (PATH FIXED)
   ======================= */

// ⚠️ Path must start with ./
const testSheet = require("./routes/testSheet");
const contactRoutes = require("./routes/contactRoutes");

app.use("/api", testSheet);
app.use("/api", contactRoutes);

/* =======================
   ROOT
   ======================= */
app.get("/", (req, res) => {
  res.send("VTC Backend running on Vercel 🚀");
});

module.exports = app;