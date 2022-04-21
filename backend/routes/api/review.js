const express = require("express");
const router = express.Router();
const reviewController = require("../../controllers/reviewController");
const verifyJWT = require("../../middlewares/verifyToken");

// ---------------------Review CRUD ------------------
router.route("/").post(verifyJWT, reviewController.createReview);
router.route("/:id").get(reviewController.findReviewsOfMovie);
router.route("/more/:id").get(reviewController.getMoreReviewsOfMovie);
router.route("/").delete(reviewController.deleteReview);
router.route("/").put(verifyJWT, reviewController.editReview);

// ---------------------Review Aggregations ------------------
router.route("/totalrev/year").get(reviewController.totalReviewsPerYear);
router.route("/ratings/:id").get(reviewController.ratingsPerMovie);

module.exports = router;
