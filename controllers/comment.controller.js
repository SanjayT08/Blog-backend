const Posts = require("../models/Posts");
const User = require("../models/User");
const Comment = require("../models/Comments");

const createComment = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { content, postId, postUserId } = req.body;

    if (!content) {
      return res.status(400).json("Comment text is required");
    }

    const post = await Posts.findById(postId);
    if (!post) 
    return res.status(400).json("This post does not exist.");

    const newComment = new Comment({
      content,
      user: userId,
      postUserId: userId,
      postId,
    });

    await Posts.findOneAndUpdate(
      { _id: postId },
      {
        $push: { comments: newComment._id },
      },
      { new: true }
    );

    const comment = await newComment.save();

    res.status(200).json({ comment });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const getAllComments = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const comments = await Comment.find().populate(
      "user",
      "username email"
    );
    if (!comments) {
      return res.status(404).json("Comments not found with this blog");
    }

    res.status(200).json({ comments });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const getSingleComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id).populate(
      "user",
      "username email"
    );

    if (!comment) {
      return res.status(404).json("Comments not found with thsi id");
    }

    res.status(200).json({ comment });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const updateComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!comment) {
      return res.status(404).json("Not found");
    }

    res.status(201).json({ comment });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;

    const comment = await Comment.findOneAndDelete({
      _id: id,
      $or: [{ user: userId}, { postUserId: userId }],
    });

    if (!comment) {
      return res.status(404).json("Comment not found");
    }

    await Posts.findOneAndUpdate(
      { _id: comment.postId },
      { $pull: { comments: id } },
      { new: true }
    );

    res.status(200).json("Comment deleted");
  } catch (error) {
    res.status(500).json({ error });
  }
}

const likeComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user.id;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the user has already liked the comment
    if (comment.likes.includes(userId)) {
      return res.status(400).json({ message: "You have already liked this comment" });
    }

    // Check if the user has already disliked the comment
    if (comment.dislikes.includes(userId)) {
      comment.dislikes.pull(userId);
    }

    comment.likes.push(userId);
    await comment.save();

    res.status(200).json({ message: "Comment liked", comment });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const dislikeComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user.id;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the user has already disliked the comment
    if (comment.dislikes.includes(userId)) {
      return res.status(400).json({ message: "You have already disliked this comment" });
    }

    // Check if the user has already liked the comment
    if (comment.likes.includes(userId)) {
      comment.likes.pull(userId);
    }

    comment.dislikes.push(userId);
    await comment.save();

    res.status(200).json({ message: "Comment disliked", comment });
  } catch (error) {
    res.status(500).json({ error });
  }
};


module.exports = {
  createComment,
  getAllComments,
  getSingleComment,
  updateComment,
  deleteComment,
  likeComment,
  dislikeComment,
};
