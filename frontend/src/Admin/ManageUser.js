import React, { useEffect, useState, useRef } from "react";
import "./ManageUser.css";
import { useDispatch, useSelector } from "react-redux";
import { loadAllUsers, deleteUser, updateUserDetails } from "../Services/Actions/userAction";
import Loader from "../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faSearch, faEllipsisV, faEye, faEdit } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

// Modal Component for updating user details
const Modal = ({ selectedUser, onClose, onUpdate }) => {
  const [updatedFirstName, setUpdatedFirstName] = useState(selectedUser.firstName);
  const [updatedLastName, setUpdatedLastName] = useState(selectedUser.lastName);
  const [updatedEmail, setUpdatedEmail] = useState(selectedUser.email);

  const handleUpdate = async () => {
    const updatedUser = {
      firstName: updatedFirstName,
      lastName: updatedLastName,
      email: updatedEmail,
    };
    try {
      // Make API call to update the user details
      const response = await axios.put(`/aak/l1/admin/user/${selectedUser._id}/update`, updatedUser, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Handle success
      console.log("User updated:", response.data);
      alert("User details updated successfully!");
    } catch (error) {
      // Handle error
      console.error("Failed to update user:", error.response?.data?.message || error.message);
      alert("Error updating user.");
    }

    // onUpdate(selectedUser._id, updatedUser);
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
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  const [sortType, setSortType] = useState("none");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Load all users on component mount
  useEffect(() => {
    dispatch(loadAllUsers());
  }, [dispatch]);

  // Delete a single user
  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  // Delete selected users
  const handleDeleteSelectedUsers = () => {
    if (selectedUsers.length === 0) {
      alert("No users selected.");
      return;
    }
    if (window.confirm("Are you sure you want to delete selected users?")) {
      selectedUsers.forEach((id) => {
        dispatch(deleteUser(id));
      });
      setSelectedUsers([]);
      setIsSelecting(false);
    }
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
  const handleUpdateUser = (id, updatedUser) => {
    dispatch(updateUserDetails(id, updatedUser)); // Ensure correct action is dispatched
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

      {/* Search Bar */}
      <div className={`search-bar ${isSearchBarVisible ? "active" : ""}`}>
        <FontAwesomeIcon
          icon={faSearch}
          onClick={() => setIsSearchBarVisible(!isSearchBarVisible)}
          style={{ cursor: "pointer" }}
        />
        {isSearchBarVisible && (
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        )}
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <div className="more-options-icon">
          <FontAwesomeIcon icon={faEllipsisV} onClick={toggleDropdown} style={{ cursor: "pointer" }} />
        </div>
        {isDropdownOpen && (
          <div className="more-options-dropdown" ref={dropdownRef}>
            <ul>
              <li onClick={handleSelectAllUsers}>
                {selectedUsers.length === users.length ? "Deselect All" : "Select All"}
              </li>
              <li onClick={handleShareSelectedUsers}>Share</li>
              <li onClick={handleDeleteSelectedUsers}>Delete </li>
              <li onClick={handleCancelSelection}>Cancel</li>
            </ul>
          </div>
        )}
      </div>

      {/* User Table */}
      {sortedUsers && sortedUsers.length > 0 ? (
        <div class="table-gap">
          <table className="user-table">
            <thead>
              <tr>
                {isSelecting && <th>Select</th>}
                <th>Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user) => (
                <tr key={user._id}>
                  {isSelecting && (
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => handleSelectUser(user._id)}
                      />
                    </td>
                  )}
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>
                    <button className="btn" onClick={() => handleEditUser(user)}>
                      <FontAwesomeIcon icon={faEye} style={{ marginRight: "5px" }} />
                      View
                    </button>
                    <button className="btn delete" onClick={() => handleDeleteUser(user._id)}>
                      <FontAwesomeIcon icon={faTrashAlt} style={{ marginRight: "5px" }} />
                      Delete
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
    </div>
  );
};

export default ManageUser;
