const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A team must have a name"],
      unique: true,
    },
    members: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        validate: {
          // Ensure the intern is not part of any other team
          validator: async function (value) {
            const member = await mongoose.model("User").findById(value);
            return (
              member && member.role === "intern" && !member.team // Ensure the intern is not part of any other team
            );
          },
          message: "User must be an available intern without a team",
        },
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "At least one guide must be assigned to the team"],
        validate: {
          validator: async function (value) {
            const user = await mongoose.model("User").findById(value);
            return user && user.role === "guide"; // Guides should have the "guide" role
          },
          message: "Guide must be a valid user with a guide role",
        },
      },
    ],
    project: {
      type: mongoose.Schema.ObjectId,
      ref: "Project",
      required: [true, "A project must be assigned to the team"],
    },
  },
  { timestamps: true }
);

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
