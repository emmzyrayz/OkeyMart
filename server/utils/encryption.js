const crypto = require("crypto");

const algorithm = "aes-256-cbc";
const key = Buffer.from(process.env.ENCRYPTION_KEY, "base64");
const iv = crypto
  .createHash("sha256")
  .update(process.env.ENCRYPTION_IV)
  .digest()
  .slice(0, 16);

if (!process.env.ENCRYPTION_KEY || !process.env.ENCRYPTION_IV) {
  throw new Error(
    "ENCRYPTION_KEY and ENCRYPTION_IV environment variables are required"
  );
}

function encrypt(text) {
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

module.exports = {encrypt, decrypt};