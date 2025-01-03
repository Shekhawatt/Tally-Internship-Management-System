import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import ScheduleDemo from "./ScheduleDemoPage"; // Component for scheduling a demo
import ViewUpcomingDemos from "./ViewUpcomingDemos"; // Component for viewing upcoming demos
import "./Dashboard.css"; // Add CSS file for styling

const DemoManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the current location is inside a child route
  const isInNestedRoute = location.pathname !== "/admin/demo-management";

  return (
    <div className="demo-management">
      {/* Render cards only if we're at the root demo-management path */}
      {!isInNestedRoute && (
        <div className="dashboard-cards">
          <div
            className="card"
            onClick={() => navigate("/admin/demo-management/schedule-demo")}
          >
            <h3>Schedule Demo</h3>
          </div>
          <div
            className="card"
            onClick={() =>
              navigate("/admin/demo-management/view-upcoming-demos")
            }
          >
            <h3>View Upcoming Demos</h3>
          </div>
        </div>
      )}

      <div className="demo-management-content">
        <Routes>
          <Route path="/" element={<div></div>} /> {/* Default view */}
          <Route path="/schedule-demo/*" element={<ScheduleDemo />} />
          <Route
            path="/view-upcoming-demos/*"
            element={<ViewUpcomingDemos />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default DemoManagement;
