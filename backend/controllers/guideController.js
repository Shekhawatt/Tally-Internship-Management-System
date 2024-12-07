const User = require("../models/userModel");
const Team = require("../models/teamModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// Get all guides
exports.getAllGuides = catchAsync(async (req, res, next) => {
  const guides = await User.find({ role: "guide" });
  res.status(200).json({
    status: "success",
    results: guides.length,
    data: guides,
  });
});

// Add a new guide
exports.addGuide = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError("All fields are required!", 400));
  }

  const newGuide = await User.create({
    name,
    email,
    password,
    passwordConfirm: password,
    role: "guide",
  });

  res.status(201).json({
    status: "success",
    data: {
      guide: {
        id: newGuide._id,
        name: newGuide.name,
        email: newGuide.email,
      },
    },
  });
});

// Update a guide
exports.updateGuide = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const updatedGuide = await User.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedGuide) {
    return next(new AppError("No guide found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: updatedGuide,
  });
});

// Delete a guide
exports.deleteGuide = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const guide = await User.findByIdAndDelete(id);

  if (!guide) {
    return next(new AppError("No guide found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Get all teams associated with a guide
exports.getTeamsByGuide = catchAsync(async (req, res, next) => {
  const guideId = req.body.guideId || req.user._id; // Get guideId from request body or use logged-in user's ID

  // Find all teams where the guideId exists in the `guides` field
  const teams = await Team.find({ guides: guideId })
    .populate({
      path: "members", // Populate members (interns)
      select: "name email", // Select only necessary fields
    })
    .populate({
      path: "project", // Populate project details
      select: "name description status", // Select only necessary fields
    });

  if (!teams || teams.length === 0) {
    return next(new AppError("No teams found for this guide", 404));
  }

  res.status(200).json({
    status: "success",
    results: teams.length,
    data: teams,
  });
});
