const nodemailer = require("nodemailer");

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// Email Templates
const templates = {
  // Reset Password Template
  resetPassword: (resetCode) => ({
    subject: "OkeyMart Password Reset Code",
    text: `Your OkeyMart password reset code is: ${resetCode}. This code will expire in 30 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>You have requested to reset your password. Here is your reset code:</p>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
          ${resetCode}
        </div>
        <p>This code will expire in 30 minutes.</p>
        <p>If you didn't request this reset, please ignore this email or contact support if you have concerns.</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          This is an automated message, please do not reply.<br>
          For security reasons, never share this code with anyone.
        </p>
      </div>
    `,
  }),

  // Email Verification Template
  verification: (verificationLink) => ({
    subject: "OkeyMart Email Verification",
    text: `Please verify your email by clicking on the following link: ${verificationLink}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Email Verification</h2>
        <p>Thank you for registering with OkeyMart! Please verify your email address by clicking on the link below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" 
             style="display: inline-block; padding: 12px 24px; background-color: #28a745; color: #fff; 
                    text-decoration: none; border-radius: 5px; font-weight: bold;">
            Verify Email
          </a>
        </div>
        <p>If you're having trouble clicking the button, copy and paste this link into your browser:</p>
        <p style="background-color: #f4f4f4; padding: 10px; word-break: break-all;">
          ${verificationLink}
        </p>
        <p>If you did not create an account, please ignore this email.</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">
          This is an automated message, please do not reply.<br>
          For security reasons, never share this verification link with anyone.
        </p>
      </div>
    `,
  }),

  // Role Update Notification Template
  roleUpdate: (newRole) => ({
    subject: "OkeyMart Account Role Updated",
    text: `Your account role has been updated to: ${newRole}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Account Role Updated</h2>
        <p>Your OkeyMart account role has been updated to:</p>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 20px; margin: 20px 0;">
          ${newRole}
        </div>
        <p>This update may grant you access to new features and capabilities on the platform.</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
      </div>
    `,
  }),

  // Verification Status Update Template
  verificationStatus: (status, message = "") => ({
    subject: `OkeyMart Verification Status: ${status}`,
    text: `Your account verification status has been updated to: ${status}. ${message}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Verification Status Update</h2>
        <p>Your account verification status has been updated to:</p>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 20px; margin: 20px 0;">
          ${status}
        </div>
        ${message ? `<p>${message}</p>` : ""}
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
      </div>
    `,
  }),
};

// Core email sending function with enhanced error handling
const sendEmail = async ({to, subject, text, html}) => {
  if (!to || !subject || (!text && !html)) {
    throw new Error("Missing required email parameters");
  }

  const transporter = createTransporter();
  const mailOptions = {
    from: {
      name: "OkeyMart",
      address: process.env.EMAIL_USER,
    },
    to,
    subject,
    text,
    html,
    replyTo: process.env.EMAIL_USER,
  };

  try {
    await transporter.verify();
    const info = await transporter.sendMail(mailOptions);
    console.log(
      `Email sent successfully to ${to}. MessageId: ${info.messageId}`
    );
    return {success: true, messageId: info.messageId};
  } catch (error) {
    console.error("Email sending failed:", {
      to,
      subject,
      error: error.message,
      stack: error.stack,
    });
    throw new Error(`Failed to send email: ${error.message}`);
  } finally {
    transporter.close();
  }
};

// Specific email sending functions
const sendResetPasswordEmail = async (to, resetCode) => {
  try {
    const template = templates.resetPassword(resetCode);
    return await sendEmail({
      to,
      ...template,
    });
  } catch (error) {
    console.error("Failed to send reset password email:", {
      to,
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
};

const sendVerificationEmail = async (to, verificationLink) => {
  try {
    const template = templates.verification(verificationLink);
    return await sendEmail({
      to,
      ...template,
    });
  } catch (error) {
    console.error("Failed to send verification email:", {
      to,
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
};

const sendRoleUpdateEmail = async (to, newRole) => {
  try {
    const template = templates.roleUpdate(newRole);
    return await sendEmail({
      to,
      ...template,
    });
  } catch (error) {
    console.error("Failed to send role update email:", {
      to,
      newRole,
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
};

const sendVerificationStatusEmail = async (to, status, message = "") => {
  try {
    const template = templates.verificationStatus(status, message);
    return await sendEmail({
      to,
      ...template,
    });
  } catch (error) {
    console.error("Failed to send verification status email:", {
      to,
      status,
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
};

module.exports = {
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendRoleUpdateEmail,
  sendVerificationStatusEmail,
};
