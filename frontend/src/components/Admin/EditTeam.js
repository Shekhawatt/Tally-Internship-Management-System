import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiService from "../../services/apiService";
import Select from "react-select";

const EditTeam = () => {
  const [interns, setInterns] = useState([]);
  const [guides, setGuides] = useState([]);
  const [projects, setProjects] = useState([]);
  const [team, setTeam] = useState({
    name: "",
    members: [],
    guides: [],
    project: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch team data
        const response = await apiService.getTeamById(id);
        const teamData = response.data.team;
        setTeam({
          name: teamData.name,
          members: teamData.members.map((m) => ({
            value: m._id,
            label: m.name,
          })),
          guides: teamData.guides.map((g) => ({
            value: g._id,
            label: g.name,
          })),
          project: teamData.project ? teamData.project._id : "",
        });

        // Fetch available interns, guides, and projects
        const internsData = await apiService.getInternList();
        const guidesData = await apiService.getGuideList();
        const projectsData = await apiService.getAllProjects();

        // Filter available interns and guides
        const availableInterns = internsData
          .filter(
            (intern) =>
              !intern.team ||
              intern.team.length === 0 ||
              intern.team.includes(id) // Include if already in this team
          )
          .map((intern) => ({ value: intern._id, label: intern.name }));

        const availableGuides = guidesData
          .filter((guide) => !teamData.guides.some((g) => g._id === guide._id))
          .map((guide) => ({ value: guide._id, label: guide.name }));

        setInterns(availableInterns);
        setGuides(availableGuides);
        setProjects(projectsData.data.projects);
      } catch (err) {
        setError("Failed to fetch data.");
        console.error("Error fetching team or users:", err);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    if (
      !team.name ||
      !team.members.length ||
      !team.guides.length ||
      !team.project
    ) {
      setError("All fields are required.");
      return;
    }

    // Prepare team data
    const updatedTeam = {
      name: team.name,
      members: team.members.map((m) => m.value), // Extract IDs
      guides: team.guides.map((g) => g.value),
      project: team.project,
    };

    console.log("Updated team data:", updatedTeam);

    try {
      await apiService.updateTeam(id, updatedTeam);
      setSuccess("Team updated successfully!");
      setError(null);
      setTimeout(() => {
        navigate("/admin/team-management/view-teams");
      }, 2000);
    } catch (err) {
      setError("Failed to update team.");
      console.error(
        "Error updating team:",
        err.response ? err.response.data : err
      );
    }
  };

  const handleInternSelect = (selectedOptions) => {
    setTeam({
      ...team,
      members: selectedOptions || [],
    });
  };

  const handleGuideSelect = (selectedOptions) => {
    setTeam({
      ...team,
      guides: selectedOptions || [],
    });
  };

  const handleProjectSelect = (e) => {
    setTeam({
      ...team,
      project: e.target.value,
    });
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
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Edit Team</h2>
      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}

      <div style={styles.formGroup}>
        <label style={styles.label}>Team Name:</label>
        <input
          type="text"
          style={styles.input}
          value={team.name}
          onChange={(e) => setTeam({ ...team, name: e.target.value })}
          placeholder="Enter team name"
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Select Interns:</label>
        <Select
          isMulti
          name="interns"
          options={interns}
          onChange={handleInternSelect}
          value={team.members}
          placeholder="Select interns"
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Select Guides:</label>
        <Select
          isMulti
          name="guides"
          options={guides}
          onChange={handleGuideSelect}
          value={team.guides}
          placeholder="Select guides"
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Select Project:</label>
        <select
          style={styles.select}
          value={team.project}
          onChange={handleProjectSelect}
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
        Update Team
      </button>
    </div>
  );
};

export default EditTeam;
