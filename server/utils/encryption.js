// utils/encryption.js
const crypto = require("crypto");

const algorithm = "aes-256-cbc";
// Convert base64 key back to Buffer
const key = Buffer.from(process.env.ENCRYPTION_KEY, "base64");
const ivLength = 16;

// Add key validation
if (!process.env.ENCRYPTION_KEY) {
  throw new Error("ENCRYPTION_KEY environment variable is not set");
}

if (key.length !== 32) {
  throw new Error("ENCRYPTION_KEY must be 32 bytes (256 bits)");
}

function encrypt(text) {
  if (!text) {
    throw new Error("Input text is required for encryption");
  }

  try {
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Encryption failed: " + error.message);
  }
}

function decrypt(text) {
  if (!text) {
    throw new Error("Input text is required for decryption");
  }

  try {
    const textParts = text.split(":");
    const iv = Buffer.from(textParts.shift(), "hex");
    const encryptedText = textParts.join(":");
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Decryption failed: " + error.message);
  }
}

// Add a function to verify the encryption setup
function verifyEncryptionSetup() {
  try {
    const testText = "test";
    const encrypted = encrypt(testText);
    const decrypted = decrypt(encrypted);

    if (decrypted !== testText) {
      throw new Error("Encryption/decryption test failed");
    }

    console.log("Encryption setup verified successfully");
    return true;
  } catch (error) {
    console.error("Encryption setup verification failed:", error);
    return false;
  }
}

// Verify setup on module load
verifyEncryptionSetup();

module.exports = {encrypt, decrypt};
