import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import EditProject from "./edit-project";
import DeleteProject from "./delete-project";
import "./Dashboard.css"; // Add appropriate CSS for styling

const ViewProjects = () => {
  const navigate = useNavigate();

  return (
    <div className="view-projects">
      <div className="dashboard-cards">
        <div
          className="card"
          onClick={() =>
            navigate("/admin/project-management/view-projects/edit-project")
          }
        >
          <h3>Edit Project</h3>
        </div>
        <div
          className="card"
          onClick={() =>
            navigate("/admin/project-management/view-projects/delete-project")
          }
        >
          <h3>Delete Project</h3>
        </div>
      </div>

      <div className="view-projects-content">
        <Routes>
          <Route path="/" element={<div></div>} /> {/* Default view */}
          <Route path="/edit-project/*" element={<EditProject />} />
          <Route path="/delete-project/*" element={<DeleteProject />} />
        </Routes>
      </div>
    </div>
  );
};

export default ViewProjects;
