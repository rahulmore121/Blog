const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  postPicturePath: {
    type: String,
    // required: true,
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
