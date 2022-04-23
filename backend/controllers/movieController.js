let neo4j = require("neo4j-driver");
const mongoDriver = require("../mongo");
const Movie = require("../models/movie");
const reviewController = require("./reviewController");
let neo4jdbconnection = neo4j.driver(
  process.env.MOVIE_DATABASE_URL,
  neo4j.auth.basic(
    process.env.MOVIE_DATABASE_USERNAME,
    process.env.MOVIE_DATABASE_PASSWORD
  )
);
function toNumber({ low, high }) {
  let res = high;

  for (let i = 0; i < 32; i++) {
    res *= 2;
  }

  return low + res;
}
// @desc    Retrieve movie by movieId
// @route   GET /api/movie/:id
// @access  Public

const findMovie = async (req, res) => {
  const movieId = req.params.id;
  if (!movieId) return res.status(400).json({ message: "Movie ID Missing." });
  try {
    // Connect to the MongoDB cluster
    let db = await mongoDriver.mongo();
    const movie = await db.collection("movies").findOne({ _id: movieId });
    res
      .status(200)
      .json({ movie: movie, message: "Task executed successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Backtrack Insertion if an exception was caught in the Neo4j movie deletion
// @route   NONE: called internally

const backtrackInsert = async (movie) => {
  console.log(movie);
  try {
    let db = await mongoDriver.mongo();
    await db.collection("movies").insertOne(movie);
  } catch (err) {
    throw err;
  }
};

// @desc    Backtrack Deletion if an exception was caught in the Neo4j movie insertion
// @route   NONE: called internally

const backtrackDelete = async (movieId) => {
  try {
    let db = await mongoDriver.mongo();
    await db.collection("movies").deleteOne({ _id: movieId });
  } catch (err) {
    throw err;
  }
};

// @desc    Create movie document on MongoDB "Movies" Collection and Neo4j
// @route   POST /api/movie
// @access  Admin

const createMovieCombined = async (req, res) => {
  if (!req.claims.roles.includes("Admin"))
    return res.status(401).json({ message: "Unauthorized" });
  const {
    budget,
    cast,
    genres,
    _id,
    overview,
    popularity,
    poster_path,
    release_date,
    revenue,
    runtime,
    spoken_languages,
    title,
  } = req.body;

  if (
    budget == null ||
    cast == null ||
    genres == null ||
    _id == null ||
    overview == null ||
    popularity == null ||
    poster_path == null ||
    release_date == null ||
    revenue == null ||
    runtime == null ||
    spoken_languages == null ||
    title == null
  )
    return res.status(400).json({ message: "Mongo: Movie Info Missing." });
  try {
    let db = await mongoDriver.mongo();
    let newMovie = new Movie({
      budget: budget,
      cast: cast,
      genres: genres,
      _id: _id,
      overview: overview,
      popularity: popularity,
      poster_path: poster_path,
      release_date: release_date,
      revenue: revenue,
      runtime: runtime,
      spoken_languages: spoken_languages,
      title: title,
    });
    try {
      await db.collection("movies").insertOne(newMovie);
    } catch {
      return res
        .status(400)
        .json({ message: "Mongo: Movie Insertion Failed." });
    }
    const movieNode = await createMovie(
      req.body._id,
      req.body.overview,
      req.body.poster_path,
      req.body.title,
      req.body.vote_average
    );
    movieNode.vote_average = movieNode.vote_average.toNumber();
    res.status(200).json({
      movie_Document: newMovie,
      movie_Node: movieNode,
      message: "Mongo: Movie added successfully",
    });
  } catch (err) {
    await backtrackDelete(_id);
    res.status(400).json({ message: err.message });
  }
};

// @desc    Create Movie Node
// @route   Internal Usage

const createMovie = async (
  movieId,
  overview,
  posterPath,
  title,
  voteAverage
) => {
  console.log(movieId, overview, posterPath, title, voteAverage);
  if (
    movieId == null ||
    overview == null ||
    posterPath == null ||
    title == null ||
    voteAverage == null
  )
    throw new Error("Neo4j: Some Fields Missing.");

  try {
    let session = neo4jdbconnection.session();
    const createMovie = await session.run(
      `
            CREATE (m:Movie{
            movie_id:"${movieId}",
            title:"${title}",
            poster_path:"${posterPath}",
            vote_average:${voteAverage},
            overview:"${overview}"})
            return {movie_id:m.movie_id,title:m.title,poster_path:m.poster_path,vote_average:m.vote_average,overview:m.overview}
            `
    );
    session.close();
    if (!createMovie.records[0])
      throw new Error(`Neo4j: Movie Creation Failed.`);

    return (result = createMovie.records[0]["_fields"][0]);
  } catch (err) {
    throw err;
  }
};

// @desc    Delete Movie Node
// @route   DELETE /api/movie/:id
// @access  Admin

const deleteMovie = async (movieId) => {
  if (movieId == null) throw new Error("Invalid Movie Id");
  try {
    let session = neo4jdbconnection.session();
    const deleteMovie = await session.run(
      `match(m:Movie{movie_id:"${movieId}"})
    detach delete m`
    );
    session.close();
    if (deleteMovie.summary.counters["_stats"].nodesDeleted === 0)
      throw new Error(`Movie Deletion Failed.`);
  } catch (err) {
    throw err;
  }
};

// @desc    Delete movie document from MongoDB "Movies" Collection and from neo4j
// @route   DELETE /api/movie/:id
// @access  Admin

const deleteMovieCombined = async (req, res) => {
  if (!req.claims.roles.includes("Admin"))
    return res.status(401).json({ message: "Unauthorized" });
  const movieId = req.params.id;
  console.log(typeof movieId);
  var movie_to_be_deleted = {};
  if (!movieId) return res.status(400).json({ message: "Movie ID Missing." });
  try {
    let db = await mongoDriver.mongo();
    movie_to_be_deleted = await db
      .collection("movies")
      .findOne({ _id: movieId });
    try {
      await db.collection("movies").deleteOne({ _id: movieId });
    } catch (err) {
      return res.status(400).json({ message: "Mongo: Movie Deletion Failed" });
    }
    await deleteMovie(movieId);
    await reviewController.deleteAllMovieReviews(movieId);
    res.status(200).json({ message: "Task executed successfully" });
  } catch (err) {
    try {
      await backtrackInsert(movie_to_be_deleted);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};

// @desc    Get movies based on "popularity"
// @route   GET /api/movie/pop/:p
// @access  Public

const getPopMovies = async (req, res) => {
  const page = req.params.p;
  if (!page) return res.status(400).json({ message: "Page Number Missing." });
  try {
    let db = await mongoDriver.mongo();
    let skipped = (page - 1) * 28;
    const movies = await db
      .collection("movies")
      .aggregate([
        { $sort: { popularity: -1 } },
        {
          $project: {
            title: 1,
            poster_path: 1,
            overview: 1,
            vote_average: 1,
            release_date: 1,
          },
        },
      ])
      .skip(skipped)
      .limit(28)
      .toArray();
    res
      .status(200)
      .json({ movies: movies, message: "Task executed successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get movies based on "popularity" and genre of choice
// @route   GET /api/movie/popg
// @access  Public

const getPopMoviesByGenre = async (req, res) => {
  const { page, genre } = req.query;
  if (!page || !genre)
    return res.status(400).json({ message: "Info Missing." });
  try {
    let db = await mongoDriver.mongo();
    let skipped = (page - 1) * 30;
    const movies = await db
      .collection("movies")
      .aggregate([
        { $match: { genres: { $regex: genre, $options: "i" } } },
        { $sort: { popularity: -1 } },
        { $project: { title: 1, poster_path: 1, popularity: 1, genres: 1 } },
      ])
      .skip(skipped)
      .limit(30)
      .toArray();
    res
      .status(200)
      .json({ movies: movies, message: "Task executed successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get movies based on "average_vote" and year of choice
// @route   GET /api/movie/topy
// @access  Public

const getTopMoviesByYear = async (req, res) => {
  const { page, year } = req.query;

  if (!page || !year) return res.status(400).json({ message: "Info Missing." });
  try {
    let skipped = (page - 1) * 30;
    let reqYear = new Date(year + "-01-01T00:00:00.000+00:00");
    let yearLimit = new Date(parseInt(year) + 1 + "-01-01T00:00:00.000+00:00");
    let db = await mongoDriver.mongo();
    const movies = await db
      .collection("movies")
      .aggregate([
        { $match: { release_date: { $gte: reqYear, $lt: yearLimit } } },
        { $sort: { vote_average: -1 } },
        {
          $project: {
            title: 1,
            poster_path: 1,
            vote_average: 1,
            release_date: 1,
          },
        },
      ])
      .skip(skipped)
      .limit(30)
      .toArray();
    res
      .status(200)
      .json({ movies: movies, message: "Task executed successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get movies based on "average_vote" and year+genre of choice
// @route   POST /api/movie/topyg
// @access  PUBLIC

const getTopMoviesByYearAndGenre = async (req, res) => {
  const { page, year, genre } = req.query;
  if (!page || !year || !genre)
    return res.status(400).json({ message: "Info Missing." });
  try {
    let skipped = (page - 1) * 30;
    let reqYear = new Date(year + "-01-01T00:00:00.000+00:00");
    let yearLimit = new Date(parseInt(year) + 1 + "-01-01T00:00:00.000+00:00");
    let db = await mongoDriver.mongo();
    const movies = await db
      .collection("movies")
      .aggregate([
        {
          $match: {
            $and: [
              { release_date: { $gte: reqYear, $lt: yearLimit } },
              { genres: { $regex: genre, $options: "i" } },
            ],
          },
        },
        { $sort: { vote_average: -1 } },
        {
          $project: {
            title: 1,
            poster_path: 1,
            vote_average: 1,
            release_date: 1,
          },
        },
      ])
      .skip(skipped)
      .limit(30)
      .toArray();
    res
      .status(200)
      .json({ movies: movies, message: "Task executed successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get most popular genres per year
// @route   GET /api/movie/popg/y
// @access  PUBLIC

const getPopGenresPerYear = async (req, res) => {
  try {
    let db = await mongoDriver.mongo();
    var genre_per_year_array = [];
    var genre_per_year = {};
    const movies = await db
      .collection("movies")
      .aggregate([
        { $unwind: { path: "$genres" } },
        {
          $project: {
            date: { $toDate: "$release_date" },
            genres: 1,
            popularity: 1,
          },
        },
        {
          $project: {
            year: { $year: "$date" },
            genres: 1,
            popularity: 1,
          },
        },
        {
          $group: {
            _id: { genre: "$genres", year: "$year" },
            total_movies: { $sum: 1 },
            total_popularity: { $sum: "$popularity" },
          },
        },
        {
          $project: {
            average_popularity: {
              $divide: ["$total_popularity", "$total_movies"],
            },
          },
        },
        {
          $group: {
            _id: "$_id.year",
            most_popular_genre: {
              $max: "$average_popularity",
            },
            data: { $push: "$$ROOT" },
          },
        },
        { $sort: { "data._id": -1 } },
      ])
      .toArray();

    movies.forEach((x) => {
      for (const genre in x.data) {
        if (x.data[genre].average_popularity === x.most_popular_genre) {
          genre_per_year = {
            Year: x._id,
            Most_Popular_Genre: x.data[genre]._id.genre,
          };
          genre_per_year_array.push(genre_per_year);
        }
      }
    });

    res.status(200).json({
      Result: genre_per_year_array,
      message: "Task executed successfully",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// @desc    View Suggested Movies
// @route   GET /api/movie/suggested
// @access  Registred User

const suggestedMovies = async (req, res) => {
  const userId = req.claims.id;

  try {
    let session = neo4jdbconnection.session();
    const suggestedMovies = await session.run(
      `MATCH(u:User{user_id:${userId}})-[:FOLLOW]->(ux:User)
      with *
      optional match(ux)-[:CREATE]->(w:Watchlist)<-[:BELONGS]-(m:Movie)
      with m,count(m) as num
      where num>=2
      return {title:m.title,poster_path:m.poster_path,overview:m.overview,vote_average:m.vote_average,id:m.movie_id}
      limit 30`
    );
    session.close();
    if (!suggestedMovies.records)
      return res.status(400).json({ message: `an error occured` });
    const result = suggestedMovies.records.map((e) => {
      return {
        ...e["_fields"][0],
        vote_average: e["_fields"][0]["vote_average"],
      };
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createMovie,
  deleteMovie,
  findMovie,
  createMovieCombined,
  deleteMovieCombined,
  getPopMovies,
  getPopMoviesByGenre,
  getTopMoviesByYear,
  getTopMoviesByYearAndGenre,
  getPopGenresPerYear,
  suggestedMovies,
};
