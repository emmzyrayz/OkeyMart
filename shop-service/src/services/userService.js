const UserShopping = require("../models/Usershopping");
const crypto = require("crypto");

class UserService {
  // Generate an encrypted password based on email and id
  static generateEncryptedPassword(email, id) {
    const secret = process.env.JWT_SECRET;
    return crypto
      .createHmac("sha256", secret)
      .update(`${email}${id}`)
      .digest("hex");
  }

  // Find or create user
  static async findOrCreateUser(email) {
    try {
      let user = await UserShopping.findOne({email});

      if (!user) {
        // Create new user
        user = new UserShopping({
          email,
          encryptedPassword: this.generateEncryptedPassword(
            email,
            Date.now().toString()
          ),
        });
        await user.save();
      }

      return user;
    } catch (error) {
      console.error("Error finding or creating user:", error);
      throw error;
    }
  }

  // Verify user
  static async verifyUser(email, id) {
    try {
      const user = await UserShopping.findOne({email});

      if (!user) {
        return false;
      }

      const generatedPassword = this.generateEncryptedPassword(email, id);
      return user.encryptedPassword === generatedPassword;
    } catch (error) {
      console.error("Error verifying user:", error);
      throw error;
    }
  }
}

module.exports = UserService;
