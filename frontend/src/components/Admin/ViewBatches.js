import React, { useEffect, useState } from "react";
import { useNavigate, Routes, Route, useLocation } from "react-router-dom";
import apiService from "../../services/apiService";
import EditBatch from "./EditBatch";
import InternsByBatch from "./InternsByBatch";

const ViewBatches = () => {
  const [batches, setBatches] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isInNestedRoute = location.pathname.includes(
    "/admin/batch-management/view-batches/"
  );

  useEffect(() => {
    fetchBatches();
  }, [location]);

  const fetchBatches = async () => {
    try {
      const response = await apiService.getAllBatches();
      setBatches(response.data.batches);
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-GB", options); // Formats as "2 January 2025"
  };

  const confirmDelete = (id) => {
    setBatchToDelete(id);
    setShowConfirmation(true);
  };

  const handleDelete = async () => {
    if (batchToDelete) {
      try {
        await apiService.deleteBatch(batchToDelete);
        setBatches(batches.filter((batch) => batch._id !== batchToDelete));
        setShowConfirmation(false);
        setBatchToDelete(null);
      } catch (error) {
        console.error("Error deleting batch:", error);
        setShowConfirmation(false);
      }
    }
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
    setBatchToDelete(null);
  };

  const handleEdit = (id) => {
    navigate(`/admin/batch-management/view-batches/edit-batch/${id}`);
  };

  const handleViewInterns = (id) => {
    navigate(`/admin/batch-management/view-batches/interns/${id}`);
  };

  return (
    <div style={styles.container}>
      {!isInNestedRoute && (
        <>
          <h2 style={styles.title}>Batches</h2>
          <div style={styles.batchesList}>
            {batches.map((batch) => (
              <div
                key={batch._id}
                style={styles.batchCard}
                onClick={() => handleViewInterns(batch._id)}
              >
                <div style={styles.cardDetails}>
                  <h3>{batch.name}</h3>
                  <p>
                    <strong>Start Date:</strong> {formatDate(batch.startDate)}
                  </p>
                  <p>
                    <strong>End Date:</strong> {formatDate(batch.endDate)}
                  </p>
                </div>
                <div
                  style={styles.cardActions}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    style={{ ...styles.button, ...styles.editButton }}
                    onClick={() => handleEdit(batch._id)}
                  >
                    Edit
                  </button>
                  <button
                    style={{ ...styles.button, ...styles.deleteButton }}
                    onClick={() => confirmDelete(batch._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {showConfirmation && (
            <div style={styles.confirmationOverlay}>
              <div style={styles.confirmationDialog}>
                <p>Are you sure you want to delete this batch?</p>
                <div style={styles.confirmationActions}>
                  <button style={styles.confirmButton} onClick={handleDelete}>
                    Confirm
                  </button>
                  <button style={styles.cancelButton} onClick={cancelDelete}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <Routes>
        <Route path="edit-batch/:id" element={<EditBatch />} />
        <Route path="interns/:id" element={<InternsByBatch />} />
      </Routes>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  batchesList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    maxHeight: "400px",
    overflowY: "auto",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f5f5f5",
  },
  batchCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
  },
  cardDetails: {
    flex: 1,
    textAlign: "left",
  },
  cardActions: {
    display: "flex",
    gap: "8px",
  },
  button: {
    padding: "5px 10px",
    fontSize: "15px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  editButton: {
    backgroundColor: "#2196F3",
    color: "white",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    color: "white",
  },
  confirmationOverlay: {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmationDialog: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "400px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  confirmationActions: {
    display: "flex",
    justifyContent: "space-around",
    gap: "10px",
  },
  confirmButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
  },
};

export default ViewBatches;
