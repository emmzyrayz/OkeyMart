const Role = require("../models/Role");
const User = require("../models/User");
const {
  isProfileComplete,
  hasPurchaseHistory,
  hasSubmittedDocuments,
  isSubscribedToPremium,
} = require("./checkRules");

// Define a mapping of rule names to functions
const ruleFunctions = {
  PROFILE_COMPLETION: isProfileComplete,
  PURCHASE_HISTORY: hasPurchaseHistory,
  DOCUMENT_SUBMISSION: hasSubmittedDocuments,
  SUBSCRIPTION: isSubscribedToPremium,
};

async function updateRole(userId) {
  const user = await User.findById(userId);
  if (!user) return;

  // Fetch roles from database and evaluate each role's rules
  const roles = await Role.find();
  for (const role of roles) {
    let eligible = true;

    // Evaluate each rule for the role
    for (const rule of role.rules) {
      const ruleFunction = ruleFunctions[rule];
      if (ruleFunction && !(await ruleFunction(user))) {
        eligible = false;
        break;
      }
    }

    // Additional check for Verified Seller role
    if (role.name === "Verified Seller" && user.verificationStatus !== "Verified") {
      eligible = false; // Only eligible if verificationStatus is "Verified"
    }
    

    // If user meets all rules, update role
    if (eligible) {
      user.role = role.name;
      await user.save();
      break; // Stop at the first eligible role to avoid overlapping roles
    }
  }
}

module.exports = updateRole;
