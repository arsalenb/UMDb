const express = require("express");
const router = express.Router();
const movieController = require("../../controllers/movieController");

// ---------------------User Crud ------------------
router.route("/").post(movieController.createMovie);
router.route("/:id").delete(movieController.deleteMovie);
// ------------------------------------------------------

module.exports = router;
