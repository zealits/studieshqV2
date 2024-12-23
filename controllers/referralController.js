const Project = require("../models/projectModel");
const User = require("../models/userModel");

exports.generateReferralLink = async (req, res) => {
  const { projectId, jobId, referringUserId } = req.body;
  console.log(req.body);

  try {
    let referralLink = "";
    // Ensure that projectId is always included if jobId is provided
    if (jobId && projectId) {
      // Generate link for a specific job with the associated project ID
      referralLink = `${req.protocol}://${req.get(
        "host"
      )}/share/job/${jobId}?referral=${referringUserId}&project=${projectId}`;
    } else if (projectId) {
      // Generate link for the entire project
      referralLink = `${req.protocol}://${req.get("host")}/share/project/${projectId}?referral=${referringUserId}`;
    } else {
      return res.status(400).json({ message: "Project or job ID required" });
    }

    res.status(200).json({ referralLink });
  } catch (error) {
    res.status(500).json({ message: "Error generating referral link" });
  }
};

// Track referral clicks and store referral info
exports.trackReferral = async (req, res) => {
  const { referral, projectId, jobId } = req.query; // Referral user ID and project/job ID

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const referredUserId = req.user._id; // Assuming user is logged in and their ID is accessible

    if (jobId) {
      // Track job-level referral
      const job = project.selectedJobs.find((job) => job.job.toString() === jobId);
      if (job) {
        job.jobReferrals.push({
          referredBy: referral,
          referredUser: referredUserId,
          status: "pending",
        });
      }
    } else {
      // Track project-level referral
      project.projectReferrals.push({
        referredBy: referral,
        referredUser: referredUserId,
        status: "pending",
      });
    }

    await project.save();
    res.status(200).json({ message: "Referral tracked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error tracking referral" });
  }
};

exports.getProjectsWithReferrals = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("projectReferrals.referredBy projectReferrals.referredUser")
      .populate("selectedJobs.job")
      .populate("selectedJobs.jobReferrals.referredBy selectedJobs.jobReferrals.referredUser");
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving projects", error });
  }
};
