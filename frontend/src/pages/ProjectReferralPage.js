import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import { FacebookShareButton, WhatsappShareButton, LinkedinShareButton, TwitterShareButton } from "react-share";
import "./ProjectReferralPage.css"; // Add any specific styling for this page

const ProjectReferralPage = () => {
  const { projectId } = useParams(); // Get the project ID from URL parameters
  const query = new URLSearchParams(useLocation().search);
  const referringUserId = query.get("referral"); // Get the referring user ID from query parameters
  const navigate = useNavigate(); // Initialize useNavigate

  const [projectDetails, setProjectDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(`/aak/l1/user/project/${projectId}`);
        setProjectDetails(response.data.project);
        console.log(response.data.project); // Set project details in state
       
        localStorage.setItem("referringUserId", referringUserId); // Store referral ID in local storage for tracking
        localStorage.setItem("referredProjectId", projectId); // Store referral ID in local storage for tracking
      } catch (error) {
        console.error("Error fetching project details:", error);
        setError("Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId, referringUserId]);

  // Generate referral link for the entire project and redirect to registration page
  const referProject = async () => {
    try {
      const response = await axios.post("/aak/l1/generate-link", { projectId, referringUserId });
      setReferralLink(response.data.referralLink); // Set referral link in state
      setShowModal(true); // Open modal for social media sharing

      // Redirect to the registration page with referral information
      navigate(`/register?redirect=/apply/project/${projectId}&referral=${referringUserId}`);
    } catch (error) {
      console.error("Error generating referral link:", error);
      alert("Failed to generate referral link.");
    }
  };

  // Generate referral link for a specific job within the project
  const referJob = async (jobId) => {
    try {
      const response = await axios.post("/aak/l1/generate-link", { projectId, jobId, referringUserId });
      setReferralLink(response.data.referralLink); // Set referral link in state
      setShowModal(true); // Open modal for social media sharing

      // Redirect to the registration page with referral information
      navigate(`/register?redirect=/apply/job/${jobId}&referral=${referringUserId}`);
    } catch (error) {
      console.error("Error generating job referral link:", error);
      alert("Failed to generate job referral link.");
    }
  };

  // Close modal
  const closeModal = () => setShowModal(false);

  if (loading) return <div>Loading project details...</div>;
  if (error) return <div>{error}</div>;
  if (!projectDetails) return <div>Project not found</div>;


  
  return (
    <div className="project-referral">
      <h2>{projectDetails.title}</h2>
      <p>{projectDetails.description}</p>
      <p>Deadline: {new Date(projectDetails.deadline).toLocaleDateString()}</p>
      <p>Budget: ${projectDetails.budget}</p>

      <button onClick={referProject} className="project-referral__refer-button">
        Refer This Project
      </button>

      <h3>Available Jobs</h3>
      {projectDetails.selectedJobs && projectDetails.selectedJobs.length > 0 ? (
        <ul className="project-referral__jobs-list">
          {projectDetails.selectedJobs.map((job) => (
            <li key={job._id} className="project-referral__job-item">
              <h4>{job.job.jobTitle}</h4>
              <p>Location: {job.job.location}</p>
              <p>Description: {job.job.jobDescription}</p>
              <p>Referral Gift: ${job.referralAmount}</p>
              <button onClick={() => referJob(job.job._id)} className="project-referral__refer-job-button">
                Refer This Job
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No jobs available for this project.</p>
      )}

      {/* Modal for sharing options */}
      {showModal && (
        <div className="share-modal">
          <div className="share-modal__content">
            <h3>Share this Project</h3>
            <p>Share the project or job with your friends:</p>
            <FacebookShareButton url={referralLink}>
              <button className="share-button facebook">Share on Facebook</button>
            </FacebookShareButton>
            <WhatsappShareButton url={referralLink}>
              <button className="share-button whatsapp">Share on WhatsApp</button>
            </WhatsappShareButton>
            <LinkedinShareButton url={referralLink}>
              <button className="share-button linkedin">Share on LinkedIn</button>
            </LinkedinShareButton>
            <TwitterShareButton url={referralLink}>
              <button className="share-button twitter">Share on Twitter</button>
            </TwitterShareButton>
            <button onClick={closeModal} className="share-modal__close-button">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectReferralPage;
