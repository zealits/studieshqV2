import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux"; // For accessing authentication status from Redux
import "./JobReferralPage.css";

const JobReferralPage = () => {
  const { jobId } = useParams();
  const query = new URLSearchParams(useLocation().search);
  const referringUserId = query.get("referral"); // Get referral ID from query parameters
  const referredProjectId = query.get("project"); // Get referral ID from query parameters
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user); // Check if user is authenticated
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`/aak/l1/job/${jobId}`);
        setJobDetails(response.data.job);
        localStorage.setItem("referringUserId", referringUserId); // Store referral ID locally
        localStorage.setItem("referredJobId", jobId); // Store referral ID locally
        localStorage.setItem("referredProjectId", referredProjectId); // Store referral ID locally
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [jobId, referringUserId]);

  const handleApplyClick = () => {
    if (!user) {
      // Redirect to registration page if not logged in, preserving referral information
      navigate(`/register?redirect=/apply/job/${jobId}&referral=${referringUserId}`);
    } else {
      // If logged in, proceed to application
      navigate(`/apply/job/${jobId}`);
    }
  };

  if (loading) return <div className="job-referral__loading">Loading...</div>;
  if (!jobDetails) return <div className="job-referral__not-found">Job not found</div>;

  return (
    <div className="job-referral">
      <h2 className="job-referral__title">{jobDetails.jobTitle}</h2>
      <p className="job-referral__description">{jobDetails.jobDescription}</p>
      <p className="job-referral__location">Location: {jobDetails.location}</p>
      <button onClick={handleApplyClick} className="job-referral__apply-button">
        Apply for Job
      </button>
    </div>
  );
};

export default JobReferralPage;
