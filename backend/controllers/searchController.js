let neo4j = require("neo4j-driver");
const mongoDriver = require("../mongo");
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
// @desc    Search User Using String And Number of Followers
// @route   GET /api/search/user
// @access  Public

const searchUser = async (req, res) => {
  const searchString = req.query.string;
  const min = req.query.min;
  const max = req.query.max;

  const page = req.query.page;
  const skip = (page - 1) * 7;
  if (!min || !max) {
    try {
      const session = neo4jdbconnection.session();
      const pagination_results = await session.run(
        `
        CALL db.index.fulltext.queryNodes("userSearch", "a")
        YIELD node,score
        return {user_name:node.username,user_id:node.user_id}
        ORDER BY score
        SKIP ${skip}
        LIMIT 7
        `
      );
      session.close();
      if (!pagination_results.records)
        return res.status(400).json({ message: `An Error Occured` });
      const result = pagination_results.records.map((e) => {
        return {
          ...e["_fields"][0],
          user_id: e["_fields"][0].user_id.toNumber(),
        };
      });
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  } else {
    try {
      const session = neo4jdbconnection.session();
      const pagination_results = await session.run(
        `
    MATCH (u:User)
    WHERE toUpper(u.username) CONTAINS  toUpper("${searchString}")
    with *
    optional match(ux:User)-[follower:FOLLOW]->(u)
    with u,count(follower) as num
    where num in range(${min},${max})
    return {user_name:u.username,user_id:u.user_id} 
    ORDER BY u.username
    SKIP ${skip}
    LIMIT 7
    `
      );
      session.close();
      if (!pagination_results.records)
        return res.status(400).json({ message: `An Error Occured` });
      const result = pagination_results.records.map((e) => {
        return {
          ...e["_fields"][0],
          user_id: e["_fields"][0].user_id.toNumber(),
        };
      });
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

// @desc    Filter Movies Dynamically from a form input
// @route   POST /api/search/movie
// @access  Public

const searchMovie = async (req, res) => {
  const { title, genre, minRuntime, maxRuntime, minDate, maxDate, language } =
    req.query;
  try {
    var query = { $and: [] };

    if (title) {
      query.$and.push({ title: { $regex: title, $options: "i" } });
    }
    if (genre) {
      query.$and.push({ genres: { $regex: genre, $options: "i" } });
    }
    if (minRuntime) {
      query.$and.push({ runtime: { $gte: minRuntime } });
    }
    if (maxRuntime) {
      query.$and.push({ runtime: { $lte: maxRuntime } });
    }
    if (minDate) {
      query.$and.push({ release_date: { $gte: new Date(minDate) } });
    }
    if (maxDate) {
      query.$and.push({ release_date: { $lte: new Date(maxDate) } });
    }
    if (language) {
      query.$and.push({
        spoken_languages: { $regex: language, $options: "i" },
      });
    }

    let db = await mongoDriver.mongo();
    const movies = await db
      .collection("movies")
      .find(query, {
        projection: { title: 1, poster_path: 1, vote_average: 1, overview: 1 },
      })
      .toArray();

    res
      .status(200)
      .json({ movies: movies, message: "Task executed successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  searchUser,
  searchMovie,
};
