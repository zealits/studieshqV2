const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  //   jobId: { type: String, required: true, unique: true },
  jobTitle: { type: String, required: true },
  companyName: { type: String },
  department: { type: String },
  location: { type: String },
  //   jobType: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Temporary'] },
  jobType: { type: String },
  employmentLevel: { type: String },
  salaryRange: { type: String },
  jobSummary: { type: String },
  jobDescription: { type: String },
  requirements: [String],
  preferredQualifications: [String],
  responsibilities: [String],
  shiftHours: { type: String },
  postedDate: { type: Date, default: Date.now },
  applicationDeadline: { type: Date },
  jobStatus: { type: String, enum: ["Open", "Closed", "Filled"], default: "Open" },
  benefits: [String],
  //   hiringManager: { type: String },
  //   contactEmail: { type: String },
  //   jobReferenceNumber: { type: String },
  companyLogo: { type: String },
});

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;
