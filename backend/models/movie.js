const mongo = require("mongoose");

const Schema = mongo.Schema;

const movieSchema = new Schema({
  budget: {
    type: Number,
  },
  cast: {
    type: Array,
    default: [],
  },
  genres: {
    type: Array,
  },
  _id: {
    type: String,
  },
  overview: {
    type: String,
  },
  popularity: {
    type: Number,
  },
  poster_path: {
    type: String,
  },
  release_date: {
    type: Date,
  },
  revenue: {
    type: Number,
  },
  runtime: {
    type: Number,
  },
  spoken_languages: {
    type: Array,
    default: [],
  },
  title: {
    type: String,
  },
  vote_average: {
    type: Number,
    default: 0,
  },
  vote_count: {
    type: Number,
    default: 0,
  },
  reviews: {
    type: Array,
    default: [],
  },
});
module.exports = mongo.model("Movie", movieSchema);
