import React, { useState } from "react";
import apiService from "../../services/apiService";

// WeeklyUpdateCard Component to display each individual update card
function WeeklyUpdateCard({ update, onClick, isSelected, onEdit }) {
  return (
    <div
      className="weekly-update-card"
      onClick={() => onClick(update)} // Trigger onClick when card is clicked
      style={{
        cursor: "pointer",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "20px",
        marginBottom: "10px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)";
      }}
    >
      <h4>Week {update.week}</h4>
      {isSelected && <p>{update.description}</p>}{" "}
      {/* Conditionally render the description */}
      {/* Show Edit button when card is selected */}
      {isSelected && (
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent click event from triggering onClick of card
              onEdit(update);
            }}
            style={{
              padding: "5px 10px",
              fontSize: "14px",
              marginRight: "10px",
              backgroundColor: "#ffa500",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}

// WeeklyUpdates Component to handle the list and full update view
function WeeklyUpdates({ updates = [], teamId, setWeeklyUpdates }) {
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [newUpdate, setNewUpdate] = useState({
    week: "",
    description: "",
  });
  const [message, setMessage] = useState(""); // For showing messages

  const handleUpdateClick = (update) => {
    setSelectedUpdate(selectedUpdate === update ? null : update); // Toggle selection
  };

  // Edit handler
  const handleEdit = (update) => {
    setNewUpdate({
      week: update.week,
      description: update.description,
    });
    document.getElementById("update-form").style.display = "block";
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUpdate({
      ...newUpdate,
      [name]: value,
    });
  };

  // Handle form submission for updating the weekly update
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (newUpdate.week && newUpdate.description) {
      try {
        // API call to update the weekly update
        const updatedUpdate = await apiService.addWeeklyUpdate(
          teamId,
          newUpdate.week,
          newUpdate.description
        );

        // Update the updates state with the newly updated update
        const updatedUpdates = updates.map((update) =>
          update.id === updatedUpdate.id ? updatedUpdate : update
        );

        // Set the new updates state
        setSelectedUpdate(updatedUpdate); // Set the newly updated update
        setNewUpdate({ week: "", description: "" }); // Reset the form

        const weeklyUpdatesResponse = await apiService.fetchWeeklyUpdates(
          teamId
        );
        setWeeklyUpdates(weeklyUpdatesResponse.data.updates); // Set weekly updates

        setMessage("Weekly Update updated successfully"); // Show success message
        setTimeout(() => setMessage(""), 3000); // Hide message after 3 seconds
        document.getElementById("update-form").style.display = "none"; // Close the form
      } catch (error) {
        setMessage("Error updating update: " + error.message); // Show error message
        setTimeout(() => setMessage(""), 3000); // Hide message after 3 seconds
      }
    } else {
      setMessage("Please fill in both week and description.");
      setTimeout(() => setMessage(""), 3000); // Hide message after 3 seconds
    }
  };

  // Handle form cancelation
  const handleCancel = () => {
    setNewUpdate({ week: "", description: "" }); // Reset the form
    document.getElementById("update-form").style.display = "none"; // Close the form
  };

  return (
    <div
      className="weekly-updates-section"
      style={{ maxWidth: "800px", margin: "0 auto" }}
    >
      <h3>Weekly Updates</h3>

      {/* Button for adding a new update */}
      <button
        onClick={() =>
          (document.getElementById("update-form").style.display = "block")
        }
        style={{
          padding: "10px 15px",
          fontSize: "16px",
          marginBottom: "20px",
          cursor: "pointer",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Add Weekly Update
      </button>

      {/* Message display */}
      {message && (
        <div
          style={{
            backgroundColor: message.startsWith("Error")
              ? "#f44336"
              : "#4CAF50",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "15px",
            textAlign: "center",
          }}
        >
          {message}
        </div>
      )}

      {/* Form for adding or updating a weekly update */}
      <div
        id="update-form"
        style={{
          display: "none",
          marginBottom: "20px",
          border: "1px solid #ddd",
          padding: "15px",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h4>{selectedUpdate ? "Edit" : "Add"} Weekly Update</h4>
        <form onSubmit={handleUpdateSubmit}>
          <div>
            <label>Week: </label>
            <input
              type="text"
              name="week"
              value={newUpdate.week}
              onChange={handleInputChange}
              required
              style={{
                padding: "8px",
                margin: "10px 0",
                borderRadius: "4px",
                width: "100%",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div>
            <label>Description: </label>
            <textarea
              name="description"
              value={newUpdate.description}
              onChange={handleInputChange}
              required
              style={{
                padding: "8px",
                margin: "10px 0",
                borderRadius: "4px",
                width: "100%",
                border: "1px solid #ccc",
                height: "100px",
              }}
            ></textarea>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              type="submit"
              style={{
                padding: "10px 15px",
                fontSize: "16px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {selectedUpdate ? "Update Weekly Update" : "Add Weekly Update"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              style={{
                padding: "10px 15px",
                fontSize: "16px",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginLeft: "10px", // Add gap between buttons
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div id="weekly-updates-list">
        {updates.length === 0 ? (
          <p>No weekly updates available yet.</p>
        ) : (
          updates.map((update, index) => (
            <WeeklyUpdateCard
              key={index}
              update={update}
              onClick={handleUpdateClick} // Pass the click handler
              isSelected={selectedUpdate === update} // Check if this card is selected
              onEdit={handleEdit} // Pass the edit handler
            />
          ))
        )}
      </div>
    </div>
  );
}

export default WeeklyUpdates;
