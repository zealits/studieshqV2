import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./CreateProject.css";

const CreateProject = () => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [referralAmount, setReferralAmount] = useState('');
  const [contractPdf, setContractPdf] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      if (location) {
        try {
          const response = await axios.get(`/aak/l1/jobs?location=${location}`);
          const filteredJobs = response.data.jobs.filter((job) =>
            job.location.toLowerCase().includes(location.toLowerCase())
          );
          setJobs(filteredJobs);
        } catch (error) {
          console.error("Error fetching jobs:", error);
          setMessage("Error fetching jobs");
        }
      } else {
        setJobs([]);
      }
    };

    fetchJobs();
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      projectName,
      projectDescription,
      selectedJob,
      referralAmount,
      contractPdf,
    });
  };

  return (
    <div className="create-project">
      <h2>Create Project</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="projectName">Project Name:</label>
          <input
            type="text"
            id="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="projectDescription">Project Description:</label>
          <textarea
            id="projectDescription"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location to filter jobs"
          />
        </div>

        <div className="form-group">
          <label htmlFor="jobSelection">Select Job:</label>
          <select
            id="jobSelection"
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            required
          >
            <option value="" disabled>Select a job</option>
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title} - {job.location}
                </option>
              ))
            ) : (
              <option value="" disabled>No jobs available</option>
            )}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="referralAmount">Referral Amount:</label>
          <input
            type="number"
            id="referralAmount"
            value={referralAmount}
            onChange={(e) => setReferralAmount(e.target.value)}
            required
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="contractPdf">Select Contract PDF:</label>
          <select
            id="contractPdf"
            value={contractPdf}
            onChange={(e) => setContractPdf(e.target.value)}
            required
          >
            <option value="" disabled>Select a contract PDF</option>
            {/* Replace the following options with actual PDFs from your API */}
            <option value="contract1.pdf">Contract 1</option>
            <option value="contract2.pdf">Contract 2</option>
          </select>
        </div>

        {message && <p className="error-message">{message}</p>}

        <button type="submit">Create Project</button>
      </form>
    </div>
  );
};

export default CreateProject;
