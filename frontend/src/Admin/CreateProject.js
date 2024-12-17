import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CreateProject.css";
import Modal from "../components/Modal";

const CreateProject = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [selectedPdf, setSelectedPdf] = useState("");
  const [pdfs, setPdfs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [totalReferralBudget, setTotalReferralBudget] = useState(0);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [modalMessage, setModalMessage] = useState(""); // State for modal message

  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`/aak/l1/jobs`);
        setJobs(response.data.jobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  // Fetch contracts for the PDF dropdown
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await axios.get("/aak/l1/contracts");
        console.log(response.data);
        setPdfs(response.data);
      } catch (error) {
        console.error("Error fetching contracts:", error);
      }
    };
    fetchContracts();
  }, []);

  const handleJobSelection = (jobId) => {
    setSelectedJobs((prevSelected) => {
      const jobExists = prevSelected.find((job) => job.id === jobId);
      let updatedSelection;

      if (jobExists) {
        // Remove the job if it already exists in the selected list
        updatedSelection = prevSelected.filter((job) => job.id !== jobId);
      } else {
        // Add the job if it is not in the selected list
        const selectedJob = jobs.find((job) => job._id === jobId);
        updatedSelection = [...prevSelected, { id: jobId, jobTitle: selectedJob.jobTitle, referralAmount: 0 }];
      }

      // Recalculate the total referral budget
      const total = updatedSelection.reduce((sum, job) => sum + job.referralAmount, 0);
      setTotalReferralBudget(total);

      return updatedSelection;
    });
  };

  const updateReferralAmount = (jobId, newAmount) => {
    setSelectedJobs((prevSelected) => {
      const updatedSelection = prevSelected.map((job) =>
        job.id === jobId ? { ...job, referralAmount: newAmount } : job
      );

      // Calculate total referral budget after each update
      const total = updatedSelection.reduce((sum, job) => sum + job.referralAmount, 0);
      setTotalReferralBudget(total);

      return updatedSelection;
    });
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.jobTitle.toLowerCase().includes(searchTitle.toLowerCase()) &&
      job.location.toLowerCase().includes(searchLocation.toLowerCase())
  );

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Prepare the data to send to the API
    const projectData = {
      title,
      description,
      selectedJobs: selectedJobs.map((job) => ({
        job: job.id,
        referralAmount: job.referralAmount,
      })),
      deadline,
      budget: totalReferralBudget,
      pdf: selectedPdf,
    };

    try {
      const response = await axios.post("/aak/l1/admin/project", projectData);

      setModalMessage("Project created successfully!"); // Set success message
      setShowModal(true); // Show modal
      // Optionally, reset the form or redirect to another page
    } catch (error) {
      setModalMessage("Error creating project. Please try again."); // Set error message
      setShowModal(true); // Show modal
    }
  };

  const closeModal = () => {
    setShowModal(false); // Close modal
  };

  return (
    <div className="create-project-container">
      {showModal && <Modal message={modalMessage} onClose={closeModal} />}

      <div className="project-details">
        <h2 className="create-project-heading">Create Project</h2>
        <form className="project-form" onSubmit={handleSubmit}>
          <label>
            Title:
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label>
            Description:
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
          </label>
          <label>
            Deadline:
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
          </label>
          <div className="add-contract-field">
            <label className="add-contract-label">Attach Contract</label>
            <select
              value={selectedPdf}
              onChange={(e) => setSelectedPdf(e.target.value)}
              required
              className="add-contract-input"
            >
              <option value="">Select Contract</option>
              {pdfs.map((pdf) => (
                <option key={pdf._id} value={pdf._id}>
                  {pdf.projectDetails.projectName}
                </option>
              ))}
            </select>
          </div>

          <h3>Selected Jobs</h3>
          <div className="selected-jobs">
            <div className="selected-jobs-headings">
              <span className="heading-job">Job</span>
              <span className="heading-referral">Referral Amount</span>
              <span className="heading-action">Action</span>
            </div>
            {selectedJobs.map((job) => (
              <div key={job.id} className="selected-job-item">
                <label>{job.jobTitle}</label>
                <input
                  type="number"
                  value={job.referralAmount}
                  onChange={(e) => updateReferralAmount(job.id, parseFloat(e.target.value) || 0)}
                  placeholder="Enter referral amount"
                />
                <button type="button" className="remove-job-button" onClick={() => handleJobSelection(job.id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <p className="total-referral-budget">Total Referral Budget: {totalReferralBudget}</p>
          <button type="submit" className="create-project-button">
            Create Project
          </button>
        </form>
      </div>

      <div className="job-search">
        <h3>Search and Filter Jobs</h3>
        <div className="search-filters">
          <label>
            Job Title:
            <input
              type="text"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              placeholder="Search by title"
            />
          </label>
          <label>
            Location:
            <input
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              placeholder="Search by location"
            />
          </label>
        </div>

        <h4 className="heading-available-jobs">Available Jobs</h4>
        <div className="available-jobs">
          {filteredJobs.map((job) => (
            <div key={job._id} className="job-item-project">
              <input
                type="checkbox"
                checked={selectedJobs.some((selected) => selected.id === job._id)}
                onChange={() => handleJobSelection(job._id)}
              />
              <label>
                {job.jobTitle} - {job.location}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
