// src/components/remove-guide.js
import React, { useEffect, useState } from "react";
import apiService from "../../services/apiService"; // Import API service

const RemoveGuide = () => {
  const [guides, setGuides] = useState([]);
  const [selectedGuideId, setSelectedGuideId] = useState(null);
  const [error, setError] = useState(null);

  // Fetch the list of guides on component mount
  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const guidesData = await apiService.getGuideList();
        setGuides(guidesData); // Set the fetched guides to state
      } catch (err) {
        setError("Failed to load guides.");
      }
    };

    fetchGuides();
  }, []);

  // Handle guide removal
  const handleRemoveGuide = async () => {
    if (!selectedGuideId) {
      setError("Please select a guide to remove.");
      return;
    }

    try {
      await apiService.deleteGuide(selectedGuideId); // API call to delete the guide
      // Remove the deleted guide from the state
      setGuides(guides.filter((guide) => guide._id !== selectedGuideId));
      setSelectedGuideId(null); // Reset the selection
    } catch (err) {
      setError("Failed to remove guide.");
    }
  };

  // Inline styles for a modern design
  const styles = {
    container: {
      maxWidth: "600px", // Increased width
      margin: "50px auto",
      padding: "50px", // Increased padding for larger content
      borderRadius: "15px",
      backgroundColor: "#fff",
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
      fontFamily: "'Roboto', sans-serif",
      color: "#333",
      textAlign: "center",
      border: "1px solid #ddd", // Light border for the container
    },
    title: {
      fontSize: "32px", // Increased title size
      fontWeight: "bold",
      color: "#333",
      marginBottom: "30px",
    },
    label: {
      display: "block",
      fontSize: "18px", // Increased label size
      fontWeight: "600",
      color: "#555",
      marginBottom: "18px", // More spacing below labels
      textAlign: "left",
      paddingLeft: "15px",
    },
    select: {
      width: "100%",
      padding: "18px 20px", // Increased padding for a bigger feel
      fontSize: "18px", // Increased font size
      border: "2px solid #3498db",
      borderRadius: "8px",
      backgroundColor: "#f7f9fc",
      transition: "all 0.3s ease-in-out",
      color: "#333",
    },
    errorMessage: {
      color: "#e74c3c",
      fontSize: "16px", // Increased error message font size
      marginTop: "20px",
      marginBottom: "25px",
      fontWeight: "bold",
    },
    button: {
      width: "100%",
      padding: "18px", // Increased padding for the button
      backgroundColor: "#3498db",
      color: "#fff",
      fontSize: "20px", // Increased button font size
      fontWeight: "600",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      marginTop: "30px", // Increased space above button
      transition: "background-color 0.3s ease-in-out",
    },
    buttonHover: {
      backgroundColor: "#2980b9", // Change on hover
    },
    buttonDisabled: {
      backgroundColor: "#ddd",
      cursor: "not-allowed",
    },
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Remove Guide</h3>

      {error && <div style={styles.errorMessage}>{error}</div>}

      <div>
        <label htmlFor="guideSelect" style={styles.label}>
          Select a Guide to Remove:
        </label>
        <select
          id="guideSelect"
          value={selectedGuideId || ""}
          onChange={(e) => setSelectedGuideId(e.target.value)}
          style={styles.select}
        >
          <option value="">Select a Guide</option>
          {guides.map((guide) => (
            <option key={guide._id} value={guide._id}>
              {guide.name}
            </option>
          ))}
        </select>
      </div>

      <button
        style={styles.button}
        onClick={handleRemoveGuide}
        disabled={!selectedGuideId}
        onMouseEnter={(e) =>
          (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)
        }
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#3498db")}
      >
        Remove Guide
      </button>
    </div>
  );
};

export default RemoveGuide;
