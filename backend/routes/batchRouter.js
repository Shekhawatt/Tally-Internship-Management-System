const express = require("express");
const batchController = require("../controllers/batchController");
const authController = require("../controllers/authController");

const router = express.Router();

// Admin-only routes
router.post(
  "/",
  authController.protect,
  authController.restrictTo("admin"),
  batchController.createBatch
);

router.patch(
  "/:id",
  authController.protect,
  authController.restrictTo("admin"),
  batchController.updateBatch
);

router.delete(
  "/:id",
  authController.protect,
  authController.restrictTo("admin"),
  batchController.deleteBatch
);

router.get(
  "/",
  authController.protect,
  authController.restrictTo("admin"),
  batchController.getAllBatches
);

router.get(
  "/:id",
  authController.protect,
  authController.restrictTo("admin"),
  batchController.getBatchById
);

// Batch-user assignment routes
router.post(
  "/assign",
  authController.protect,
  authController.restrictTo("admin"),
  batchController.assignToBatch
);

router.patch(
  "/remove/:userId",
  authController.protect,
  authController.restrictTo("admin"),
  batchController.removeFromBatch
);

router
  .route("/:batchId/interns")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    batchController.getInternsByBatch
  );

module.exports = router;
