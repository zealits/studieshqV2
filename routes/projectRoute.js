// routes/projectRoutes.js

const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { createProject, getAllProjects } = require("../controllers/projectController.js");

const router = express.Router();

// Route for creating a project
router.post("/admin/project", createProject);

// Route for getting all projects
router.get("/admin/projects", getAllProjects); // Add this line

module.exports = router;
