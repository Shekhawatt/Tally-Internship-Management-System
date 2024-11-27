const express = require("express");
const projectController = require("./../controllers/projectController");
const authController = require("./../controllers/authController");

const router = express.Router();

// Protect routes with authentication (optional, can be adjusted based on requirements)
router.use(authController.protect);

// Route to create a new project
router.post(
  "/create",
  authController.restrictTo("admin"),
  projectController.createProject
);

// Route to update an existing project
router.patch(
  "/:id",
  authController.restrictTo("admin"),
  projectController.updateProject
);

// Route to get all projects
router.get(
  "/",
  authController.restrictTo("admin"),
  projectController.getAllProjects
);

// Route to get a project by ID
router.get(
  "/:id",
  authController.restrictTo("admin"),
  projectController.getProjectById
);

// Route to delete a project
router.delete(
  "/:id",
  authController.restrictTo("admin"),
  projectController.deleteProject
);

module.exports = router;
