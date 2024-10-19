import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addGig, clearErrors } from "../Services/Actions/gigsActions.js";
import axios from "axios";
import "./AddGig.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faChevronDown} from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faLinkedin, faWhatsapp } from '@fortawesome/free-brands-svg-icons'; // Correctly importing brand icons


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
    const [alert, setAlert] = useState({ visible: false, content: "" });
    const [shareModalOpen, setShareModalOpen] = useState(false);

    const dispatch = useDispatch();
    const { loading, error, success } = useSelector((state) => state.gig);

    useEffect(() => {
        if (error) {
            alert(error);
            dispatch(clearErrors());
        }

        if (success) {
            setAlert({ visible: true, content: `Successfully created project: ${title}` });
            setTitle("");
            setSelectedJobs([]);
            setDeadline("");
            setBudget("");
            setSelectedPdf("");
            setLocation("");
            setJobs([]);
        }
    }, [dispatch, error, success, title]);

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

    const handleShare = () => {
        setAlert({ visible: false, content: "" });
        setShareModalOpen(true);
    };

    const closeShareModal = () => {
        setShareModalOpen(false);
    };

    const shareOnSocialMedia = (platform) => {
        const url = window.location.href; // Current URL
        const message = `Check out this project: ${title}`;
        let shareUrl = "";

        switch (platform) {
            case "facebook":
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case "twitter":
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(message)}`;
                break;
            case "linkedin":
                shareUrl = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
                break;
            case "whatsapp":
                shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}%20${encodeURIComponent(url)}`;
                break;
            case "email":
                shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(message + ' ' + url)}`;
                break;
            default:
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, "_blank");
        }
    };

    return (
        <div className="add-gig-container">
            {alert.visible && (
                <div className="add-gig-alert">
                    <p>{alert.content}</p>
                    <button onClick={handleShare} className="share-button">Share</button>
                    <button onClick={() => setAlert({ ...alert, visible: false })}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
            )}

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
                        <option value="">Select Contract</option>
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

            {/* Share Modal */}
            {shareModalOpen && (
    <div className="share-modal-overlay">
        <div className="share-modal-content">
            <div className="share-modal-header">
                <h2>Share Gig</h2>
                <button onClick={closeShareModal}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>
            <div className="share-modal-body">
                <p>Share this project with others:</p>
                <button onClick={() => shareOnSocialMedia('facebook')} className="share-button">
                    <FontAwesomeIcon icon={faFacebook} />
                </button>
                <button onClick={() => shareOnSocialMedia('twitter')} className="share-button">
                    <FontAwesomeIcon icon={faTwitter} />
                </button>
                <button onClick={() => shareOnSocialMedia('linkedin')} className="share-button">
                    <FontAwesomeIcon icon={faLinkedin} />
                </button>
                <button onClick={() => shareOnSocialMedia('whatsapp')} className="share-button">
                    <FontAwesomeIcon icon={faWhatsapp} />
                </button>
                {/* <button onClick={() => shareOnSocialMedia('email')} className="share-button">
                    <FontAwesomeIcon icon={faEnvelope} />
                </button> */}
                {/* <button onClick={closeShareModal}>Close</button> */}
            </div>
        </div>
    </div>
)}

        </div>
    );
};

export default AddGig;
