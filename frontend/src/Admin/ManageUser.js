import React, { useEffect, useState, useRef } from "react";
import "./ManageUser.css";
import { useDispatch, useSelector } from "react-redux";
import { loadAllUsers, deleteUser, updateUserDetails } from "../Services/Actions/userAction";
import Loader from "../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faSearch, faEllipsisV, faEye, faEdit, faShareAlt } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

// Feedback Modal Component
const FeedbackModal = ({ message, onClose }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>{message}</h2>
      <button onClick={onClose}>Close</button>
    </div>
  </div>
);
// for delete conifrma
const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirmation</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn" onClick={onConfirm}>
            Confirm
          </button>
          <button className="btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal Component for updating user details
const Modal = ({ selectedUser, onClose, onUpdate }) => {
  const [updatedFirstName, setUpdatedFirstName] = useState(selectedUser.firstName);
  const [updatedLastName, setUpdatedLastName] = useState(selectedUser.lastName);
  const [updatedEmail, setUpdatedEmail] = useState(selectedUser.email);

  const handleUpdate = () => {
    const updatedUser = {
      firstName: updatedFirstName,
      lastName: updatedLastName,
      email: updatedEmail,
    };
    onUpdate(selectedUser._id, updatedUser);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>User Details</h2>
        <div>
          <label>First Name:</label>
          <input type="text" value={updatedFirstName} onChange={(e) => setUpdatedFirstName(e.target.value)} />
        </div>
        <div>
          <label>Last Name:</label>
          <input type="text" value={updatedLastName} onChange={(e) => setUpdatedLastName(e.target.value)} />
        </div>
        <div>
          <label>Email:</label>
          <input type="text" value={updatedEmail} onChange={(e) => setUpdatedEmail(e.target.value)} />
        </div>
        <button onClick={handleUpdate}>Update</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const ManageUser = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.admin);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState(""); // For confirmation modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // Confirmation modal state
  const [deleteUserId, setDeleteUserId] = useState(null); // To track which user to delete
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  const [sortType, setSortType] = useState("none");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false); // For feedback modal
  const [feedbackMessage, setFeedbackMessage] = useState(""); // Feedback message

  const dropdownRef = useRef(null);

  // Load all users on component mount
  useEffect(() => {
    dispatch(loadAllUsers());
  }, [dispatch]);

  // Function to show feedback
  const onShowFeedback = (message) => {
    setFeedbackMessage(message);
    setIsFeedbackModalOpen(true);
  };

  // Delete a single user - Show confirmation modal
  const handleDeleteUser = (id) => {
    setDeleteUserId(id);
    setConfirmMessage("Are you sure you want to delete this user?");
    setIsConfirmModalOpen(true);
  };

  const confirmDeleteUser = () => {
    dispatch(deleteUser(deleteUserId));
    setIsConfirmModalOpen(false);
    setDeleteUserId(null);
  };

  // Delete selected users - Show confirmation modal
  const handleDeleteSelectedUsers = () => {
    if (selectedUsers.length === 0) {
      alert("No users selected.");
      return;
    }
    setConfirmMessage("Are you sure you want to delete selected users?");
    setIsConfirmModalOpen(true);
  };

  const confirmDeleteSelectedUsers = () => {
    selectedUsers.forEach((id) => {
      dispatch(deleteUser(id));
    });
    setSelectedUsers([]);
    setIsSelecting(false);
    setIsConfirmModalOpen(false);
  };

  const handleCancelConfirmation = () => {
    setIsConfirmModalOpen(false);
    setDeleteUserId(null);
  };
  // Handle individual user selection
  const handleSelectUser = (id) => {
    setSelectedUsers((prevSelected) => {
      if (prevSelected.includes(id)) {
        const newSelected = prevSelected.filter((userId) => userId !== id);
        if (newSelected.length === 0) {
          setIsSelecting(false);
        }
        return newSelected;
      } else {
        return [...prevSelected, id];
      }
    });
  };

  // Handle selecting all users
  const handleSelectAllUsers = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
      setIsSelecting(false);
    } else {
      setSelectedUsers(users.map((user) => user._id));
      setIsSelecting(true);
    }
  };

  // Cancel selection
  const handleCancelSelection = () => {
    setSelectedUsers([]);
    setIsSelecting(false);
  };

  // Share selected users (stub for functionality)
  const handleShareSelectedUsers = () => {
    if (selectedUsers.length === 0) {
      alert("No users selected to share.");
      return;
    }
    alert(`Sharing ${selectedUsers.length} selected users.`);
  };

  // Edit user
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Update user information
  const handleUpdateUser = async (id, updatedUser) => {
    try {
      const response = await axios.put(`/aak/l1/admin/user/${id}/update`, updatedUser, {
        headers: { "Content-Type": "application/json" },
      });
      onShowFeedback("User updated successfully!");
      dispatch(loadAllUsers());
    } catch (error) {
      onShowFeedback("Error updating user.");
    }
  };

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      (user.firstName && user.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Sort users based on selected sort type and order
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortType === "name") {
      if (sortOrder === "asc") {
        return a.firstName.localeCompare(b.firstName);
      } else {
        return b.firstName.localeCompare(a.firstName);
      }
    } else if (sortType === "date") {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    }
    return 0;
  });

  // Toggle dropdown menu
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="manage-user">
      {loading && <Loader />}
      <div className="header">
        <h1>Manage Users</h1>
      </div>
      <div className={`action-bar`}>

        <span className="selected-count">{selectedUsers.length} Selected</span>
        
        <div className="search-box-wrapper">
          <input
            type="text"
            placeholder="Search user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button className="search-btn">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>

        <div className="action-icons">
          <button className="action-icon" title="Share">
            <FontAwesomeIcon icon={faShareAlt} />
          </button>
          <button className="action-icon delete-selected" title="Delete Selected" onClick={handleDeleteSelectedUsers}>
            <FontAwesomeIcon icon={faTrashAlt} />
          </button>
        </div>

      </div>

      {filteredUsers.length > 0 ? (
        <div className="table-gap">
          <table className="user-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    className="select-all-users"
                    onChange={handleSelectAllUsers}
                    checked={selectedUsers.length === users.length}
                  />
                </th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <input
                      type="checkbox"
                      className="select-user"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleSelectUser(user._id)}
                    />
                  </td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>
                    <button className="btn btn-update" onClick={() => handleEditUser(user)}>
                      <FontAwesomeIcon icon={faEdit} /> Update
                    </button>
                    <button className="btn btn-delete" onClick={() => handleDeleteUser(user._id)}>
                      <FontAwesomeIcon icon={faTrashAlt} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No users found.</p>
      )}

      {/* Modal for Editing User */}
      {isModalOpen && (
        <Modal selectedUser={selectedUser} onClose={() => setIsModalOpen(false)} onUpdate={handleUpdateUser} />
      )}

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <ConfirmModal
          message={confirmMessage}
          onConfirm={deleteUserId ? confirmDeleteUser : confirmDeleteSelectedUsers}
          onCancel={handleCancelConfirmation}
        />
      )}

      {/* Feedback Modal */}
      {isFeedbackModalOpen && <FeedbackModal message={feedbackMessage} onClose={() => setIsFeedbackModalOpen(false)} />}
    </div>
  );
};

export default ManageUser;
