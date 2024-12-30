import React, { useState, useEffect } from "react";
import apiService from "../../services/apiService"; // Import the API service to fetch the guide list

const ViewGuideList = () => {
  const [guideList, setGuideList] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for fetching data
  const [error, setError] = useState(""); // Error state to handle any API errors

  useEffect(() => {
    // Fetch guide list from API
    const fetchGuideList = async () => {
      try {
        const guides = await apiService.getGuideList();
        setGuideList(guides);
      } catch (err) {
        setError("Failed to fetch guide list");
      } finally {
        setLoading(false);
      }
    };

    fetchGuideList();
  }, []);

  // If data is loading, show a loading message
  if (loading) {
    return <div className="loading">Loading guides...</div>;
  }

  // If there's an error, show the error message
  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="container">
      <h3 className="title">Guide List</h3>
      <div className="table-container">
        <table className="guide-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Team</th> {/* Added Team Column */}
            </tr>
          </thead>
          <tbody>
            {guideList.map((guide) => (
              <tr key={guide._id}>
                <td>{guide.name}</td>
                <td>{guide.email}</td>
                <td>{guide.role}</td>
                <td>{guide.team ? guide.team : "No Team Assigned"}</td>{" "}
                {/* Displaying Team */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewGuideList;

/* CSS Styling */
const styles = `
  /* General Container Styling */
  .container {
    width: 100%;
    height: 100vh; /* Ensures container takes full height of the viewport */
    padding: 20px;
    font-family: 'Arial', sans-serif;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: flex-start; /* Align content to the top */
    overflow-x: hidden; /* Prevent horizontal scrolling */
  }

  /* Title Styling */
  .title {
    text-align: center;
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
    font-weight: 600;
  }

  /* Table Container Styling */
  .table-container {
    width: 100%;
    overflow-y: auto; /* Enable vertical scrolling if the table overflows */
    max-height: 80vh; /* Limit the height to 80% of the viewport */
  }

  /* Table Styling */
  .guide-table {
    width: 100%;
    table-layout: fixed; /* Prevents horizontal overflow */
    border-collapse: collapse;
    margin-bottom: 20px;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
  }

  .guide-table th, .guide-table td {
    padding: 12px;
    text-align: left;
    font-size: 16px;
    color: #333;
    word-wrap: break-word; /* Ensures content breaks into multiple lines if necessary */
  }

  .guide-table th {
    background-color: #007bff;
    color: #fff;
    font-weight: 600;
  }

  .guide-table tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  .guide-table tr:hover {
    background-color: #f1f1f1;
  }

  .guide-table td {
    border-bottom: 1px solid #ddd;
  }

  /* Loading and Error Message Styling */
  .loading, .error {
    text-align: center;
    font-size: 18px;
    color: #f44336;
    margin-top: 20px;
  }

  .loading {
    color: #007bff;
  }
`;

// Injecting the styles into the document head
const styleTag = document.createElement("style");
styleTag.innerHTML = styles;
document.head.appendChild(styleTag);
