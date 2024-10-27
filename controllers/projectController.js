const Project = require("../models/projectModel"); // Adjust the path based on your project structure
const Job = require("../models/jobModel"); // Import Job model to validate jobs
const Pdf = require("../models/pdfModel"); // Import Pdf model to validate PDF

const createProject = async (req, res) => {
  try {
    const { title, description, selectedJobs, deadline, budget, pdf } = req.body;

    console.log(req.body);
    // Validate required fields
    if (!title || !description || !selectedJobs || !deadline || !budget || !pdf) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create the project
    const newProject = new Project({
      title,
      description,
      selectedJobs, // This can directly use the incoming array
      deadline,
      budget,
      pdf,
    });

    // Save the project to the database
    await newProject.save();

    return res.status(201).json({ message: "Project created successfully.", project: newProject });
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = { createProject };
