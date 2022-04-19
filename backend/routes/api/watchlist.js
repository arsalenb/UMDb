const express = require("express");
const router = express.Router();
const watchlistController = require("../../controllers/watchlistController");

// Followed and Suggested Watchlists
router.route("/followed").get(watchlistController.followedWatchlists);
router.route("/suggested").get(watchlistController.suggestedWatchlists);

// User Adds or Removes movie from watchlist
router.route("/add").post(watchlistController.addMovie);
router.route("/remove").delete(watchlistController.deleteMovie);

// ---------------------Watchlist Crud ------------------
router.route("/:id").get(watchlistController.watchlistById);
router.route("/:id").put(watchlistController.updateWatchlist);
router.route("/:id").delete(watchlistController.deleteWatchlist);
router.route("/").post(watchlistController.createWatchlist);
// ------------------------------------------------------
router.route("/").get(watchlistController.watchlistsByUserId);

// User Follow or Unfollow watchlist
router.route("/:id/follow").post(watchlistController.followWatchlist);
router.route("/:id/follow").delete(watchlistController.unfollowWatchlist);

module.exports = router;
