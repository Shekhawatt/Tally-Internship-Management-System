import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiService from "../../services/apiService";

const InternsByBatch = () => {
  const { id } = useParams(); // Batch ID from URL
  const [interns, setInterns] = useState([]);
  const [batchName, setBatchName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInterns();
  }, []);

  const fetchInterns = async () => {
    try {
      const response = await apiService.getInternsByBatch(id);
      const { interns } = response.data;
      if (interns.length > 0) {
        setBatchName(interns[0].batch.name); // Set batch name from the first intern
      }
      setInterns(interns);
    } catch (err) {
      console.error("Error fetching interns:", err.message);
      //   setError("Failed to load interns. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Interns in {batchName || "Batch"}</h2>
      {error && <p style={styles.error}>{error}</p>}
      {interns.length > 0 ? (
        <div style={styles.scrollableContainer}>
          {interns.map((intern) => (
            <div key={intern._id} style={styles.card}>
              <div style={styles.cardContent}>
                <h3 style={styles.cardTitle}>{intern.name}</h3>
                <p>
                  <strong>Email:</strong> {intern.email}
                </p>
                <p>
                  <strong>Batch:</strong> {intern.batch.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={styles.noData}>No interns found for this batch.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: 20,
    maxWidth: "800px",
    margin: "0 auto",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: "1.8rem",
    color: "#333",
  },
  error: {
    color: "red",
    textAlign: "center",
    fontSize: "1.2rem",
  },
  noData: {
    textAlign: "center",
    color: "#555",
    fontSize: "1.2rem",
  },
  scrollableContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "15px",
    maxHeight: "500px",
    overflowY: "auto",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  },
  card: {
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    padding: "15px",
    textAlign: "center",
    transition: "transform 0.3s, box-shadow 0.3s",
  },
  cardHover: {
    transform: "scale(1.05)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
  },
  cardTitle: {
    fontSize: "1.2rem",
    marginBottom: "10px",
    color: "#007bff",
  },
};

export default InternsByBatch;
