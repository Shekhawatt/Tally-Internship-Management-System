import React, { useEffect, useState } from "react";
import apiService from "../../services/apiService"; // Import the apiService

const ManageGuideDetails = () => {
  const [guides, setGuides] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    name: "",
    email: "",
    team: "", // Changed 'department' to 'team'
  });
  const [teamNames, setTeamNames] = useState([]); // State to store team names
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const guidesData = await apiService.getGuideList();
        setGuides(guidesData);
        fetchTeamNames(guidesData); // Fetch team names after fetching guide list
      } catch (error) {
        console.error("Error fetching guides:", error);
      }
    };

    fetchGuides();
  }, []);

  // Function to fetch team names by IDs
  const fetchTeamNames = async (guides) => {
    try {
      const allTeams = [];

      for (const guide of guides) {
        for (const teamId of guide.team) {
          // Check if the team name is already fetched
          if (!allTeams.some((t) => t.id === teamId)) {
            const team = await apiService.getTeamById(teamId);
            allTeams.push({ id: teamId, name: team.data.team.name });
          }
        }
      }

      setTeamNames(allTeams); // Save team names to state
    } catch (err) {
      console.error("Error fetching team details:", err);
    }
  };

  // Function to get the team name by ID
  const getTeamNameById = (teamId) => {
    const team = teamNames.find((t) => t.id === teamId);
    return team ? team.name : "No Team Assigned";
  };

  const handleSelectGuide = (guide) => {
    setSelectedGuide(guide);
    setUpdatedData({
      name: guide.name,
      email: guide.email,
      team:
        guide.team.length > 0 ? guide.team.map(getTeamNameById).join(", ") : "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({ ...updatedData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!updatedData.name || !updatedData.email || !updatedData.team) {
      // Changed 'department' to 'team'
      alert("Please fill in all fields!");
      setLoading(false);
      return;
    }

    try {
      await apiService.updateGuide(`/${selectedGuide._id}`, updatedData);
      setGuides((prevGuides) =>
        prevGuides.map((guide) =>
          guide._id === selectedGuide._id ? { ...guide, ...updatedData } : guide
        )
      );
      setSelectedGuide(null);
      setUpdatedData({ name: "", email: "", team: "" }); // Changed 'department' to 'team'
    } catch (error) {
      console.error("Error updating guide details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.guideContainer}>
      <div style={styles.guidesList}>
        {guides.length > 0 ? (
          guides.map((guide) => (
            <div
              key={guide._id}
              style={styles.guideCard}
              onClick={() => handleSelectGuide(guide)}
            >
              <h3>{guide.name}</h3>
              <p>
                {guide.team.length > 0
                  ? guide.team.map(getTeamNameById).join(", ")
                  : "No Team Assigned"}
              </p>{" "}
              {/* Displaying team names */}
              <p>{guide.email}</p>
            </div>
          ))
        ) : (
          <p>No guides found.</p>
        )}
      </div>

      {selectedGuide && (
        <div style={styles.guideUpdateForm}>
          <h2>Update Guide Details</h2>
          <form onSubmit={handleUpdate}>
            <div style={styles.formGroup}>
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={updatedData.name}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={updatedData.email}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="team">Team:</label>{" "}
              {/* Changed 'department' to 'team' */}
              <input
                type="text"
                id="team"
                name="team"
                value={updatedData.team}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

const styles = {
  guideContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    padding: "20px",
  },
  guidesList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    overflowY: "auto",
    maxHeight: "70vh", // Set the max height for the scrolling section
    marginBottom: "20px",
  },
  guideCard: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    width: "250px",
    cursor: "pointer",
    transition: "transform 0.3s ease",
  },
  guideCardHover: {
    transform: "scale(1.05)",
  },
  guideUpdateForm: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  formGroup: {
    marginBottom: "15px",
  },
  formGroupLabel: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "5px",
    display: "block",
  },
  input: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxSizing: "border-box",
    transition: "border-color 0.3s ease",
  },
  inputFocus: {
    outline: "none",
    borderColor: "#004b87",
    boxShadow: "0 0 8px rgba(0, 75, 135, 0.2)",
  },
  button: {
    backgroundColor: "#004b87",
    color: "#fff",
    padding: "14px",
    fontSize: "18px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    width: "100%",
    boxSizing: "border-box",
    transition: "background-color 0.3s ease",
  },
};

export default ManageGuideDetails;
