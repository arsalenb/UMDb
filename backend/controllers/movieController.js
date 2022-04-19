let neo4j = require("neo4j-driver");
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

const createMovie = async (req, res) => {
  const { movieId, overview, posterPath, title, voteAverage } = req.body;
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

module.exports = {
  createMovie,
  deleteMovie,
};
