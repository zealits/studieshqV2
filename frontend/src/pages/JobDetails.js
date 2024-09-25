import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./JobDetails.css";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState(null); // For showing application status

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`/aak/l1/job/${id}`);
        setJob(response.data.job);
      } catch (err) {
        setError("Failed to fetch job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  const handleApply = async () => {
    try {
      const response = await axios.post(`/aak/l1/job/${id}/apply`, {
        jobId: id, // Send job ID
        applicantName: "John Doe", // This would normally come from logged-in user data
        applicantEmail: "john.doe@example.com", // Replace with actual user data
      });
      setApplicationStatus("Application submitted successfully!");
    } catch (err) {
      setApplicationStatus("Failed to submit application.");
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!job) {
    return <div className="error">Job not found</div>;
  }

  return (
    <div className="job-details">
      <h1 className="job-details-title">{job.jobTitle}</h1>
      <p>
        <strong>Company:</strong> {job.companyName}
      </p>
      <p>
        <strong>Location:</strong> {job.location}
      </p>
      <p>
        <strong>Salary Range:</strong> {job.salaryRange}
      </p>
      <p>
        <strong>Job Type:</strong> {job.jobType}
      </p>
      <p>
        <strong>Employment Level:</strong> {job.employmentLevel}
      </p>
      <p>
        <strong>Job Summary:</strong> {job.jobSummary}
      </p>
      <p>
        <strong>Job Description:</strong> {job.jobDescription}
      </p>
      <p>
        <strong>Responsibilities:</strong> {job.responsibilities.join(", ")}
      </p>
      <p>
        <strong>Requirements:</strong> {job.requirements.join(", ")}
      </p>
      <p>
        <strong>Preferred Qualifications:</strong> {job.preferredQualifications.join(", ")}
      </p>
      <p>
        <strong>Posted Date:</strong> {new Date(job.postedDate).toLocaleDateString()}
      </p>
      <p>
        <strong>Application Deadline:</strong> {new Date(job.applicationDeadline).toLocaleDateString()}
      </p>
      <p>
        <strong>Job Status:</strong> {job.jobStatus}
      </p>

      {/* Apply button */}
      <button className="apply-button" onClick={handleApply}>
        Apply for this Job
      </button>
      {/* Display the application status */}
      {applicationStatus && <p className="application-status">{applicationStatus}</p>}
    </div>
  );
};

export default JobDetails;
