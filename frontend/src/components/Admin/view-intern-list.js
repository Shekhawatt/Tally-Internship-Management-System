import React, { useState, useEffect } from "react";
import apiService from "../../services/apiService"; // Adjust path as necessary

const ViewInternList = () => {
  const [internList, setInternList] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for fetching data
  const [error, setError] = useState(""); // Error state to handle any API errors

  useEffect(() => {
    // Fetch intern list with team names
    const fetchInternList = async () => {
      try {
        const interns = await apiService.getInternList();

        // Fetch team names for each intern
        const internsWithTeamNames = await Promise.all(
          interns.map(async (intern) => {
            if (intern.team && intern.team.length > 0) {
              const teamNames = await Promise.all(
                intern.team.map(async (teamId) => {
                  const teamResponse = await apiService.getTeamById(teamId);
                  return teamResponse.data.team.name;
                })
              );
              return { ...intern, status: teamNames.join(", ") }; // Join team names with commas
            }
            return { ...intern, status: "No Team Assigned" };
          })
        );

        setInternList(internsWithTeamNames);
      } catch (err) {
        setError("Failed to fetch intern list");
      } finally {
        setLoading(false);
      }
    };

    fetchInternList();
  }, []);

  // If data is loading, show a loading message
  if (loading) {
    return <div className="loading">Loading interns...</div>;
  }

  // If there's an error, show the error message
  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="intern-list-container">
      <h3 className="title">Intern List</h3>
      <div className="table-container">
        <table className="intern-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Team</th>
            </tr>
          </thead>
          <tbody>
            {internList.map((intern) => (
              <tr key={intern._id}>
                <td>{intern.name}</td>
                <td>{intern.email}</td>
                <td>{intern.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewInternList;

/* CSS Styling */
const styles = `
  /* General Container Styling */
  .intern-list-container {
    width: 50%;
    height: 100vh;
    padding: 10px;
    font-family: 'Arial', sans-serif;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow-x: hidden;
    margin: 0 auto;
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
    overflow-y: auto;
    max-height: 80vh;
  }

  /* Table Styling */
  .intern-table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    margin-bottom: 20px;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
  }

  .intern-table th, .intern-table td {
    padding: 12px;
    text-align: left;
    font-size: 16px;
    color: #333;
    word-wrap: break-word;
  }

  .intern-table th {
    background-color: #007bff;
    color: #fff;
    font-weight: 600;
  }

  .intern-table tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  .intern-table tr:hover {
    background-color: #f1f1f1;
  }

  .intern-table td {
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
