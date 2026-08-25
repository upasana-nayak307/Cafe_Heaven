const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["booking", "cancelled", "completed", "info"],
      default: "booking",
    },
    read: { type: Boolean, default: false },
    time: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);