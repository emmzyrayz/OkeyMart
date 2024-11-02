// utils/email.js
const nodemailer = require("nodemailer");

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER, // Must be the email used for App Password
      pass: process.env.EMAIL_APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// HTML template for reset password email
const createResetEmailHTML = (resetCode) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>You have requested to reset your password. Here is your reset code:</p>
      <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
        ${resetCode}
      </div>
      <p>This code will expire in 30 minutes.</p>
      <p>If you didn't request this reset, please ignore this email or contact support if you have concerns.</p>
      <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
    </div>
  `;
};

const sendEmail = async ({to, subject, text, html}) => {
  if (!to || !subject || (!text && !html)) {
    throw new Error("Missing required email parameters");
  }

  const transporter = createTransporter();

  // You can customize the display name while using the authenticated email
  const mailOptions = {
    from: {
      name: "OkeyMart", // This will be the display name
      address: process.env.EMAIL_USER, // This must be your authenticated email
    },
    to,
    subject,
    text,
    html,
    replyTo: process.env.EMAIL_WUSER, // Optional: Set reply-to address
  };

  try {
    await transporter.verify();
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    return {success: true, messageId: info.messageId};
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  } finally {
    transporter.close();
  }
};

const sendResetPasswordEmail = async (to, resetCode) => {
  const subject = "OkeyMart Password Reset Code";
  const text = `Your OkeyMart password reset code is: ${resetCode}. This code will expire in 30 minutes.`;
  const html = createResetEmailHTML(resetCode);

  try {
    return await sendEmail({to, subject, text, html});
  } catch (error) {
    console.error("Failed to send reset password email:", error);
    throw error;
  }
};

module.exports = {
  sendEmail,
  sendResetPasswordEmail,
};