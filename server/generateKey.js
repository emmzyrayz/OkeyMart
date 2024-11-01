const crypto = require("crypto");

// Generate a random 32-byte (256-bit) key
const key = crypto.randomBytes(32);

// Convert to base64 for easier storage
const base64Key = key.toString("base64");

console.log("Your encryption key:", base64Key);
console.log("Key length:", key.length, "bytes");