const User = require("../models/User");

async function isProfileComplete(user) {
  return user.profileCompletion >= 100;
}

async function hasPurchaseHistory(user) {
  return user.purchaseHistory && user.purchaseHistory.length > 0;
}

async function hasSubmittedDocuments(user) {
  return user.isVerifiedSeller;
}

async function isSubscribedToPremium(user) {
  return user.isPremiumSeller;
}

module.exports = {
  isProfileComplete,
  hasPurchaseHistory,
  hasSubmittedDocuments,
  isSubscribedToPremium,
};
