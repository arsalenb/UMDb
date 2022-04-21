const express = require("express");
const router = express.Router();
const movieController = require("../../controllers/movieController");
const verifyJWT = require("../../middlewares/verifyToken");

// ---------------------Movie Aggregations------------------
router.route("/pop/:p").get(movieController.getPopMovies);
router.route("/popg").get(movieController.getPopMoviesByGenre);
router.route("/topy").get(movieController.getTopMoviesByYear);
router.route("/topyg").get(movieController.getTopMoviesByYearAndGenre);
router.route("/popg/y").get(movieController.getPopGenresPerYear);

// View suggested movies based on their occurrence on the watchlists of users you follow (>=2)
router.route("/suggested").get(verifyJWT, movieController.suggestedMovies);
// ---------------------Movie CRUD------------------
router.route("/").post(verifyJWT, movieController.createMovie);
router.route("/crtmongo").post(verifyJWT, movieController.createMovieMongo);
router.route("/:id").get(movieController.findMovie);
router.route("/:id").delete(verifyJWT, movieController.deleteMovie);
router
  .route("/dltmongo/:id")
  .delete(verifyJWT, movieController.deleteMovieMongo);

module.exports = router;
