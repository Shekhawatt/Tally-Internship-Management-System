import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiService from "../../services/apiService";
import Select from "react-select"; // Import react-select

const EditDemoPage = () => {
  const { demoId } = useParams();
  const navigate = useNavigate();
  const [demo, setDemo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [teams, setTeams] = useState([]);
  const [guides, setGuides] = useState([]);
  const [scheduledTeams, setScheduledTeams] = useState([]);
  const [formData, setFormData] = useState({
    Title: "",
    Description: "",
    team: "",
    pannel: [],
    startDateTime: "",
    endDateTime: "",
  });

  useEffect(() => {
    const fetchDemoAndTeams = async () => {
      try {
        const demoData = await apiService.getDemoById(demoId);
        setDemo(demoData.data);

        const formatDate = (date) => {
          if (!date) return "";
          const newDate = new Date(date);
          return newDate.toISOString().slice(0, 16);
        };

        setFormData({
          Title: demoData.data.Title || "",
          Description: demoData.data.team.project.description || "",
          team: demoData.data.team?._id || "",
          pannel: demoData.data.pannel?.map((p) => p._id) || [],
          startDateTime: formatDate(demoData.data.startDateTime),
          endDateTime: formatDate(demoData.data.endDateTime),
        });

        const teamsData = await apiService.getAllTeams();
        setTeams(teamsData.data.teams || []);

        const guidesData = await apiService.getGuideList();
        setGuides(guidesData);

        const demosData = await apiService.getAllDemos();
        const demoTeams = demosData.data.map((demo) => demo.team._id);
        setScheduledTeams(demoTeams);
      } catch (err) {
        setError("Failed to fetch demo details");
      } finally {
        setLoading(false);
      }
    };

    fetchDemoAndTeams();
  }, [demoId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "team") {
      const selectedTeam = teams.find((team) => team._id === value);
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        Description: selectedTeam ? selectedTeam.project.description : "",
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handlePanelChange = (selectedOptions) => {
    setFormData((prevData) => ({
      ...prevData,
      pannel: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.updateDemo(demoId, formData);
      setSuccessMessage("Demo updated successfully!");
      setTimeout(() => {
        navigate("/admin/demo-management/view-upcoming-demos");
      }, 2000);
    } catch (err) {
      alert("Failed to update demo");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const unscheduledTeams = teams.filter(
    (team) => !scheduledTeams.includes(team._id)
  );

  const getAvailableGuides = (selectedTeamId) => {
    const selectedTeam = teams.find((team) => team._id === selectedTeamId);
    if (selectedTeam) {
      const assignedGuides = selectedTeam.guides.map((guide) => guide._id);
      return guides.filter((guide) => !assignedGuides.includes(guide._id));
    }
    return guides;
  };

  const guideOptions = getAvailableGuides(formData.team).map((guide) => ({
    label: guide.name,
    value: guide._id,
  }));

  const styles = {
    formContainer: {
      maxWidth: "600px",
      margin: "0 auto",
      backgroundColor: "#f9f9f9",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    header: {
      textAlign: "center",
      marginBottom: "20px",
      fontSize: "24px",
      color: "#333",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
    },
    label: {
      fontSize: "14px",
      fontWeight: "bold",
      color: "#555",
      marginBottom: "8px",
    },
    input: {
      padding: "10px",
      fontSize: "14px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      transition: "border 0.3s ease",
    },
    textarea: {
      minHeight: "100px",
      resize: "vertical",
      padding: "10px",
      fontSize: "14px",
      border: "1px solid #ddd",
      borderRadius: "4px",
    },
    select: {
      padding: "10px",
      fontSize: "14px",
      border: "1px solid #ddd",
      borderRadius: "4px",
    },
    submitBtn: {
      padding: "12px 20px",
      fontSize: "16px",
      backgroundColor: "#4a90e2",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    submitBtnHover: {
      backgroundColor: "#357ab7",
    },
    submitBtnActive: {
      backgroundColor: "#285a8f",
    },
    successMessage: {
      color: "green",
      fontSize: "16px",
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: "20px",
    },
  };

  return (
    <div style={styles.formContainer}>
      <h2 style={styles.header}>Edit Demo</h2>
      {successMessage && (
        <div style={styles.successMessage}>{successMessage}</div>
      )}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Title</label>
          <input
            style={styles.input}
            type="text"
            name="Title"
            value={formData.Title}
            onChange={handleChange}
            placeholder="Demo Title"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            style={styles.textarea}
            name="Description"
            value={formData.Description}
            onChange={handleChange}
            placeholder="Demo Description"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Team</label>
          <select
            style={styles.select}
            name="team"
            value={formData.team}
            onChange={handleChange}
          >
            {!formData.team && <option value="">Select a Team</option>}
            {unscheduledTeams.map((team) => (
              <option key={team._id} value={team._id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Panel Members</label>
          <Select
            isMulti
            name="pannel"
            options={guideOptions}
            value={guideOptions.filter((option) =>
              formData.pannel.includes(option.value)
            )}
            onChange={handlePanelChange}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
            placeholder="Select Panel Members"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Start Date & Time</label>
          <input
            style={styles.input}
            type="datetime-local"
            name="startDateTime"
            value={formData.startDateTime}
            onChange={handleChange}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>End Date & Time</label>
          <input
            style={styles.input}
            type="datetime-local"
            name="endDateTime"
            value={formData.endDateTime}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          style={{
            ...styles.submitBtn,
            ...(formData.Title && formData.team ? styles.submitBtnHover : {}),
          }}
          disabled={!formData.Title || !formData.team}
        >
          Update Demo
        </button>
      </form>
    </div>
  );
};

export default EditDemoPage;
