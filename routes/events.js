const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

// Middleware to ensure all requests are authenticated
router.use(verifyToken);

// Create an event (Admin only)
// routes/events.js
router.post("/", verifyAdmin, async (req, res) => {
  const {
    event_name,
    organizer_id,
    hall_id,
    start_date,
    end_date,
    approval_status,
    licence_document,
    hall_permit_document,
  } = req.body;

  try {
    const event = new Event({
      event_name,
      organizer_id,
      hall_id,
      start_date,
      end_date,
      approval_status,
      licence_document,
      hall_permit_document,
    });

    await event.save();
    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update an event (Admin only)
router.put("/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const event = await Event.findByIdAndUpdate(id, updates, { new: true });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event updated successfully", event });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Soft delete an event (Admin only)
router.delete("/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findByIdAndUpdate(
      id,
      { is_deleted: true },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get an event by ID (Accessible by all authenticated users)
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id).where({ is_deleted: false });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get full list of events (Accessible by all authenticated users)
router.get("/", async (req, res) => {
  try {
    const events = await Event.find({ is_deleted: false });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
