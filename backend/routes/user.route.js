const {
  registerUser,
  loginUser,
  getAllUser,
  signOut,
  getUser,
  updateProfile,
} = require("../controllers/user.controller.js");

const upload = require("../middleware/multer.middleware.js");
const express = require("express");
const protectThisRoute = require("../middleware/auth.middleware.js");

const router = express.Router();

router.get("/", protectThisRoute, getAllUser);
router.route("/register").post(upload.single("profile_pic"), registerUser);

router.route("/login").post(loginUser);
router.route("/sign-out").get(signOut);
router.route("/get-me").get(protectThisRoute, getUser);
router.route("/update-profile").put(protectThisRoute, upload.single("avatar"), updateProfile);

module.exports = router;
