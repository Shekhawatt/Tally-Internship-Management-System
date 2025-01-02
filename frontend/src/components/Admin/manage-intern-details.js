import React, { useEffect, useState } from "react";
import apiService from "../../services/apiService"; // Import the apiService
import "./ManageInternDetails.css"; // Import the CSS file

const ManageInternDetails = () => {
  const [interns, setInterns] = useState([]);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    name: "",
    email: "",
    team: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInterns = async () => {
      try {
        const internsData = await apiService.getInternList();
        console.log(internsData);
        setInterns(internsData);
      } catch (error) {
        console.error("Error fetching interns:", error);
      }
    };

    fetchInterns();
  }, []);

  const handleSelectIntern = (intern) => {
    setSelectedIntern(intern);
    setUpdatedData({
      name: intern.name,
      email: intern.email,
      team: intern.team,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({ ...updatedData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.put(`/interns/${selectedIntern._id}`, updatedData);
      setInterns((prevInterns) =>
        prevInterns.map((intern) =>
          intern._id === selectedIntern._id
            ? { ...intern, ...updatedData }
            : intern
        )
      );
      setSelectedIntern(null);
      setUpdatedData({ name: "", email: "", team: "" });
    } catch (error) {
      console.error("Error updating intern details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="intern-container">
      <div className="interns-list">
        {interns.length > 0 ? (
          interns.map((intern) => (
            <div
              key={intern._id}
              className="intern-card"
              onClick={() => handleSelectIntern(intern)}
            >
              <h3>{intern.name}</h3>
              <p>{intern.team}</p>
              <p>{intern.email}</p>
            </div>
          ))
        ) : (
          <p>No interns found.</p>
        )}
      </div>

      {selectedIntern && (
        <div className="intern-update-form">
          <h2>Update Intern Details</h2>
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={updatedData.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={updatedData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="team">Team:</label>
              <input
                type="text"
                id="team"
                name="team"
                value={updatedData.team}
                onChange={handleChange}
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageInternDetails;