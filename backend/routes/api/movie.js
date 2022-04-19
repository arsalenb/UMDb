const express = require("express");
const router = express.Router();
const movieController = require("../../controllers/movieController");

// ---------------------Movie Create ------------------
router.route("/").post(movieController.createMovie);
router.route("/crtmongo").post(movieController.createMovieMongo);

// ---------------------Movie Search ------------------
router.route("/:id").get(movieController.findMovie);
router.route("/fbt").post(movieController.findMovieByTitle);
router.route("/fbg").post(movieController.findMovieByGenre);
router.route("/fbr").post(movieController.findMovieByRuntime);
router.route("/fbd").post(movieController.findMovieByRelDate);
router.route("/fbl").post(movieController.findMovieByLang);

// ---------------------Movie Delete------------------
router.route("/:id").delete(movieController.deleteMovie);
router.route("/dltmongo/:id").delete(movieController.deleteMovieMongo);

// ---------------------Movie Aggregations------------------
router.route("/pop/:p").get(movieController.getPopMovies);
router.route("/popg").post(movieController.getPopMoviesByGenre);
router.route("/topy").post(movieController.getTopMoviesByYear);
router.route("/topyg").post(movieController.getTopMoviesByYearAndGenre);
router.route("/popg/y").get(movieController.c);

module.exports = router;
