const userModel = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");

//GetAllUsers Route
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await userModel.find();
  res.status(200).json({
    status: "success",

    users,
  });
});

// Function to filter the allowed keys from the object
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  // Loop through all the keys of the object
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el]; // If the key is allowed, add it to the new object
    }
  });

  return newObj;
};
exports.update = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // 2) Filter out unwanted field names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email", "role"); // Include 'name' and 'email'

  // 3) Update user document
  const updatedUser = await userModel.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    {
      new: true,
      runValidators: true, // Ensures validation is applied to updated fields
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const id = req.params.id || req.user._id;
  const user = await userModel.findById(id);
  res.status(200).json({
    status: "success",
    user,
  });
});
