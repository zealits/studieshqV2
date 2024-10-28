import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProjectReferrals.css";
import { Bar, Pie } from "react-chartjs-2";

const ProjectReferrals = () => {
  const [projects, setProjects] = useState([]);
  const [barChartData, setBarChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("/aak/l1/projects-with-referrals");
        const projectsData = response.data;
        setProjects(projectsData);
        prepareChartData(projectsData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  const prepareChartData = (projectsData) => {
    // Bar chart data: count referrals per project
    const projectTitles = projectsData.map((project) => project.title);
    const referralCounts = projectsData.map((project) => project.projectReferrals.length);

    setBarChartData({
      labels: projectTitles,
      datasets: [
        {
          label: "Referrals per Project",
          data: referralCounts,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    });

    // Pie chart data: job-level referral status distribution
    const statusCounts = { pending: 0, applied: 0, hired: 0 };
    projectsData.forEach((project) => {
      project.selectedJobs.forEach((job) => {
        job.jobReferrals.forEach((referral) => {
          statusCounts[referral.status] = (statusCounts[referral.status] || 0) + 1;
        });
      });
    });

    setPieChartData({
      labels: Object.keys(statusCounts),
      datasets: [
        {
          data: Object.values(statusCounts),
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        },
      ],
    });
  };

  return (
    <div className="project-referrals">
      <h2 className="project-referrals__title">Project Referrals</h2>

      {/* Bar Chart for Project-Level Referral Counts */}
      {barChartData && (
        <div className="project-referrals__chart">
          <h3>Referrals per Project</h3>
          <Bar data={barChartData} options={{ responsive: true }} />
        </div>
      )}

      {/* Pie Chart for Job-Level Referral Status Distribution */}
      {pieChartData && (
        <div className="project-referrals__chart">
          <h3>Job-Level Referral Status</h3>
          <Pie data={pieChartData} options={{ responsive: true }} />
        </div>
      )}

      {/* Referral Data Table */}
      {projects.map((project) => (
        <div key={project._id} className="project-referrals__project">
          <h3 className="project-referrals__project-title">{project.title}</h3>
          <p className="project-referrals__project-description">{project.description}</p>

          <h4 className="project-referrals__section-title">Project-Level Referrals</h4>
          <ul className="project-referrals__list">
            {project.projectReferrals.map((referral, idx) => (
              <li key={idx} className="project-referrals__list-item">
                <span className="referral__referred-by">Referred By: {referral.referredBy.name}</span>
                <span className="referral__referred-user">Referred User: {referral.referredUser.name}</span>
                <span className="referral__status">Status: {referral.status}</span>
                <span className="referral__date">Date: {new Date(referral.referralDate).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>

          <h4 className="project-referrals__section-title">Job-Level Referrals</h4>
          {project.selectedJobs.map((jobItem, jobIdx) => (
            <div key={jobIdx} className="project-referrals__job">
              <strong>Job:</strong> {jobItem.job.title} <br />
              <strong>Referral Amount:</strong> ${jobItem.referralAmount}
              <ul className="project-referrals__list">
                {jobItem.jobReferrals.map((jobReferral, refIdx) => (
                  <li key={refIdx} className="project-referrals__list-item">
                    <span className="referral__referred-by">Referred By: {jobReferral.referredBy.name}</span>
                    <span className="referral__referred-user">Referred User: {jobReferral.referredUser.name}</span>
                    <span className="referral__status">Status: {jobReferral.status}</span>
                    <span className="referral__date">
                      Date: {new Date(jobReferral.referralDate).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ProjectReferrals;
