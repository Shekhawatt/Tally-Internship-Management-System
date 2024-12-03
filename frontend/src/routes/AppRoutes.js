// src/routes/AppRoutes.js
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginForm from "../components/Login/LoginForm";
import AdminDashboard from "../components/Admin/Dashboard";
import GuideDashboard from "../components/Guide/Dashboard";
import InternDashboard from "../components/Intern/Dashboard";
import ApplyPage from "../components/TemporaryUser/Apply";

const AppRoutes = () => {
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated by checking JWT token or role
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      const storedRole = localStorage.getItem("role");
      setRole(storedRole);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Protecting Routes based on role and authentication status
  const ProtectedRoute = ({ element, roleRequired }) => {
    if (!isAuthenticated) {
      return <Navigate to="/" />;
    }
    if (roleRequired && role !== roleRequired) {
      return <Navigate to="/" />;
    }
    return element;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        {/* Protected route for Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute element={<AdminDashboard />} roleRequired="admin" />
          }
        />
        {/* Protected route for Guide */}
        <Route
          path="/guide"
          element={
            <ProtectedRoute element={<GuideDashboard />} roleRequired="guide" />
          }
        />
        {/* Protected route for Intern */}
        <Route
          path="/intern"
          element={
            <ProtectedRoute
              element={<InternDashboard />}
              roleRequired="intern"
            />
          }
        />
        {/* Apply route for Temporary User */}
        <Route path="/apply" element={<ApplyPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
