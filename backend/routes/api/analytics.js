const express = require("express");
const router = express.Router();
const analyticsController = require("../../controllers/analyticsController");

// Find the most active users based on the number of followers of their watchlists
router.route("/mostactive").get(analyticsController.mostActiveUsers);
// Most Followed Watchlists
router.route("/mostfollowed").get(analyticsController.mostFollowedWatchlists);

module.exports = router;
