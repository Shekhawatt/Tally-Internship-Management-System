const Feedback = require("../models/feedbackModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Create feedback for a weekly update
exports.createFeedback = catchAsync(async (req, res, next) => {
  const { weeklyUpdateId, comment } = req.body;

  // Create feedback
  const feedback = await Feedback.create({
    weeklyUpdateId,
    guideId: req.user.id,
    comment,
  });

  res.status(201).json({
    status: "success",
    data: {
      feedback,
    },
  });
});

// Get all feedback for a specific weekly update
exports.getFeedbacksForWeeklyUpdate = catchAsync(async (req, res, next) => {
  const { weeklyUpdateId } = req.params;

  // Fetch feedbacks and populate guide details
  const feedbacks = await Feedback.find({ weeklyUpdateId }).populate(
    "guideId",
    "name"
  );

  if (!feedbacks || feedbacks.length === 0) {
    return next(
      new AppError("No feedback found for the specified weekly update", 404)
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      feedbacks,
    },
  });
});
