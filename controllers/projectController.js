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

const getAllProjects = async (req, res) => {
  try {
    // Fetch all projects from the database and populate selectedJobs.job
    const projects = await Project.find().populate({
      path: "selectedJobs.job", // Path to the job reference
      model: "Job", // The model to populate
    });

    // console.log(projects);
    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Controller for getting a single project by ID
const getSingleProject = async (req, res) => {
  console.log(req.params);
  const projectId = req.params.id; // Get the project ID from the URL parameters
  console.log(projectId);
  try {
    // Find the project by ID
    const project = await Project.findById(projectId).populate({
      path: "selectedJobs.job", // Path to the job reference
      model: "Job", // The model to populate
    });
    console.log(project);
    // Check if the project exists
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Return the project details
    res.status(200).json({ project });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createProject, getAllProjects, getSingleProject };
