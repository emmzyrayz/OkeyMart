// utils/encryption.js
const crypto = require("crypto");
const process = require("process");

const algorithm = "aes-256-cbc";
const key = Buffer.from(process.env.ENCRYPTION_KEY || crypto.randomBytes(32));
const iv = Buffer.from(process.env.ENCRYPTION_IV || crypto.randomBytes(16));

function encrypt(text) {
  if (typeof text !== "string") {
    throw new Error(`Encryption requires a string. Received: ${typeof text}`);
  }

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

function decrypt(encrypted) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

function generateToken(userId, email) {
  // Combine user ID and email with a separator
  const tokenData = `${userId}:${email}`;

  // Encrypt the combined data
  return encrypt(tokenData);
}

function validateToken(token, userId, email) {
  try {
    const decryptedData = decrypt(token);
    const [decryptedUserId, decryptedEmail] = decryptedData.split(":");

    // Add additional checks
    if (!decryptedUserId || !decryptedEmail) {
      return false;
    }

    return (
      decryptedUserId === userId &&
      decryptedEmail.toLowerCase() === email.toLowerCase()
    );
  } catch (error) {
    console.error("Token validation error:", error);
    return false;
  }
}

module.exports = {
  encrypt,
  decrypt,
  generateToken,
  validateToken,
};
