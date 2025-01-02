import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import CreateBatch from "./CreateBatch"; // Component for creating a batch
import ViewBatches from "./ViewBatches"; // Component for viewing batches
import "./Dashboard.css"; // Add CSS file for styling

const BatchManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the current location is inside a child route
  const isInNestedRoute = location.pathname !== "/admin/batch-management";

  return (
    <div className="batch-management">
      {/* Render cards only if we're at the root batch-management path */}
      {!isInNestedRoute && (
        <div className="dashboard-cards">
          <div
            className="card"
            onClick={() => navigate("/admin/batch-management/create-batch")}
          >
            <h3>Create Batch</h3>
          </div>
          <div
            className="card"
            onClick={() => navigate("/admin/batch-management/view-batches")}
          >
            <h3>View Batches</h3>
          </div>
        </div>
      )}

      <div className="batch-management-content">
        <Routes>
          <Route path="/" element={<div></div>} /> {/* Default view */}
          <Route path="/create-batch/*" element={<CreateBatch />} />
          <Route path="/view-batches/*" element={<ViewBatches />} />
        </Routes>
      </div>
    </div>
  );
};

export default BatchManagement;
