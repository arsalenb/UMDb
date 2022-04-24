const mongoDriver = require("../mongo");
const neo4j = require("neo4j-driver");
let neo4jdbconnection = neo4j.driver(
  process.env.MOVIE_DATABASE_URL,
  neo4j.auth.basic(
    process.env.MOVIE_DATABASE_USERNAME,
    process.env.MOVIE_DATABASE_PASSWORD
  )
);

// @desc    Method to retrieve a SINGLE review embedded in a "Movie" document
// @route   NONE: called internally
async function getReviewEmbedded(id, movieId) {
  try {
    let elt_to_return = [];
    // Connect to the MongoDB cluster
    let db = await mongoDriver.mongo();
    let movie = await db.collection("movies").findOne({ _id: movieId });
    movie["reviews"].forEach((x) => {
      if (x._id === id) {
        elt_to_return = [x, movie["reviews"].indexOf(x)];
      }
    });
    return elt_to_return;
  } catch (e) {
    throw e;
  }
}

// @desc    Method to retrieve a review in the MongoDB "review" collection
// @route   NONE: called internally

async function getReview(id) {
  try {
    // Connect to the MongoDB cluster
    let db = await mongoDriver.mongo();
    return await db.collection("reviews").findOne({ _id: id });
  } catch (e) {
    throw e;
  }
}

// @desc    Get ALL reviews embedded in a "Movie" document
// @route   GET /api/review/:id
// @access  Public

const findReviewsOfMovie = async (req, res) => {
  const movieId = req.params.id;
  if (!movieId) return res.status(400).json({ message: "Movie ID Missing." });
  try {
    // Connect to the MongoDB cluster
    let db = await mongoDriver.mongo();
    let movie = await db.collection("movies").findOne({ _id: movieId });
    const reviews = movie["reviews"];
    res
      .status(200)
      .json({ reviews: reviews, message: "Task executed successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get MORE reviews of a movie from the mongoDB "reviews" collection
// @route   GET /api/review/more/:id
// @access  Public

const getMoreReviewsOfMovie = async (req, res) => {
  const movieId = req.params.id;
  if (!movieId) return res.status(400).json({ message: "Movie ID Missing." });
  try {
    // Connect to the MongoDB cluster
    let db = await mongoDriver.mongo();
    let reviews = await db
      .collection("reviews")
      .aggregate([
        { $match: { movieId: movieId } },
        {
          $project: {
            review_date: { $toDate: "$review_date" },
            movieId: 1,
            title: 1,
            reviewer: 1,
            rating: 1,
            review_detail: 1,
            review_summary: 1,
            userId: 1,
          },
        },
        { $sort: { date: -1 } },
      ])
      .skip(20)
      .toArray();
    res
      .status(200)
      .json({ reviews: reviews, message: "Task executed successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateVoteMovieNode = async (movieId, new_avg_vote) => {
  if (movieId == null || new_avg_vote == null) {
    throw new Error("Neo4j update vote: Info Missing");
  }
  try {
    let session = neo4jdbconnection.session();
    const update_vote = await session.run(
      `MATCH (m:Movie {movie_id: "${movieId}"})
        SET m.vote_average = "${new_avg_vote}"
        return {movie:m.movie_id,vote_average:m.vote_average}`
    );
    session.close();
    if (!update_vote.records[0]) {
      throw new Error("Neo4j: update unsuccessful");
    }
  } catch (err) {
    throw err;
  }
};

// @desc    Method to update the "average_vote" and "vote_count" of movie after CREATING a review
// @route   NONE: called internally

const updateMovieRatingCreation = async (movie, rating) => {
  try {
    let newAvgRating =
      (movie["vote_average"] * movie["vote_count"] + rating) /
      (movie["vote_count"] + 1);
    let newNumVotes = movie["vote_count"] + 1;
    let update = {
      vote_average: +newAvgRating.toFixed(1),
      vote_count: newNumVotes,
    };
    return update;
  } catch (e) {
    throw e;
  }
};

// @desc    Method to update the "average_vote" and "vote_count" of movie after EDITING a review
// @route   NONE: called internally

const updateMovieRatingEditing = async (movie, oldRating, newRating) => {
  try {
    let newAvgRating =
      (movie["vote_average"] * movie["vote_count"] -
        parseInt(oldRating) +
        parseInt(newRating)) /
      movie["vote_count"];
    let updateNew = +newAvgRating.toFixed(1);
    return updateNew;
  } catch (e) {
    throw e;
  }
};

// @desc    Method to update the "average_vote" and "vote_count" of movie after DELETING a review
// @route   NONE: called internally

const updateMovieRatingDeleting = async (movie, oldRating, delRating) => {
  try {
    let db = await mongoDriver.mongo();
    let newAvgRating =
      (oldRating * movie["vote_count"] - delRating) / (movie["vote_count"] - 1);
    let newNumVotes = movie["vote_count"] - 1;
    if (isNaN(newAvgRating)) {
      newAvgRating = 0;
    }
    let update = {
      vote_average: +newAvgRating.toFixed(1),
      vote_count: newNumVotes,
    };
    return update;
  } catch (e) {
    throw e;
  }
};

// @desc    Create a review document in the MongoDb "reviews" collection
// @route   POST /api/review/
// @access  Registred User

const createReview = async (req, res) => {
  const userId = req.claims.id;
  const username = req.claims.username;
  let newReview = {};
  let new_reviews = [];
  const { movieId, title, rating, review_summary, review_detail } = req.body;
  if (
    movieId == null ||
    title == null ||
    rating == null ||
    review_summary == null ||
    review_detail == null
  )
    return res.status(400).json({ message: "Review Info Missing." });
  try {
    let db = await mongoDriver.mongo();
    let tot =
      (await db.collection("reviews").count()) +
      15704481 +
      Math.floor(Math.random() * 10000) +
      Math.floor(Math.random() * 10000);

    newReview = {
      _id: "rw" + tot,
      userId: userId,
      reviewer: username,
      movieId: movieId,
      rating: rating,
      title: title,
      review_summary: review_summary,
      review_detail: review_detail,
      review_date: new Date(Date.now()),
    };
    let movie = await db.collection("movies").findOne({ _id: movieId });
    if (movie["reviews"].length >= 20) {
      new_reviews = movie["reviews"];
      new_reviews.push(newReview);
      new_reviews.shift();
    } else {
      new_reviews = movie["reviews"];
      new_reviews.push(newReview);
    }

    try {
      await db.collection("reviews").insertOne(newReview);
    } catch (e) {
      return res
        .status(400)
        .json({ message: "Mongo: Review Insertion unsuccessful" });
    }

    const new_vote = await updateMovieRatingCreation(
      movie,
      newReview["rating"]
    );

    try {
      await updateVoteMovieNode(movieId, new_vote.vote_average.toFixed(1));
      await db.collection("movies").updateOne(
        { _id: movieId },
        {
          $set: {
            reviews: new_reviews,
            vote_average: new_vote.vote_average,
            vote_count: new_vote.vote_count,
          },
        }
      );
    } catch (e) {
      throw new Error("Update movie vote info unsuccessful");
    }
    res
      .status(201)
      .json({ review: newReview, message: "Review Added successfully" });
  } catch (err) {
    let db = await mongoDriver.mongo();
    await db.collection("reviews").deleteOne({ _id: newReview._id });
    res.status(500).json({ message: err.message });
  }
};

// @desc    Edit a review document in the MongoDb "reviews" collection
// @route   PUT /api/review/
// @access  User

const editReview = async (req, res) => {
  const userId = req.claims.id;
  let review_to_edit = {};
  const {
    review_id,
    movieId,
    new_rating,
    new_review_summary,
    new_review_detail,
  } = req.body;
  if (
    review_id == null ||
    userId == null ||
    movieId == null ||
    new_rating == null ||
    new_review_summary == null ||
    new_review_detail == null
  )
    return res.status(400).json({ message: "Review Edit Info Missing." });

  try {
    let db = await mongoDriver.mongo();

    let movie = await db.collection("movies").findOne({ _id: movieId });
    review_to_edit = await db.collection("reviews").findOne({ _id: review_id });

    if (!review_to_edit || !movie)
      return res.status(400).json({ message: "Inexistant Movie or Review Id" });

    let rating_to_edit = review_to_edit.rating;

    let status = await db.collection("reviews").updateOne(
      { _id: review_id },
      {
        $set: {
          rating: new_rating,
          review_summary: new_review_summary,
          review_detail: new_review_detail,
          review_date: new Date(Date.now()),
        },
      }
    );

    let update = await updateMovieRatingEditing(
      movie,
      rating_to_edit,
      new_rating
    );
    await updateVoteMovieNode(movieId, update);

    let emb_rev = await getReviewEmbedded(review_id, movieId);
    if (emb_rev != null) {
      let review_array_to_update = movie["reviews"];
      review_array_to_update[emb_rev[1]]["review_summary"] = new_review_summary;
      review_array_to_update[emb_rev[1]]["review_detail"] = new_review_detail;
      review_array_to_update[emb_rev[1]]["rating"] = new_rating;
      review_array_to_update[emb_rev[1]]["review_date"] = new Date(Date.now());
      await db.collection("movies").updateOne(
        { _id: movieId },
        {
          $set: {
            vote_average: update,
            reviews: review_array_to_update,
          },
        }
      );
    } else {
      await db.collection("movies").updateOne(
        { _id: movieId },
        {
          $set: {
            vote_average: update,
          },
        }
      );
    }
    res.status(201).json({ message: "Review Edited successfully" });
  } catch (err) {
    let db = await mongoDriver.mongo();
    await db
      .collection("reviews")
      .replaceOne({ _id: review_id }, review_to_edit);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete a review document from the MongoDb "reviews" collection
// @route   DELETE /api/review/
// @access  User

const deleteReview = async (req, res) => {
  const review_id = req.query.review_id;
  const movieId = req.query.movieId;
  let movie_reviews = [];
  if (review_id == null || movieId == null)
    return res.status(400).json({ message: "Review Info Missing." });

  try {
    let db = await mongoDriver.mongo();
    let review_to_delete = await db
      .collection("reviews")
      .findOne({ _id: review_id });

    let movie = await db.collection("movies").findOne({ _id: movieId });

    if (!review_to_delete || !movie)
      return res.status(400).json({ message: "Inexistant Movie or Review Id" });

    let oldVoteAverage = movie["vote_average"];
    let delRating = review_to_delete["rating"];
    const new_vote = await updateMovieRatingDeleting(
      movie,
      oldVoteAverage,
      delRating
    );
    if (review_to_delete != null) {
      await updateVoteMovieNode(movieId, new_vote.vote_average.toFixed(1));
      await db.collection("reviews").deleteOne(review_to_delete);
      let x = await getReviewEmbedded(review_id, movieId);
      if (x != null) {
        movie_reviews = movie["reviews"];
        movie_reviews.splice(x[1], 1);
        await db.collection("movies").updateOne(
          { _id: movieId },
          {
            $set: {
              reviews: movie_reviews,
              vote_average: new_vote.vote_average,
              vote_count: new_vote.vote_count,
            },
          }
        );
      } else {
        await db.collection("movies").updateOne(
          { _id: movieId },
          {
            $set: {
              vote_average: new_vote.vote_average,
              vote_count: new_vote.vote_count,
            },
          }
        );
      }
    }
    res.status(204).json({ message: "Review Deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: "Review Deleting Failed" });
  }
};

const deleteAllMovieReviews = async (movieId) => {
  try {
    let db = await mongoDriver.mongo();
    await db.collection("reviews").deleteMany({ movieId: movieId });
  } catch (err) {
    throw err;
  }
};

// @desc    Get the total reviews posted per year
// @route   GET /api/review/totalrev/year
// @access  Public

const totalReviewsPerYear = async (req, res) => {
  try {
    // Connect to the MongoDB cluster
    let db = await mongoDriver.mongo();
    const reviews = await db
      .collection("reviews")
      .aggregate([
        {
          $project: {
            date: { $toDate: "$review_date" },
          },
        },
        {
          $project: {
            year: { $year: "$date" },
          },
        },
        {
          $group: {
            _id: "$year",
            review_per_year: {
              $sum: 1,
            },
          },
        },
        { $sort: { _id: -1 } },
      ])
      .toArray();
    res
      .status(200)
      .json({ reviews: reviews, message: "Task executed successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get the distribution of the rating scores per movie
// @route   GET /api/review/ratings/:id
// @access  User

const ratingsPerMovie = async (req, res) => {
  const movieId = req.params.id;
  if (!movieId) return res.status(400).json({ message: "Movie ID Missing." });
  try {
    // Connect to the MongoDB cluster
    let db = await mongoDriver.mongo();
    const reviews = await db
      .collection("reviews")
      .aggregate([
        { $match: { movieId: movieId } },
        {
          $group: {
            _id: "$rating",
            rating_count: {
              $sum: 1,
            },
          },
        },
        { $sort: { _id: -1 } },
      ])
      .toArray();
    res
      .status(200)
      .json({ reviews: reviews, message: "Task executed successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getReview,
  createReview,
  deleteReview,
  editReview,
  findReviewsOfMovie,
  getMoreReviewsOfMovie,
  totalReviewsPerYear,
  ratingsPerMovie,
  deleteAllMovieReviews,
};
