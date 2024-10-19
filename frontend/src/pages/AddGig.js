import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addGig, clearErrors } from "../Services/Actions/gigsActions.js";
import axios from "axios";
import "./AddGig.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const AddGig = () => {
  const [title, setTitle] = useState("");
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [deadline, setDeadline] = useState("");
  const [budget, setBudget] = useState("");
  const [selectedPdf, setSelectedPdf] = useState("");
  const [pdfs, setPdfs] = useState([]);
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.gig);

  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert("Gig added successfully");
      setTitle("");
      setSelectedJobs([]);
      setDeadline("");
      setBudget("");
      setSelectedPdf("");
      setLocation("");
      setJobs([]);
    }
  }, [dispatch, error, success]);

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const response = await axios.get("/aak/l1/contracts");
        setPdfs(response.data);
      } catch (error) {
        console.error("Error fetching PDFs:", error);
        setMessage("Error fetching files");
      }
    };

    fetchPdfs();
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      if (location) {
        try {
          const response = await axios.get(`/aak/l1/jobs?location=${location}`);
          const filteredJobs = response.data.jobs.filter(job => 
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

  const submitHandler = (e) => {
    e.preventDefault();

    const gigData = {
      title,
      jobs: selectedJobs,
      deadline,
      budget,
      pdf: selectedPdf,
    };

    dispatch(addGig(gigData));
  };

  const toggleJobModal = () => {
    setModalOpen((prev) => !prev);
  };

  const handleJobSelect = (jobId) => {
    setSelectedJobs((prevSelected) =>
      prevSelected.includes(jobId)
        ? prevSelected.filter((id) => id !== jobId)
        : [...prevSelected, jobId]
    );
  };

  return (
    <div className="add-gig-container">
      <form onSubmit={submitHandler} className="add-gig-form">
        <h1 className="add-gig-heading">Add Projects</h1>
        <div className="add-gig-field">
          <label className="add-gig-label">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="add-gig-input"
          />
        </div>
        <div className="add-gig-field">
          <label className="add-gig-label">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value.toLowerCase())}
            placeholder="Enter Location to filter jobs"
            className="add-gig-input"
          />
        </div>
        
        <button type="button" onClick={toggleJobModal} className="add-gig-dropdown-button">
          Select Jobs <FontAwesomeIcon icon={faChevronDown} />
        </button>

        <div className="add-gig-selected-jobs">
          <h3>Selected Jobs:</h3>
          {selectedJobs.length > 0 ? (
            <div className="add-gig-selected-jobs-list">
              {selectedJobs.map((jobId) => {
                const job = jobs.find((job) => job._id === jobId);
                return job ? (
                  <div key={jobId} className="add-gig-selected-jobs-item">
                    <span className="add-gig-selected-jobs-title">{job.jobTitle}</span>
                    <button
                      onClick={() => {
                        setSelectedJobs((prevSelected) => prevSelected.filter((id) => id !== jobId));
                      }}
                      className="add-gig-remove-button"
                      aria-label={`Remove ${job.jobTitle}`}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                ) : (
                  <div key={jobId} className="add-gig-selected-jobs-item">
                    Job not found
                  </div>
                );
              })}
            </div>
          ) : (
            <p>No jobs selected</p>
          )}
        </div>

        <div className="add-gig-field">
          <label className="add-gig-label">Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
            className="add-gig-input"
          />
        </div>
        <div className="add-gig-field">
          <label className="add-gig-label">Budget</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
            className="add-gig-input"
          />
        </div>
        <div className="add-gig-field">
          <label className="add-gig-label">Attach Contract</label>
          <select
            value={selectedPdf}
            onChange={(e) => setSelectedPdf(e.target.value)}
            required
            className="add-gig-input"
          >
            <option value="">Select a PDF</option>
            {pdfs.map((pdf) => (
              <option key={pdf._id} value={pdf._id}>
                {pdf.filename}
              </option>
            ))}
          </select>
        </div>
        {message && <p className="add-gig-error-message">{message}</p>}
        <button type="submit" disabled={loading} className="add-gig-submit-button">
          {loading ? "Loading..." : "Add Project"}
        </button>
      </form>

      {modalOpen && (
        <div className="add-gig-modal-overlay">
          <div className="add-gig-modal-content">
            <div className="add-gig-modal-header">
              <h2>Select Jobs</h2>
              <button className="add-gig-modal-close-button" onClick={toggleJobModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="add-gig-modal-list">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <div key={job._id} className="add-gig-modal-item">
                    <span className="add-gig-modal-title">{job.jobTitle}</span>
                    <input
                      type="checkbox"
                      checked={selectedJobs.includes(job._id)}
                      onChange={() => handleJobSelect(job._id)}
                    />
                  </div>
                ))
              ) : (
                <p>No jobs available for this location.</p>
              )}
            </div>
            <button className="add-gig-modal-submit-button" onClick={toggleJobModal}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddGig;
