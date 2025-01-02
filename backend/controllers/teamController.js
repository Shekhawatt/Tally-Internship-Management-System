const Team = require("../models/teamModel");
const User = require("../models/userModel");
const Project = require("../models/projectModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Add a new team
exports.addTeam = catchAsync(async (req, res, next) => {
  const { name, members, guides, project } = req.body;

  // Check if a team with the same name already exists
  const existingTeam = await Team.findOne({ name });
  if (existingTeam) {
    return next(new AppError(`Team with name "${name}" already exists`, 400));
  }

  // Ensure all members are valid interns and not already assigned to a team
  for (let memberId of members) {
    const member = await User.findById(memberId).select("-passwordConfirm"); // Ignore the passwordConfirm field;
    if (!member || member.role !== "intern") {
      return next(new AppError(`User ${memberId} is not a valid intern`, 400));
    }

    // Ensure the intern is not part of any other team
    if (User.team && User.team.length > 0) {
      return next(
        new AppError(`User ${User.name} is already part of another team`, 400)
      );
    }
  }

  // Ensure guides are valid
  for (let guideId of guides) {
    const guide = await User.findById(guideId).select("-passwordConfirm"); // Ignore the passwordConfirm field;
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
  await Promise.all(
    members.map(async (memberId) => {
      const member = await User.findById(memberId).select("-passwordConfirm"); // Ignore the passwordConfirm field;
      member.team.push(team._id);
      await member.save();
    })
  );

  // Add the team to all guides
  await Promise.all(
    guides.map(async (guideId) => {
      const guide = await User.findById(guideId).select("-passwordConfirm"); // Ignore the passwordConfirm field;

      if (!guide) {
        return next(new AppError(`Guide ${guideId} not found`, 400)); // Guard against null guide
      }

      // Ensure guide.team is initialized as an array if it's null
      if (!guide.team) {
        guide.team = []; // Initialize the team array if it's null
      }

      guide.team.push(team._id); // Guide is assigned to this team (pushed to the array)
      await guide.save();
    })
  );

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

  console.log("Update Team Request:", { id, name, members, guides, project });

  // Find the existing team
  const team = await Team.findById(id);
  if (!team) {
    return next(new AppError("No team found with that ID", 404));
  }

  // Find all current members and guides of the team
  const currentMembers = team.members.map((member) => member.toString());
  const currentGuides = team.guides.map((guide) => guide.toString());

  // Find removed members and guides
  const removedMembers = currentMembers.filter((m) => !members.includes(m));
  const removedGuides = currentGuides.filter((g) => !guides.includes(g));

  // Update removed members' and guides' team field to null
  for (const memberId of removedMembers) {
    const member = await User.findById(memberId).select("-passwordConfirm");
    if (member) {
      member.team = [];
      await member.save();
    }
  }

  for (const guideId of removedGuides) {
    const guide = await User.findById(guideId).select("-passwordConfirm");
    if (guide) {
      guide.team = guide.team.filter((teamId) => teamId.toString() !== id);
      await guide.save();
    }
  }

  // Update added members' and guides' team field
  for (const memberId of members) {
    const member = await User.findById(memberId).select("-passwordConfirm");
    if (member && member.team.toString() !== id) {
      member.team = id;
      await member.save();
    }
  }

  for (const guideId of guides) {
    const guide = await User.findById(guideId).select("-passwordConfirm");
    if (guide && !guide.team.includes(id)) {
      guide.team.push(id);
      await guide.save();
    }
  }

  // Update team details
  team.name = name || team.name;
  team.members = members || team.members;
  team.guides = guides || team.guides;
  team.project = project || team.project;

  const updatedTeam = await team.save();

  res.status(200).json({
    status: "success",
    data: {
      team: updatedTeam,
    },
  });
});

// Get all teams
exports.getAllTeams = catchAsync(async (req, res, next) => {
  const teams = await Team.find()
    .populate("members project") // Populate members and project fields
    .populate({
      path: "guides", // Populate guides
      populate: {
        path: "team", // Populate the team field in guides (which is now an array)
        select: "_id", // Only return the team ID, not the full team object
      },
    });

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
  const team = await Team.findById(req.params.id);
  if (!team) {
    return next(new AppError("No team found with that ID", 404));
  }

  // Remove the team assignment from all members
  for (let memberId of team.members) {
    const member = await User.findById(memberId).select("-passwordConfirm"); // Ignore the passwordConfirm field;;
    member.team = undefined; // Remove team association
    await member.save();
  }

  // Use findByIdAndDelete to remove the team
  await Team.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Team deleted successfully",
  });
});
