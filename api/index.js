const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB (safe for serverless)
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
  console.log("MongoDB connected");
}

connectDB().catch(console.error);

// Root route (IMPORTANT)
app.get("/", (req, res) => {
  res.send("VTC Backend running on Vercel 🚀");
});

// Routes
const contactRoutes = require("../routes/contactRoutes");
app.use("/api", contactRoutes);

// ❌ NO app.listen
module.exports = app;