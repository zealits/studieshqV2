const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  selectedJobs: [
    {
      job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
      },
      referralAmount: {
        type: Number,
        required: true,
      },
      jobReferrals: [
        {
          referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Referring user
          referredUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Friend who was referred
          status: { type: String, default: "pending" }, // Status (e.g., "applied", "hired")
          referralDate: { type: Date, default: Date.now },
        },
      ],
    },
  ],
  deadline: {
    type: Date,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  pdf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pdf",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  projectReferrals: [
    {
      referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Referring user
      referredUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Friend who was referred
      status: { type: String, default: "pending" }, // Status (e.g., "applied", "hired")
      referralDate: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Project", projectSchema);
