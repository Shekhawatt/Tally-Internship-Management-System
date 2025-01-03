import React, { useEffect, useState } from "react";
import apiService from "../../services/apiService"; // Import the API service
import "./GuideProfile.css"; // Import the CSS file

const GuideProfile = () => {
  const [internData, setInternData] = useState({
    name: "",
    email: "",
    role: "Intern", // Default role
  });
  const [updatedData, setUpdatedData] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch intern details on component load
  useEffect(() => {
    const fetchInternDetails = async () => {
      try {
        const response = await apiService.getProfile(); // Fetch profile data
        const data = response.user;
        setInternData({
          name: data.name,
          email: data.email,
          role: "Intern",
        });
        setUpdatedData({
          name: data.name,
          email: data.email,
        });
      } catch (error) {
        console.error("Error fetching intern details:", error);
      }
    };

    fetchInternDetails();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission for updating intern details
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.updateProfile(updatedData);
      setInternData((prevData) => ({ ...prevData, ...updatedData }));
    } catch (error) {
      console.error("Error updating intern profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="intern-profile-container">
      <h2>Intern Profile</h2>

      <div className="profile-card">
        <h3>Profile Information</h3>
        <div className="profile-details">
          <div className="profile-item">
            <strong>Name:</strong> {internData.name}
          </div>
          <div className="profile-item">
            <strong>Email:</strong> {internData.email}
          </div>
          <div className="profile-item">
            <strong>Role:</strong> {internData.role}
          </div>
        </div>
      </div>

      <div className="profile-update-form">
        <h3>Update Profile</h3>
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
          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GuideProfile;
