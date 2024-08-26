const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

// Middleware to ensure all requests are authenticated
router.use(verifyToken);

// Create a new user (Admin only)
router.post("/", verifyAdmin, async (req, res) => {
  const { username, email, password, user_type } = req.body;

  try {
    const user = new User({ username, email, password, user_type });
    await user.save();
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all users (Admin only)
router.get("/", verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({ is_deleted: false });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get user by ID (Admin only)
router.get("/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({ _id: id, is_deleted: false });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update user (Admin only)
router.put("/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, updates, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Soft delete user (Admin only)
router.delete("/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { is_deleted: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
