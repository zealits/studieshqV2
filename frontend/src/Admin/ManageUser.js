import React, { useEffect, useState } from "react";
import "./ManageUser.css";
import { useDispatch, useSelector } from "react-redux";
import { loadAllUsers, deleteUser, updateUser } from "../Services/Actions/userAction";
import Loader from "../components/Loading";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faSearch, faSort, faEdit, faEye } from '@fortawesome/free-solid-svg-icons';

// Modal Component for displaying user details
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
          <input
            type="text"
            value={updatedFirstName}
            onChange={(e) => setUpdatedFirstName(e.target.value)}
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            value={updatedLastName}
            onChange={(e) => setUpdatedLastName(e.target.value)}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="text"
            value={updatedEmail}
            onChange={(e) => setUpdatedEmail(e.target.value)}
          />
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

  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  const [sortType, setSortType] = useState("none");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  useEffect(() => {
    dispatch(loadAllUsers());
  }, [dispatch]);

  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

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
    }
  };

  const handleSelectUser = (id) => {
    setSelectedUsers((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((userId) => userId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleSelectAllUsers = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user._id));
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true); // Open modal when editing
  };

  const handleUpdateUser = (id, updatedUser) => {
    dispatch(updateUser(id, updatedUser));
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // Filtered users based on the search query
  const filteredUsers = users.filter((user) =>
    (user.firstName && user.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Sort users based on selected sort type and order
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortType === "name") {
      return sortOrder === "asc" ? a.firstName.localeCompare(b.firstName) : b.firstName.localeCompare(a.firstName);
    } else if (sortType === "date") {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    }
    return 0;
  });

  // Toggle the dropdown when the sort button is clicked
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
      <div className={`search-bar ${isSearchBarVisible ? 'active' : ''}`}>
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

      <div className="action-buttons">
        <button className="btn btn-primary" onClick={() => setIsSelecting(!isSelecting)}>
          {isSelecting ? "Cancel" : "Select Users"}
        </button>

        {isSelecting && (
          <div className="delete-icon">
            <button className="btn btn-secondary" onClick={handleSelectAllUsers}>
              {selectedUsers.length === users.length ? "Deselect All" : "Select All"}
            </button>

            <span className="delete-icon-container">
              <FontAwesomeIcon icon={faTrashAlt} onClick={handleDeleteSelectedUsers} />
              <span>({selectedUsers.length})</span>
            </span>
          </div>
        )}
      </div>

      {sortedUsers && sortedUsers.length > 0 ? (
        <table className="user-table">
          <thead>
            <tr>
              {isSelecting && <th>Select</th>}
              <th>
                Name
                <FontAwesomeIcon
                  icon={faSort}
                  onClick={toggleDropdown}
                  style={{ cursor: "pointer", marginLeft: "8px" }}
                />
                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    <ul>
                      <li onClick={() => { setSortType("name"); setSortOrder("asc"); setIsDropdownOpen(false); }}>A - Z</li>
                      <li onClick={() => { setSortType("name"); setSortOrder("desc"); setIsDropdownOpen(false); }}>Z - A</li>
                    </ul>
                  </div>
                )}
              </th>
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
                  <button className="btn" onClick={() => { setSelectedUser(user); setIsModalOpen(true); }}>
                    <FontAwesomeIcon icon={faEye} style={{ marginRight: '5px' }} />
                    View
                  </button>
                  <button className="btn" onClick={() => handleDeleteUser(user._id)}>
                    <FontAwesomeIcon icon={faTrashAlt} style={{ marginRight: '5px' }} />
                    Delete
                  </button>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found.</p>
      )}

      {/* Modal for User Details */}
      {isModalOpen && selectedUser && (
        <Modal
          selectedUser={selectedUser}
          onClose={() => setIsModalOpen(false)}
          onUpdate={handleUpdateUser}
        />
      )}
    </div>
  );
};

export default ManageUser;
