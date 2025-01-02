const Team = require("../models/teamModel");
const User = require("../models/userModel");
const Demo = require("../models/demoModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.createDemo = catchAsync(async (req, res, next) => {
  const {
    team: teamId,
    pannel,
    startDateTime,
    endDateTime,
    Title,
    Description,
  } = req.body;

  const team = await Team.findById(teamId).populate("members guides");
  if (!team) {
    return next(new AppError("Invalid team ID", 400));
  }

  const allParticipants = [
    ...team.members,
    ...team.guides,
    ...pannel.filter((id) => id !== req.user._id.toString()),
  ];

  const conflictingDemos = await Demo.find({
    startDateTime: { $lt: endDateTime },
    endDateTime: { $gt: startDateTime },
    $or: [{ team: teamId }, { pannel: { $in: allParticipants } }],
  });

  if (conflictingDemos.length > 0) {
    return next(new AppError("Schedule conflict detected", 400));
  }

  const demo = await Demo.create({
    team: teamId,
    pannel,
    startDateTime,
    endDateTime,
    Title,
    Description,
  });

  res.status(201).json({
    status: "success",
    data: demo,
  });
});

exports.updateDemo = catchAsync(async (req, res, next) => {
  const demo = await Demo.findById(req.params.id);
  if (!demo) {
    return next(new AppError("Demo not found", 404));
  }

  const teamId = req.body.team || demo.team;
  const team = await Team.findById(teamId).populate("members guides");
  if (!team) {
    return next(new AppError("Invalid team ID", 400));
  }

  const updatedPannel = req.body.pannel || demo.pannel;
  const allParticipants = [
    ...team.members,
    ...team.guides,
    ...updatedPannel.filter((id) => id !== req.user._id.toString()),
  ];

  const startDateTime = req.body.startDateTime || demo.startDateTime;
  const endDateTime = req.body.endDateTime || demo.endDateTime;

  if (endDateTime <= startDateTime) {
    return next(new AppError("End time must be after start time", 400));
  }

  const conflictingDemos = await Demo.find({
    _id: { $ne: req.params.id },
    startDateTime: { $lt: endDateTime },
    endDateTime: { $gt: startDateTime },
    $or: [{ team: teamId }, { pannel: { $in: allParticipants } }],
  });

  if (conflictingDemos.length > 0) {
    return next(new AppError("Schedule conflict detected", 400));
  }

  const updatedDemo = await Demo.findByIdAndUpdate(
    req.params.id,
    {
      team: teamId,
      pannel: updatedPannel,
      startDateTime,
      endDateTime,
      Title: req.body.Title || demo.Title,
      Description: req.body.Description || demo.Description,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    data: updatedDemo,
  });
});

exports.getUpcomingDemos = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const teams = await Team.find({
    $or: [{ members: userId }, { guides: userId }],
  });

  const demos = await Demo.find({
    $or: [{ team: { $in: teams.map((team) => team._id) } }, { pannel: userId }],
    startDateTime: { $gte: new Date() },
  })
    .populate({
      path: "team",
      populate: {
        path: "members guides project",
        select: "-passwordConfirm -password",
      },
    })
    .populate({
      path: "pannel",
      select: "-passwordConfirm -password",
    })
    .sort({ startDateTime: 1 });

  res.status(200).json({
    status: "success",
    results: demos.length,
    data: demos,
  });
});

exports.deleteDemo = catchAsync(async (req, res, next) => {
  const demo = await Demo.findByIdAndDelete(req.params.id);
  if (!demo) {
    return next(new AppError("Demo not found", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
