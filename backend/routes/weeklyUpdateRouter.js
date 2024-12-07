const express = require("express");
const weeklyUpdateController = require("../controllers/weeklyUpdateController");
const { protect, restrictTo } = require("./../controllers/authController");

const router = express.Router();

router.post(
  "/",
  protect,
  restrictTo("intern", "admin"),
  weeklyUpdateController.createOrUpdateWeeklyUpdate
);
router.get(
  "/:teamId",
  protect,
  restrictTo("guide", "intern", "admin"),
  weeklyUpdateController.getAllWeeklyUpdates
);
router.get(
  "/update/:id",
  protect,
  restrictTo("guide", "intern", "admin"),
  weeklyUpdateController.getWeeklyUpdate
);

module.exports = router;
