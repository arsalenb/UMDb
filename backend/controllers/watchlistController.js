let neo4j = require("neo4j-driver");
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
// @desc    Get single watchlist by id
// @route   GET /api/watchlist/:id
// @access  Public

const watchlistById = async (req, res) => {
  const watchlistId = req.params.id;
  if (!req.params.id)
    return res.status(400).json({ message: "Invalid Watchlist Id" });
  try {
    let session = neo4jdbconnection.session();
    const watchlistById = await session.run(
      `
    match(w:Watchlist)
    where ID(w)=${watchlistId}
    with *
    match(owner:User)-[:CREATE]->(w)
    optional Match(m:Movie)-[:BELONGS]->(w)
    optional Match(u:User)-[f:FOLLOW]->(w)
    return {
        movies:Case when m is not null then collect(distinct {
            title:m.title,
            movie_id:m.movie_id,
            poster_path:m.poster_path,
            vote_average:m.vote_average,
            overview:m.overview})
            else
            [] 
            end,
        id:ID(w),
        owner: owner.username,
        owner_id:owner.user_id,
        name:w.name,
        created_date:w.created_date,
        num_followers:count(distinct f)} as watchlist_internal_ID
    `
    );
    session.close();
    if (!watchlistById.records[0])
      return res
        .status(400)
        .json({ message: `Watchlist ID ${req.params.id} not found` });
    const result = watchlistById.records[0]["_fields"][0];
    console.log(watchlistById.records[0]);

    res.status(200).json({
      ...result,
      id: result.id.toNumber(),
      num_followers: result["num_followers"].toNumber(),
      owner_id: result["owner_id"].toNumber(),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get watchlists by user id
// @route   GET /api/watchlist/user
// @access  Public

const watchlistsByUserId = async (req, res) => {
  const userId = req.query.id;
  if (!req.query.id)
    return res.status(400).json({ message: "Invalid User Id" });
  try {
    let session = neo4jdbconnection.session();
    const watchlistsByUserId = await session.run(
      `
        Match(u:User{user_id:${userId}})-[c:CREATE]->(w:Watchlist)
        return {id:ID(w),name:w.name,created_date:w.created_date} as watchlists_by_uid
        `
    );
    session.close();
    if (!watchlistsByUserId.records)
      return res
        .status(400)
        .json({ message: `User ID ${req.params.id} not found` });
    const result = watchlistsByUserId.records.map((e) => {
      return {
        ...e["_fields"][0],
        id: e["_fields"][0].id.toNumber(),
      };
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create watchlist node
// @route   POST /api/watchlist
// @access  Registred users

const createWatchlist = async (req, res) => {
  const { name } = req.body;
  const id = req.claims.id;

  if (!name)
    return res.status(400).json({ message: "Watchlist Name Not Provided." });

  try {
    let session = neo4jdbconnection.session();
    const createdWatchlist = await session.run(
      `
        match (u:User{user_id:${id}})
         create(w:Watchlist{name:"${name}",created_date:toString(date())})
         create (u)-[:CREATE]->(w)
         return {owner:u.username,owner_id:u.user_id,watchlist_name:w.name,id:ID(w),created_date:w.created_date}
     
         `
    );
    session.close();
    if (!createdWatchlist.records[0])
      return res.status(400).json({ message: `Watchlist Creation Failed.` });
    const result = createdWatchlist.records[0]["_fields"][0];

    res.status(201).json({
      ...result,
      owner_id: result["owner_id"].toNumber(),
      id: result["id"].toNumber(),
      created_date: result["created_date"],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update watchlist node
// @route   PUT /api/watchlist
// @access  Owner of watchlist

const updateWatchlist = async (req, res) => {
  const { name } = req.body;
  const watchlistId = req.params.id;
  const id = req.claims.id;
  if (!name)
    return res.status(400).json({ message: "Watchlist Name is missing." });

  try {
    let session = neo4jdbconnection.session();
    const updateWatchlist = await session.run(
      `
      match(w:Watchlist)<-[:CREATE]-(u:User)
      where ID(w)=${watchlistId} AND u.user_id=${id}
      SET w.name="${name}"
      return {name:w.name,id:ID(w),created_date:w.created_date}
       
    `
    );
    session.close();
    if (!updateWatchlist.records[0])
      return res.status(400).json({ message: `Update Has Failed.` });
    const result = updateWatchlist.records[0]["_fields"][0];

    res.status(201).json({
      ...result,
      id: result["id"].toNumber(),
      created_date: result.created_date,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete watchlist node
// @route   DELETE /api/watchlist
// @access  Owner of watchlist or Admin

const deleteWatchlist = async (req, res) => {
  const watchlistId = req.params.id;
  const isAdmin = req.claims.roles.includes("Admin");
  const user_id = req.claims.id;
  if (!req.params.id)
    return res.status(400).json({ message: "Invalid Watchlist Id" });
  try {
    let session = neo4jdbconnection.session();
    const deleteWatchlist = await session.run(
      `
      Match(w:Watchlist)<-[c:CREATE]-(u:User)
      where ID(w)=${watchlistId} and (u.user_id=${user_id} or ${isAdmin})
      detach delete  w    
      `
    );
    session.close();
    if (deleteWatchlist.summary.counters["_stats"].nodesDeleted === 0)
      return res.status(400).json({ message: `Watchlist Deletion Failed.` });

    res.status(204).json({ success: "true" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Add a movie to watchlist
// @route   POST /api/watchlist/add
// @access  Registred user

const addMovie = async (req, res) => {
  const { movieId, watchlistId } = req.body;
  if (!movieId || !watchlistId)
    return res
      .status(400)
      .json({ message: "Movie Id or Watchlist Id is missing." });
  try {
    let session = neo4jdbconnection.session();
    const addMovie = await session.run(
      `match(m:Movie{movie_id:"${movieId}"})
            match(w:Watchlist)
            where  ID(w)=${watchlistId} and not (m)-[:BELONGS]->(w)
            create(m)-[:BELONGS]->(w)
            return m,w
             `
    );
    session.close();
    if (addMovie.summary.counters["_stats"].relationshipsCreated === 0)
      return res
        .status(400)
        .json({ message: `Adding Movie To Watchlist Failed.` });
    res.status(204).json({ success: "true" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Remove a movie from watchlist
// @route   Post /api/watchlist/remove
// @access  Owner of watchlist

const deleteMovie = async (req, res) => {
  const { movieId, watchlistId } = req.body;
  if (!movieId || !watchlistId)
    return res
      .status(400)
      .json({ message: "Movie Id or Watchlist Id is missing." });
  try {
    let session = neo4jdbconnection.session();
    const deleteMovie = await session.run(
      `Match(m:Movie{movie_id:"${movieId}"})-[b:BELONGS]->(w:Watchlist)
    where ID(w)=${watchlistId}
    delete b
    return 'Belongs relation Deleted!'`
    );
    session.close();
    if (deleteMovie.summary.counters["_stats"].relationshipsDeleted === 0)
      return res
        .status(400)
        .json({ message: `Removing Movie From Watchlist Failed.` });
    res.status(204).json({ success: "true" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Follow Watchlist
// @route   POST /api/watchlist/id/follow
// @access  Registred User

const followWatchlist = async (req, res) => {
  const watchlistId = req.params.id;
  const userId = req.claims.id;
  if (!req.params.id)
    return res.status(400).json({ message: "Invalid Watchlist Id" });
  try {
    let session = neo4jdbconnection.session();
    const followWatchlist = await session.run(
      `
        MATCH (u:User{user_id:${userId}})
        MATCH(w:Watchlist)
        where ID(w)=${watchlistId} and not (u)-[:FOLLOW]->(w) and not (u)-[:CREATE]->(w)
        MERGE(u)-[:FOLLOW]->(w) 
        return 'relationship created'
        `
    );
    session.close();
    if (followWatchlist.summary.counters["_stats"].relationshipsCreated === 0)
      return res.status(400).json({ message: `Watchlist Follow Failed` });
    res.status(204).json({ success: "true" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Unfollow Watchlist
// @route   POST /api/watchlist/id/follow
// @access  Registred User

const unfollowWatchlist = async (req, res) => {
  const watchlistId = req.params.id;
  const userId = req.claims.id;
  if (!req.params.id)
    return res.status(400).json({ message: "Invalid Watchlist Id" });
  try {
    let session = neo4jdbconnection.session();
    const unfollowWatchlist = await session.run(
      `
        MATCH(u:User{user_id:${userId}})-[f:FOLLOW]->(w:Watchlist)
        where ID(w)=${watchlistId} 
        delete f
        return 'User unfollow watchlist!'
        
        `
    );
    session.close();
    if (unfollowWatchlist.summary.counters["_stats"].relationshipsDeleted === 0)
      return res.status(400).json({ message: `Watchlist Unfollow Failed` });
    res.status(204).json({ success: "true" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Watchlists you follow
// @route   GET  /api/watchlist/followed
// @access  Registred User

const followedWatchlists = async (req, res) => {
  const userId = req.claims.id;
  try {
    let session = neo4jdbconnection.session();
    const followedWatchlists = await session.run(
      `match(u:User)-[:FOLLOW]->(w:Watchlist)
    where u.user_id=${userId}
    with w,u
    match(ux)-[c:CREATE]->(w)
    return {id:ID(w),name:w.name,owner:ux.username,owner_id:ux.user_id,created_date:w.created_date}
    `
    );
    session.close();
    if (!followedWatchlists.records)
      return res.status(400).json({ message: `an error occured` });
    const result = followedWatchlists.records.map((e) => {
      return {
        ...e["_fields"][0],
        id: e["_fields"][0].id.toNumber(),
        owner_id: e["_fields"][0].owner_id.toNumber(),
      };
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Suggested Watchlists
// @route   GET  /api/watchlist/followed
// @access  Registred User

const suggestedWatchlists = async (req, res) => {
  const userId = req.claims.id;
  try {
    let session = neo4jdbconnection.session();
    const suggestedWatchlists = await session.run(`
    MATCH (u1:User{user_id:${userId}})-[f1:FOLLOW]->(ux:User)-[fl:FOLLOW]->(wl:Watchlist)
    where NOT (u1)-[:FOLLOW]->(wl) AND NOT (u1)-[:CREATE]->(wl)
    with wl 
    match (ux:User)-[:CREATE]->(wl)
    return {name:wl.name,id:ID(wl),owner:ux.username,owner_id:ux.user_id,created_date:wl.created_date}`);
    session.close();
    if (!suggestedWatchlists.records)
      return res.status(400).json({ message: `an error occured` });
    const result = suggestedWatchlists.records.map((e) => {
      return {
        ...e["_fields"][0],
        id: e["_fields"][0].id.toNumber(),
        owner_id: e["_fields"][0].owner_id.toNumber(),
      };
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Most Followed Watchlists
// @route   GET /api/watchlist/mostfollowed
// @access  Public

const mostFollowedWatchlists = async (req, res) => {
  try {
    const session = neo4jdbconnection.session();
    const mostFollowed = await session.run(
      `MATCH(u1:User)-[f1:FOLLOW]->(w:Watchlist)
        with count(w) as numFollowers,w
        RETURN {name:w.name,id:ID(w),numFollowers:numFollowers}
        ORDER BY  numFollowers
        DESC
        LIMIT 10`
    );
    session.close();
    if (!mostFollowed.records)
      return res.status(400).json({ message: `An Error Occured` });
    const result = mostFollowed.records.map((e) => {
      return {
        ...e["_fields"][0],
        numFollowers: e["_fields"][0].numFollowers.toNumber(),
        id: e["_fields"][0].id.toNumber(),
      };
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = {
  watchlistById,
  watchlistsByUserId,
  createWatchlist,
  updateWatchlist,
  deleteWatchlist,
  addMovie,
  deleteMovie,
  followWatchlist,
  unfollowWatchlist,
  followedWatchlists,
  suggestedWatchlists,
  mostFollowedWatchlists,
};
