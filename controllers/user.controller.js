const User = require("../models/User");
const generateToken = require("../utils/jwt");
const mongoose = require("mongoose")
const signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json("All fields are required");
    }

    let user = await User.findOne({ email }).exec();

    user = new User({ username, email, password });

    user = await user.save();

    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json("All fields are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json("Incorrect email and password");
    }

    const comparePassword = await user.comparePassword(password);
    if (!comparePassword) {
      return res.status(404).json("Incorrect email and password");
    }

    const token = await generateToken(user);

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, //cookie expiry for 30 days
    });

    res.status(200).json({ user, token });
  } catch (error) {
    
    res.status(500).json(error);
  }
};

const getSingleUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById({ _id: id }).select(["-password"]);

    if (!user) {
      return res.status(404).json(`User not found with this id ${id}`);
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getAllUser = async (req, res, next) => {
  try {
    const users = await User.find({}).select(["-password"]);

    if (!users) {
      return res.status(404).json(`User not found`);
    }

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  signUp,
  login,
  getSingleUser,
  getAllUser,
};
