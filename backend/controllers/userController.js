let neo4j = require("neo4j-driver");
const mongoDriver = require("../mongo");
const User = require("../models/user");
const bcrypt = require("bcrypt");
let neo4jdbconnection = neo4j.driver(
  process.env.MOVIE_DATABASE_URL,
  neo4j.auth.basic(
    process.env.MOVIE_DATABASE_USERNAME,
    process.env.MOVIE_DATABASE_PASSWORD
  )
);

// @desc    Get User Details By Id
// @route   GET /api/user/:id
// @access  Public

const userById = async (req, res) => {
  const userId = req.params.id;
  if (!req.params.id)
    return res.status(400).json({ message: "Invalid user Id" });
  try {
    let session = neo4jdbconnection.session();
    const userById = await session.run(
      `match(u:User)
            where u.user_id=${userId}
            with *
            optional match(ux:User)-[followers:FOLLOW]->(u)
            optional match(u)-[following:FOLLOW]->(Uy:User)
            return {user_id:u.user_id,username:u.username,following:count(distinct following), followers:count(distinct followers) }`
    );
    session.close();
    if (!userById.records[0])
      return res.status(400).json({ message: `User ID ${userId} not found` });
    const result = userById.records[0]["_fields"][0];
    res.status(200).json({
      ...result,
      following: result["following"].low,
      followers: result["followers"].low,
      user_id: result["user_id"].low,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create User Node
// @route   POST /api/user
// @access  Public

const createUser = async (req, res) => {
  const { username } = req.body;
  if (!username)
    return res.status(400).json({ message: "Username Not Provided." });

  try {
    let session = neo4jdbconnection.session();
    const createUser = await session.run(
      `match(u:User)
            with u ORDER BY u.user_id DESC LIMIT 1
            create(ux:User {user_id:u.user_id+1,username:"${username}"})
            return {user_id:ux.user_id,username:ux.username}`
    );
    session.close();
    if (!createUser.records[0])
      return res.status(400).json({ message: `User Creation Failed.` });
    const result = createUser.records[0]["_fields"][0];
    res.status(201).json({
      ...result,
      user_id: result["user_id"].low,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete User Node
// @route   DELETE /api/user/:id
// @access  Owner and Admin

const deleteUser = async (req, res) => {
  const userId = req.params.id;
  const id = req.claims.id;
  if (!req.params.id)
    return res.status(400).json({ message: "Invalid user Id" });
  try {
    let session = neo4jdbconnection.session();
    const deleteUser = await session.run(
      ` match(u:User{user_id:${userId}}) 
      optional match(u)-[:CREATE]->(w:Watchlist)
      detach delete u,w`
    );
    session.close();
    if (deleteUser.summary.counters["_stats"].nodesDeleted === 0)
      return res.status(400).json({ message: `User Deletion Failed.` });

    res.status(204).json({ success: "true" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// @desc    Follow User
// @route   POST /api/user/:id/follow
// @access  Registred User

const followUser = async (req, res) => {
  const followedUserId = req.params.id;
  const userId = req.claims.id;
  if (!req.params.id)
    return res.status(400).json({ message: "Invalid User Id" });
  try {
    let session = neo4jdbconnection.session();
    const followUser = await session.run(
      `  match(u:User{user_id:${userId}})
        match(ux:User{user_id:${followedUserId}})
        where u.user_id<>ux.user_id and NOT (u)-[:FOLLOW]-(ux)
        create (u)-[r:FOLLOW]->(ux)
        return 'relationship created'
        `
    );
    session.close();
    if (followUser.summary.counters["_stats"].relationshipsCreated === 0)
      return res.status(400).json({ message: `User Follow Failed` });
    res.status(204).json({ success: "true" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Unfollow User
// @route   DELETE /api/user/:id/follow
// @access  Owner

const unfollowUser = async (req, res) => {
  const followedUserId = req.params.id;
  const userId = req.claims.id;
  if (!req.params.id)
    return res.status(400).json({ message: "Invalid User Id" });
  try {
    let session = neo4jdbconnection.session();
    const unfollowUser = await session.run(
      `   match(u:User{user_id:${userId}})-[f:FOLLOW]->(ux:User{user_id:${followedUserId}})
            where u.user_id<>ux.user_id
            delete f    
            return 'relationship deleted'
        `
    );
    session.close();
    if (unfollowUser.summary.counters["_stats"].relationshipsDeleted === 0)
      return res.status(400).json({ message: `User Unfollow Failed` });
    res.status(204).json({ success: "true" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Users you follow
// @route   GET  /api/users/followed
// @access  Registred User

const followedUsers = async (req, res) => {
  const userId = req.claims.id;
  try {
    let session = neo4jdbconnection.session();
    const followedUsers = await session.run(
      `match(u:User)-[:FOLLOW]->(ux:User)
    where u.user_id=${userId}
    return {user_name:ux.username,user_id:ux.user_id}`
    );
    session.close();
    if (!followedUsers.records)
      return res.status(400).json({ message: `an error occured` });
    const result = followedUsers.records.map((e) => {
      return {
        ...e["_fields"][0],
        user_id: e["_fields"][0].user_id.low,
      };
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Suggested Users
// @route   GET  /api/users/followed
// @access  Registred User

const suggestedUsers = async (req, res) => {
  const userId = req.claims.id;

  try {
    let session = neo4jdbconnection.session();
    const suggestedUsers = await session.run(
      `MATCH (u1:User{user_id:${userId}})-[f1:FOLLOW]->(wl:Watchlist)<-[f2:FOLLOW]-(ux:User)
    where  NOT (u1)-[:FOLLOW]->(ux)
    return {user_name:ux.username,user_id:ux.user_id} LIMIT 7`
    );
    if (!suggestedUsers.records)
      return res.status(400).json({ message: `an error occured` });
    const result = suggestedUsers.records.map((e) => {
      return {
        ...e["_fields"][0],
        user_id: e["_fields"][0].user_id.low,
      };
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update User document in MongoDB "users" collection
// @route   PUT /api/user/upd
// @access  User

const updateUserMongo = async (req, res) => {
  // id = req.claims.id;
  const updatedUserId = req.params.id;
  const {
    new_email,
    new_password,
    new_gender,
    new_name,
    new_surname,
    new_country,
    new_dob,
  } = req.body;
  if (
    !new_email ||
    !new_password ||
    !new_gender ||
    !new_name ||
    !new_surname ||
    !new_country ||
    !new_dob ||
    !updatedUserId
  )
    return res.status(400).json({ message: "User Update Info Missing." });
  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(new_password, salt);
    let newProfileInfo = {
      email: new_email,
      password: hashedPassword,
      gender: new_gender,
      name: new_name,
      surname: new_surname,
      country: new_country,
      dob: new Date(new_dob),
    };

    let db = await mongoDriver.mongo();
    await db
      .collection("users")
      .updateOne({ _id: parseInt(updatedUserId) }, { $set: newProfileInfo });
    res
      .status(201)
      .json({ user: newProfileInfo, message: "User Updated successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// @desc    Delete User document from MongoDB "users" collection
// @route   DELETE /api/user/dltmongo/:id
// @access  User/Admin

const deleteUserMongo = async (req, res) => {
  const userId = req.params.id;
  if (!userId) return res.status(400).json({ message: "UserId is Missing." });
  try {
    let db = await mongoDriver.mongo();
    await db.collection("users").deleteOne({ _id: parseInt(userId) });
    res.status(204).json({ message: "Task executed successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Most Active Users
// @route   GET /api/user/mostactive
// @access  Public

const mostActiveUsers = async (req, res) => {
  try {
    const session = neo4jdbconnection.session();
    const mostActive = await session.run(
      `
        MATCH(u1:User)-[f1]->(w:Watchlist)<-[f2]-(u2:User)
        with *
        WHERE
        type (f1) in["CREATE"] AND
        type (f2) in ["FOLLOW"] AND
        NOT (u1)-[:FOLLOW]-(w) AND
        NOT (u2)-[:CREATE]-(w)
        with  count(f2) as numFollowers,u1
        RETURN {username:u1.username,user_id:u1.user_id,numFollowers:numFollowers}
        ORDER BY  numFollowers
        DESC
        LIMIT 10 `
    );
    session.close();
    if (!mostActive.records)
      return res.status(400).json({ message: `An Error Occured` });
    const result = mostActive.records.map((e) => {
      return {
        ...e["_fields"][0],
        user_id: e["_fields"][0].user_id.low,
        numFollowers: e["_fields"][0].numFollowers.low,
      };
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  userById,
  createUser,
  deleteUser,
  followUser,
  unfollowUser,
  followedUsers,
  suggestedUsers,
  updateUserMongo,
  deleteUserMongo,
  mostActiveUsers,
};
