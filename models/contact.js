const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  fullName: String,
  country: String,
  email: String,
  phone: String,
  company: String,
  subject: String,
  message: String
}, { timestamps: true });

// ✅ SERVERLESS SAFE EXPORT
module.exports =
  mongoose.models.Contact || mongoose.model("Contact", contactSchema);