const express = require("express");
const router = express.Router();
const internController = require("../controllers/internController");
const { protect, restrictTo } = require("./../controllers/authController");

// Routes
router.post("/", protect, restrictTo("admin"), internController.addIntern);
router.delete(
  "/:id",
  protect,
  restrictTo("admin"),
  internController.deleteIntern
);
router.patch(
  "/:id",
  protect,
  restrictTo("admin"),
  internController.updateIntern
);

module.exports = router;
