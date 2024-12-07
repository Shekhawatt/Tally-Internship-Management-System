const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  weeklyUpdateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WeeklyUpdate",
    required: true,
  },
  guideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Feedback", feedbackSchema);
