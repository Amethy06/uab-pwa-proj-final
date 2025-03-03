const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  fullName: { type: String, required: true, },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String},
  bio: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
