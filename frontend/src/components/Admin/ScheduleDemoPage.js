import React, { useState, useEffect } from "react";
import apiService from "../../services/apiService";
import Select from "react-select"; // Import react-select for multi-select

const ScheduleDemo = () => {
  const [formData, setFormData] = useState({
    team: "",
    pannel: [],
    startDateTime: "",
    endDateTime: "",
    Title: "",
    Description: "",
  });

  const [teams, setTeams] = useState([]);
  const [guides, setGuides] = useState([]);
  const [scheduledTeams, setScheduledTeams] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  // Fetch teams, guides, and demos
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all teams
        const fetchedTeams = await apiService.getAllTeams();
        setTeams(fetchedTeams.data.teams);

        // Fetch all guides
        const fetchedGuides = await apiService.getGuideList();
        setGuides(fetchedGuides);

        // Fetch all demos and find scheduled teams
        const fetchedDemos = await apiService.getAllDemos();
        const demoTeams = fetchedDemos.data.map((demo) => demo.team._id);
        setScheduledTeams(demoTeams);

        // Extract time slots from scheduled demos
        const timeSlots = fetchedDemos.data.map((demo) => ({
          start: demo.startDateTime,
          end: demo.endDateTime,
        }));
        setAvailableTimeSlots(timeSlots);
      } catch (err) {
        setError("Failed to fetch data for dropdowns");
      }
    };
    fetchData();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle team selection change to update project description
  const handleTeamChange = (selectedOption) => {
    const selectedTeam = teams.find(
      (team) => team._id === selectedOption.value
    );
    setFormData((prevData) => ({
      ...prevData,
      team: selectedOption.value,
      Description: selectedTeam ? selectedTeam.project.description : "",
    }));
  };

  // Handle panel selection change
  const handlePanelChange = (selectedOptions) => {
    setFormData((prevData) => ({
      ...prevData,
      pannel: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const demoData = {
      ...formData,
      pannel: formData.pannel,
    };

    try {
      const response = await apiService.createDemo(demoData);
      setSuccess("Demo created successfully!");
      console.log("Demo created:", response);
    } catch (error) {
      setError(error.message || "Failed to create demo. Please try again.");
    }
  };

  // Filter teams that are already scheduled for a demo
  const availableTeams = teams.filter(
    (team) => !scheduledTeams.includes(team._id)
  );

  // Get guides that are not part of the selected team
  const getAvailableGuides = (selectedTeamId) => {
    const selectedTeam = teams.find((team) => team._id === selectedTeamId);
    if (selectedTeam) {
      const guidesForSelectedTeam = selectedTeam.guides.map(
        (guide) => guide._id
      );
      return guides.filter(
        (guide) => !guidesForSelectedTeam.includes(guide._id)
      );
    }
    return guides;
  };

  // Handle Date and Time selection
  const handleTimeSlotChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Create Demo</h2>
      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
      )}
      {success && (
        <div style={{ color: "green", marginBottom: "10px" }}>{success}</div>
      )}
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <label style={{ display: "block", marginBottom: "10px" }}>
          Title:
          <input
            type="text"
            name="Title"
            value={formData.Title}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "20px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
        </label>

        {/* Team */}
        <label style={{ display: "block", marginBottom: "10px" }}>
          Team:
          <Select
            name="team"
            options={availableTeams.map((team) => ({
              value: team._id,
              label: team.name,
            }))}
            onChange={handleTeamChange}
            value={{
              value: formData.team,
              label:
                availableTeams.find((team) => team._id === formData.team)
                  ?.name || "",
            }}
            required
            placeholder="Select a team"
            styles={{
              container: (provided) => ({
                ...provided,
                width: "100%",
                marginBottom: "20px",
              }),
              menu: (provided) => ({
                ...provided,
                width: "100%",
              }),
            }}
          />
        </label>

        {/* Description */}
        <label style={{ display: "block", marginBottom: "10px" }}>
          Description:
          <textarea
            name="Description"
            value={formData.Description}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "20px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          ></textarea>
        </label>

        {/* Panel Members */}
        <label style={{ display: "block", marginBottom: "10px" }}>
          Panel Members:
          <Select
            isMulti
            name="pannel"
            options={getAvailableGuides(formData.team).map((guide) => ({
              value: guide._id,
              label: guide.name,
            }))}
            onChange={handlePanelChange}
            value={guides
              .filter((guide) => formData.pannel.includes(guide._id))
              .map((guide) => ({
                value: guide._id,
                label: guide.name,
              }))}
            required
            placeholder="Select panel members"
            styles={{
              container: (provided) => ({
                ...provided,
                width: "100%",
                marginBottom: "20px",
              }),
              menu: (provided) => ({
                ...provided,
                width: "100%",
              }),
            }}
          />
        </label>

        {/* Start Date/Time */}
        <label style={{ display: "block", marginBottom: "10px" }}>
          Start Date/Time:
          <input
            type="datetime-local"
            name="startDateTime"
            value={formData.startDateTime}
            onChange={handleTimeSlotChange}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "20px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
        </label>

        {/* End Date/Time */}
        <label style={{ display: "block", marginBottom: "10px" }}>
          End Date/Time:
          <input
            type="datetime-local"
            name="endDateTime"
            value={formData.endDateTime}
            onChange={handleTimeSlotChange}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "20px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
        </label>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Create Demo
        </button>
      </form>
    </div>
  );
};

export default ScheduleDemo;
