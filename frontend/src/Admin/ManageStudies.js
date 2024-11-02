import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "./ManageStudies.css"; // Ensure this CSS file exists for custom styles

const ManageProject = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studyToDelete, setStudyToDelete] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const token = useSelector((state) => state.user.token);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/aak/l1/user/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setProjects(response.data.projects || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Error fetching projects");
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      setLoadingAction(true);
      try {
        await axios.delete(`/aak/l1/user/projects/${projectId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProjects(projects.filter((project) => project._id !== projectId));
        setLoadingAction(false);
      } catch (error) {
        console.error("Error deleting project:", error);
        setError("Error deleting project");
        setLoadingAction(false);
      }
    }
  };

  const handleEditProject = (projectId) => {
    // Logic to open an edit modal or navigate to an edit page
    console.log("Edit project with ID:", projectId);
    // Open a modal or navigate to an edit form
  };

  // Expose the fetch function to be called from AddGig component
  useEffect(() => {
    window.refreshProjects = fetchProjects;
    fetchProjects();

    // Clean up to avoid memory leaks
    return () => {
      window.refreshProjects = null;
    };
  }, [token]);

  if (loading) return <div className="manage-projects__loading">Loading...</div>;
  if (error) return <div className="manage-projects__error-message">{error}</div>;

  return (
    <div className="manage-projects">
      <h1 className="manage-projects__title">Manage Projects</h1>
      {projects.length === 0 ? (
        <p className="manage-projects__no-projects">No projects available</p>
      ) : (
        projects.map((project) => (
          <div key={project._id} className="manage-projects__project-card">
            <h2 className="manage-projects__project-title">{project.title}</h2>
            {project.description && (
              <p className="manage-projects__project-description">
                Description: {project.description}
              </p>
            )}
            <p className="manage-projects__project-deadline">
              Deadline: {new Date(project.deadline).toLocaleDateString()}
            </p>
            <p className="manage-projects__project-budget">
              Referral Gift: ${project.budget}
            </p>
            <div className="manage-projects__project-jobs">
              <h3 className="manage-projects__project-jobs-title">Selected Jobs:</h3>
              {project.selectedJobs && project.selectedJobs.length > 0 ? (
                <ul className="manage-projects__job-list">
                  {project.selectedJobs.map((job) => (
                    <li key={job._id} className="manage-projects__job-item">
                      <p className="manage-projects__job-title">{job.job.jobTitle}</p>
                      <p className="manage-projects__job-location">{job.job.location}</p>
                      <p className="manage-projects__job-description">{job.job.jobDescription}</p>
                      <p className="manage-projects__job-referral">
                        Referral Gift: <strong>${job.referralAmount}</strong>
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="manage-projects__no-selected-jobs">No jobs selected for this project.</p>
              )}
            </div>
            <div className="manage-projects__actions">
              <button
                className="manage-projects__edit-button"
                onClick={() => handleEditProject(project._id)}
              >
                Edit
              </button>
              <button
                className="manage-projects__delete-button"
                onClick={() => handleDeleteProject(project._id)}
                disabled={loadingAction}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ManageProject;
