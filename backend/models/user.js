const mongoose = require("mongoose");

var Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    _id: {
      type: Number,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },

    roles: {
      type: Array,
      default: ["User"],
    },
    joinDate: {
      type: Date,
      default: Date.now(),
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("User", userSchema);
