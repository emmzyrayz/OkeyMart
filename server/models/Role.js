const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
  name: {type: String, required: true, unique: true},
  rules: [
    {
      type: String,
      enum: [
        "PROFILE_COMPLETION",
        "PURCHASE_HISTORY",
        "DOCUMENT_SUBMISSION",
        "SUBSCRIPTION",
      ],
    },
  ],
});

module.exports = mongoose.model("Role", RoleSchema);
