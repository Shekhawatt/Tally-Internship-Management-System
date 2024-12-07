const express = require("express");
const router = express.Router();
const guideController = require("../controllers/guideController");
const { protect, restrictTo } = require("../controllers/authController");

// Basic CRUD routes
router.get("/", protect, restrictTo("admin"), guideController.getAllGuides);
router.post("/", protect, restrictTo("admin"), guideController.addGuide);
router.patch("/:id", protect, restrictTo("admin"), guideController.updateGuide);
router.delete(
  "/:id",
  protect,
  restrictTo("admin"),
  guideController.deleteGuide
);

// Guide-specific route
router.get(
  "/teams",
  protect,
  restrictTo("guide", "admin"),
  guideController.getTeamsByGuide
);

module.exports = router;
