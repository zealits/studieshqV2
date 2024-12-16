const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema({
  applicantName: { type: String },

  projectDetails: {
    projectName: { type: String },
    projectDescription: { type: String },
  },
  jobRole: { type: [String] },
  jobResponsibilities: { type: [String] },
  compensation: {
    salary: { type: String },
    paymentFrequency: { type: String },
    benefits: { type: [String] },
  },
  confidentialityAgreement: {
    type: Boolean,
    default: false,
  },
  intellectualPropertyAgreement: {
    type: Boolean,
    default: false,
  },
  performanceMetrics: { type: String },
  terminationConditions: { type: String },
  disputeResolutionMethod: { type: String },
  noticePeriod: { type: String },
  dateOfSignature: { type: Date, default: Date.now },
  signatureDate: { type: Date },
  signedByApplicant: {
    type: Boolean,
    default: false,
  },
  signedByEmployer: {
    type: Boolean,
    default: false,
  },
  employerDetails: {
    employerName: { type: String },
    employerSignature: { type: String },
    employerRepresentative: { type: String },
    employerAddress: { type: String },
  },
  status: {
    type: String,
    enum: ["Pending", "Signed", "Completed"],
    default: "Pending",
  },
  pdfData: { type: Buffer },
});

// const contractSchema = new mongoose.Schema({
//   userId: {
//     type: String,
//     required: true,
//   },
//   filename: {
//     type: String,
//     // required: true,
//   },
//   jobTitle: {
//     type: String,
//     required: true,
//   },
//   projectDetails: {
//     type: String,
//     required: true,
//   },
//   freelanceStudyDetails: {
//     type: String,
//     required: true,
//   },
//   email: { // New field for email address
//     type: String,
//     // required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   signature: {
//     type: String,
//   },
//   pdfData: { type: Buffer }, // Store PDF binary data
// });

const Contract = mongoose.model("Contract", contractSchema);

module.exports = Contract;
