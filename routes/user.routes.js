const express = require("express");
const {
  signUp,
  login,
  getAllUser,
  getSingleUser,
} = require("../controllers/user.controller");
const auth = require("../middlewares/auth");
const router = express.Router();

router.post("/register", signUp);
router.post("/login", login);
router.get("/", auth, getAllUser);
router.get("/:id", auth, getSingleUser);

module.exports = router;
