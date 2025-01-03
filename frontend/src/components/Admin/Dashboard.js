import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import apiService from "../../services/apiService";
import UserManagement from "./UserManagement"; // Ensure this import is correct
import ProjectManagement from "./ProjectManagement"; // Ensure this import is correct
import TeamManagement from "./TeamManagement"; // Ensure this import is correct
import BatchManagement from "./BatchManagement"; // Ensure this import is correct
import DemoManagement from "./DemoManagement"; // Ensure this import is correct
import AdminProfile from "./admin-Profile";
import "./Dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUserCircle,
  faUsers,
  faUserTie,
  faTasks,
  faChalkboard,
  faChartBar,
  faCog,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

// Admin Dashboard Component
const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    activeInterns: 0,
    activeGuides: 0,
    upcomingDemos: 0,
    pendingRequests: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiService.getAdminDashboardData();
        setDashboardData({
          activeInterns: response.activeInterns,
          activeGuides: response.activeGuides,
          upcomingDemos: response.upcomingDemos,
          pendingRequests: response.pendingRequests,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/"); // Redirect to login or home
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h2>Admin Dashboard</h2>
        </div>
        <div className="header-right">
          <i className="notification-icon">
            <FontAwesomeIcon icon={faBell} size="lg" />
          </i>
          <i
            className="profile-icon"
            onClick={() => navigate("/admin/profile")}
          >
            <FontAwesomeIcon icon={faUserCircle} size="lg" />
          </i>
        </div>
      </header>

      <div className="dashboard-container">
        <div className="sidebar">
          <ul>
            <li onClick={() => navigate("/admin/user-management")}>
              <FontAwesomeIcon icon={faUsers} /> User Management
            </li>
            <li onClick={() => navigate("/admin/team-management")}>
              <FontAwesomeIcon icon={faUserTie} /> Team Management
            </li>
            <li onClick={() => navigate("/admin/project-management")}>
              <FontAwesomeIcon icon={faTasks} /> Project Management
            </li>
            <li onClick={() => navigate("/admin/demo-management")}>
              <FontAwesomeIcon icon={faChalkboard} /> Demo Management
            </li>
            <li onClick={() => navigate("/admin/batch-management")}>
              <FontAwesomeIcon icon={faChartBar} /> Batch Management
            </li>
            <li onClick={() => navigate("/admin/report-generation")}>
              <FontAwesomeIcon icon={faTasks} /> Report Generation
            </li>
            <li>
              <FontAwesomeIcon icon={faCog} /> Settings
            </li>
            <li onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} /> Logout
            </li>
          </ul>
        </div>

        <div className="dashboard-content">
          <Routes>
            <Route path="/" element={<DashboardHome data={dashboardData} />} />
            <Route path="/user-management/*" element={<UserManagement />} />
            <Route path="/team-management/*" element={<TeamManagement />} />
            <Route
              path="/project-management/*"
              element={<ProjectManagement />}
            />
            <Route path="/profile" element={<AdminProfile />} />
            <Route path="/demo-management/*" element={<DemoManagement />} />
            <Route path="/batch-management/*" element={<BatchManagement />} />
            <Route path="/report-generation" element={<ReportGeneration />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

// Dashboard Home Component
const DashboardHome = ({ data }) => (
  <div className="dashboard-cards">
    <div className="card">
      <h3>Active Interns</h3>
      <p>{data.activeInterns}</p>
    </div>
    <div className="card">
      <h3>Active Guides</h3>
      <p>{data.activeGuides}</p>
    </div>
    <div className="card">
      <h3>Upcoming Demos</h3>
      <p>{data.upcomingDemos}</p>
    </div>
    <div className="card">
      <h3>Pending Requests</h3>
      <p>{data.pendingRequests}</p>
    </div>
  </div>
);

// Individual Page Components with Basic Structure

const ReportGeneration = () => (
  <div>
    <h2>Report Generation</h2>
    <p>Generate and download reports here.</p>
    {/* Add report generation functionalities */}
  </div>
);

export default AdminDashboard;
