import React, { useState, useEffect } from "react";
import apiService from "../../services/apiService";
import { useNavigate } from "react-router-dom";

const EditProject = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
  });

  // Fetch all projects
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.getAllProjects();
        if (response && response.projects) {
          setProjects(response.projects); // Ensure response.projects exists
        } else {
          setError("No projects found.");
        }
      } catch (err) {
        console.error("Error fetching projects:", err.message);
        setError("Failed to load projects.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Handle project selection
  const handleSelectProject = async (projectId) => {
    setIsLoading(true);
    try {
      const response = await apiService.getProjectById(projectId);
      if (response && response.project) {
        setSelectedProject(response.project);
        setProjectData(response.project);
      } else {
        setError("Failed to load project details.");
      }
    } catch (err) {
      console.error("Error fetching project details:", err.message);
      setError("Failed to load project details.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle project update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await apiService.updateProject(selectedProject._id, projectData);
      navigate("/admin/project-management/view-projects");
    } catch (err) {
      console.error("Error updating project:", err.message);
      setError("Failed to update project.");
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    container: { padding: "20px", fontFamily: "Arial, sans-serif" },
    projectList: { marginBottom: "20px" },
    projectCard: {
      padding: "10px",
      margin: "10px 0",
      border: "1px solid #ccc",
      borderRadius: "5px",
      cursor: "pointer",
    },
    formGroup: { marginBottom: "15px" },
    label: { display: "block", marginBottom: "5px", fontWeight: "bold" },
    input: {
      width: "100%",
      padding: "8px",
      borderRadius: "4px",
      border: "1px solid #ccc",
    },
    button: {
      padding: "10px 20px",
      backgroundColor: "#4CAF50",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    error: { color: "red", marginBottom: "10px" },
  };

  return (
    <div style={styles.container}>
      <h2>Edit Project</h2>

      {isLoading && <p>Loading...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {/* Show the project list if no project is selected */}
      {!selectedProject && (
        <div style={styles.projectList}>
          <h3>Available Projects</h3>
          {projects.length > 0 ? (
            projects.map((project) => (
              <div
                key={project._id}
                style={styles.projectCard}
                onClick={() => handleSelectProject(project._id)}
              >
                {project.name}
              </div>
            ))
          ) : (
            <p>No projects available.</p>
          )}
        </div>
      )}

      {/* Show the form if a project is selected */}
      {selectedProject && (
        <form onSubmit={handleUpdate}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="name">
              Project Name
            </label>
            <input
              style={styles.input}
              type="text"
              id="name"
              name="name"
              value={projectData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="description">
              Description
            </label>
            <textarea
              style={styles.input}
              id="description"
              name="description"
              value={projectData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button style={styles.button} type="submit">
            Update Project
          </button>
        </form>
      )}
    </div>
  );
};

export default EditProject;
