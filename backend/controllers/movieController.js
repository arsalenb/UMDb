let neo4j = require("neo4j-driver");
const mongoDriver = require("../Mongo");
const {Movie} = require("../models/movie");
let neo4jdbconnection = neo4j.driver(
  process.env.MOVIE_DATABASE_URL,
  neo4j.auth.basic(
    process.env.MOVIE_DATABASE_USERNAME,
    process.env.MOVIE_DATABASE_PASSWORD
  )
);

// @desc    Create Movie Node
// @route   POST /api/movie
// @access  Admin

const findMovie = async (req, res) => {
  const movieId = req.params.id;
  if (!movieId)
    return res.status(400).json({ message: "Movie ID Missing." });
  try {
    // Connect to the MongoDB cluster
    let db = await mongoDriver.mongo();
    const movie = await db.collection("movies").findOne({_id: movieId});
    res.status(200).json({ movie: movie, message: "Task executed successfully" });
  } catch (err) {

    res.status(400).json({ message: err.message });
  }
};

const findMovieByTitle = async (req, res) => {
  const movieTitle = req.body.title;
  if (!movieTitle)
    return res.status(400).json({ message: "Movie Title Missing." });
  try{
    let db = await mongoDriver.mongo();
    const movies = await db.collection("movies").find({title:{'$regex' : movieTitle, '$options' : 'i'}},
        {projection: {'title':1, 'poster_path':1, 'vote_average':1}}).toArray();
    res.status(200).json({ movies: movies, message: "Task executed successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const findMovieByGenre = async (req, res) => {
  const genre = req.body.genre;
  if (!genre)
    return res.status(400).json({ message: "Movie genre Missing." });
  try{
    let db = await mongoDriver.mongo();
    const movies = await db.collection("movies").find({genres:{'$regex' : genre, '$options' : 'i'}},
        {projection: {'title':1, 'poster_path':1, 'vote_average':1}}).limit(20).toArray();
    res.status(200).json({ movies: movies, message: "Task executed successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const findMovieByRuntime = async (req, res) => {
  const {startRuntime, endRuntime } = req.body;
  if (!startRuntime || !endRuntime)
    return res.status(400).json({ message: "Runtime Missing." });
  try{
    let db = await mongoDriver.mongo();
    const movies = await db.collection("movies").find(
        {runtime: {'$gte': parseInt(startRuntime), '$lte': parseInt(endRuntime)}},
        {projection: {'title':1, 'poster_path':1, 'vote_average':1, 'runtime':1}}).limit(20).toArray();
    res.status(200).json({ movies: movies, message: "Task executed successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const findMovieByRelDate = async (req, res) => {
  const {startDate, endDate } = req.body;
  if (!startDate || !endDate)
    return res.status(400).json({ message: "Date Missing." });
  try{
    let db = await mongoDriver.mongo();
    const movies = await db.collection("movies").find({release_date: {'$gte': new Date(startDate), '$lte': new Date (endDate)}},
        {projection: {'title':1, 'poster_path':1, 'vote_average':1, 'release_date':1}}).limit(20).toArray();
    res.status(200).json({ movies: movies, message: "Task executed successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const findMovieByLang = async (req, res) => {
  const lang = req.body.lang;
  if (!lang)
    return res.status(400).json({ message: "Date Missing." });
  try{
    let db = await mongoDriver.mongo();
    const movies = await db.collection("movies").find({spoken_languages: {'$regex' : lang, '$options' : 'i'}},
        {projection: {'title':1, 'poster_path':1, 'vote_average':1, 'spoken_languages':1}}).limit(20).toArray();
    res.status(200).json({ movies: movies, message: "Task executed successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const createMovieMongo = async (req, res) => {
  const {budget, cast, genres, _id, overview, popularity, poster_path, release_date, revenue, runtime, spoken_languages, title, vote_average, vote_count} = req.body;
  console.log(budget, cast, genres, _id, overview, popularity, poster_path, release_date, revenue, runtime, spoken_languages, title, vote_average, vote_count)
  if (!budget || !cast || !genres || !_id || !overview || !popularity || !poster_path || !release_date|| !revenue || !runtime || !spoken_languages || !title || !vote_average || !vote_count)
    return res.status(400).json({ message: "Movie Info Missing." });
  try{
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
      vote_average: vote_average,
      vote_count: vote_count,
    })
    await db.collection("movies").insertOne(newMovie);
    res.status(200).json({ movie: newMovie, message: "Movie added successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const createMovie = async (req, res) => {
  const {movieId, overview, posterPath, title, voteAverage } = req.body;
  if (!movieId || !overview || !posterPath || !title || !voteAverage)
    return res.status(400).json({ message: "Some Fields Missing." });

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
      return res.status(400).json({ message: `Movie Creation Failed.` });
    const result = createMovie.records[0]["_fields"][0];
    res.status(201).json({
      ...result,
      vote_average: result["vote_average"].low,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete Movie Node
// @route   DELETE /api/movie/:id
// @access  Admin

const deleteMovie = async (req, res) => {
  const movieId = req.params.id;
  if (!req.params.id)
    return res.status(400).json({ message: "Invalid Movie Id" });
  try {
    let session = neo4jdbconnection.session();
    const deleteUser = await session.run(
      `match(m:Movie{movie_id:"${movieId}"})
    detach delete m`
    );
    session.close();
    if (deleteUser.summary.counters["_stats"].nodesDeleted === 0)
      return res.status(400).json({ message: `Movie Deletion Failed.` });

    res.status(204).json({ success: "true" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteMovieMongo = async (req, res) => {
  const movieId = req.params.id;
  if (!movieId)
    return res.status(400).json({ message: "Movie ID Missing." });
  try{
    let db = await mongoDriver.mongo();
    await db.collection("movies").deleteOne({_id: movieId});
    res.status(200).json({ message: "Task executed successfully" });
  } catch (err) {

    res.status(400).json({ message: err.message });
  }
};

const getPopMovies = async (req, res) => {
  const page = req.params.p;
  if (!page)
    return res.status(400).json({ message: "Page Number Missing." });
  try {
    let db = await mongoDriver.mongo();
    let skipped = (page-1)* 30
    const movies = await db.collection("movies").aggregate([
      {$sort: {popularity: -1}},
      {$project: {title:1, poster_path:1, popularity:1}}
    ]).skip(skipped).limit(30).toArray();
    res.status(200).json({ movies: movies, message: "Task executed successfully" });
  } catch (err) {

    res.status(400).json({ message: err.message });
  }
};

const getPopMoviesByGenre = async (req, res) => {
  const {page, genre} = req.body;

  if (!page || !genre)
    return res.status(400).json({ message: "Info Missing." });
  try {
    let db = await mongoDriver.mongo();
    let skipped = (page-1)* 30
    const movies = await db.collection("movies").aggregate([
      {$match: {genres: {'$regex' : genre, '$options' : 'i'}}},
      {$sort: {popularity: -1}},
      {$project: {title:1, poster_path:1, popularity:1, genres:1}}
    ]).skip(skipped).limit(30).toArray();
    res.status(200).json({ movies: movies, message: "Task executed successfully" });
  } catch (err) {

    res.status(400).json({ message: err.message });
  }
};

const getTopMoviesByYear = async (req, res) => {
  const {page, year} = req.body;

  if (!page || !year)
    return res.status(400).json({ message: "Info Missing." });
  try {
    let skipped = (page-1)* 30
    let reqYear = new Date (year + '-01-01T00:00:00.000+00:00')
    let yearLimit = new Date (parseInt(year)+1 + '-01-01T00:00:00.000+00:00')
    let db = await mongoDriver.mongo();
    const movies = await db.collection("movies").aggregate([
      {$match: {release_date: {'$gte': reqYear, '$lt': yearLimit}}},
      {$sort: {vote_average: -1}},
      {$project: {title:1, poster_path:1, vote_average:1, release_date:1}}
    ]).skip(skipped).limit(30).toArray();
    res.status(200).json({ movies: movies, message: "Task executed successfully" });
  } catch (err) {

    res.status(400).json({ message: err.message });
  }
};

const getTopMoviesByYearAndGenre = async (req, res) => {
  const {page, year, genre} = req.body;

  if (!page || !year || !genre)
    return res.status(400).json({ message: "Info Missing." });
  try {
    let skipped = (page-1)* 30
    let reqYear = new Date (year + '-01-01T00:00:00.000+00:00')
    let yearLimit = new Date (parseInt(year)+1 + '-01-01T00:00:00.000+00:00')
    let db = await mongoDriver.mongo();
    const movies = await db.collection("movies").aggregate([
      {$match: {
          $and: [
            {release_date: {'$gte': reqYear, '$lt': yearLimit}},
            {genres: {'$regex': genre, '$options': 'i'}}
          ]
        }},
      {$sort: {vote_average: -1}},
      {$project: {title:1, poster_path:1, vote_average:1, release_date:1}}
    ]).skip(skipped).limit(30).toArray();
    res.status(200).json({ movies: movies, message: "Task executed successfully" });
  } catch (err) {

    res.status(400).json({ message: err.message });
  }
};

const getPopGenresPerYear = async (req, res) => {
  try {
    let db = await mongoDriver.mongo();
    const movies = await db.collection("movies").aggregate([
      {$unwind: {path: "$genres"}},
      {$project: {
          date: {$toDate: "$release_date"},
          genres:1,
          popularity:1
        }},
      {$project: {
          year: {$year: "$date"},
          genres: 1,
          popularity:1
        }},
      {$group: {
          _id: {genre: "$genres", year: "$year"},
          total_movies: {$sum: 1},
          total_popularity: {$sum: "$popularity"}
        }},
      {$project: {
          average_popularity: {
            $divide: ["$total_popularity", "$total_movies"]
          }
        }},
      {$group:{
          _id: "$_id.year",
          most_popular_genre: {
            $max: "$average_popularity"
          },
          data: { $push: '$$ROOT' }
        }},
      {$sort: {"data.average_popularity": -1}},
    ]).toArray();
    res.status(200).json({movies: movies, message: "Task executed successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  createMovie,
  deleteMovie,
  findMovie,
  findMovieByTitle,
  findMovieByGenre,
  findMovieByRuntime,
  findMovieByRelDate,
  findMovieByLang,
  createMovieMongo,
  deleteMovieMongo,
  getPopMovies,
  getPopMoviesByGenre,
  getTopMoviesByYear,
  getTopMoviesByYearAndGenre,
  getPopGenresPerYear

};
