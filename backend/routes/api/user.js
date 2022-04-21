const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");
const verifyJWT = require("../../middlewares/verifyToken");

// Find the most active users based on the number of followers of their watchlists
router.route("/mostactive").get(verifyJWT, userController.mostActiveUsers);

// Followed and Suggested Watchlists
router.route("/followed").get(verifyJWT, userController.followedUsers);
router.route("/suggested").get(verifyJWT, userController.suggestedUsers);

// ---------------------User CRUD ------------------
router.route("/:id").get(userController.userById);
router.route("/mongo/:id").get(userController.userByIdMongo);
// get user infos from mongo
// router.route("/").post(userController.createUser);
router.route("/:id").put(verifyJWT, userController.updateUserMongo);
// router.route("/:id").delete(userController.deleteUser);
router.route("/mongo/:id").delete(userController.deleteUserMongo);
// ------------------------------------------------------

// User Follow or Unfollow User
router.route("/:id/follow").post(verifyJWT, userController.followUser);
router.route("/:id/follow").delete(verifyJWT, userController.unfollowUser);

module.exports = router;
