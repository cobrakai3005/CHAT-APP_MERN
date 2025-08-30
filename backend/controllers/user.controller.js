const asyncHandler = require("express-async-handler");
const path = require("path");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model.js");
const generateToken = require("../config/generateToken.js");
const { uploadOnCloudinary } = require("../config/cloudinary.js");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password || !req.file) {
    res.status(400);
    throw new Error("Please enter all the field");
  }

  const userExists = await User.findOne({ email });

  const filePath = path.resolve(req.file.path);
  
  if (userExists) {
    res.status(400);
    throw new Error("User already Exists");
  }

  const resource = await uploadOnCloudinary(filePath);

  const user = await User.create({
    name,
    email,
    password,
    avatar: { public_id: resource.public_id, url: resource.secure_url },
  });

  if (user) {
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.avatar.url,
      token: generateToken(user._id),
    });
  } else {
    res.status(402);
    throw new Error("Failed to create User");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter all the field");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("User Does not Exists");
  }

  const comparePassword = bcrypt.compare(password, user.password);
  if (comparePassword) {
    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar.url,
        token: generateToken(user._id),
      },
    });
  }
  res.status(400);
  throw new Error("Invalid Credentials");
  // if (await user.matchPassword(password)) {

  // } else {

  // }
});

const getAllUser = asyncHandler(async (req, res) => {
  const { search } = req.query;
  let keyword;
  if (search) {
    keyword = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };
  } else {
  }

  const users = await User.find({ _id: { $ne: req.user._id } });

  return res.status(200).json(users);
});

const signOut = asyncHandler(async (req, res) => {
  try {
    // Optional clean-up (not required, but sometimes people like removing user from req)
    req.user = null;

    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
});
const updateProfile = asyncHandler(async (req, res) => {
  let filePath;

  if (req.file) {
    filePath = path.resolve(req.file.path);
    let user = await User.findById(req.user._id);
    const resource = await uploadOnCloudinary(filePath);
    user.avatar = { public_id: resource.public_id, url: resource.secure_url };

    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Success", avatar: resource.secure_url });
  } else {
    const { bio } = req.body;

    let user = await User.findById(req.user._id);

    user.bio = bio;
    user = await user.save();
    console.log(user);
    return res.status(200).json({ success: true, message: "Success", bio });
  }
});
const getUser = asyncHandler(async (req, res) => {
  // console.log(req.user);
  return res.status(200).json(req.user);
});

module.exports = {
  registerUser,
  loginUser,
  getAllUser,
  signOut,
  updateProfile,
  getUser,
};
