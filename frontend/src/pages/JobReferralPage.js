import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import "./JobReferralPage.css"; // Include this line to add CSS

const JobReferralPage = () => {
  const { jobId } = useParams(); 
  const query = new URLSearchParams(useLocation().search);
  const referringUserId = query.get("referral");

  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`/aak/l1/job/${jobId}`);
        setJobDetails(response.data.job);
        localStorage.setItem("referringUserId", referringUserId);
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [jobId, referringUserId]);

  if (loading) return <div className="job-referral__loading">Loading...</div>;
  if (!jobDetails) return <div className="job-referral__not-found">Job not found</div>;

  return (
    <div className="job-referral">
      <h2 className="job-referral__title">{jobDetails.jobTitle}</h2>
      <p className="job-referral__description">{jobDetails.jobDescription}</p>
      <p className="job-referral__location">Location: {jobDetails.location}</p>
      <button className="job-referral__apply-button">Apply for Job</button>
    </div>
  );
};

export default JobReferralPage;
