const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  console.log(req.headers);
  if (!authHeader?.startsWith("Bearer "))
    return res
      .status(401)
      .json({ message: "You must send an Authorization header" });
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: err }); //invalid token
    const claims = {
      username: decoded.UserInfo.username,
      roles: decoded.UserInfo.roles,
      id: decoded.UserInfo.userId,
    };
    req.claims = claims;
    next();
  });
};
module.exports = verifyJWT;
