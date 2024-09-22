const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { createJob, updateJob, deleteJob, getAllJobs, getSingleJob } = require("../controllers/jobController.js");

const router = express.Router();

// Admin routes
router.route("/admin/job").post(createJob);

router
  .route("/admin/job/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateJob)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteJob);

// Public routes
router.route("/jobs").get(getAllJobs);
router.route("/job/:id").get(getSingleJob);

module.exports = router;
