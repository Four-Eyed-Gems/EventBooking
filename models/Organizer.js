const mongoose = require("mongoose");

// Define the Organizer schema
const organizerSchema = new mongoose.Schema({
  organizer_name: { type: String, required: true },
  payment_profile_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PaymentProfile",
    // Optional, depends on if all organizers have a payment profile
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  contact_email: { type: String, required: true, unique: true },
  contact_number: { type: String, required: true },
  address: { type: String },
  is_deleted: { type: Boolean, default: false },
});

// Add a method to check if the organizer is associated with a payment profile
organizerSchema.methods.hasPaymentProfile = function () {
  return !!this.payment_profile_id;
};

// Add a pre-save hook to ensure unique contact email
organizerSchema.pre("save", async function (next) {
  if (this.isModified("contact_email")) {
    const existingOrganizer = await mongoose
      .model("Organizer")
      .findOne({ contact_email: this.contact_email });
    if (
      existingOrganizer &&
      existingOrganizer._id.toString() !== this._id.toString()
    ) {
      return next(new Error("Email is already in use by another organizer"));
    }
  }
  next();
});

module.exports = mongoose.model("Organizer", organizerSchema);
