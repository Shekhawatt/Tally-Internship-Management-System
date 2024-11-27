const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A project must have a name"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "A project must have a description"],
    },
  },
  {
    timestamps: true,
  }
);

// Model creation
const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
