const express = require("express");
const authController = require("./../controllers/authController");
const internshipRequestController = require("./../controllers/internshipRequestController");

const internshipRequestRouter = express.Router();

// Routes

// Intern Routes
internshipRequestRouter.post(
  "/apply",
  authController.protect,
  authController.restrictTo("temp", "admin"), // Only temp users (students) can apply
  internshipRequestController.applyForInternship
);

// Admin Routes
internshipRequestRouter.patch(
  "/review/:id",
  authController.protect,
  authController.restrictTo("admin"), // Only admin can review requests
  internshipRequestController.reviewInternshipRequest
);

internshipRequestRouter.get(
  "/pending",
  authController.protect,
  authController.restrictTo("admin"), // Only admin can view pending requests
  internshipRequestController.getAllPendingRequests
);

// Export the router
module.exports = internshipRequestRouter;
