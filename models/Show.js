const mongoose = require("mongoose");

const showSchema = new mongoose.Schema({
  show_name: { type: String, required: true },
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  show_date: { type: Date, required: true },
  start_time: { type: String, required: true },
  end_time: { type: String, required: true },
  description: { type: String },
});

module.exports = mongoose.model("Show", showSchema);
