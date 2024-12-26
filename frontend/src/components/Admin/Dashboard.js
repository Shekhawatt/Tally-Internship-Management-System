import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import apiService from "../../services/apiService";
import UserManagement from "./UserManagement"; // Ensure this import is correct
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
          <i className="profile-icon">
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
            <li onClick={() => navigate("/admin/progress-tracking")}>
              <FontAwesomeIcon icon={faChartBar} /> Progress Tracking
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
            <Route path="/team-management" element={<TeamManagement />} />
            <Route path="/project-management" element={<ProjectManagement />} />
            <Route path="/demo-management" element={<DemoManagement />} />
            <Route path="/progress-tracking" element={<ProgressTracking />} />
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

const TeamManagement = () => (
  <div>
    <h2>Team Management</h2>
    <p>Manage teams and their details here.</p>
    {/* Add functionalities for managing teams */}
  </div>
);

const ProjectManagement = () => (
  <div>
    <h2>Project Management</h2>
    <p>View and edit project details here.</p>
    {/* Add functionalities like viewing, editing, adding projects */}
  </div>
);

const DemoManagement = () => (
  <div>
    <h2>Demo Management</h2>
    <p>Organize and schedule demos here.</p>
    {/* Add demo scheduling functionalities */}
  </div>
);

const ProgressTracking = () => (
  <div>
    <h2>Progress Tracking</h2>
    <p>Track the progress of the teams here.</p>
    {/* Add functionalities for tracking team progress */}
  </div>
);

const ReportGeneration = () => (
  <div>
    <h2>Report Generation</h2>
    <p>Generate and download reports here.</p>
    {/* Add report generation functionalities */}
  </div>
);

export default AdminDashboard;
