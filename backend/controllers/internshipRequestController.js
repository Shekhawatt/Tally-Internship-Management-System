const InternshipRequest = require("../models/internshipRequestModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.applyForInternship = catchAsync(async (req, res, next) => {
  // Check if user is a student
  if (req.user.role !== "temp") {
    return next(new AppError("Only students can apply for internships", 403));
  }

  // Check for a rejected request within the last month
  const lastRequest = await InternshipRequest.findOne({
    student: req.user.id,
    status: "rejected",
  });

  if (lastRequest) {
    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // One month ago
    if (new Date(lastRequest.rejectionDate) > oneMonthAgo) {
      return next(
        new AppError(
          "You cannot apply for an internship until one month has passed since your rejection.",
          400
        )
      );
    }
  }

  // Check for existing pending request
  const existingRequest = await InternshipRequest.findOne({
    student: req.user.id,
    status: "pending",
  });

  if (existingRequest) {
    return next(
      new AppError("You already have a pending internship request", 400)
    );
  }

  // Validate required fields
  const requiredFields = [
    "fullName",
    "college",
    "branch",
    "year",
    "cgpa",
    "mobileNumber",
    "preferredDomain",
    "workMode",
    "pastExperience",
    "resumeLink",
  ];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      return next(
        new AppError(
          `Please provide ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`,
          400
        )
      );
    }
  }

  // Create internship request
  const newRequest = await InternshipRequest.create({
    ...req.body,
    student: req.user.id,
  });

  res.status(201).json({
    status: "success",
    data: {
      request: newRequest,
    },
  });
});
exports.reviewInternshipRequest = catchAsync(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    return next(
      new AppError("Only admins can review internship requests", 403)
    );
  }

  const request = await InternshipRequest.findById(req.params.id);

  if (!request) {
    return next(new AppError("No request found with that ID", 404));
  }

  if (request.status !== "pending") {
    return next(new AppError("This request has already been processed", 400));
  }

  const { status, remarks } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return next(
      new AppError('Invalid status! Use "approved" or "rejected".', 400)
    );
  }

  if (status === "approved") {
    await User.findByIdAndUpdate(request.student, { role: "intern" });
  } else if (status === "rejected") {
    // Add rejection date for rejected requests
    request.rejectionDate = new Date();
    await request.save();
  }

  res.status(200).json({
    status: "success",
    message: `Request ${status} successfully.`,
  });
});

exports.getAllPendingRequests = catchAsync(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    return next(new AppError("Only admins can view pending requests", 403));
  }

  const requests = await InternshipRequest.find({ status: "pending" })
    .populate({
      path: "student",
      select: "name email",
    })
    .sort("-submittedAt");

  res.status(200).json({
    status: "success",
    results: requests.length,
    data: {
      requests,
    },
  });
});
