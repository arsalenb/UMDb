const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");

// Followed and Suggested Watchlists
router.route("/followed").get(userController.followedUsers);
router.route("/suggested").get(userController.suggestedUsers);

// ---------------------User Create ------------------
router.route("/").post(userController.createUser);
router.route("/crtmongo").post(userController.createUserMongo);

// ---------------------User Search ------------------
router.route("/:id").get(userController.userById);

// ---------------------User Update ------------------
router.route("/upd").put(userController.updateUserMongo);

// ---------------------User Delete ------------------
router.route("/:id").delete(userController.deleteUser);
router.route("/dltmongo/:id").delete(userController.deleteUserMongo);
// ------------------------------------------------------

// User Follow or Unfollow User
router.route("/:id/follow").post(userController.followUser);
router.route("/:id/follow").delete(userController.unfollowUser);

module.exports = router;
