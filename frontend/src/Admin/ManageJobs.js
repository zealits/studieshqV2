import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./ManageJobs.css";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch jobs
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching jobs...");
      const response = await axios.get("/aak/l1/jobs");
      setJobs(response.data.jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error.message);
      setError("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle creating a new job
  const handleCreateJob = () => {
    // Implement the logic to navigate to the Create Job page or show a modal
    console.log("Navigating to create new job...");
  };

  // Function to handle syncing with Workday API
  const handleSyncWithWorkday = () => {
    // Implement the logic to sync with Workday API
    console.log("Syncing with Workday API...");
  };

  // useEffect to fetch jobs when the component mounts
  useEffect(() => {
    fetchJobs();
  }, []); // Empty dependency array means this runs once when the component mounts

  return (
    <div className="manage-jobs-container">
      <h1 className="manage-jobs-title">Manage Jobs</h1>

      {/* Buttons for creating a new job and syncing with Workday */}
      <div className="manage-jobs-actions">
        <button onClick={handleCreateJob} className="manage-create-job-button">
          Create New Job
        </button>
        <button onClick={handleSyncWithWorkday} className="manage-sync-workday-button">
          Sync with Workday API
        </button>
      </div>

      {loading && <div className="manage-loading">Loading...</div>}
      {error && <div className="manage-error">{error}</div>}
      <ul className="manage-jobs-list">
        {jobs.map((job) => (
          <li key={job._id} className="job-item">
            <Link to={`/jobs/${job._id}`} className="job-link">
              <div className="job-content">
                <h2 className="job-title">{job.jobTitle}</h2>
                <p className="job-company">
                  <strong>Company:</strong> {job.companyName}
                </p>
                <p className="job-location">
                  <strong>Location:</strong> {job.location}
                </p>
                <p className="job-salary">
                  <strong>Salary Range:</strong> {job.salaryRange}
                </p>
                <p className="job-summary">
                  <strong>Job Summary:</strong> {job.jobSummary}
                </p>
                <p className="job-posted-date">
                  <strong>Posted Date:</strong> {new Date(job.postedDate).toLocaleDateString()}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageJobs;
