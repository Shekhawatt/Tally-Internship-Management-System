const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// Add a new intern
exports.addIntern = catchAsync(async (req, res, next) => {
  const { name, email, password, batch } = req.body;

  // Create the intern
  const newIntern = await User.create({
    name,
    email,
    password,
    passwordConfirm: password,
    role: "intern",
    batch,
  });

  res.status(201).json({
    status: "success",
    message: "Intern created successfully",
    credentials: {
      email: newIntern.email,
      password: password,
    },
  });
});

// Delete an intern
exports.deleteIntern = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const intern = await User.findByIdAndDelete(id);

  if (!intern) {
    return next(new AppError("Intern not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Intern deleted successfully",
  });
});

// Update intern details
exports.updateIntern = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  const updatedIntern = await User.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  if (!updatedIntern) {
    return next(new AppError("Intern not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Intern details updated successfully",
    data: updatedIntern,
  });
});
