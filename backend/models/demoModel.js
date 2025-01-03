const mongoose = require("mongoose");

const demoSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
    },
    Description: {
      type: String,
    },
    team: {
      type: mongoose.Schema.ObjectId,
      ref: "Team",
      required: [true, "A demo must be associated with a team"],
    },
    pannel: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "A demo must have panel members"],
      },
    ],
    startDateTime: {
      type: Date,
      required: [true, "A demo must have a start date and time"],
    },
    endDateTime: {
      type: Date,
      required: [true, "A demo must have an end date and time"],
      // validate: {
      //   validator: function (value) {
      //     return value > this.startDateTime;
      //   },
      //   message: "End date and time must be after start date and time",
      // },
    },
  },
  { timestamps: true }
);

const Demo = mongoose.model("Demo", demoSchema);

module.exports = Demo;
