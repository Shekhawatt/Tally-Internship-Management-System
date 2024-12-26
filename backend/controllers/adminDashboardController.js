const Demo = require("../models/demoModel");
const User = require("../models/userModel");
const InternshipRequest = require("../models/internshipRequestModel");

// Controller to fetch admin dashboard data
exports.getAdminDashboardData = async (req, res) => {
  try {
    // Count active interns
    const activeInterns = await User.countDocuments({
      role: "intern",
      // team: { $ne: null },
    });

    // Count active guides
    const activeGuides = await User.countDocuments({ role: "guide" });

    // Count upcoming demos
    const currentDate = new Date();
    const upcomingDemos = await Demo.countDocuments({
      startDateTime: { $gte: currentDate },
    });

    // Count pending internship requests
    const pendingRequests = await InternshipRequest.countDocuments({
      status: "pending",
    });

    // Respond with the data
    res.status(200).json({
      activeInterns,
      activeGuides,
      upcomingDemos,
      pendingRequests,
    });
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    res.status(500).json({ message: "Failed to fetch dashboard data", error });
  }
};
