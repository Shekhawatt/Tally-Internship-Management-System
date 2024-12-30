// src/components/AddProject.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../../services/apiService"; // Import the API service to interact with backend

const AddProject = () => {
  const navigate = useNavigate();

  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData({
      ...projectData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset error

    try {
      await apiService.createProject(projectData); // No need for response here
      navigate("/admin/projects"); // Navigate to projects page after creation
    } catch (err) {
      setError("Failed to create project. Please try again.");
      console.error(err); // Log error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create a New Project</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Project Name</label>
          <input
            type="text"
            name="name"
            value={projectData.name}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Project Description</label>
          <textarea
            name="description"
            value={projectData.description}
            onChange={handleChange}
            required
            style={styles.textarea}
          />
        </div>
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Creating Project..." : "Create Project"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#f4f7fc",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    maxWidth: "600px",
    margin: "0 auto",
  },
  title: {
    fontSize: "24px",
    color: "#333",
    marginBottom: "20px",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginBottom: "15px",
  },
  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "16px",
    color: "#555",
  },
  input: {
    padding: "10px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    outline: "none",
    transition: "border-color 0.3s",
  },
  textarea: {
    padding: "10px",
    fontSize: "14px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    outline: "none",
    resize: "vertical",
    minHeight: "100px",
    transition: "border-color 0.3s",
  },
  button: {
    padding: "12px 20px",
    fontSize: "16px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default AddProject;
