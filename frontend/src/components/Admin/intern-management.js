import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import ViewInternList from "./view-intern-list"; // Import the ViewInternList component
import ReviewPendingRequests from "./review-pending-request"; // Import ReviewPendingRequests component
import ManageInternDetails from "./manage-intern-details"; // Import ManageInternDetails component
import "./Dashboard.css"; // Ensure the same CSS file is used

const InternManagement = () => {
  const navigate = useNavigate();
  const location = useLocation(); // To check the current path

  // Check if the current location is inside a child route
  const isInNestedRoute =
    location.pathname !== "/admin/user-management/intern-management";

  return (
    <div className="intern-management">
      {/* Render cards only if we're at the root intern-management path */}
      {!isInNestedRoute && (
        <div className="dashboard-cards">
          <div
            className="card"
            onClick={() =>
              navigate(
                "/admin/user-management/intern-management/view-intern-list"
              )
            }
          >
            <h3>View Intern List</h3>
          </div>
          <div
            className="card"
            onClick={() =>
              navigate(
                "/admin/user-management/intern-management/review-pending-requests"
              )
            }
          >
            <h3>Review Pending Requests</h3>
          </div>
          <div
            className="card"
            onClick={() =>
              navigate(
                "/admin/user-management/intern-management/manage-intern-details"
              )
            }
          >
            <h3>Manage Intern Details</h3>
          </div>
        </div>
      )}

      <div className="intern-management-content">
        <Routes>
          <Route path="/" element={<div></div>} /> {/* Default view */}
          <Route path="/view-intern-list" element={<ViewInternList />} />
          <Route
            path="/review-pending-requests"
            element={<ReviewPendingRequests />}
          />
          <Route
            path="/manage-intern-details"
            element={<ManageInternDetails />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default InternManagement;
