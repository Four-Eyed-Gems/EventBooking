const express = require("express");
const router = express.Router();
const Hall = require("../models/Hall");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

// Middleware to ensure all requests are authenticated
router.use(verifyToken);

// Create a new hall (Admin only)
router.post("/", verifyAdmin, async (req, res) => {
  const { hall_name, location, capacity } = req.body;

  try {
    const hall = new Hall({ hall_name, location, capacity });
    await hall.save();
    res.status(201).json(hall);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update an existing hall (Admin only)
router.put("/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { hall_name, location, capacity } = req.body;

  try {
    const hall = await Hall.findByIdAndUpdate(
      id,
      { hall_name, location, capacity },
      { new: true }
    );

    if (!hall) {
      return res.status(404).json({ message: "Hall not found" });
    }

    res.json(hall);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a hall (Admin only, soft delete)
router.delete("/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const hall = await Hall.findByIdAndUpdate(
      id,
      { is_deleted: true },
      { new: true }
    );

    if (!hall) {
      return res.status(404).json({ message: "Hall not found" });
    }

    res.json({ message: "Hall deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all halls (Accessible by all authenticated users)
router.get("/", async (req, res) => {
  try {
    const halls = await Hall.find({ is_deleted: false });
    res.json(halls);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get a hall by ID (Accessible by all authenticated users)
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const hall = await Hall.findOne({ _id: id, is_deleted: false });

    if (!hall) {
      return res.status(404).json({ message: "Hall not found" });
    }

    res.json(hall);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
