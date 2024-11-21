const express = require("express");
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");

const userRouter = express.Router();
// Routes

// Basic User Routes
userRouter.get(
  "/",
  authController.protect,
  authController.restrictTo("admin"),
  userController.getAllUsers
);
userRouter.post("/update", authController.protect, userController.update);
userRouter.get("/:id", authController.protect, userController.getUser);

// Authentication routes
userRouter.post("/signup", authController.signup);
userRouter.post("/login", authController.login);
userRouter.post("/logout", authController.protect, authController.logOut);

module.exports = userRouter;
