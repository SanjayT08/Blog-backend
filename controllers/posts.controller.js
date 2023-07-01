const Posts = require("../models/Posts");
const User = require("../models/User");
const Comment = require("../models/Comments");
const { findOne } = require("../models/Posts");

const createPost = async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json("Title and description are required");
    }

    let post = new Posts({
      title,
      description,
      user: userId,
    });

    await post.save();
    res.status(201).json({ post });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error });
  }
};

const getAllPost = async (req, res, next) => {
  try {
    const posts = await Posts.find()
      .populate("user", "username email")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "-password",
        },
      })
      .sort({ createdAt: -1 });

      res.status(200).json({ posts });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

const getSinglePost = async (req, res, next) => {
  try {
    const post = await Posts.findById(req.params.id)
      .populate("user", "username email")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "-password",
        },
      });

    if (!post) {
      return res.status(404).json("Posts not found with thsi id");
    }

    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const deletePost = async (req, res, next) => {
  try {

    const post = await Posts.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!post) {
      return res.status(404).json("Posts not found with this id");
    }

    const comment = await Comment.deleteMany({ _id: { $in: post.comments } });

    if (!comment) {
      return res.status(404).json("Comment not found with thsi id");
    }
    await Comment.deleteMany({ _id: { $in: post.comments } });

    res.status(200).json({
      message: "Post deleted",
      newPost: {
        ...post,
        user: req.user,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}

const likePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user has already liked the post
    if (post.likes.includes(userId)) {
      return res.status(400).json({ message: "You have already liked this post" });
    }

    // Check if the user has already disliked the post
    if (post.dislikes.includes(userId)) {
      // Remove the user from the dislikes array
      post.dislikes.pull(userId);
    }

    // Add the user to the likes array
    post.likes.push(userId);

    await post.save();

    res.status(200).json({ message: "Post liked successfully", post });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const dislikePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Posts.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user has already disliked the post
    if (post.dislikes.includes(userId)) {
      return res.status(400).json({ message: "You have already disliked this post" });
    }

    // Check if the user has already liked the post
    if (post.likes.includes(userId)) {
      // Remove the user from the likes array
      post.likes.pull(userId);
    }

    // Add the user to the dislikes array
    post.dislikes.push(userId);

    await post.save();

    res.status(200).json({ message: "Post disliked successfully", post });
  } catch (error) {
    res.status(500).json({ error });
  }
};


module.exports = {
  createPost,
  getAllPost,
  getSinglePost,
  deletePost,
  likePost,
  dislikePost,
};
