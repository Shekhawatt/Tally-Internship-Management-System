const express = require("express");
const { protect, restrictTo } = require("../controllers/authController");
const {
  createDemo,
  updateDemo,
  deleteDemo,
  getUpcomingDemosForUser,
} = require("../controllers/demoController");

const router = express.Router();

// Protect all routes below
router.use(protect);

// Admin-only routes
router
  .route("/")
  .post(restrictTo("admin"), createDemo) // Admin can create demos
  .patch(restrictTo("admin"), updateDemo); // Admin can update demos

router.route("/:id").delete(restrictTo("admin"), deleteDemo); // Admin can delete demos

// Get upcoming demos for the logged-in user
router.route("/upcoming").get(getUpcomingDemosForUser);

module.exports = router;
