const express = require("express");
const router = express.Router();
const watchlistController = require("../../controllers/watchlistController");
const verifyJWT = require("../../middlewares/verifyToken");

// Followed and Suggested Watchlists
router
  .route("/followed")
  .get(verifyJWT, watchlistController.followedWatchlists);
router
  .route("/suggested")
  .get(verifyJWT, watchlistController.suggestedWatchlists);

// Most Followed Watchlists
router
  .route("/mostfollowed")
  .get(verifyJWT, watchlistController.mostFollowedWatchlists);

// User Adds or Removes movie from watchlist
router.route("/add").post(verifyJWT, watchlistController.addMovie);
router.route("/remove").post(verifyJWT, watchlistController.deleteMovie);

// ---------------------Watchlist Crud ------------------
router.route("/").get(watchlistController.watchlistsByUserId);
router.route("/:id").get(watchlistController.watchlistById);
router.route("/:id").put(verifyJWT, watchlistController.updateWatchlist);
router.route("/:id").delete(verifyJWT, watchlistController.deleteWatchlist);
router.route("/").post(verifyJWT, watchlistController.createWatchlist);
// ------------------------------------------------------

// User Follow or Unfollow watchlist
router
  .route("/:id/follow")
  .post(verifyJWT, watchlistController.followWatchlist);
router
  .route("/:id/follow")
  .delete(verifyJWT, watchlistController.unfollowWatchlist);

module.exports = router;
