import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import ViewGuideList from "./view-guide-list"; // Import the ViewGuideList component
import AddNewGuide from "./add-new-guide"; // Import AddNewGuide component
import EditGuideDetails from "./edit-guide-details"; // Import EditGuideDetails component
import RemoveGuide from "./remove-guide"; // Import RemoveGuide component
import "./Dashboard.css"; // Ensure the same CSS file is used

const GuideManagement = () => {
  const navigate = useNavigate();
  const location = useLocation(); // To check the current path

  // Check if the current location is inside a child route
  const isInNestedRoute =
    location.pathname !== "/admin/user-management/guide-management";

  return (
    <div className="guide-management">
      {/* Render cards only if we're at the root guide-management path */}
      {!isInNestedRoute && (
        <div className="dashboard-cards">
          <div
            className="card"
            onClick={() =>
              navigate(
                "/admin/user-management/guide-management/view-guide-list"
              )
            }
          >
            <h3>View Guide List</h3>
          </div>
          <div
            className="card"
            onClick={() =>
              navigate("/admin/user-management/guide-management/add-new-guide")
            }
          >
            <h3>Add New Guide</h3>
          </div>
          <div
            className="card"
            onClick={() =>
              navigate(
                "/admin/user-management/guide-management/edit-guide-details"
              )
            }
          >
            <h3>Edit Guide Details</h3>
          </div>
          <div
            className="card"
            onClick={() =>
              navigate("/admin/user-management/guide-management/remove-guide")
            }
          >
            <h3>Remove Guide</h3>
          </div>
        </div>
      )}

      <div className="guide-management-content">
        <Routes>
          <Route path="/" element={<div></div>} /> {/* Default view */}
          <Route path="/view-guide-list" element={<ViewGuideList />} />
          <Route path="/add-new-guide" element={<AddNewGuide />} />
          <Route path="/edit-guide-details" element={<EditGuideDetails />} />
          <Route path="/remove-guide" element={<RemoveGuide />} />
        </Routes>
      </div>
    </div>
  );
};

export default GuideManagement;
