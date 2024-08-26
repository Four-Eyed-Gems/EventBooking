const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  event_name: { type: String, required: true },
  organizer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organizer",
    required: true,
  },
  hall_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hall",
    required: true,
  },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  approval_status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  licence_document: { type: String },
  hall_permit_document: { type: String },
  is_deleted: { type: Boolean, default: false }, // Soft delete flag
});

module.exports = mongoose.model("Event", eventSchema);
