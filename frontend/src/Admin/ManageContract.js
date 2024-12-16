import React, { useState } from "react";
import "./ManageContract.css";

const ManageContract = () => {
  const [formData, setFormData] = useState({
    projectName: "",
    projectDescription: "",
    jobRoles: [],
    jobResponsibilities: [],
    paymentFrequency: "",
    benefits: [],
    confidentialityAgreement: "",
    intellectualPropertyAgreement: "",
    performanceMetrics: "",
    terminationConditions: "",
    disputeResolutionMethod: "",
    noticePeriod: "",
    status: "Pending", // Default status
  });

  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState("");
  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddItem = (field) => {
    const newItem = prompt(`Enter ${field}:`);
    if (newItem) {
      setFormData({ ...formData, [field]: [...formData[field], newItem] });
    }
  };

  const handleRemoveItem = (field, index) => {
    const updatedList = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updatedList });
  };

  const handleFormSubmit = () => {
    alert("Form submitted successfully!");
    console.log("Form Data:", formData);
    setShowModal(false); // Close the modal after submission
  };

  return (
    <div className="manage-contract">
      <div className="manage-contract-header">
        <h1 className="manage-contract-title">Manage Contract</h1>
        <button className="manage-contract-create-btn" onClick={() => setShowModal(true)}>
          Create Contract
        </button>
      </div>

      <table className="manage-contract-table">
        <thead>
          <tr>
            <th className="manage-contract-table-header">Contract Name</th>
            <th className="manage-contract-table-header">Date</th>
            <th className="manage-contract-table-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="manage-contract-table-data">Sample Contract</td>
            <td className="manage-contract-table-data">30/10/2024</td>
            <td className="manage-contract-table-data">
              <button
                className="manage-contract-action-btn view-btn"
                onClick={() => alert("View PDF functionality not implemented yet.")}
              >
                View PDF
              </button>
              <button
                className="manage-contract-action-btn update-btn"
                onClick={() => alert("Update functionality not implemented yet.")}
              >
                Update
              </button>
              <button
                className="manage-contract-action-btn delete-btn"
                onClick={() => alert("Delete functionality not implemented yet.")}
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Modal for Creating Contract */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Create Contract</h2>
            <form className="modal-form">
              <div className="form-group">
                <label className="form-label">Project Name:</label>
                <input
                  type="text"
                  className="form-input"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Project Description:</label>
                <textarea
                  className="form-textarea"
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleInputChange}
                />
              </div>

              {/* Job Roles */}
              <div className="form-group">
                <label className="form-label">Job Roles:</label>
                <div className="dynamic-input-container">
                  <input
                    type="text"
                    className="form-input"
                    value={newItem}
                    placeholder="Enter a job role"
                    onChange={(e) => setNewItem(e.target.value)}
                  />
                  <button type="button" className="dynamic-input-add-btn" onClick={() => handleAddItem("jobRoles")}>
                    Add
                  </button>
                </div>
                <ul className="dynamic-list">
                  {formData.jobRoles.map((role, index) => (
                    <li key={index} className="dynamic-list-item">
                      {role}
                      <button
                        type="button"
                        className="dynamic-list-remove-btn"
                        onClick={() => handleRemoveItem("jobRoles", index)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Job Responsibilities */}
              <div className="form-group">
                <label className="form-label">Job Responsibilities:</label>
                <div className="dynamic-input-container">
                  <input
                    type="text"
                    className="form-input"
                    value={newItem}
                    placeholder="Enter a responsibility"
                    onChange={(e) => setNewItem(e.target.value)}
                  />
                  <button
                    type="button"
                    className="dynamic-input-add-btn"
                    onClick={() => handleAddItem("jobResponsibilities")}
                  >
                    Add
                  </button>
                </div>
                <ul className="dynamic-list">
                  {formData.jobResponsibilities.map((responsibility, index) => (
                    <li key={index} className="dynamic-list-item">
                      {responsibility}
                      <button
                        type="button"
                        className="dynamic-list-remove-btn"
                        onClick={() => handleRemoveItem("jobResponsibilities", index)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="form-group">
                <label className="form-label">Payment Frequency:</label>
                <input
                  type="text"
                  className="form-input"
                  name="paymentFrequency"
                  value={formData.paymentFrequency}
                  onChange={handleInputChange}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="modal-submit-btn" onClick={handleFormSubmit}>
                  Submit
                </button>
                <button type="button" className="modal-cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageContract;
