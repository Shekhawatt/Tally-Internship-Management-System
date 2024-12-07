const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  role: {
    type: String,
    enum: ["intern", "admin", "guide", "temp"],
    default: "temp",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  batch: {
    type: mongoose.Schema.ObjectId,
    ref: "Batch",
    default: null, // Null if the user isn't assigned to a batch yet
  },
  team: {
    type: mongoose.Schema.ObjectId,
    ref: "Team",
    default: null, // For 'interns', ensure they belong to only one team
  },
});

// middleware for save operation to encrpt passward
userSchema.pre("save", async function (next) {
  // if password is not modified then no need to encrypt it
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.passwordCompare = async function (
  userPassword,
  inputPassward
) {
  return await bcrypt.compare(inputPassward, userPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
