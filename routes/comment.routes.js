const express = require("express");
const router = express.Router();
const {
  createComment,
  getAllComments,
  getSingleComment,
  updateComment,
  deleteComment,
  likeComment,
  dislikeComment,
} = require("../controllers/comment.controller");

const auth = require("../middlewares/auth");


router.post("/", auth, createComment);
router.get("/", auth, getAllComments);
router.get("/:id", auth, getSingleComment);
router.patch("/:id", auth, updateComment);
router.delete("/:id", auth, deleteComment);
router.post("/:id/like", auth, likeComment);
router.post("/:id/dislike", auth, dislikeComment);

module.exports = router;
