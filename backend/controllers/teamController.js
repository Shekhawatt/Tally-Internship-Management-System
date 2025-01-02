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

  // Log the request data to check for correctness
  console.log("Update Team Request:", { id, name, members, guides, project });

  // Check if the team exists
  const team = await Team.findById(id);
  if (!team) {
    console.log(`Team not found with ID: ${id}`);
    return next(new AppError("No team found with that ID", 404));
  }

  // Check if the guides exist and are valid
  for (let guideId of guides) {
    const guide = await User.findById(guideId).select("-passwordConfirm");
    if (!guide || guide.role !== "guide") {
      console.log(`Invalid guide: ${guideId}`);
      return next(new AppError(`User ${guideId} is not a valid guide`, 400));
    }
  }

  // Check if the project exists
  const teamProject = await Project.findById(project);
  if (!teamProject) {
    console.log(`Project not found with ID: ${project}`);
    return next(new AppError("Project not found", 400));
  }

  // Uncomment this logic if you want to ensure members are not assigned to other teams
  for (let memberId of members) {
    const member = await User.findById(memberId).select("-passwordConfirm");
    if (!member || member.role !== "intern") {
      console.log(`Invalid intern: ${memberId}`);
      return next(new AppError(`User ${memberId} is not a valid intern`, 400));
    }

    if (member.team && member.team.toString() !== id) {
      console.log(`Intern ${memberId} is already in another team`);
      return next(
        new AppError(`User ${memberId} is already part of another team`, 400)
      );
    }
  }

  // Update the team details
  team.name = name || team.name;
  team.members = members || team.members;
  team.guides = guides || team.guides;
  team.project = project || team.project;

  // Save updated team
  const updatedTeam = await team.save();
  //console.log("Team updated:", updatedTeam);

  // Update the intern's team assignment
  for (let memberId of members) {
    const member = await User.findById(memberId).select("-passwordConfirm");
    if (member.team.toString() !== team._id.toString()) {
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
