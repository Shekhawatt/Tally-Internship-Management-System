const express = require("express");
const { protect, restrictTo } = require("../controllers/authController");
const {
  createDemo,
  updateDemo,
  deleteDemo,
  getUpcomingDemos,
  getAllUpcomingDemosForAdmin, // New controller for admin
  getDemoById,
} = require("../controllers/demoController");

const router = express.Router();

// Protect all routes below
router.use(protect);

// Admin-only routes
router.route("/").post(restrictTo("admin"), createDemo); // Admin can create demos

router.route("/:id").delete(restrictTo("admin"), deleteDemo); // Admin can delete demos
router.route("/:id").patch(restrictTo("admin"), updateDemo); // Admin can update demos

// Get upcoming demos for the logged-in user
router.route("/upcoming").get(getUpcomingDemos);

// Get demo by ID
router.route("/:id").get(getDemoById); // Added route for fetching demo by ID

// Admin can get all upcoming demos
router.route("/").get(restrictTo("admin"), getAllUpcomingDemosForAdmin);

module.exports = router;
