require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const PORT = 5000;

const app = express();

app.use(express.json());
// HTTP request logger middleware
app.use(morgan("dev"));
// Enable Cross-Origin Resource Sharing
app.use(cors());

// Authentication and registration routes
app.use("/login", require("./routes/login"));
app.use("/signup", require("./routes/signup"));
// --------------------------------------

// CRUD And Analytics API End Points
app.use("/api/watchlist", require("./routes/api/watchlist"));
app.use("/api/user", require("./routes/api/user"));
app.use("/api/movie", require("./routes/api/movie"));
app.use("/api/search", require("./routes/api/search"));
app.use("/api/review", require("./routes/api/review"));

app.listen(PORT, () => console.log("Backend is listening on port", PORT));

module.exports = { PORT };
