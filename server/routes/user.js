const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleware");

// ✅ GET all users
router.get("/", verifyToken, async (req, res) => {
  try {
    const users = await User.find({}, "_id name email role");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
});

module.exports = router;
