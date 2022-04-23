const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoDriver = require("../mongo");
const userController = require("../controllers/userController");

// @desc    Authenticate a user
// @route   POST /login
// @access  Public

const handleLogin = async (req, res) => {
  const { username, email, password } = req.body;
  if ((!username && !email) || !password)
    return res
      .status(400)
      .json({ message: "Username or Email and password are required." });

  let db = await mongoDriver.mongo();
  const foundUser = await db.collection("users").findOne({
    $or: [
      { username: { $regex: new RegExp(`^${username}$`, "i") } },
      { email },
    ],
  });
  console.log(foundUser);

  if (!foundUser) return res.sendStatus(401); //Unauthorized
  // evaluate password
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    const roles = foundUser.roles;
    // create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          userId: foundUser._id,
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "36000s" }
    );
    res.json({
      id: foundUser._id,
      username: foundUser.username,
      roles: foundUser.roles,
      accessToken,
    });
  } else {
    res.sendStatus(401);
  }
};

// @desc    Register a user
// @route   POST /signup
// @access  Public

const handleSignup = async (req, res) => {
  const { username, password, email, gender, name, surname, country, dob } =
    req.body;
  if (
    !username ||
    !password ||
    !email ||
    !gender ||
    !name ||
    !surname ||
    !country ||
    !dob
  )
    res.status(400).json({ message: "Please add all fields." });
  else {
    // Check if user exists
    let db = await mongoDriver.mongo();
    const exists = await db.collection("users").findOne({
      $or: [
        { username: { $regex: new RegExp(`^${username}$`, "i") } },
        { email },
      ],
    });

    if (exists) {
      return res.status(409).json({ message: "User already exist." });
    } else {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user Mongo
      const tot = await db
        .collection("users")
        .aggregate([{ $sort: { _id: -1 } }])
        .limit(1)
        .toArray();
      const newId = tot[0]._id + 1;
      try {
        var newUser = {
          _id: parseInt(newId),
          username: username,
          password: hashedPassword,
          email: email,
          gender: gender,
          name: name,
          surname: surname,
          country: country,
          dob: new Date(dob),
          roles: ["User"],
          joinDate: new Date(Date.now()),
        };
        try {
          await db.collection("users").insertOne(newUser);
        } catch (e) {
          return res.status(500).json({ message: "User Document not Created" });
        }
        const node = await userController.createUser(username, parseInt(newId));
        return res
          .status(201)
          .json({ User_Document: newUser, User_Node: node });
      } catch (err) {
        await userController.backtrackDelete(newId);
        return res.status(500).json({ message: err.message });
      }
    }
  }
};

module.exports = { handleLogin, handleSignup };
