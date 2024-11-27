const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Project = require("./../models/projectModel");
const User = require("./../models/userModel");
const mongoose = require("mongoose");

exports.createProject = catchAsync(async (req, res, next) => {
  const { name, description} = req.body;

  // Check if project name is unique
  const existingProject = await Project.findOne({ name });
  if (existingProject) {
    return next(new AppError("A project with this name already exists", 400));
  }

  const project = await Project.create({
    name,
    description,
  });

  res.status(201).json({
    status: "success",
    data: {
      project,
    },
  });
});

exports.updateProject = catchAsync(async (req, res, next) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!project) {
    return next(new AppError("No project found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      project,
    },
  });
});

exports.getAllProjects = catchAsync(async (req, res, next) => {
  const projects = await Project.find();

  res.status(200).json({
    status: "success",
    results: projects.length,
    data: {
      projects,
    },
  });
});

// Get a project by ID
exports.getProjectById = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new AppError("No project found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      project,
    },
  });
});

exports.deleteProject = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Check if the project exists
  const project = await Project.findById(id);
  if (!project) {
    return next(new AppError("No project found with that ID", 404));
  }

  // Delete the project
  await Project.findByIdAndDelete(id);

  res.status(204).json({
    status: "success",
    message: "Project deleted successfully",
  });
});
