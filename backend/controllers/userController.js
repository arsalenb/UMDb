let neo4j = require("neo4j-driver");
const mongoDriver = require("../Mongo");
const User = require("../models/user");
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

const findByUsername = async (req, res) => {
  const username = req.params.usn;
  if (!username)
    return res.status(400).json({ message: "Username Missing." });
  try {
    // Connect to the MongoDB cluster
    let db = await mongoDriver.mongo();
    const user = await db.collection("users").findOne({username: username});
    res.status(200).json({ user: user, message: "Task executed successfully" });
  } catch (err) {

    res.status(400).json({ message: err.message });
  }
};

const findByNameAndSurname = async (req, res) => {
  const {name, surname} = req.body;
  if (!name || !surname)
    return res.status(400).json({ message: "Name Missing." });
  try{
    let db = await mongoDriver.mongo();
    const users = await db.collection("users").find(
        {$and: [
            {name:{'$regex' : name, '$options' : 'i'}},
            {surname: {'$regex' : surname, '$options' : 'i'}}
          ]}).toArray();
    res.status(200).json({ user: users, message: "Task executed successfully" });
  } catch (err) {

    res.status(400).json({ message: err.message });
  }
};

const findByCountry = async (req, res) => {
  const country = req.body.country;
  if (!country)
    return res.status(400).json({ message: "Country Missing." });
  try{
    let db = await mongoDriver.mongo();
    const users = await db.collection("users").find({country: country}).toArray();
    res.status(200).json({ user: users, message: "Task executed successfully" });
  } catch (err) {

    res.status(400).json({ message: err.message });
  }
};

const findByNFollowers = async (req, res) => {
  const {min, max} = req.body;
  if (!min || !max)
    return res.status(400).json({ message: "Follower Range Missing." });
  try{
    let db = await mongoDriver.mongo();
    const users = await db.collection("users").aggregate([
      {$match: {numFollowers: {'$gte': min, '$lte': max}}},
      {$sort: {numFollowers: -1}}]).toArray();
    res.status(200).json({ user: users, message: "Task executed successfully" });
  } catch (err) {

    res.status(400).json({ message: err.message });
  }
};

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

const createUserMongo = async (req, res) => {
  const {username, email, password, gender, name, surname, country, dob} = req.body;
  if (!username || !email || !password || !gender || !name || !surname || !country || !dob)
    return res.status(400).json({ message: "User Info Missing." });
  try{
    var db = await mongoDriver.mongo();
    let usr = await db.collection("users").findOne(
        {$or: [
            {username: username},
            {email: email}
          ]});
    if (usr === null){
      let tot = await db.collection("users").count()+ 1
      var newUser = new User({
        _id: parseInt(tot),
        username: username,
        email: email,
        password: password,
        gender: gender,
        name: name,
        surname: surname,
        country: country,
        dob: dob
      })
      await db.collection("users").insertOne(newUser);
    }else {
      throw Error("UserID or Email already exists");
    }
    res.status(200).json({ user: newUser, message: "User Created successfully" });
  }catch (err) {

    res.status(400).json({ message: err.message });
  }
};

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
    res.status(400).json({ message: err.message });
  }
};

const updateUserMongo = async (req, res) => {
  const {username, new_email, new_password, new_gender, new_name, new_surname, new_country, new_dob} = req.body;
  if (!username || !new_email || !new_password || !new_gender || !new_name || !new_surname || !new_country || !new_dob)
    return res.status(400).json({ message: "User Update Info Missing." });
  try{
    let newProfileInfo = {
      email: new_email,
      password: new_password,
      gender: new_gender,
      name: new_name,
      surname: new_surname,
      country: new_country,
      dob: new_dob
    }
    let db = await mongoDriver.mongo();
    await db.collection("users").updateOne({username: username}, {$set: newProfileInfo});
    res.status(200).json({ user: newProfileInfo, message: "User Updated successfully" });
  }catch (err) {

    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete User Node
// @route   DELETE /api/user/:id
// @access  Owner and Admin

const deleteUserMongo = async (req, res) => {
  const username = req.params.id;
  if (!username)
    return res.status(400).json({ message: "Username Missing." });
  try{
    let db = await mongoDriver.mongo();
    await db.collection("users").deleteOne({username: username});
    res.status(200).json({message: "Task executed successfully" });
  } catch (err) {

    res.status(400).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;
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
    res.status(400).json({ message: err.message });
  }
};
// @desc    Follow User
// @route   POST /api/user/:id/follow
// @access  Registred User

const followUser = async (req, res) => {
  const followedUserId = req.params.id;
  const userId = 102;
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
  const userId = 102;
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
  const userId = 5;
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
  const userId = 5;
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
module.exports = {
  userById,
  createUser,
  deleteUser,
  followUser,
  unfollowUser,
  followedUsers,
  suggestedUsers,
  findByUsername,
  findByNFollowers,
  findByCountry,
  findByNameAndSurname,
  createUserMongo,
  updateUserMongo,
  deleteUserMongo
};
