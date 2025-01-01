import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import CreateTeam from "./CreateTeam"; // Component for creating a team
import ViewTeams from "./ViewTeams"; // Component for viewing teams
import "./Dashboard.css"; // Add CSS file for styling

const TeamManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the current location is inside a child route
  const isInNestedRoute = location.pathname !== "/admin/team-management";

  return (
    <div className="team-management">
      {/* Render cards only if we're at the root team-management path */}
      {!isInNestedRoute && (
        <div className="dashboard-cards">
          <div
            className="card"
            onClick={() => navigate("/admin/team-management/create-team")}
          >
            <h3>Create Team</h3>
          </div>
          <div
            className="card"
            onClick={() => navigate("/admin/team-management/view-teams")}
          >
            <h3>View Teams</h3>
          </div>
        </div>
      )}

      <div className="team-management-content">
        <Routes>
          <Route path="/" element={<div></div>} /> {/* Default view */}
          <Route path="/create-team/*" element={<CreateTeam />} />
          <Route path="/view-teams/*" element={<ViewTeams />} />
        </Routes>
      </div>
    </div>
  );
};

export default TeamManagement;
