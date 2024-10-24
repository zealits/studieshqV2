const mongoose = require("mongoose");

const gigSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description:{
    type: String,
    required: true,

  },
  selectedJobs: [{ // Change here
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job", // Assuming you have a Job model
    required: true,
  }],
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
    ref: "Pdf", // Assuming you have a Pdf model for the PDFs
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Gig", gigSchema);
