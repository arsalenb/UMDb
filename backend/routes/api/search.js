const express = require("express");
const router = express.Router();
const searchController = require("../../controllers/searchController");

// ---------------------USER Search ------------------
router.route("/user").get(searchController.searchUser);

// ---------------------Movie Search ------------------
router.route("/movie").get(searchController.searchMovie);

module.exports = router;
