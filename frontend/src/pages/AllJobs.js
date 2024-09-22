import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AllJobs.css";

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("/aak/l1/jobs"); // Adjust the endpoint as needed
        console.log(response);
        setJobs(response.data.jobs);
      } catch (err) {
        setError("Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="all-jobs">
      <h1 className="all-jobs-title">All Jobs</h1>
      <ul className="jobs-list">
        {jobs.map((job) => (
          <li key={job._id} className="job-item">
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
            <hr className="job-divider" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllJobs;
