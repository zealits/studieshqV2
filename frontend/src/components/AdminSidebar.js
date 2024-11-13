import React, { useState } from "react";
import "./Sidebar.css"; // Ensure you import the CSS
import { useDispatch } from "react-redux";
import { logout } from "../Services/Actions/userAction";
import { Link, useLocation } from "react-router-dom";

import {
  FaHome,
  FaBook,
  FaUsers,
  FaTasks,
  FaChartBar,
  FaPlusCircle,
  FaHeadset,
  FaSignOutAlt,
  FaAngleRight,
  FaAngleLeft,
  FaFileInvoiceDollar,
  FaBriefcase,
} from "react-icons/fa";

const AdminSidebar = () => {
  const location = useLocation();

  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(true); // Sidebar open initially
  const isActive = (path) => location.pathname === path;

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="logo-details">
        <i className="bx bxl-codepen"></i>
        <div className="logo_name">StudiesHQ</div>
        <i className={`bx bx-menu ${isOpen ? "rotate" : ""}`} id="btn" onClick={toggleSidebar}>
          {isOpen ? <FaAngleLeft id="btn" className="icon" /> : <FaAngleRight id="btn" className="icon" />}
        </i>
      </div>
      <ul className="nav-list">
        <li>
          <Link to="/admin-dashboard" className={`linke ${isActive("/") ? "active" : ""}`}>
            <i>
              <FaHome className="icon" />
            </i>

            <span className="links_name">Dashboard</span>
          </Link>
          <span className="tooltip">Dashboard</span>
        </li>
        <li>
          <Link to="/managestudies" className={`linke ${isActive("/managestudies") ? "active" : ""}`}>
            <i>
              <FaBook className="icon" />
            </i>

            <span className="links_name">Manage Projects</span>
          </Link>
          <span className="tooltip">Manage Projects</span>
        </li>
        <li>
          <Link to="/manageuser" className={`linke ${isActive("/manageuser") ? "active" : ""}`}>
            <i>
              <FaUsers className="icon" />
            </i>

            <span className="links_name">Manage Users</span>
          </Link>
          <span className="tooltip">Manage Users</span>
        </li>
        <li>
          <Link to="/managepayout" className={`linke ${isActive("/managepayout") ? "active" : ""}`}>
            <i>
              <FaTasks className="icon" />
            </i>

            <span className="links_name">Manage Payout</span>
          </Link>
          <span className="tooltip">Manage Payout</span>
        </li>
        <li>
          <Link to="/managejobs" className={`linke ${isActive("/managejobs") ? "active" : ""}`}>
            <i>
              <FaBriefcase className="icon" /> {/* Use FaBriefcase icon here */}
            </i>
            <span className="links_name">Manage Jobs</span>
          </Link>
          <span className="tooltip">Manage Jobs</span>
        </li>
        <li>
          <Link to="/analytics" className={`linke ${isActive("/analytics") ? "active" : ""}`}>
            <i>
              <FaChartBar className="icon" />
            </i>

            <span className="links_name">Analytics</span>
          </Link>
          <span className="tooltip">Analytics</span>
        </li>
        <li>
          <Link to="/create-invoice" className={`linke ${isActive("/create-invoice") ? "active" : ""}`}>
            <i>
              <FaFileInvoiceDollar className="icon" /> {/* Icon for invoice */}
            </i>
            <span className="links_name">Create Invoice</span>
          </Link>
          <span className="tooltip">Create Invoice</span>
        </li>

        <li>
          <Link to="/managePdf" className={`linke ${isActive("/managePdf") ? "active" : ""}`}>
            <i>
              <FaBook className="icon" />
            </i>

            <span className="links_name">Manage Contract</span>
          </Link>
          <span className="tooltip">Manage Contract</span>
        </li>
        <li>
          <Link to="/addstudies" className={`linke ${isActive("/addstudies") ? "active" : ""}`}>
            <i>
              {" "}
              <FaPlusCircle className="icon" />
            </i>

            <span className="links_name">Add Project</span>
          </Link>
          <span className="tooltip">Add Study</span>
        </li>

        <li className="profile">
          <div className="profile-details" onClick={handleLogout}>
            <i>
              <FaSignOutAlt className="icon" />
            </i>

            <div className="name_job">
              <div className="name">Logout</div>
            </div>
          </div>
          <i className="bx bx-log-out" id="log_out"></i>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
