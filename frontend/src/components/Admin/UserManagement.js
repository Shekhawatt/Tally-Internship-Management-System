import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import InternManagement from "./intern-management"; // Import InternManagement component
import GuideManagement from "./guide-management"; // Import GuideManagement component
import "./Dashboard.css"; // Add appropriate CSS file for styling

const UserManagement = () => {
  const navigate = useNavigate();
  const location = useLocation(); // To check the current path

  // Check if the current location is inside a child route
  const isInNestedRoute = location.pathname !== "/admin/user-management";

  return (
    <div className="user-management">
      {/* Render cards only if we're at the root user-management path */}
      {!isInNestedRoute && (
        <div className="dashboard-cards">
          <div
            className="card"
            onClick={() => navigate("/admin/user-management/intern-management")}
          >
            <h3>Intern Management</h3>
          </div>
          <div
            className="card"
            onClick={() => navigate("/admin/user-management/guide-management")}
          >
            <h3>Guide Management</h3>
          </div>
        </div>
      )}

      <div className="user-management-content">
        <Routes>
          <Route path="/" element={<div></div>} /> {/* Default view */}
          <Route path="/intern-management/*" element={<InternManagement />} />
          <Route path="/guide-management/*" element={<GuideManagement />} />
        </Routes>
      </div>
    </div>
  );
};

export default UserManagement;
