const express = require("express");
const router = express.Router();
const movieController = require("../../controllers/movieController");

// ---------------------Movie Create ------------------
router.route("/").post(movieController.createMovie);
router.route("/crtmongo").post(movieController.createMovieMongo);

// ---------------------Movie Search ------------------
router.route("/:id").get(movieController.findMovie);
router.route("/fdynamic").post(movieController.findMovieByDynamicFilters);

// ---------------------Movie Delete------------------
router.route("/:id").delete(movieController.deleteMovie);
router.route("/dltmongo/:id").delete(movieController.deleteMovieMongo);

// ---------------------Movie Aggregations------------------
router.route("/pop/:p").get(movieController.getPopMovies);
router.route("/popg").post(movieController.getPopMoviesByGenre);
router.route("/topy").post(movieController.getTopMoviesByYear);
router.route("/topyg").post(movieController.getTopMoviesByYearAndGenre);
router.route("/popg/y").get(movieController.getPopGenresPerYear);

module.exports = router;
