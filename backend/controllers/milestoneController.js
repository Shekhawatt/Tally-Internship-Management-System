const Milestone = require("../models/milestoneModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Add a new milestone
exports.addMilestone = catchAsync(async (req, res, next) => {
  var { teamId, title, description } = req.body;
  teamId = req.user.team[0];
  if (!teamId || !title) {
    return next(new AppError("Team ID and Title are required", 400));
  }

  // Fetch the latest milestone number for the team
  const latestMilestone = await Milestone.findOne({ teamId })
    .sort("-milestoneNumber")
    .exec();

  const milestoneNumber = latestMilestone
    ? latestMilestone.milestoneNumber + 1
    : 1;

  const milestone = await Milestone.create({
    teamId,
    title,
    description,
    milestoneNumber,
  });

  res.status(201).json({
    status: "success",
    data: { milestone },
  });
});

// Edit a milestone
exports.editMilestone = catchAsync(async (req, res, next) => {
  const { milestoneId } = req.params;
  const { title, description } = req.body;

  const milestone = await Milestone.findById(milestoneId);
  if (!milestone) {
    return next(new AppError("Milestone not found", 404));
  }

  milestone.title = title || milestone.title;
  milestone.description = description || milestone.description;

  await milestone.save();

  res.status(200).json({
    status: "success",
    data: { milestone },
  });
});

// Get all milestones for a team
exports.getMilestonesByTeam = catchAsync(async (req, res, next) => {
  const { teamId } = req.params;

  const milestones = await Milestone.find({ teamId }).sort("milestoneNumber");

  if (!milestones || milestones.length === 0) {
    return next(new AppError("No milestones found for the team", 404));
  }

  res.status(200).json({
    status: "success",
    data: { milestones },
  });
});

// Delete a milestone
exports.deleteMilestone = catchAsync(async (req, res, next) => {
  const { milestoneId } = req.params;

  const milestone = await Milestone.findByIdAndDelete(milestoneId);
  if (!milestone) {
    return next(new AppError("Milestone not found", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Add a subtask to a milestone
exports.addSubtask = catchAsync(async (req, res, next) => {
  const { milestoneId } = req.params;
  const { title } = req.body;

  if (!title) {
    return next(new AppError("Subtask title is required", 400));
  }

  const milestone = await Milestone.findById(milestoneId);
  if (!milestone) {
    return next(new AppError("Milestone not found", 404));
  }

  milestone.subtasks.push({ title });
  await milestone.save();

  res.status(201).json({
    status: "success",
    data: { milestone },
  });
});

// Mark a subtask as completed
exports.markSubtaskComplete = catchAsync(async (req, res, next) => {
  const { milestoneId, subtaskId } = req.params;

  const milestone = await Milestone.findById(milestoneId);
  if (!milestone) {
    return next(new AppError("Milestone not found", 404));
  }

  const subtask = milestone.subtasks.id(subtaskId);
  if (!subtask) {
    return next(new AppError("Subtask not found", 404));
  }

  subtask.isCompleted = true;

  // Check if all subtasks are completed
  const allSubtasksCompleted = milestone.subtasks.every(
    (task) => task.isCompleted
  );
  if (allSubtasksCompleted) {
    milestone.isCompleted = true;
  }

  await milestone.save();

  res.status(200).json({
    status: "success",
    data: { milestone },
  });
});

exports.updateSubtaskCompletion = catchAsync(async (req, res, next) => {
  const { milestoneId, subtaskId } = req.params;
  const { isCompleted } = req.body;

  // Find the milestone
  const milestone = await Milestone.findById(milestoneId);
  if (!milestone) {
    return next(new AppError("Milestone not found", 404));
  }

  // Find the subtask by subtaskId
  const subtask = milestone.subtasks.id(subtaskId);
  if (!subtask) {
    return next(new AppError("Subtask not found", 404));
  }

  // Update the completion status of the subtask
  subtask.isCompleted = isCompleted;

  // Check if all subtasks are completed
  const allSubtasksCompleted = milestone.subtasks.every(
    (task) => task.isCompleted
  );

  if (allSubtasksCompleted) {
    milestone.isCompleted = true;
  }

  // Save the updated milestone
  await milestone.save();

  res.status(200).json({
    status: "success",
    data: {
      milestone,
    },
  });
});
