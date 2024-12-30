// review-pending-request.js
import React, { useEffect, useState } from "react";
import apiService from "../../services/apiService";

const ReviewPendingRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await apiService.getPendingInternshipRequests();
        setRequests(data.data.requests);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch pending requests.");
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      await apiService.reviewInternshipRequest(id, "approved");
      setRequests((prevRequests) =>
        prevRequests.filter((req) => req._id !== id)
      );
    } catch (err) {
      console.error("Error approving request:", err);
      alert("Failed to approve request.");
    }
  };

  const handleReject = async (id) => {
    try {
      await apiService.reviewInternshipRequest(id, "rejected");
      setRequests((prevRequests) =>
        prevRequests.filter((req) => req._id !== id)
      );
    } catch (err) {
      console.error("Error rejecting request:", err);
      alert("Failed to reject request.");
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Pending Internship Requests</h1>
      {requests.length === 0 ? (
        <p style={styles.noRequests}>No pending requests found.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>College</th>
              <th style={styles.th}>Branch</th>
              <th style={styles.th}>Year</th>
              <th style={styles.th}>CGPA</th>
              <th style={styles.th}>Preferred Domain</th>
              <th style={styles.th}>Work Mode</th>
              <th style={styles.th}>Past Experience</th>
              <th style={styles.th}>Resume</th>
              <th style={styles.th}>Batch</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id} style={styles.row}>
                <td style={styles.td}>{req.fullName}</td>
                <td style={styles.td}>{req.student.email}</td>
                <td style={styles.td}>{req.college}</td>
                <td style={styles.td}>{req.branch}</td>
                <td style={styles.td}>{req.year}</td>
                <td style={styles.td}>{req.cgpa}</td>
                <td style={styles.td}>{req.preferredDomain}</td>
                <td style={styles.td}>{req.workMode}</td>
                <td style={styles.td}>{req.pastExperience}</td>
                <td style={styles.td}>
                  <a
                    href={req.resumeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.link}
                  >
                    View Resume
                  </a>
                </td>
                <td style={styles.td}>{req.batch.name}</td>
                <td style={styles.td}>
                  <button
                    style={styles.buttonApprove}
                    onClick={() => handleApprove(req._id)}
                  >
                    <span style={styles.iconApprove}>✔</span>
                  </button>
                  <button
                    style={styles.buttonReject}
                    onClick={() => handleReject(req._id)}
                  >
                    <span style={styles.iconReject}>✘</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "'Arial', sans-serif",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
    color: "#333",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  th: {
    backgroundColor: "#007BFF",
    color: "#fff",
    padding: "10px",
    textAlign: "left",
    fontSize: "16px",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    fontSize: "14px",
  },
  row: {
    transition: "background-color 0.3s",
  },
  "row:hover": {
    backgroundColor: "#f1f1f1",
  },
  link: {
    color: "#007BFF",
    textDecoration: "none",
  },
  "link:hover": {
    textDecoration: "underline",
  },
  buttonApprove: {
    backgroundColor: "#FFFFFF", // Green color for approve
    color: "#28a745",
    border: "none",
    padding: "8px 15px", // Added padding for a better button size
    fontSize: "16px", // Increased font size
    borderRadius: "5px", // Rounded corners for the button
    cursor: "pointer",
    transition: "background-color 0.3s ease, transform 0.2s ease", // Smooth background color and scale transition
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Added shadow for depth
    outline: "none", // Removes outline on focus
  },

  buttonReject: {
    backgroundColor: "#FFFFFF", // Red color for reject
    color: "#dc3545",
    border: "none",
    padding: "8px 15px", // Added padding for a better button size
    fontSize: "16px", // Increased font size
    borderRadius: "5px", // Rounded corners for the button
    cursor: "pointer",
    transition: "background-color 0.3s ease, transform 0.2s ease", // Smooth background color and scale transition
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Added shadow for depth
    outline: "none", // Removes outline on focus
  },
  "buttonApprove:hover": {
    backgroundColor: "#218838",
    transform: "scale(1.05)",
  },
  "buttonReject:hover": {
    backgroundColor: "#c82333",
    transform: "scale(1.05)",
  },
  iconApprove: {
    fontSize: "20px",
  },
  iconReject: {
    fontSize: "20px",
  },
  loading: {
    textAlign: "center",
    fontSize: "18px",
    color: "#007BFF",
  },
  error: {
    textAlign: "center",
    fontSize: "18px",
    color: "red",
  },
  noRequests: {
    textAlign: "center",
    fontSize: "18px",
    color: "#777",
  },
};

export default ReviewPendingRequest;
