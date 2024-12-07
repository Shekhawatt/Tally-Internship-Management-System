const express = require("express");
const milestoneController = require("../controllers/milestoneController");
const { protect } = require("./../controllers/authController");

const router = express.Router();

// Milestone routes
router.use(protect);
router.post("/add", milestoneController.addMilestone);
router.patch("/edit/:milestoneId", milestoneController.editMilestone);
router.delete("/delete/:milestoneId", milestoneController.deleteMilestone);
router.get("/team/:teamId", milestoneController.getMilestonesByTeam);

// Subtask routes
router.post("/:milestoneId/subtask/add", milestoneController.addSubtask);
router.patch(
  "/:milestoneId/subtask/complete/:subtaskId",
  milestoneController.markSubtaskComplete
);

module.exports = router;
