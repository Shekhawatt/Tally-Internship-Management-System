// src/components/SignUp/SignUpForm.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../../services/apiService";
import "./SignUpForm.css"; // Import external CSS for styling

const SignUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call the signup API
      const response = await apiService.signup({
        name,
        email,
        password,
        passwordConfirm,
      });

      // Print the full response in the console
      console.log("Backend Response:", response);

      if (response.status === "success") {
        // Redirect to login page after successful sign up
        navigate("/login");
      } else {
        setError("Error in account creation. Please try again.");
      }
    } catch (err) {
      // Handle error (e.g., server error, validation errors)
      console.error("SignUp error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input-field"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
            className="input-field"
          />
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        <p>
          Already have an account?{" "}
          <a href="/login" className="link">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
