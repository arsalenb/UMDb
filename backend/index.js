require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv").config();

const app = express();

app.use(express.json());

// HTTP request logger middleware
app.use(morgan("dev"));
// Enable Cross-Origin Resource Sharing
app.use(cors());

var mongoDB = "mongodb://localhost:27017/umdb";
mongoose.connect(
  mongoDB,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (!err) console.log("MongoDB has connected successfully.");
    else console.error.bind("MongoDB connection error:");
  }
);
// Authentication and registration routes
app.use("/login", require("./routes/login"));
app.use("/signup", require("./routes/signup"));
// --------------------------------------
app.use("/api/watchlist", require("./routes/api/watchlist"));
app.use("/api/user", require("./routes/api/user"));
app.use("/api/movie", require("./routes/api/movie"));
app.use("/api/review", require("./routes/api/review"));

app.listen(5000, () => console.log("Backend is listening on port 5000"));
