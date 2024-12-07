const express = require("express");
const feedbackController = require("../controllers/feedbackController");
const { protect, restrictTo } = require("./../controllers/authController");

const router = express.Router();

router.post(
  "/",
  protect,
  restrictTo("guide"),
  feedbackController.createFeedback
);
router.get(
  "/:weeklyUpdateId",
  protect,
  restrictTo("intern", "guide", "admin"),
  feedbackController.getFeedbacksForWeeklyUpdate
);

module.exports = router;
