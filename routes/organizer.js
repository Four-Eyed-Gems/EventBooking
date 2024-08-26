const express = require("express");
const router = express.Router();
const Organizer = require("../models/Organizer");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

// Middleware to ensure all requests are authenticated
router.use(verifyToken);

// Create a new organizer (Admin only)
router.post("/", verifyAdmin, async (req, res) => {
  const { organizer_name, payment_profile_id, user_id } = req.body;

  try {
    const organizer = new Organizer({
      organizer_name,
      payment_profile_id,
      user_id,
    });

    await organizer.save();
    res
      .status(201)
      .json({ message: "Organizer created successfully", organizer });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update an organizer (Admin only)
router.put("/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const organizer = await Organizer.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!organizer) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    res.json({ message: "Organizer updated successfully", organizer });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Soft delete an organizer (Admin only)
router.delete("/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const organizer = await Organizer.findByIdAndUpdate(
      id,
      { is_deleted: true },
      { new: true }
    );

    if (!organizer) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    res.json({ message: "Organizer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get an organizer by ID (Accessible by all authenticated users)
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const organizer = await Organizer.findById(id).where({ is_deleted: false });

    if (!organizer) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    res.json(organizer);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get full list of organizers (Accessible by all authenticated users)
router.get("/", async (req, res) => {
  try {
    const organizers = await Organizer.find({ is_deleted: false });

    res.json(organizers);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
