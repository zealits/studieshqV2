import React, { useState } from "react";
import "./Sidebar.css"; // Ensure you import the CSS
import { useDispatch } from "react-redux";
import { logout } from "../Services/Actions/userAction";
import { Link, useLocation } from "react-router-dom";

import {
  FaHome,
  FaBriefcase,
  FaTasks,
  FaUser,
  FaCog,
  FaInfoCircle,
  FaHeadset,
  FaSignOutAlt,
  FaMoneyBill,
  FaEnvelope,
  FaAngleRight,
  FaAngleLeft,
} from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const isActive = (path) => location.pathname === path;

  const [isOpen, setIsOpen] = useState(true); // Sidebar open initially

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
          <Link to="/" className={`linke ${isActive("/") ? "active" : ""}`}>
            <i className="bx bx-grid-alt">
              <FaHome className="icon " />
            </i>
            <span className="links_name">Home</span>
          </Link>
          <span className="tooltip">Home</span>
        </li>
        <li>
          <Link to="/my-gigs" className={`linke ${isActive("/my-gigs") ? "active" : ""}`}>
            <i className="bx bx-user">
              <FaBriefcase className="icon " />
            </i>
            <span className="links_name">My studies</span>
          </Link>
          <span className="tooltip">My studies</span>
        </li>
        <li>
          <Link to="/available-projects" className={`linke ${isActive("/available-projects") ? "active" : ""}`}>
            <i className="bx bx-chat">
              <FaTasks className="icon " />
            </i>
            <span className="links_name">Projects</span>
          </Link>
          <span className="tooltip">Projects</span>
        </li>
        <li>
          <Link to="/available-jobs" className={`linke ${isActive("/available-jobs") ? "active" : ""}`}>
            <i className="bx bx-chat">
              <FaBriefcase className="icon" />
            </i>
            <span className="links_name">Available Jobs</span>
          </Link>
          <span className="tooltip">Available Jobs</span>
        </li>

        <li>
          <Link to="/profile" className={`linke ${isActive("/profile") ? "active" : ""}`}>
            <i className="bx bx-pie-chart-alt-2">
              <FaUser className="icon " />
            </i>
            <span className="links_name">Profile</span>
          </Link>
          <span className="tooltip">Profile</span>
        </li>
        <li>
          <Link to="/earnings" className={`linke ${isActive("/earnings") ? "active" : ""}`}>
            <i className="bx bx-folder">
              <FaMoneyBill className="icon " />
            </i>
            <span className="links_name">Earnings</span>
          </Link>
          <span className="tooltip">Earnings</span>
        </li>
        {/* <li>
          <Link to="/preferences" className="linke">
            <i className="bx bx-cart-alt">
              <FaCog className="icon " />
            </i>
            <span className="links_name">Preferences</span>
          </Link>
          <span className="tooltip">Preferences</span>
        </li> */}
        <li>
          <Link to="/message" className={`linke ${isActive("/message") ? "active" : ""}`}>
            <i className="bx bx-heart">
              <FaEnvelope className="icon " />
            </i>
            <span className="links_name">Message</span>
          </Link>
          <span className="tooltip">Message</span>
        </li>
        {/* <li>
          <Link to="/knowledge-bank" className="linke">
            <i className="bx bx-cog">
              <FaInfoCircle className="icon " />
            </i>
            <span className="links_name">Knowledge Bank</span>
          </Link>
          <span className="tooltip">Knowledge Bank</span>
        </li> */}
        {/* <li>
          <Link to="/support" className="linke">
            <i className="bx bx-cog">
              <FaHeadset className="icon " />
            </i>
            <span className="links_name">Support</span>
          </Link>
          <span className="tooltip">Support</span>
        </li> */}
        <li className="profile">
          <div className="profile-details" onClick={handleLogout}>
            <i className="bx bx-export">
              <FaSignOutAlt className="icon " />
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

export default Sidebar;
