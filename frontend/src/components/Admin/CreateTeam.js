import React, { useState, useEffect } from "react";
import apiService from "../../services/apiService";
import Select from "react-select"; // Importing react-select for multi-select

const CreateTeam = () => {
  const [interns, setInterns] = useState([]);
  const [guides, setGuides] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedInterns, setSelectedInterns] = useState([]);
  const [selectedGuides, setSelectedGuides] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [teamName, setTeamName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const internsData = await apiService.getInternList();
        const guidesData = await apiService.getGuideList();
        const projectsData = await apiService.getAllProjects();

        // Filter interns to include only those whose 'team' field is null or empty
        const availableInterns = internsData.filter(
          (intern) => !intern.team || intern.team.length === 0
        );

        // Extract the projects array from the response
        const projectsArray = projectsData.data.projects;

        setInterns(availableInterns);
        setGuides(guidesData);
        setProjects(projectsArray);
      } catch (error) {
        setError("Failed to fetch data.");
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (
      !teamName ||
      !selectedInterns.length ||
      !selectedGuides.length ||
      !selectedProject
    ) {
      setError("All fields are required.");
      return;
    }

    try {
      const teamData = {
        name: teamName,
        members: selectedInterns,
        guides: selectedGuides,
        project: selectedProject,
      };

      console.log("Team data to be sent:", teamData);

      await apiService.addTeam(teamData);
      setSuccess("Team created successfully!");
      setError("");
      setTeamName("");
      setSelectedInterns([]);
      setSelectedGuides([]);
      setSelectedProject("");
    } catch (error) {
      setError("Failed to create team.");
    }
  };

  const handleInternSelect = (selectedOptions) => {
    setSelectedInterns(
      selectedOptions ? selectedOptions.map((option) => option.value) : []
    );
  };

  const handleGuideSelect = (selectedOptions) => {
    setSelectedGuides(
      selectedOptions ? selectedOptions.map((option) => option.value) : []
    );
  };

  const styles = {
    container: {
      maxWidth: "600px",
      margin: "0 auto",
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",
    },
    title: {
      textAlign: "center",
      marginBottom: "20px",
    },
    formGroup: {
      marginBottom: "15px",
    },
    label: {
      display: "block",
      fontWeight: "bold",
      marginBottom: "5px",
    },
    input: {
      width: "100%",
      padding: "8px",
      margin: "5px 0",
      border: "1px solid #ccc",
      borderRadius: "4px",
    },
    select: {
      width: "100%",
      padding: "8px",
      margin: "5px 0",
      border: "1px solid #ccc",
      borderRadius: "4px",
    },
    multiSelect: {
      height: "120px",
    },
    error: {
      color: "red",
      fontSize: "14px",
      marginBottom: "10px",
    },
    success: {
      color: "green",
      fontSize: "14px",
      marginBottom: "10px",
    },
    button: {
      display: "block",
      width: "100%",
      padding: "10px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    buttonHover: {
      backgroundColor: "#0056b3",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create Team</h2>
      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}

      <div style={styles.formGroup}>
        <label style={styles.label}>Team Name:</label>
        <input
          type="text"
          style={styles.input}
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Enter team name"
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Select Interns:</label>
        <Select
          isMulti
          name="interns"
          options={interns.map((intern) => ({
            value: intern._id,
            label: intern.name,
          }))}
          onChange={handleInternSelect}
          value={interns
            .filter((intern) => selectedInterns.includes(intern._id))
            .map((intern) => ({
              value: intern._id,
              label: intern.name,
            }))}
          placeholder="Select interns"
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Select Guides:</label>
        <Select
          isMulti
          name="guides"
          options={guides.map((guide) => ({
            value: guide._id,
            label: guide.name,
          }))}
          onChange={handleGuideSelect}
          value={guides
            .filter((guide) => selectedGuides.includes(guide._id))
            .map((guide) => ({
              value: guide._id,
              label: guide.name,
            }))}
          placeholder="Select guides"
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Select Project:</label>
        <select
          style={styles.select}
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="">--Select Project--</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleSubmit} style={styles.button}>
        Create Team
      </button>
    </div>
  );
};

export default CreateTeam;
