import React, { useState } from 'react';
import { Link } from "react-router-dom";
import axios from "axios";
import './ManageJobs.css'; 

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobs = async () => {
    setLoading(true); 
    setError(null); 
    try {
      console.log("Fetching jobs...");
      const response = await axios.get('/aak/l1/jobs'); 
      setJobs(response.data.jobs); 
    } catch (error) {
      console.error('Error fetching jobs:', error.message);
      setError("Failed to fetch jobs");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="manage-jobs-container">
      <h1 className="manage-jobs-title">Manage Jobs</h1>
      {/* Render the button only if jobs are not fetched */}
      {jobs.length === 0 && !loading && (
        <button onClick={fetchJobs} className="manage-fetch-jobs-button">Fetch Jobs</button>
      )}
      {loading && <div className="manage-loading">Loading...</div>}
      {error && <div className="manage-error">{error}</div>}
      <ul className="manage-jobs-list">
        {jobs.map((job) => (
          <li key={job._id} className="job-item">
            {/* The Link component should work for navigation */}
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
