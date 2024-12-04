import React, { useEffect, useState } from "react";
import axios from "axios";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import "./ProjectReferrals.css";

// Register the components with Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const ProjectReferrals = () => {
  const [projects, setProjects] = useState([]);
  const [barChartData, setBarChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("/aak/l1/projects-with-referrals");
        if (response && response.data) {
          const projectsData = response.data;
          console.log(response.data);
          setProjects(projectsData);
          prepareChartData(projectsData);
        } else {
          console.error("API returned no data or unexpected structure.");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const prepareChartData = (projectsData) => {
    // Bar chart data
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

    // Pie chart data
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

      <div className="project-referrals__charts-row">
        {/* Bar Chart */}
        {barChartData && (
          <div className="project-referrals__chart project-referrals__chart--bar">
            <h3>Referrals per Project</h3>
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                  padding: 20,
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Projects",
                    },
                    ticks: {
                      autoSkip: true,
                      maxTicksLimit: 10,
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: "Referrals",
                    },
                    beginAtZero: true,
                  },
                },
                interaction: {
                  mode: "nearest",
                  intersect: true,
                },
                plugins: {
                  tooltip: {
                    enabled: true,
                    mode: "index",
                    intersect: false,
                    callbacks: {
                      label: function (tooltipItem) {
                        return `Project: ${tooltipItem.label}, Referrals: ${tooltipItem.raw}`;
                      },
                    },
                  },
                  legend: {
                    display: true,
                    position: "top",
                  },
                },
              }}
            />
          </div>
        )}

        {/* Pie Chart */}
        {pieChartData && (
          <div className="project-referrals__chart project-referrals__chart--pie">
            <h3>Job-Level Referral Status</h3>
            <Pie
              data={pieChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: "50%",
                layout: { padding: 20 },
                plugins: {
                  legend: { position: "bottom" },
                  tooltip: {
                    callbacks: {
                      label: (tooltipItem) => `${tooltipItem.raw} Referrals`,
                    },
                  },
                },
                animations: {
                  tension: { duration: 800, easing: "easeOutBounce" },
                },
              }}
              style={{ width: "300px", height: "300px" }}
            />
          </div>
        )}
      </div>

      {/* Referral Data Table */}
      {projects.map((project) => (
        <div key={project._id} className="project-referrals__project">
          <h3 className="project-referrals__project-title">{project.title}</h3>
          <p className="project-referrals__project-description">
            Referral Budget: <strong>${project.budget}</strong>
          </p>

          <h4 className="project-referrals__section-title">Project-Level Referrals</h4>
          <ul className="project-referrals__list">
            {project.projectReferrals.map((referral, idx) => (
              <li key={idx} className="project-referrals__list-item">
                <span className="referral__referred-by">Referred By: {referral.referredBy.firstName}</span>
                <span className="referral__referred-user">Referred User: {referral.referredUser.firstName}</span>
                <span className="referral__status">Status: {referral.status}</span>
                <span className="referral__date">Date: {new Date(referral.referralDate).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>

          <h4 className="project-referrals__section-title">Job-Level Referrals</h4>
          {project.selectedJobs.map((jobItem, jobIdx) => (
            <div key={jobIdx} className="project-referrals__job">
              <strong>Job:</strong> {jobItem.job.jobTitle} <br />
              <strong>Referral Amount:</strong> ${jobItem.referralAmount}
              <ul className="project-referrals__list">
                {jobItem.jobReferrals.map((jobReferral, refIdx) => (
                  <li key={refIdx} className="project-referrals__list-item">
                    <span className="referral__referred-by">Referred By: {jobReferral.referredBy.firstName}</span>
                    <span className="referral__referred-user">Referred User: {jobReferral.referredUser.firstName}</span>
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
