const Team = require("../models/teamModel");
const User = require("../models/userModel");
const Project = require("../models/projectModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Add a new team
exports.addTeam = catchAsync(async (req, res, next) => {
  const { name, members, guides, project } = req.body;

  // Ensure all members are valid interns and not already assigned to a team
  for (let memberId of members) {
    const member = await User.findById(memberId);
    if (!member || member.role !== "intern") {
      return next(new AppError(`User ${memberId} is not a valid intern`, 400));
    }

    // Ensure the intern is not part of any other team
    if (member.team) {
      return next(
        new AppError(`User ${memberId} is already part of another team`, 400)
      );
    }
  }

  // Ensure guides are valid
  for (let guideId of guides) {
    const guide = await User.findById(guideId);
    if (!guide || guide.role !== "guide") {
      return next(new AppError(`User ${guideId} is not a valid guide`, 400));
    }
  }

  // Ensure the project exists
  const teamProject = await Project.findById(project);
  if (!teamProject) {
    return next(new AppError("Project not found", 400));
  }

  // Create the new team
  const team = await Team.create({
    name,
    members,
    guides,
    project,
  });

  // Assign the team to all interns
  for (let memberId of members) {
    const member = await User.findById(memberId);
    member.team = team._id;
    await member.save();
  }

  res.status(201).json({
    status: "success",
    data: {
      team,
    },
  });
});

// Update team details
exports.updateTeam = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, members, guides, project } = req.body;

  // Check if the team exists
  const team = await Team.findById(id);
  if (!team) {
    return next(new AppError("No team found with that ID", 404));
  }

  // Ensure that all members are not part of another team
  for (let memberId of members) {
    const member = await User.findById(memberId);
    if (!member || member.role !== "intern") {
      return next(new AppError(`User ${memberId} is not a valid intern`, 400));
    }

    // Ensure the intern is not part of any other team
    if (member.team && member.team.toString() !== id) {
      return next(
        new AppError(`User ${memberId} is already part of another team`, 400)
      );
    }
  }

  // Check if the guides exist and are valid
  for (let guideId of guides) {
    const guide = await User.findById(guideId);
    if (!guide || guide.role !== "guide") {
      return next(new AppError(`User ${guideId} is not a valid guide`, 400));
    }
  }

  // Check if the project exists
  const teamProject = await Project.findById(project);
  if (!teamProject) {
    return next(new AppError("Project not found", 400));
  }

  // Update the team details
  team.name = name || team.name;
  team.members = members || team.members;
  team.guides = guides || team.guides;
  team.project = project || team.project;

  // Save updated team
  const updatedTeam = await team.save();

  // Update the intern's team assignment
  for (let memberId of members) {
    const member = await User.findById(memberId);
    if (member.team !== team._id.toString()) {
      member.team = team._id;
      await member.save();
    }
  }

  res.status(200).json({
    status: "success",
    data: {
      team: updatedTeam,
    },
  });
});

// Get all teams
exports.getAllTeams = catchAsync(async (req, res, next) => {
  const teams = await Team.find().populate("members guides project");
  res.status(200).json({
    status: "success",
    results: teams.length,
    data: {
      teams,
    },
  });
});

// Get team by ID
exports.getTeamById = catchAsync(async (req, res, next) => {
  const team = await Team.findById(req.params.id).populate(
    "members guides project"
  );
  if (!team) {
    return next(new AppError("No team found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      team,
    },
  });
});

// Delete a team
exports.deleteTeam = catchAsync(async (req, res, next) => {
  const teaam = await Team.findById(req.params.id);
  if (!team) {
    return next(new AppError("No team found with that ID", 404));
  }

  // Remove the team assignment from all members
  for (let memberId of team.members) {
    const member = await User.findById(memberId);
    member.team = undefined; // Remove team association
    await member.save();
  }

  // Delete the team
  await team.remove();

  res.status(204).json({
    status: "success",
    message: "Team deleted successfully",
  });
});
