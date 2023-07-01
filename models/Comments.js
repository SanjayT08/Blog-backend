const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Comment title is required"],
    trim: true,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  posts: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },

  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  // postId: mongoose.Types.ObjectId,
  // postUserId: mongoose.Types.ObjectId,
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
