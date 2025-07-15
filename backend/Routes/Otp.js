const express = require("express");
const router = express.Router();
const sendOtpEmail = require("../utils/sendOtp.js");

let otpStore = {}; // In-memory store: use DB or Redis in production

// Send OTP
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins

  otpStore[email] = { otp, expiresAt };

  try {
    await sendOtpEmail(email, otp);
    res.json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// Verify OTP
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];

  if (!record) return res.status(400).json({ error: "OTP not sent" });
  if (Date.now() > record.expiresAt) return res.status(400).json({ error: "OTP expired" });
  if (record.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });

  delete otpStore[email]; // Clear OTP after successful verification

  res.json({ success: true });
});

module.exports = router;
