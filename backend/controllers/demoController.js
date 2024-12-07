const Team = require("../models/teamModel");
const User = require("../models/userModel");
const Project = require("../models/projectModel");
const demo = require("../models/demoModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.createDemo = catchAsync(async (req, res, next) => {
  const { team, pannel, startDateTime, endDateTime } = req.body;

  // Validate team existence and fetch team details
  const existingTeam = await Team.findById(team).populate("members guides");
  if (!existingTeam) {
    return next(new AppError("Invalid team ID", 400));
  }

  // Gather all relevant participants
  const allParticipants = [
    ...existingTeam.members.map((member) => member._id.toString()), // Team members
    ...existingTeam.guides.map((guide) => guide._id.toString()), // All guides
    ...pannel.filter((id) => id !== req.user._id), // Panel members (excluding admin)
  ];

  // Check for conflicting demos
  const conflictingDemos = await Demo.find({
    $or: [
      { "team.members": { $in: allParticipants } }, // Team members
      { guide: { $in: allParticipants } }, // Guides
      { pannel: { $in: allParticipants } }, // Panel members
    ],
    $or: [
      {
        startDateTime: { $lt: endDateTime },
        endDateTime: { $gt: startDateTime },
      }, // Overlapping times
    ],
  });

  if (conflictingDemos.length > 0) {
    return next(
      new AppError(
        "One or more participants are not available during this time",
        400
      )
    );
  }

  // Create the demo
  const demo = await Demo.create({ team, pannel, startDateTime, endDateTime });
  res.status(201).json({
    status: "success",
    data: demo,
  });
});

exports.updateDemo = catchAsync(async (req, res, next) => {
  const { team, pannel, startDateTime, endDateTime } = req.body;

  // Validate demo existence
  const demo = await Demo.findById(req.params.id);
  if (!demo) {
    return next(new AppError("No demo found with this ID", 404));
  }

  // Fetch team details, including all guides
  const existingTeam = await Team.findById(team || demo.team).populate(
    "members guides"
  );
  if (!existingTeam) {
    return next(new AppError("Invalid team ID", 400));
  }

  // Gather all relevant participants
  const allParticipants = [
    ...existingTeam.members.map((member) => member._id.toString()), // Team members
    ...existingTeam.guides.map((guide) => guide._id.toString()), // All guides
    ...(pannel || demo.pannel).filter((id) => id !== req.user._id), // Panel members (excluding admin)
  ];

  // Check for conflicting demos
  const conflictingDemos = await Demo.find({
    _id: { $ne: req.params.id }, // Exclude the current demo
    $or: [
      { "team.members": { $in: allParticipants } }, // Team members
      { guide: { $in: allParticipants } }, // Guides
      { pannel: { $in: allParticipants } }, // Panel members
    ],
    $or: [
      {
        startDateTime: { $lt: endDateTime },
        endDateTime: { $gt: startDateTime },
      }, // Overlapping times
    ],
  });

  if (conflictingDemos.length > 0) {
    return next(
      new AppError(
        "One or more participants are not available during this time",
        400
      )
    );
  }

  // Update demo details
  demo.team = team || demo.team;
  demo.pannel = pannel || demo.pannel;
  demo.startDateTime = startDateTime || demo.startDateTime;
  demo.endDateTime = endDateTime || demo.endDateTime;
  await demo.save();

  res.status(200).json({
    status: "success",
    data: demo,
  });
});

exports.getUpcomingDemos = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const demos = await Demo.find({
    $or: [{ pannel: userId }, { "team.members": userId }, { guide: userId }],
    startDateTime: { $gte: new Date() }, // Future demos
  })
    .populate("team")
    .populate("pannel");

  res.status(200).json({
    status: "success",
    results: demos.length,
    data: demos,
  });
});

exports.deleteDemo = catchAsync(async (req, res, next) => {
  const demo = await Demo.findByIdAndDelete(req.params.id);

  if (!demo) {
    return next(new AppError("No demo found with this ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
