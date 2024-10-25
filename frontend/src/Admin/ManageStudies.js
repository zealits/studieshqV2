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
      const response = await axios.get("/aak/l1/admin/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data); // Check if the data is structured correctly
      setProjects(response.data.gigs || []); // Make sure to access gigs
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Error fetching projects");
      setLoading(false);
    }
  };

  //   const handleDelete = async () => {
  //   if (studyToDelete) {
  //     setLoadingAction(true);
  //     try {
  //       await axios.delete(`/aak/l1/admin/gig/${studyToDelete._id}`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       // setGigs(gigs.filter((gig) => gig._id !== studyToDelete._id));
  //     } catch (error) {
  //       setError("Error deleting study");
  //     } finally {
  //       setLoadingAction(false);

  //     }
  //   }
  // };

  // Expose the fetch function to be called from AddGig component
  useEffect(() => {
    window.refreshProjects = fetchProjects;
    fetchProjects(); // Fetch projects on component mount

    // Clean up to avoid memory leaks
    return () => {
      window.refreshProjects = null;
    };
  }, [token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="manage-projects">
      <h1>Existing Projects</h1>
      {projects.length === 0 ? (
        <p>No projects available</p>
      ) : (
        projects.map((project) => (
          <div key={project._id} className="project-card">
            <h2 className="project-title">{project.title}</h2>
            {project.description && <p className="project-description">Description: {project.description}</p>}
            <p className="project-deadline">Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
            <p className="project-budget">Budget: ${project.budget}</p>
            <div className="project-jobs">
              <h3>Selected Jobs:</h3>
              {project.selectedJobs && project.selectedJobs.length > 0 ? (
                <ul>
                  {project.selectedJobs.map((job) => (
                    <li key={job._id} className="project-job-item ">
                      {job.jobTitle}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No jobs selected for this project.</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ManageProject;
