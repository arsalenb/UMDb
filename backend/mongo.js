const { MongoClient } = require("mongodb");

var client = null;
var db;
async function mongo() {
  if (client == null) {
    const uri = "mongodb://localhost:27017/";
    client = new MongoClient(uri);
    await client.connect();
    db = client.db("umdbMovies");
    return db;
  } else return client.db("umdbMovies");
}

function close() {
  if (client == null) throw new Error("Connection doesn't exist.");
  else client.close();
}
module.exports = { mongo, close };
