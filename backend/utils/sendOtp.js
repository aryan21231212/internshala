const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service:"gmail",
  auth: {
    user: "aryanpratapsingh674@gmail.com",
    pass: "rdodorfaukzpviah",
  },
});

const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: `"Internshala Clone" <aryanpratapsingh674@gmail.com>`,
    to: email,
    subject: "Your OTP for Video Upload",
    html: `<p>Your OTP is <b>${otp}</b>. It will expire in 5 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOtpEmail;
