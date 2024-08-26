const mongoose = require("mongoose");

const hallSchema = new mongoose.Schema({
  hall_name: { type: String, required: true },
  location: { type: String, required: true },
  capacity: { type: Number, required: true },
  amenities: [String],
  is_deleted: { type: Boolean, default: false },
});

module.exports = mongoose.model("Hall", hallSchema);
