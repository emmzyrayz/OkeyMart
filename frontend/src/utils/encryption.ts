import crypto from "crypto";

// Constants and Types
const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16;

interface EncryptionResult {
  encryptedData: string;
  iv?: string; // Only present for random encryption
}

interface EncryptionConfig {
  key: string;
  iv?: string; // Optional for random encryption
}

class EncryptionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EncryptionError";
  }
}

class EncryptionUtility {
  private readonly key: Buffer;
  private readonly deterministicIv: Buffer;

  constructor(config: EncryptionConfig) {
    if (!config.key) {
      throw new EncryptionError("Encryption key is required");
    }

    try {
      this.key = Buffer.from(config.key, "base64");

      if (config.iv) {
        // Create deterministic IV for determined encryption
        this.deterministicIv = crypto
          .createHash("sha256")
          .update(config.iv)
          .digest()
          .slice(0, IV_LENGTH);
      } else {
        this.deterministicIv = Buffer.alloc(0);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new EncryptionError(
        `Determined encryption failed: ${errorMessage}`
      );
    }
  }

  /**
   * Encrypts data using a deterministic IV
   */
  public encryptDetermined(text: string): string {
    if (!this.deterministicIv.length) {
      throw new EncryptionError("Deterministic IV not configured");
    }

    try {
      const cipher = crypto.createCipheriv(
        ALGORITHM,
        this.key,
        this.deterministicIv
      );
      let encrypted = cipher.update(text, "utf8", "hex");
      encrypted += cipher.final("hex");
      return encrypted;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      throw new EncryptionError(
        `Determined encryption failed: ${errorMessage}`
      );
    }
  }

  /**
   * Decrypts data using a deterministic IV
   */
  public decryptDetermined(encrypted: string): string {
    if (!this.deterministicIv.length) {
      throw new EncryptionError("Deterministic IV not configured");
    }

    try {
      const decipher = crypto.createDecipheriv(
        ALGORITHM,
        this.key,
        this.deterministicIv
      );
      let decrypted = decipher.update(encrypted, "hex", "utf8");
      decrypted += decipher.final("utf8");
      return decrypted;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      throw new EncryptionError(
        `Determined decryption failed: ${errorMessage}`
      );
    }
  }

  /**
   * Encrypts data using a random IV
   */
  public encryptRandom(text: string): EncryptionResult {
    try {
      const randomIv = crypto.randomBytes(IV_LENGTH);
      const cipher = crypto.createCipheriv(ALGORITHM, this.key, randomIv);

      let encrypted = cipher.update(text, "utf8", "hex");
      encrypted += cipher.final("hex");

      return {
        encryptedData: encrypted,
        iv: randomIv.toString("hex"),
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      throw new EncryptionError(`Random encryption failed: ${errorMessage}`);
    }
  }

  /**
   * Decrypts data using a provided IV
   */
  public decryptRandom(encrypted: string, iv: string): string {
    try {
      const ivBuffer = Buffer.from(iv, "hex");
      const decipher = crypto.createDecipheriv(ALGORITHM, this.key, ivBuffer);

      let decrypted = decipher.update(encrypted, "hex", "utf8");
      decrypted += decipher.final("utf8");

      return decrypted;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      throw new EncryptionError(`Random decryption failed: ${errorMessage}`);
    }
  }

  /**
   * Validates that the input is a non-empty string
   */
  private validateInput(text: string): void {
    if (typeof text !== "string" || !text) {
      throw new EncryptionError(
        `Invalid input: Expected non-empty string, got ${typeof text}`
      );
    }
  }
}

// Export types separately to fix isolatedModules error
export type { EncryptionConfig, EncryptionResult };
export { EncryptionUtility, EncryptionError };