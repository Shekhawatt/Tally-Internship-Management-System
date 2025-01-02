import React, { useState } from "react";
import apiService from "../../services/apiService"; // Assuming apiService is in the correct path

const CreateBatchForm = () => {
  const [batchData, setBatchData] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBatchData({
      ...batchData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!batchData.name || !batchData.startDate || !batchData.endDate) {
      setError("All fields are required.");
      return;
    }

    try {
      await apiService.createBatch(batchData);
      setSuccess("Batch created successfully!");
      setError("");
      setBatchData({ name: "", startDate: "", endDate: "" });
    } catch (error) {
      setError("Failed to create batch.");
    }
  };

  const styles = {
    container: {
      maxWidth: "750px", // Increased the max width
      margin: "0 auto",
      padding: "30px", // Increased padding for a larger form
      border: "1px solid #ddd",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",
    },
    title: {
      textAlign: "center",
      marginBottom: "20px",
    },
    formGroup: {
      marginBottom: "20px", // Increased margin between fields
    },
    label: {
      display: "block",
      fontWeight: "bold",
      marginBottom: "8px", // Increased margin
    },
    input: {
      width: "100%",
      padding: "12px", // Increased padding for better space
      margin: "8px 0", // Increased margin
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
      padding: "12px", // Increased padding for button
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
      <h2 style={styles.title}>Create Batch</h2>
      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}

      <div style={styles.formGroup}>
        <label style={styles.label}>Batch Name:</label>
        <input
          type="text"
          style={styles.input}
          name="name"
          value={batchData.name}
          onChange={handleChange}
          placeholder="Enter batch name"
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Start Date:</label>
        <input
          type="date"
          style={styles.input}
          name="startDate"
          value={batchData.startDate}
          onChange={handleChange}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>End Date:</label>
        <input
          type="date"
          style={styles.input}
          name="endDate"
          value={batchData.endDate}
          onChange={handleChange}
        />
      </div>

      <button onClick={handleSubmit} style={styles.button}>
        Create Batch
      </button>
    </div>
  );
};

export default CreateBatchForm;
