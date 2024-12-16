import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import SignatureCanvas from "react-signature-canvas";
import "./CreateContract.css";

const CreateContract = () => {
  // State to hold form data
  const [formData, setFormData] = useState({
    applicantName: "",
    applicantAddress: "",
    projectName: "",
    projectDescription: "",
    jobRoles: [], // Array to store multiple job roles
    jobResponsibilities: [], // Array to store multiple responsibilities
    salary: "",
    paymentFrequency: "",
    benefits: [], // Array to store multiple benefits
    confidentialityAgreement: false, // Boolean
    intellectualPropertyAgreement: false, // Boolean
    performanceMetrics: "",
    terminationConditions: "",
    disputeResolutionMethod: "",
    noticePeriod: "",
    signatureDate: "",
    signedByApplicant: false,
    signedByEmployer: false,
    employerDetails: {
      employerName: "",
      employerSignature: "",
      employerRepresentative: "",
      employerAddress: "",
    },
    status: "Pending", // Default status
  });

  const [contracts, setContracts] = useState([]);

  // Ref to manage the signature canvas
  const sigCanvas = useRef({});

  // Function to handle form input changes
  const handleChange = (e, field) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else if (name === "jobRoles" || name === "jobResponsibilities" || name === "benefits") {
      // For fields that are arrays
      const newArray = value.split(",").map((item) => item.trim());
      setFormData({
        ...formData,
        [name]: newArray,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Function to handle digital signature
  const handleClearSignature = () => {
    sigCanvas.current.clear();
    setFormData({ ...formData, signature: "" });
  };

  const handleSaveSignature = () => {
    // Save the signature as a base64 string
    const signature = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
    setFormData({ ...formData, signature });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure the filename ends with .pdf
    // const filename = formData.filename.endsWith(".pdf") ? formData.filename : `${formData.filename}.pdf`;
    const updatedFormData = { ...formData };

    try {
      // Send form data to backend
      const response = await axios.post("/aak/l1/contracts", updatedFormData);
      console.log("Contract created successfully:", response.data);
      alert("Contract created successfully!");

      fetchContracts();
    } catch (error) {
      console.error("Error creating contract:", error);
      alert("Failed to create contract. Please try again.");
    }
  };

  const fetchContracts = async () => {
    try {
      const response = await axios.get("/aak/l1/contracts");
      console.log(response);
      setContracts(response.data); // Assuming response.data is an array of contracts
    } catch (error) {
      console.error("Error fetching contracts:", error);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  // Convert byte array to base64 string
  const byteArrayToBase64 = (byteArray) => {
    let binary = "";
    const bytes = new Uint8Array(byteArray);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    console.log(btoa(binary));
    return window.btoa(binary);
  };

  return (
    <div>
      <div className="create-contract-container">
        <h2 className="create-contract-title">Create Contract</h2>

        <form className="create-contract-form" onSubmit={handleSubmit}>
          <div className="create-contract-field">
            <label htmlFor="projectName" className="create-contract-label">
              Project Name:
            </label>
            <input
              id="projectName"
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              required
              className="create-contract-input"
            />
          </div>

          <div className="create-contract-field">
            <label htmlFor="projectDescription" className="create-contract-label">
              Project Description:
            </label>
            <textarea
              id="projectDescription"
              name="projectDescription"
              value={formData.projectDescription}
              onChange={handleChange}
              required
              className="create-contract-input"
            />
          </div>

          <div className="create-contract-field">
            <label htmlFor="jobRoles" className="create-contract-label">
              Job Roles (Separate multiple roles with commas):
            </label>
            <input
              id="jobRoles"
              type="text"
              name="jobRoles"
              value={formData.jobRoles.join(", ")} // Display array as comma-separated string
              onChange={(e) => handleChange(e, "jobRoles")}
              className="create-contract-input"
            />
          </div>

          <div className="create-contract-field">
            <label htmlFor="jobResponsibilities" className="create-contract-label">
              Job Responsibilities (Separate multiple with commas):
            </label>
            <input
              id="jobResponsibilities"
              type="text"
              name="jobResponsibilities"
              value={formData.jobResponsibilities.join(", ")} // Display array as comma-separated string
              onChange={(e) => handleChange(e, "jobResponsibilities")}
              className="create-contract-input"
            />
          </div>

          <div className="create-contract-field">
            <label htmlFor="salary" className="create-contract-label">
              Salary:
            </label>
            <input
              id="salary"
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              required
              className="create-contract-input"
            />
          </div>

          <div className="create-contract-field">
            <label htmlFor="paymentFrequency" className="create-contract-label">
              Payment Frequency:
            </label>
            <input
              id="paymentFrequency"
              type="text"
              name="paymentFrequency"
              value={formData.paymentFrequency}
              onChange={handleChange}
              required
              className="create-contract-input"
            />
          </div>

          <div className="create-contract-field">
            <label htmlFor="benefits" className="create-contract-label">
              Benefits (Separate with commas):
            </label>
            <input
              id="benefits"
              type="text"
              name="benefits"
              value={formData.benefits.join(", ")} // Display array as comma-separated string
              onChange={(e) => handleChange(e, "benefits")}
              className="create-contract-input"
            />
          </div>

          <div className="create-contract-field">
            <label htmlFor="confidentialityAgreementText" className="create-contract-label">
              Confidentiality Agreement:
            </label>
            <textarea
              id="confidentialityAgreementText"
              name="confidentialityAgreementText"
              value={formData.confidentialityAgreementText}
              onChange={handleChange}
              className="create-contract-input"
              placeholder="Enter details of the Confidentiality Agreement"
            />
          </div>

          <div className="create-contract-field">
            <label htmlFor="intellectualPropertyAgreementText" className="create-contract-label">
              Intellectual Property Agreement:
            </label>
            <textarea
              id="intellectualPropertyAgreementText"
              name="intellectualPropertyAgreementText"
              value={formData.intellectualPropertyAgreementText}
              onChange={handleChange}
              className="create-contract-input"
              placeholder="Enter details of the Intellectual Property Agreement"
            />
          </div>

          <div className="create-contract-field">
            <label htmlFor="performanceMetrics" className="create-contract-label">
              Performance Metrics:
            </label>
            <textarea
              id="performanceMetrics"
              name="performanceMetrics"
              value={formData.performanceMetrics}
              onChange={handleChange}
              required
              className="create-contract-input"
            />
          </div>

          <div className="create-contract-field">
            <label htmlFor="terminationConditions" className="create-contract-label">
              Termination Conditions:
            </label>
            <textarea
              id="terminationConditions"
              name="terminationConditions"
              value={formData.terminationConditions}
              onChange={handleChange}
              required
              className="create-contract-input"
            />
          </div>

          <div className="create-contract-field">
            <label htmlFor="disputeResolutionMethod" className="create-contract-label">
              Dispute Resolution Method:
            </label>
            <input
              id="disputeResolutionMethod"
              type="text"
              name="disputeResolutionMethod"
              value={formData.disputeResolutionMethod}
              onChange={handleChange}
              required
              className="create-contract-input"
            />
          </div>

          <div className="create-contract-field">
            <label htmlFor="noticePeriod" className="create-contract-label">
              Notice Period:
            </label>
            <input
              id="noticePeriod"
              type="text"
              name="noticePeriod"
              value={formData.noticePeriod}
              onChange={handleChange}
              required
              className="create-contract-input"
            />
          </div>

          {/* Uncomment and use SignatureCanvas if required */}

          <button type="submit" className="create-contract-submit-button">
            Create Contract
          </button>
        </form>
      </div>
      <div className="contracts-list">
        {contracts.map((contract) => {
          const base64Data = contract.pdfData.data ? byteArrayToBase64(contract.pdfData.data) : "";

          return (
            <div key={contract._id} className="contract-item">
              <p>
                <strong>Project Title:</strong> {contract.projectDetails ? contract.projectDetails.projectName : "N/A"}{" "}
                {/* Accessing projectDetails object */}
              </p>

              {/* Display PDF if it exists */}
              {contract.pdfData && (
                <div className="contract-pdf">
                  <h4>Contract :</h4>
                  <iframe
                    src={`data:application/pdf;base64,${base64Data}`}
                    title="Contract PDF"
                    width="500"
                    height="400"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CreateContract;

{
  /* <div className="create-contract-signature">
            <label className="create-contract-label">Signature:</label>
            <SignatureCanvas
              penColor="blue"
              canvasProps={{ width: 300, height: 200, className: "create-contract-signatureCanvas" }}
              ref={sigCanvas}
            />
            <div className="create-contract-signature-buttons">
              <button type="button" className="create-contract-save-button" onClick={handleSaveSignature}>
                Save Signature
              </button>
              <button type="button" className="create-contract-clear-button" onClick={handleClearSignature}>
                Clear Signature
              </button>
            </div>
          </div> */
}





