const mongoose = require("mongoose");
const internshipRequestSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Internship request must belong to a student"],
    },
    fullName: {
      type: String,
      required: [true, "Please provide your full name"],
    },
    college: {
      type: String,
      required: [true, "Please provide your college name"],
    },
    branch: {
      type: String,
      required: [true, "Please provide your branch/major"],
    },
    year: {
      type: String,
      required: [true, "Please provide your current year of study"],
      enum: ["1st", "2nd", "3rd", "4th", "Other"],
    },
    cgpa: {
      type: Number,
      required: [true, "Please provide your CGPA"],
      min: [0, "CGPA cannot be less than 0"],
      max: [10, "CGPA cannot be more than 10"],
    },
    mobileNumber: {
      type: String,
      required: [true, "Please provide your mobile number"],
      validate: {
        validator: function (v) {
          return /^[0-9]{10}$/.test(v);
        },
        message: "Please provide a valid 10-digit mobile number",
      },
    },
    preferredDomain: {
      type: String,
      required: [true, "Please specify your preferred domain"],
      enum: [
        "Web Development",
        "Mobile Development",
        "Machine Learning",
        "Data Science",
        "Cloud Computing",
        "DevOps",
        "Blockchain",
        "UI/UX Design",
        "Other",
      ],
    },
    workMode: {
      type: String,
      required: [true, "Please specify preferred work mode"],
      enum: ["Remote", "On-site", "Hybrid"],
    },
    pastExperience: {
      type: String,
    },
    resumeLink: {
      type: String,
      required: [true, "Please provide your resume Google Drive link"],
      validate: {
        validator: function (v) {
          // Validates Google Drive share links
          return /^https:\/\/drive\.google\.com\/(file\/d\/|drive\/folders\/|open\?id=)([a-zA-Z0-9-_]+)/.test(
            v
          );
        },
        message: "Please provide a valid Google Drive link",
      },
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    batch: { type: mongoose.Schema.ObjectId, ref: "Batch", required: true },
    adminRemarks: {
      type: String,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    rejectionDate: Date, // Add rejection date
  },
  {
    timestamps: true,
  }
);

const InternshipRequest = mongoose.model(
  "InternshipRequest",
  internshipRequestSchema
);

module.exports = InternshipRequest;
