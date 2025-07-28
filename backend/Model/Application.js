const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  company: String,
  category: String,
  coverLetter: String,
  user: Object,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["accepted", "pending", "rejected"],
    default: "pending",
  },
  Application: String, // Changed from Object to String
  availability: String, 
  video: {
    public_id: String,
    url: String,
    duration: Number,
    format: String,
    uploadedAt: Date
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model("Application", ApplicationSchema);