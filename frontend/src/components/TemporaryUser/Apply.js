import React, { useState } from "react";
import "./apply.css";
import axios from 'axios';


const Apply = () => {
  const [formData, setFormData] = useState({
    resume: null,
    fullName: "",
    pronouns: [],
    email: "",
    phone: "",
    currentLocation: "",
    currentCompany: "",
    isStudying: "",
    college: "",
    availability: "",
    joinTime: "",
    additionalInfo: "",
  });
   const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prevState) => {
        if (checked) {
          return { ...prevState, pronouns: [...prevState.pronouns, value] };
        } else {
          return {
            ...prevState,
            pronouns: prevState.pronouns.filter((item) => item !== value),
          };
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, resume: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  if (!formData.fullName || !formData.email || !formData.resume) {
    setErrorMessage('Please fill in all fields');
    setLoading(false);
    return;
  }

  const dataToSend = new FormData();
  dataToSend.append('fullName', formData.fullName);
  dataToSend.append('email', formData.email);
  dataToSend.append('resume', formData.resume);

  try {
    const response = await axios.post('/api/internship/apply', dataToSend);

    if (response.data.status === 'success') {
      setIsSubmitted(true);
      setErrorMessage('');
    }
  } catch (error) {
    console.error("Error occurred during form submission:", error);
    setErrorMessage('Something went wrong. Please try again.');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="container">
      <h1 className="heading">Tally Solutions Internship Application</h1>
      <br/>
      <br/>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label className="form-label" htmlFor="resume">
            Resume/CV (PDF, DOC, DOCX)
          </label>
          <input
            type="file"
            id="resume"
            name="resume"
            onChange={handleFileChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="fullName">
            Full Name
          </label>
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
          <label className="form-label">Pronouns</label>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="pronouns"
                value="He/Him"
                checked={formData.pronouns.includes("He/Him")}
                onChange={handleChange}
              />
              He/Him
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="pronouns"
                value="She/Her"
                checked={formData.pronouns.includes("She/Her")}
                onChange={handleChange}
              />
              She/Her
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="pronouns"
                value="They/Them"
                checked={formData.pronouns.includes("They/Them")}
                onChange={handleChange}
              />
              They/Them
            </label>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="phone">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="currentLocation">
            Current Location
          </label>
          <input
            type="text"
            id="currentLocation"
            name="currentLocation"
            value={formData.currentLocation}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="currentCompany">
            Current Company
          </label>
          <input
            type="text"
            id="currentCompany"
            name="currentCompany"
            value={formData.currentCompany}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Are you Currently Studying?</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="isStudying"
                value="Yes"
                checked={formData.isStudying === "Yes"}
                onChange={handleChange}
              />
              Yes
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="isStudying"
                value="No"
                checked={formData.isStudying === "No"}
                onChange={handleChange}
              />
              No
            </label>
          </div>
        </div>

        {formData.isStudying === "Yes" && (
          <div className="form-group">
            <label className="form-label" htmlFor="college">
              College/University
            </label>
            <input
              type="text"
              id="college"
              name="college"
              value={formData.college}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="availability">
            Availability Duration
          </label>
          <select
            id="availability"
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Select Duration</option>
            <option value="3months">3 Months</option>
            <option value="6months">6 Months</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="joinTime">
            When will you be able to Join?
          </label>
          <select
            id="joinTime"
            name="joinTime"
            value={formData.joinTime}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Select Option</option>
            <option value="Immediately">Immediately</option>
            <option value="Within 15 Days">Within 15 Days</option>
            <option value="Within a Month">Within a Month</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="additionalInfo">
            Additional Information
          </label>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            className="form-control"
            rows="4"
          />
        </div>

        <button type="submit" className="btn-submit">
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default Apply;
