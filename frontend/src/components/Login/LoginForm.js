// src/components/Login/LoginForm.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../../services/apiService";
import "./LoginForm.css"; // Import the external CSS for styling

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call the login API and get the response
      const response = await apiService.login(email, password);

      // Print the full response in the console
      console.log("Backend Response:", response);

      if (response.status === "success") {
        const { token, data } = response;
        const { role } = data.user;

        // Store JWT token in localStorage
        localStorage.setItem("token", token);

        // Log user role to debug
        console.log("User role:", role);

        // Redirect based on the user's role
        if (role === "admin") {
          navigate("/admin"); // Redirect to Admin Dashboard
        } else if (role === "guide") {
          navigate("/guide"); // Redirect to Guide Dashboard
        } else if (role === "intern") {
          navigate("/intern"); // Redirect to Intern Dashboard
        } else {
          navigate("/apply"); // Redirect to Apply Page for temporary users
        }
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      // Handle error (e.g., server error, invalid credentials)
      console.error("Login error:", err);
      setError("Invalid credentials or server error....");
    }
  };

  // Function to navigate to the SignUp page
  const handleSignUpRedirect = () => {
    navigate("/create-account");
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        {/* Links for creating a new account and forgot password */}
        <div className="additional-links">
          <p>
            <button onClick={handleSignUpRedirect} className="link">
              Don't have an account?{" "}
            </button>
          </p>
          <p>
            <a href="/forgot-password" className="link">
              Forgot your password?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
