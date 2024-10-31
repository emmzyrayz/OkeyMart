import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  image: {type: String},
  authProvider: {type: String, required: true}, // Added this field
  createdAt: {type: Date, default: Date.now},
});

export default mongoose.models.User || mongoose.model("User", userSchema);
