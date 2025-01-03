import React, { useState, useEffect } from "react";
import {
  useNavigate,
  useLocation,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import apiService from "../../services/apiService";
import EditDemoPage from "./EditDemoPage"; // Import the EditDemoPage

const ViewUpcomingDemos = () => {
  const [demos, setDemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] =
    useState(false);
  const [demoToDelete, setDemoToDelete] = useState(null); // Track the demo to be deleted
  const location = useLocation(); // Hook to get the current location
  const { demoId } = useParams(); // Get demoId from the URL params if available
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchDemos = async () => {
      try {
        const response = await apiService.getAllDemos();
        console.log(response.data); // Log the response to check its structure
        setDemos(response.data); // Assuming 'data' contains your demos
      } catch (error) {
        setError("Failed to fetch demos");
      } finally {
        setLoading(false);
      }
    };

    fetchDemos();
  }, [location]);

  const styles = {
    container: {
      padding: "40px 20px",
      fontFamily: "'Roboto', sans-serif",
      backgroundColor: "#f4f4f9",
      minHeight: "100vh",
    },
    loader: {
      fontSize: "18px",
      textAlign: "center",
      color: "#007bff",
      marginTop: "20px",
    },
    errorMessage: {
      fontSize: "18px",
      textAlign: "center",
      color: "#e74c3c",
      marginTop: "20px",
    },
    noDemosMessage: {
      fontSize: "18px",
      textAlign: "center",
      color: "#555",
      marginTop: "20px",
    },
    upcomingDemosHeading: {
      textAlign: "center",
      fontSize: "32px", // Increased font size
      fontWeight: "600",
      color: "#333", // Darker color for better readability
      marginBottom: "40px",
    },
    demosList: {
      display: "flex",
      flexDirection: "column", // Cards will now be stacked vertically, one card per row
      gap: "30px", // Space between the cards
      justifyContent: "center", // Center the cards
      padding: "10px",
    },
    demoCard: {
      backgroundColor: "#fff",
      padding: "30px",
      borderRadius: "12px",
      border: "1px solid #ddd",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      cursor: "pointer",
      marginBottom: "20px", // Margin at the bottom to space out the cards
      width: "100%", // Make sure cards take full width of their container
      position: "relative", // Positioning context for the delete button
    },
    demoCardHover: {
      transform: "translateY(-8px)",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
    },
    demoTitle: {
      fontSize: "26px", // Increased font size for title
      fontWeight: "600",
      color: "#333", // Darker color
      marginBottom: "15px",
    },
    demoDescription: {
      fontSize: "18px", // Increased font size for better readability
      color: "#444", // Slightly darker color for description
      marginBottom: "15px",
      lineHeight: "1.6", // Increased line height for readability
    },
    demoDate: {
      fontSize: "16px",
      color: "#888", // Lighter color for date
      marginBottom: "15px",
    },
    sectionTitle: {
      fontSize: "20px", // Slightly larger font for section titles
      fontWeight: "500",
      marginBottom: "10px",
      color: "#333",
    },
    listItem: {
      fontSize: "16px", // Adjusted size for list items
      color: "#555", // Slightly darker color
      marginBottom: "8px",
    },
    noContent: {
      color: "#aaa",
      fontStyle: "italic",
    },
    projectDescriptionLabel: {
      fontSize: "20px", // Increased font size for label
      fontWeight: "500",
      color: "#333", // Dark color for contrast
      marginBottom: "8px",
    },
    deleteButton: {
      backgroundColor: "#e74c3c",
      color: "#fff",
      //padding: "6px 12px", // Reduced padding to make the button smaller
      borderRadius: "4px",
      border: "none",
      cursor: "pointer",
      position: "absolute", // Fix the delete button at the bottom-right corner
      bottom: "15px",
      right: "15px",
      fontSize: "15px",
      width: "auto", // Ensure button doesn't cover the entire width
      height: "auto", // Ensure height auto adjusts to content
    },
    modalBackdrop: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    },
    modalTitle: {
      fontSize: "20px",
      fontWeight: "600",
    },
    modalActions: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "20px",
      gap: "10px",
    },
    confirmButton: {
      backgroundColor: "#e74c3c",
      color: "#fff",
      padding: "10px 20px",
      borderRadius: "4px",
      border: "none",
      cursor: "pointer",
    },
    cancelButton: {
      backgroundColor: "#95a5a6",
      color: "#fff",
      padding: "10px 20px",
      borderRadius: "4px",
      border: "none",
      cursor: "pointer",
    },
  };

  const handleCardClick = (demoId) => {
    // Prevent navigation here
    navigate(`/admin/demo-management/view-upcoming-demos/${demoId}`);
  };

  // Handle Delete Button Click
  const handleDeleteClick = (demo) => {
    setDemoToDelete(demo);
    setIsDeleteConfirmationVisible(true);
  };

  // Confirm the delete action
  const handleDeleteConfirm = async () => {
    try {
      await apiService.deleteDemo(demoToDelete._id);
      setDemos(demos.filter((demo) => demo._id !== demoToDelete._id));
      setIsDeleteConfirmationVisible(false);
      setDemoToDelete(null);
    } catch (error) {
      console.error("Error deleting demo:", error);
      setError("Failed to delete demo");
    }
  };

  // Cancel the delete action
  const handleDeleteCancel = () => {
    setIsDeleteConfirmationVisible(false);
    setDemoToDelete(null);
  };

  const isInNestedRoute =
    location.pathname !== "/admin/demo-management/view-upcoming-demos";

  return (
    <div style={styles.container}>
      {loading && <div style={styles.loader}>Loading...</div>}
      {error && <div style={styles.errorMessage}>{error}</div>}

      {!loading && !error && demos.length === 0 && (
        <div style={styles.noDemosMessage}>No demos available.</div>
      )}

      <h2 style={styles.upcomingDemosHeading}>Upcoming Demos</h2>

      {!isInNestedRoute && (
        <div style={styles.demosList}>
          {!loading &&
            !error &&
            demos.length > 0 &&
            demos.map((demo) => {
              const team = demo.team || {};
              const members = team.members || [];
              const guides = team.guides || [];
              const pannel = demo.pannel || [];

              return (
                <div
                  key={demo._id}
                  style={{
                    ...styles.demoCard,
                    ...(location.pathname.includes(demo._id)
                      ? styles.demoCardHover
                      : {}),
                  }}
                  onClick={() => handleCardClick(demo._id)}
                >
                  <h3 style={styles.demoTitle}>{demo.Title}</h3>

                  <p style={styles.projectDescriptionLabel}>
                    Project Description:
                  </p>
                  <p style={styles.demoDescription}>
                    {demo.team.project?.description ||
                      "No description available"}
                  </p>

                  <p style={styles.demoDate}>
                    Date: {new Date(demo.startDateTime).toLocaleDateString()}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent navigating on button click
                      handleDeleteClick(demo);
                    }}
                    style={styles.deleteButton}
                  >
                    Delete Demo
                  </button>

                  <div>
                    <h4 style={styles.sectionTitle}>
                      Team: {team.name || "No team assigned"}
                    </h4>
                    {members.length > 0 ? (
                      members.map((member) => (
                        <p key={member._id} style={styles.listItem}>
                          {member.name} ({member.role}) - {member.email}
                        </p>
                      ))
                    ) : (
                      <p style={styles.noContent}>No members available</p>
                    )}
                  </div>

                  <div>
                    <h4 style={styles.sectionTitle}>Guides:</h4>
                    {guides.length > 0 ? (
                      guides.map((guide) => (
                        <p key={guide._id} style={styles.listItem}>
                          {guide.name} ({guide.role}) - {guide.email}
                        </p>
                      ))
                    ) : (
                      <p style={styles.noContent}>No guides available</p>
                    )}
                  </div>

                  <div>
                    <h4 style={styles.sectionTitle}>Panel:</h4>
                    {pannel.length > 0 ? (
                      pannel.map((panelMember) => (
                        <p key={panelMember._id} style={styles.listItem}>
                          {panelMember.name} ({panelMember.role}) -{" "}
                          {panelMember.email}
                        </p>
                      ))
                    ) : (
                      <p style={styles.noContent}>No panel members available</p>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmationVisible && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalContent}>
            <h4 style={styles.modalTitle}>
              Are you sure you want to delete this demo?
            </h4>
            <div style={styles.modalActions}>
              <button
                onClick={handleDeleteConfirm}
                style={styles.confirmButton}
              >
                Confirm
              </button>
              <button onClick={handleDeleteCancel} style={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Routes>
        <Route path="/:demoId" element={<EditDemoPage />} />
      </Routes>
    </div>
  );
};

export default ViewUpcomingDemos;
