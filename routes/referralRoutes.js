const express = require("express");
const router = express.Router();
const referralController = require("../controllers/referralController.js");

// Route to generate a referral link
router.post("/generate-link", referralController.generateReferralLink);

// Route to track referral clicks (when the link is visited)
router.get("/track-referral", referralController.trackReferral);

module.exports = router;
