const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    service: "gmail",
    auth: {
        user:"glenda.langosh@ethereal.email",  
        pass:"69Sp3M3JKMubzRXuHr", 
    },
});

const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: `"Internshala Clone" <glenda.langosh@ethereal.email>`,
    to: email,
    subject: "Your OTP for Video Upload",
    html: `<p>Your OTP is <b>${otp}</b>. It will expire in 5 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOtpEmail;
