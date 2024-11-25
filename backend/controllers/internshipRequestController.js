const InternshipRequest = require("../models/internshipRequestModel");
const Batch = require("../models/batchModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.applyForInternship = catchAsync(async (req, res, next) => {
  // Check if user is a student
  if (!(req.user.role == "temp" || req.user.role == "admin")) {
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

  // Check if user already has a pending request for the same batch
  const { batchId } = req.body;
  const existingRequestForBatch = await InternshipRequest.findOne({
    student: req.user.id,
    batch: batchId,
    status: "pending",
  });

  if (existingRequestForBatch) {
    return next(
      new AppError(
        "You have already applied for an internship in this batch.",
        400
      )
    );
  }

  // Validate batch ID
  const batch = await Batch.findById(batchId);
  if (!batch) {
    return next(new AppError("Batch not found", 404));
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

  // Create internship request with batch info
  const newRequest = await InternshipRequest.create({
    ...req.body,
    student: req.user.id,
    batch: batchId, // Adding the batch information here
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
    // Assign the user role as 'intern' and link to the batch
    await User.findByIdAndUpdate(request.student, {
      role: "intern",
      batch: request.batch, // Set batch for the intern
    });
  } else if (status === "rejected") {
    // Add rejection date for rejected requests
    request.rejectionDate = new Date();
    await request.save();
  }
  request.status = status; // Set the request status as 'approved' or 'rejected'
  await request.save();

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
