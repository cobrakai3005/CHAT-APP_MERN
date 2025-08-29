const express = require("express");
const {
  getMessages,
  createMessage,
} = require("../controllers/message.controller");
const protectThisRoute = require("../middleware/auth.middleware");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

router
  .route("/imageDelete/:public_id")
  .delete(protectThisRoute, async (req, res) => {
    const { public_id } = req.params;
    try {
      const result = await cloudinary.uploader.destroy(public_id);
      res.json({ success: true, result });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: "Failed to delete image" });
    }
  });
router
  .route("/:recieverEmail")
  .get(protectThisRoute, getMessages)
  .post(protectThisRoute, createMessage);

module.exports = router;
