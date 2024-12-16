import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import { loadUser } from "./Services/Actions/userAction.js";
import Home from "./pages/Home";
import MyGigs from "./pages/MyGigs";
import AvailableGigs from "./pages/AvailableGigs";
import AvailableProjects from "./pages/AvailableProjects.js";
import Earnings from "./pages/Earnings";
import Profile from "./pages/Profile";
import Preferences from "./pages/Preferences";
import KnowledgeBank from "./pages/KnowledgeBank";
import Support from "./pages/Support";
import Message from "./pages/Messages";
import PandaLogin from "./pages/PandaLogin";
import Sidebar from "./components/Sidebar";
import AddGig from "./pages/AddGig";
import AllJobs from "./pages/AllJobs.js";
import JobReferralPage from "./pages/JobReferralPage.js";
import ProjectReferralPage from "./pages/ProjectReferralPage.js";
import JobDetails from "./pages/JobDetails.js";
import AdminDashboard from "./pages/AdminDashboard.js";
import Loading from "./components/Loading.js";
import AdminSidebar from "./components/AdminSidebar.js";
import ManageUser from "./Admin/ManageUser.js";
import ManageStudies from "./Admin/ManageStudies.js";
import ManagePayout from "./Admin/ManagePayout.js";
import ProjectReferrals from "./Admin/ProjectReferrals.js";
import ManagePdf from "./Admin/ManagePdf.js";
import SuperAdminDashboard from "./superAdmin/SuperAdminDashboard.js";
import SuperAdminSidebar from "./superAdmin/SuperAdminSidebar.js";
import Modal from "react-modal";
import Invoice from "./Admin/Invoice.js";
import ManageJobs from "./Admin/ManageJobs.js";
import TotpPage from "./components/TotpPage.js";
import TwoFactorAuthPage from "./components/TwoFactorAuthPage.js";
import "./App.css"; // Import the CSS for layout
import axios from "axios";
import CreateContract from "./Admin/CreateContract.js";
import ManageContract from "./Admin/ManageContract.js";
import UpdateContract from "./Admin/updateContract.js";
import CreateProject from "./Admin/CreateProject.js";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, user, totpVerified } = useSelector((state) => state.user);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [showTOTPForm, setShowTOTPForm] = useState(false);

  useEffect(() => {
    dispatch(loadUser()); // Load user data on app load
  }, [dispatch]);

  const handle2FA = async (activate) => {
    if (activate) {
      try {
        // Make an API call to enable 2FA
        const response = await axios.post("/aak/l1/enable-2fa");
        const qrCodeUrl = response.data.qrCodeUrl;

        setQrCodeUrl(qrCodeUrl);
        setShow2FAModal(false); // Close the initial 2FA modal
      } catch (error) {
        console.error("Error enabling 2FA:", error);
        alert("Failed to enable 2FA");
      }
    } else {
      setShow2FAModal(false);
    }
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    const newCode = verificationCode.split("");
    newCode[index] = value.slice(0, 1);

    setVerificationCode(newCode.join(""));

    // Focus on the next input box
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const [totpCode, setTotpCode] = useState("");

  const handleTOTPChange = (e, index) => {
    const value = e.target.value;
    const newCode = totpCode.split("");
    newCode[index] = value.slice(0, 1);

    setTotpCode(newCode.join(""));

    // Focus on the next input box
    if (value && index < 5) {
      const nextInput = document.getElementById(`totp-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleVerification = async () => {
    try {
      const response = await axios.post("/aak/l1/verify-2fa", { token: totpCode });

      if (response.data.message === "2FA verified successfully") {
        alert("2FA has been successfully enabled!");
        setQrCodeUrl(""); // Close the modal after successful verification
        setShowTOTPForm(false);
        // Update user state to reflect 2FA verification
        // You might need to dispatch an action here to update the user state
      } else {
        setVerificationError("Invalid 2FA code. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying 2FA code:", error);
      setVerificationError("Failed to verify 2FA code. Please try again.");
    }
  };

  if (loading) {
    return <Loading />; // Show loading screen while fetching user data
  }

  return (
    <div className="app">
      <Router>
        {/* {isAuthenticated && totpVerified && user.is2FAEnabled && ( */}
        {isAuthenticated && (
          <>
            {user.role === "admin" && <AdminSidebar />}
            {user.role === "user" && <Sidebar />}
            {user.role === "superadmin" && <SuperAdminSidebar />}
          </>
        )}
        <div className="content">
          <Routes>
            {!isAuthenticated && <Route path="/" element={<PandaLogin />} />}

            {/* {isAuthenticated && !user.is2FAEnabled && <Route path="/" element={<TwoFactorAuthPage />} />} */}

            {isAuthenticated && totpVerified && user.is2FAEnabled ? (
              <Route path="/" element={<TotpPage />} />
            ) : (
              isAuthenticated &&
              !totpVerified && (
                <>
                  {user.role === "user" && (
                    <>
                      <Route exact path="/" element={<Home />} />
                      <Route path="/my-gigs" element={<MyGigs />} />
                      {/* <Route path="/available-jobs" element={<AvailableGigs />} /> */}
                      <Route path="/available-projects" element={<AvailableProjects />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/available-jobs" element={<AllJobs />} />
                      <Route path="/jobs/:id" element={<JobDetails isAdmin={user.role === "admin"} />} />
                      <Route path="/earnings" element={<Earnings />} />
                      <Route path="/preferences" element={<Preferences />} />
                      <Route path="/message" element={<Message />} />
                      <Route path="/knowledge-bank" element={<KnowledgeBank />} />
                      <Route path="/support" element={<Support />} />
                      {/* Add the referral landing page route */}
                    </>
                  )}

                  {user.role === "admin" && (
                    <>
                      <Route exact path="/" element={<ProjectReferrals />} />
                      <Route exact path="/manageuser" element={<ManageUser />} />
                      <Route exact path="/managestudies" element={<ManageStudies />} />
                      <Route exact path="/managejobs" element={<ManageJobs />} />
                      <Route path="/jobs/:id" element={<JobDetails isAdmin={true} />} />
                      <Route exact path="/managepayout" element={<ManagePayout />} />
                      <Route exact path="/managePdf" element={<CreateContract />} />
                      <Route exact path="/create-invoice" element={<ManageContract />} />
                      <Route path="/addstudies" element={<CreateProject />} />
                      {/* <Route path="/analytics" element={<UpdateContract />} /> */}
                      {/* <Route path="/analytics" element={<AllJobs />} /> */}
                    </>
                  )}

                  {user.role === "superadmin" && (
                    <>
                      <Route exact path="/" element={<SuperAdminDashboard />} />
                    </>
                  )}
                </>
              )
            )}

            {/* Redirect to the home page if no matching route */}
            <Route path="/share/job/:jobId" element={<JobReferralPage />} />
            <Route path="/share/project/:projectId" element={<ProjectReferralPage />} />

            {/* Register and Apply routes for referral flow */}
            <Route path="/register" element={<PandaLogin />} />
            {/* <Route path="/apply/job/:jobId" element={<ApplyJob />} /> */}

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
