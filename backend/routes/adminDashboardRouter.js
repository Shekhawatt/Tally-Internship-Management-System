const express = require("express");
const adminDashboardController = require("../controllers/adminDashboardController");

const router = express.Router();

// Route for fetching dashboard data
router.get("/dashboard-data", adminDashboardController.getAdminDashboardData);

module.exports = router;
