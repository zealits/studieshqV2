const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { createProject, getAllProjects, getSingleProject, deleteSingleProject } = require("../controllers/projectController.js");

const router = express.Router();

// Route for creating a project
router.post("/admin/project", createProject);

// Route for getting all projects
router.get("/user/projects", getAllProjects); 

// Route for getting a single project by ID
router.get("/user/project/:id", getSingleProject); // Add this line

router.delete("/projects/:id", deleteSingleProject);

module.exports = router;
