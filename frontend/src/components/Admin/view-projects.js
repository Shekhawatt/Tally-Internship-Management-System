import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import apiService from "../../services/apiService";
import EditProject from "./edit-project";

const ViewProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the current route is a nested route (edit-project)
  const isInNestedRoute = location.pathname.includes(
    "/admin/project-management/view-projects/"
  );

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await apiService.getAllProjects();
        setProjects(response.data.projects);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch projects.");
        console.error("Error fetching projects:", err);
        setLoading(false);
      }
    };

    fetchProjects();
  }, [location]);

  const handleDelete = async () => {
    if (projectToDelete) {
      try {
        await apiService.deleteProject(projectToDelete);
        setProjects(
          projects.filter((project) => project._id !== projectToDelete)
        );
        setShowConfirmation(false);
        console.log(`Project with id ${projectToDelete} deleted.`);
      } catch (err) {
        setError("Failed to delete project.");
        console.error("Error deleting project:", err);
        setShowConfirmation(false);
      }
    }
  };

  const confirmDelete = (id) => {
    setProjectToDelete(id);
    setShowConfirmation(true);
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
    setProjectToDelete(null);
  };

  const handleEdit = (id) => {
    navigate(`/admin/project-management/view-projects/edit-project/${id}`);
  };

  return (
    <div style={styles.container}>
      {/* Conditionally display project management content based on route */}
      {!isInNestedRoute && (
        <>
          <h1 style={styles.header}>Available Projects</h1>

          {/* Display back button if in nested route */}
          {isInNestedRoute && (
            <button
              style={styles.backButton}
              onClick={() => navigate("/admin/project-management")}
            >
              Back to Project Management
            </button>
          )}

          {loading ? (
            <p style={styles.message}>Loading projects...</p>
          ) : error ? (
            <p style={styles.messageError}>{error}</p>
          ) : projects.length === 0 ? (
            <p style={styles.message}>No projects available.</p>
          ) : (
            <div style={styles.projectGrid}>
              {projects.map((project) => (
                <div key={project._id} style={styles.projectCard}>
                  <h2 style={styles.projectName}>{project.name}</h2>
                  <p style={styles.projectDescription}>{project.description}</p>
                  <div style={styles.actions}>
                    <button
                      style={styles.editButton}
                      onClick={() => handleEdit(project._id)}
                    >
                      Edit
                    </button>
                    <button
                      style={styles.deleteButton}
                      onClick={() => confirmDelete(project._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Confirmation dialog for deleting project */}
          {showConfirmation && (
            <div style={styles.confirmationOverlay}>
              <div style={styles.confirmationDialog}>
                <p>Are you sure you want to delete this project?</p>
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

      {/* Nested route for EditProject */}
      <Routes>
        <Route path="edit-project/:id" element={<EditProject />} />
      </Routes>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: "#f0f4f8",
    minHeight: "100vh",
    maxWidth: "1200px",
    margin: "0 auto",
    maxHeight: "calc(100vh - 40px)",
  },
  header: {
    textAlign: "center",
    fontSize: "2.5rem",
    color: "#333",
    marginBottom: "20px",
    position: "sticky", // This makes the header sticky
    top: "0", // Keep it at the top
    backgroundColor: "#f0f4f8", // Ensure the background matches the page color
    paddingTop: "20px", // Add some padding if needed for spacing
    zIndex: "1", // Ensure it stays on top of other content
  },
  backButton: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "20px",
  },
  message: {
    textAlign: "center",
    fontSize: "1.2rem",
    color: "#666",
  },
  messageError: {
    textAlign: "center",
    fontSize: "1.2rem",
    color: "red",
  },
  projectGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    overflowY: "auto", // Make the project grid scrollable
    maxHeight: "calc(100vh - 200px)", // Adjust for the space occupied by the header
  },
  projectCard: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  projectName: {
    fontSize: "1.5rem",
    color: "#007bff",
    marginBottom: "10px",
  },
  projectDescription: {
    fontSize: "1rem",
    color: "#555",
    marginBottom: "15px",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-start",
    gap: "10px",
  },
  editButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
  },
  confirmationOverlay: {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center", // Centers horizontally
    alignItems: "center", // Centers vertically
  },
  confirmationDialog: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "400px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Optional: add shadow for emphasis
  },
  confirmationActions: {
    display: "flex",
    justifyContent: "space-around",
    gap: "10px", // Adds space between the buttons
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

export default ViewProjects;
