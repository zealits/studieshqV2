import React, { useEffect, useState } from "react";
import axios from "axios";
import { FacebookShareButton, WhatsappShareButton, LinkedinShareButton, TwitterShareButton } from "react-share";
import { useSelector } from "react-redux";
import "./AvailableProjects.css";

const AvailableProjects = () => {
  const { user } = useSelector((state) => state.user);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("/aak/l1/user/projects");
        setProjects(response.data.projects);
      } catch (err) {
        setError("Failed to fetch projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

  const referFriend = async (projectId, jobId) => {
    try {
      const response = await axios.post("aak/l1/generate-link", { projectId, jobId, referringUserId: user._id });
      setReferralLink(response.data.referralLink);
      setShowModal(true);
    } catch (error) {
      console.error("Error generating referral link:", error);
      alert("Failed to generate referral link.");
    }
  };

  const referProject = async (projectId) => {
    try {
      const response = await axios.post("aak/l1/generate-link", { projectId, referringUserId: user._id });
      setReferralLink(response.data.referralLink);
      setShowModal(true);
    } catch (error) {
      console.error("Error generating project referral link:", error);
      alert("Failed to generate project referral link.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (loading) return <div className="available-projects__loading">Loading projects...</div>;
  if (error) return <div className="available-projects__error">{error}</div>;

  return (
    <div className="available-projects">
      <h2 className="available-projects__title">Available Projects</h2>
      {projects.length === 0 ? (
        <p className="available-projects__no-projects">No projects available.</p>
      ) : (
        <ul className="available-projects__projects-list">
          {projects.map((project) => (
            <li key={project._id} className="available-projects__project-item">
              <h3 className="available-projects__project-title">{project.title}</h3>
              <p className="available-projects__project-description">{project.description}</p>
              <p className="available-projects__project-deadline">Deadline: {formatDate(project.deadline)}</p>
              <p className="available-projects__project-budget">Referral Gift: ${project.budget}</p>

              {/* Button to refer the entire project */}
              <button onClick={() => referProject(project._id)} className="available-projects__refer-project-button">
                Refer Entire Project
              </button>

              <h4 className="available-projects__jobs-title">Jobs:</h4>
              {project.selectedJobs.length === 0 ? (
                <p className="available-projects__no-jobs">No jobs available for this gig.</p>
              ) : (
                <ul className="available-projects__jobs-list">
                  {project.selectedJobs.map((job) => (
                    <li key={job._id} className="available-projects__job-item">
                      <p className="available-projects__job-title">{job.job.jobTitle}</p>
                      <p className="available-projects__job-location">{job.job.location}</p>
                      <p className="available-projects__job-description">{job.job.jobDescription}</p>
                      <p className="available-projects__job-referral">
                        Referral Gift: <strong>${job.referralAmount}</strong>
                      </p>
                      <button className="available-projects__apply-button">Apply</button>
                      <button
                        onClick={() => referFriend(project._id, job.job._id)}
                        className="available-projects__refer-button"
                      >
                        Refer to a Friend
                      </button>
                      <button className="available-projects__resume-button">Upload Resume</button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Modal for social media sharing options */}
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

export default AvailableProjects;
