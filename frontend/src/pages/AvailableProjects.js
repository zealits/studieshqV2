import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AvailableProjects.css"; // Import the CSS file for styles

const AvailableProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("/aak/l1/projects");
        setProjects(response.data.gigs); // Assuming response.data contains the projects
      } catch (err) {
        setError("Failed to fetch projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Function to format the date from ISO format to '31 Oct 2024'
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

  // Display a loading message while fetching projects
  if (loading) {
    return <div className="available-projects__loading">Loading projects...</div>;
  }

  // Display an error message if fetching projects fails
  if (error) {
    return <div className="available-projects__error">{error}</div>;
  }

  return (
    <div className="available-projects">
      <h2 className="available-projects__title">Available Projects</h2>
      {projects.length === 0 ? (
        <p className="available-projects__no-projects">No projects available.</p>
      ) : (
        <ul className="available-projects__projects-list">
          {projects.map((project) => (
            <li key={project._id} className="available-projects__project-item">
              <h3 className="available-projects__project-title">{project.title}</h3>
              <p className="available-projects__project-description">{project.description}</p>

              {/* Display the project's deadline in a user-friendly format */}
              <p className="available-projects__project-deadline">Deadline: {formatDate(project.deadline)}</p>

              {/* Display the project's budget with a clear message */}
              <p className="available-projects__project-budget">Referral gift: ${project.budget}</p>

              <h4 className="available-projects__jobs-title">Jobs:</h4>

              {project.selectedJobs.length === 0 ? (
                <p className="available-projects__no-jobs">No jobs available for this gig.</p>
              ) : (
                <ul className="available-projects__jobs-list">
                  {project.selectedJobs.map((job) => (
                    <li key={job._id} className="available-projects__job-item">
                      <p className="available-projects__job-title">{job.jobTitle}</p>
                      <p className="available-projects__job-location">{job.location}</p>
                      <p className="available-projects__job-description">{job.jobDescription}</p>
                      <button className="available-projects__apply-button">Apply</button>
                      <button className="available-projects__refer-button">Refer to a Friend</button>
                      <button className="available-projects__resume-button">Upload Resume</button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AvailableProjects;
