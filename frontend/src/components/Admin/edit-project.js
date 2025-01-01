import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiService from "../../services/apiService"; // Importing the API service

const EditProject = () => {
  const [project, setProject] = useState({ name: "", description: "" });
  const [error, setError] = useState(null);
  const [showMessage, setShowMessage] = useState(false); // State to show success message
  const { id } = useParams(); // Get the project ID from the URL
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await apiService.getProjectById(id); // Fetch the project data
        setProject(response.data.project);
      } catch (err) {
        setError("Failed to fetch project.");
        console.error("Error fetching project:", err);
      }
    };

    fetchProject();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await apiService.updateProject(id, project); // Update the project using the API
      setShowMessage(true); // Show success message
      setTimeout(() => {
        navigate("/admin/project-management/view-projects"); // Navigate back to project list after 2 seconds
      }, 2000);
    } catch (err) {
      setError("Failed to update project.");
      console.error("Error updating project:", err);
    }
  };

  // Handle cancel (go back to previous page)
  const handleCancel = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Edit Project</h1>
      {error && <p style={styles.messageError}>{error}</p>}

      {/* Display success message after form submission */}
      {showMessage && (
        <div style={styles.messageContainer}>
          <p style={styles.message}>Project updated successfully!</p>
        </div>
      )}

      {/* Display the form if no message is shown */}
      {!showMessage && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <label htmlFor="name">Project Name</label>
          <input
            type="text"
            id="name"
            value={project.name}
            onChange={(e) => setProject({ ...project, name: e.target.value })}
            style={styles.input}
          />

          <label htmlFor="description">Project Description</label>
          <textarea
            id="description"
            value={project.description}
            onChange={(e) =>
              setProject({ ...project, description: e.target.value })
            }
            style={styles.input}
          ></textarea>

          <div style={styles.actions}>
            <button type="submit" style={styles.submitButton}>
              Save
            </button>
            <button
              type="button"
              style={styles.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: "#f0f4f8",
    minHeight: "100vh",
    maxWidth: "800px",
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    fontSize: "2.5rem",
    color: "#333",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  input: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
  },
  submitButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  messageContainer: {
    backgroundColor: "#28a745",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "20px",
  },
  message: {
    fontSize: "1.2rem",
    textAlign: "center",
    color: "#fff",
  },
  messageError: {
    textAlign: "center",
    fontSize: "1.2rem",
    color: "red",
  },
};

export default EditProject;
