const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Batch = require("./../models/batchModel");
const User = require("./../models/userModel");

exports.createBatch = catchAsync(async (req, res, next) => {
  const { name, startDate, endDate } = req.body;

  // Check if batch name is unique
  const existingBatch = await Batch.findOne({ name });
  if (existingBatch) {
    return next(new AppError("A batch with this name already exists", 400));
  }

  const batch = await Batch.create({ name, startDate, endDate });

  res.status(201).json({
    status: "success",
    data: {
      batch,
    },
  });
});

exports.updateBatch = catchAsync(async (req, res, next) => {
  const batch = await Batch.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!batch) {
    return next(new AppError("No batch found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      batch,
    },
  });
});

exports.getAllBatches = catchAsync(async (req, res, next) => {
  const batches = await Batch.find();

  res.status(200).json({
    status: "success",
    results: batches.length,
    data: {
      batches,
    },
  });
});

exports.getBatchById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const batch = await Batch.findById(id);

  if (!batch) {
    return next(new AppError("No batch found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      batch,
    },
  });
});

exports.assignToBatch = catchAsync(async (req, res, next) => {
  const { userId, batchId } = req.body;

  // Find batch and check capacity
  const batch = await Batch.findById(batchId);
  if (!batch) {
    return next(new AppError("No batch found with that ID", 404));
  }

  // Assign user to batch
  const user = await User.findByIdAndUpdate(
    userId,
    { batch: batchId },
    { new: true, runValidators: true }
  );

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.removeFromBatch = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.userId,
    { batch: null },
    { new: true, runValidators: true }
  );

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.deleteBatch = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Check if the batch exists
  const batch = await Batch.findById(id);

  if (!batch) {
    return next(new AppError("No batch found with that ID", 404));
  }

  // Delete the batch
  await Batch.findByIdAndDelete(id);

  res.status(204).json({
    status: "success",
    message: "Batch deleted successfully",
  });
});

exports.getInternsByBatch = catchAsync(async (req, res, next) => {
  // Check if user is admin (optional, can be removed based on your requirements)
  if (req.user.role !== "admin") {
    return next(new AppError("Only admins can view the interns list", 403));
  }

  const { batchId } = req.params;

  // Find all interns in the provided batch
  const interns = await User.find({ batch: batchId, role: "intern" })
    .select("name email batch") // Select the relevant fields
    .populate("batch", "name"); // Optionally, populate the batch name if needed

  if (!interns || interns.length === 0) {
    return next(new AppError("No interns found for this batch", 404));
  }

  res.status(200).json({
    status: "success",
    results: interns.length,
    data: {
      interns,
    },
  });
});
