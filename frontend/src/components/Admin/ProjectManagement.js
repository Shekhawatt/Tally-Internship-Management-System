import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import AddProject from "./add-project"; // New component for adding projects
import ViewProjects from "./view-projects"; // New component for viewing projects
import "./Dashboard.css"; // Add appropriate CSS file for styling

const ProjectManagement = () => {
  const navigate = useNavigate();
  const location = useLocation(); // To check the current path

  // Check if the current location is inside a child route
  const isInNestedRoute = location.pathname !== "/admin/project-management";

  return (
    <div className="project-management">
      {/* Render cards only if we're at the root project-management path */}
      {!isInNestedRoute && (
        <div className="dashboard-cards">
          <div
            className="card"
            onClick={() => navigate("/admin/project-management/add-project")}
          >
            <h3>Add New Project</h3>
          </div>
          <div
            className="card"
            onClick={() => navigate("/admin/project-management/view-projects")}
          >
            <h3>View Projects</h3>
          </div>
        </div>
      )}

      <div className="project-management-content">
        <Routes>
          <Route path="/" element={<div></div>} /> {/* Default view */}
          <Route path="/add-project/*" element={<AddProject />} />
          <Route path="/view-projects/*" element={<ViewProjects />} />
        </Routes>
      </div>
    </div>
  );
};

export default ProjectManagement;
