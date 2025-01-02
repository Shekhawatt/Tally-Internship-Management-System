import React, { useEffect, useState } from "react";
import { useNavigate, Routes, Route, useLocation } from "react-router-dom";
import apiService from "../../services/apiService"; // Importing the API service
import EditTeam from "./EditTeam"; // Importing the EditTeam component (this would be the form for editing the team)

const ViewTeams = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the current route is a nested route (edit-team)
  const isInNestedRoute = location.pathname.includes(
    "/admin/team-management/view-teams/"
  );

  useEffect(() => {
    fetchTeams();
  }, [location]);

  const fetchTeams = async () => {
    try {
      const response = await apiService.getAllTeams();
      setTeams(response.data.teams);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const confirmDelete = (id) => {
    setTeamToDelete(id);
    setShowConfirmation(true);
  };

  const handleDelete = async () => {
    if (teamToDelete) {
      try {
        await apiService.deleteTeam(teamToDelete);
        setTeams(teams.filter((team) => team._id !== teamToDelete));
        setShowConfirmation(false);
        setTeamToDelete(null);
      } catch (error) {
        console.error("Error deleting team:", error);
        setShowConfirmation(false);
      }
    }
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
    setTeamToDelete(null);
  };

  const handleEdit = (id) => {
    navigate(`/admin/team-management/view-teams/edit-team/${id}`);
  };

  return (
    <div style={styles.container}>
      {!isInNestedRoute && (
        <>
          <h2 style={styles.title}>Teams</h2>
          <div style={styles.teamsList}>
            {teams.map((team) => (
              <div key={team._id} style={styles.teamCard}>
                <div style={styles.cardDetails}>
                  <h3>{team.name}</h3>
                  <p>
                    <strong>Members:</strong>{" "}
                    {team.members.map((m) => m.name).join(", ")}
                  </p>
                  <p>
                    <strong>Guides:</strong>{" "}
                    {team.guides?.map((g) => g.name).join(", ")}
                  </p>
                </div>
                <div style={styles.cardActions}>
                  <button
                    style={{ ...styles.button, ...styles.editButton }}
                    onClick={() => handleEdit(team._id)}
                  >
                    Edit
                  </button>
                  <button
                    style={{ ...styles.button, ...styles.deleteButton }}
                    onClick={() => confirmDelete(team._id)}
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
                <p>Are you sure you want to delete this team?</p>
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

      {/* Nested route for EditTeam */}
      <Routes>
        <Route path="edit-team/:id" element={<EditTeam />} />
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
  teamsList: {
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
  teamCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  cardDetails: {
    flex: 1,
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

export default ViewTeams;
