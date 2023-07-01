const express = require("express");
const router = express.Router();
const {
  createPost,
  getAllPost,
  getSinglePost,
  deletePost,
  likePost,
  dislikePost,
} = require("../controllers/posts.controller");

const auth = require("../middlewares/auth");


router.post("/", auth, createPost);
router.get("/", auth, getAllPost);
router.get("/:id", auth, getSinglePost);
router.delete("/:id", auth, deletePost);
router.put("/:id/like", auth, likePost);
router.put("/:id/dislike", auth, dislikePost);


module.exports = router;
