const express = require("express");
const router = express.Router();
const reviewController = require("../../controllers/reviewController");

// ---------------------Review Create ------------------
router.route("/crtrev").post(reviewController.createReview);

// ---------------------Review Search ------------------
router.route("/:id").get(reviewController.findReviewsOfMovie);
router.route("/more/:id").get(reviewController.getMoreReviewsOfMovie);

// ---------------------Review Delete------------------
router.route("/dltrev").delete(reviewController.deleteReview);

// ---------------------Review Update------------------
router.route("/upd").put(reviewController.editReview);

// ---------------------Review Aggregations ------------------
router.route("/totalrev/year").get(reviewController.totalReviewsPerYear);
router.route("/ratings/:id").get(reviewController.ratingsPerMovie);


module.exports = router;
