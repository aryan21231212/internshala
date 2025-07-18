const mongoose = require("mongoose");

const Applicationipschema = new mongoose.Schema({
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
  Application: Object,
  availability: String, 
  video: {
    public_id: {
      type: String,
      default: null
    },
    url: {
      type: String,
      default: null
    },
    duration: {
      type: Number,
      default: null
    },
    format: {
      type: String,
      default: null
    },
    uploadedAt: {
      type: Date,
      default: null
    }
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model("Application", Applicationipschema);