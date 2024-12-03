// src/index.js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App"; // Import App.js
import "./index.css"; // Your global styles (if any)

ReactDOM.render(
  <React.StrictMode>
    <App /> {/* Render the main App component */}
  </React.StrictMode>,
  document.getElementById("root") // Ensure the app is rendered in the root div
);
