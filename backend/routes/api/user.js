const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");

// Followed and Suggested Watchlists
router.route("/followed").get(userController.followedUsers);
router.route("/suggested").get(userController.suggestedUsers);

// ---------------------User Crud ------------------
router.route("/").post(userController.createUser);
router.route("/:id").get(userController.userById);
router.route("/:id").delete(userController.deleteUser);
// ------------------------------------------------------

// User Follow or Unfollow User
router.route("/:id/follow").post(userController.followUser);
router.route("/:id/follow").delete(userController.unfollowUser);

module.exports = router;
