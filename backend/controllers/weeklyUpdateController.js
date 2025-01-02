const WeeklyUpdate = require("../models/weeklyUpdateModel");
const Feedback = require("../models/feedbackModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Create or update a weekly update
exports.createOrUpdateWeeklyUpdate = catchAsync(async (req, res, next) => {
  const { teamId, week, description } = req.body;
  // Check if an update already exists for this week and team
  let weeklyUpdate = await WeeklyUpdate.findOne({ teamId, week });
  if (weeklyUpdate) {
    weeklyUpdate.description = description;
    weeklyUpdate.status = {}; // Reset the status for all guides
    await weeklyUpdate.save();
  } else {
    console.log(teamId);
    weeklyUpdate = await WeeklyUpdate.create({
      teamId,
      week,
      description,
      createdBy: req.user.id,
    });
    console.log(weeklyUpdate);
  }

  res.status(200).json({
    status: "success",
    data: {
      weeklyUpdate,
    },
  });
});

// Get all weekly updates for a team (with seen/new status)
exports.getAllWeeklyUpdates = catchAsync(async (req, res, next) => {
  const { teamId } = req.params;

  // Fetch all updates for the team
  const updates = await WeeklyUpdate.find({ teamId }).populate(
    "createdBy",
    "name"
  );

  // Update the 'seen' status for the requesting user
  updates.forEach((update) => {
    update.status.set(req.user.id, "seen");
    update.save();
  });

  res.status(200).json({
    status: "success",
    results: updates.length,
    data: {
      updates,
    },
  });
});

// Get a specific weekly update
exports.getWeeklyUpdate = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const weeklyUpdate = await WeeklyUpdate.findById(id).populate(
    "createdBy",
    "name"
  );
  if (!weeklyUpdate) {
    return next(new AppError("No weekly update found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      weeklyUpdate,
    },
  });
});

// Add feedback to a weekly update
exports.addFeedback = catchAsync(async (req, res, next) => {
  const { weeklyUpdateId, feedbackText } = req.body;

  const feedback = await Feedback.create({
    weeklyUpdate: weeklyUpdateId,
    createdBy: req.user.id,
    feedbackText,
  });
  res.status(200).json({
    status: "success",
    data: {
      feedback,
    },
  });
});

// Get feedback for a specific weekly update
exports.getFeedbackForWeeklyUpdate = catchAsync(async (req, res, next) => {
  const { weeklyUpdateId } = req.params;

  const feedbacks = await Feedback.find({
    weeklyUpdate: weeklyUpdateId,
  }).populate("createdBy", "name");

  res.status(200).json({
    status: "success",
    results: feedbacks.length,
    data: {
      feedbacks,
    },
  });
});
