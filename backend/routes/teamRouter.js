const express = require("express");
const teamController = require("../controllers/teamController");
const authController = require("../controllers/authController");
const router = express.Router();

// Middleware to restrict access to admins only
const restrictToAdmin = authController.restrictTo("admin");

// Route to add a new team (Admin only)
router
  .route("/")
  .post(authController.protect, restrictToAdmin, teamController.addTeam);

// Route to update team details (Admin only)
router
  .route("/:id")
  .patch(authController.protect, restrictToAdmin, teamController.updateTeam);

// Route to get all teams (Admin only)
router
  .route("/")
  .get(authController.protect, restrictToAdmin, teamController.getAllTeams);

// Route to get a single team by ID (Admin only)
router
  .route("/:id")
  .get(authController.protect, restrictToAdmin, teamController.getTeamById);

// Route to delete a team (Admin only)
router
  .route("/:id")
  .delete(authController.protect, restrictToAdmin, teamController.deleteTeam);

module.exports = router;
