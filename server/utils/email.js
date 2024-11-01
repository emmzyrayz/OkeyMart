// utils/email.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail", // Use 'Gmail', 'SendGrid', etc., depending on the provider
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, // Email address
    pass: process.env.EMAIL_PASS, // Email password or app password
  },
});

const resetEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_WUSER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Reset code email sent successfully.");
  } catch (error) {
    console.error("Error sending reset code email:", error);
  }
};

module.exports = resetEmail;