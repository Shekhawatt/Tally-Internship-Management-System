import React, { useState } from "react";
import axios from "axios";
import './apply.css'; // Ensure you import the new CSS file

const Apply = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    college: "",
    branch: "",
    year: "1st", // default year selection
    cgpa: "",
    mobileNumber: "",
    preferredDomain: "Web Development", // default domain selection
    workMode: "Remote", // default work mode
    pastExperience: "",
    resumeLink: "",
    batch: "", // assuming this will come from backend/admin dropdown
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (
      !formData.fullName ||
      !formData.college ||
      !formData.resumeLink ||
      !formData.cgpa ||
      !formData.mobileNumber ||
      !formData.batch
    ) {
      setErrorMessage("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/internshipRequests", formData, {
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Pass token if needed
        },
      });

      if (response.data.status === "success") {
        setIsSubmitted(true);
        setErrorMessage("");
      }
    } catch (error) {
      console.error("Error occurred during form submission:", error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="heading">Tally Solutions Internship Application</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label className="form-label" htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="college">College Name</label>
          <input
            type="text"
            id="college"
            name="college"
            value={formData.college}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="branch">Branch/Major</label>
          <input
            type="text"
            id="branch"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="year">Current Year of Study</label>
          <select
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="1st">1st</option>
            <option value="2nd">2nd</option>
            <option value="3rd">3rd</option>
            <option value="4th">4th</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="cgpa">CGPA</label>
          <input
            type="number"
            id="cgpa"
            name="cgpa"
            value={formData.cgpa}
            onChange={handleChange}
            className="form-control"
            min="0"
            max="10"
            step="0.1"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="mobileNumber">Mobile Number</label>
          <input
            type="tel"
            id="mobileNumber"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="preferredDomain">Preferred Domain</label>
          <select
            id="preferredDomain"
            name="preferredDomain"
            value={formData.preferredDomain}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="Web Development">Web Development</option>
            <option value="Mobile Development">Mobile Development</option>
            <option value="Machine Learning">Machine Learning</option>
            <option value="Data Science">Data Science</option>
            <option value="Cloud Computing">Cloud Computing</option>
            <option value="DevOps">DevOps</option>
            <option value="Blockchain">Blockchain</option>
            <option value="UI/UX Design">UI/UX Design</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="workMode">Preferred Work Mode</label>
          <select
            id="workMode"
            name="workMode"
            value={formData.workMode}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="Remote">Remote</option>
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="pastExperience">Past Experience</label>
          <textarea
            id="pastExperience"
            name="pastExperience"
            value={formData.pastExperience}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="resumeLink">Resume (Google Drive Link)</label>
          <input
            type="url"
            id="resumeLink"
            name="resumeLink"
            value={formData.resumeLink}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="batch">Batch ID</label>
          <input
            type="text"
            id="batch"
            name="batch"
            value={formData.batch}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>

        {isSubmitted && <p className="success-message">Application submitted successfully!</p>}
      </form>
    </div>
  );
};

export default Apply;
