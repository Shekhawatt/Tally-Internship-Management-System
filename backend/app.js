const express = require("express");
const cookieParser = require("cookie-parser"); // Import cookie-parser
const app = express();

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser()); // Use cookie-parser middleware

module.exports = app;
