import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Modal from "react-modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faLinkedin, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import "./ShareButton.css";

const ShareButton = ({ project }) => {
    const [registeredUsers, setRegisteredUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [shareModalIsOpen, setShareModalIsOpen] = useState(false);
    const [visibleUsersCount, setVisibleUsersCount] = useState(5);
    const token = useSelector((state) => state.user.token);
    const [showSocialIcons, setShowSocialIcons] = useState(true); // State to toggle social icons

    useEffect(() => {
        const fetchRegisteredUsers = async () => {
            try {
                const response = await axios.get("/aak/l1/admin/users", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRegisteredUsers(response.data.users || []);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchRegisteredUsers();
    }, [token]);

    const handleSendToUsers = async () => {
        try {
            await axios.post(`/aak/l1/admin/share/${project._id}`, {
                users: selectedUsers,
                message: `Check out this project: ${project.title} - ${window.location.href}`,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Project link shared successfully via email!");
            setShareModalIsOpen(false);
            setSelectedUsers([]);
        } catch (error) {
            console.error("Error sharing with users:", error);
        }
    };

    const handleChangeUsers = (userId) => {
        setSelectedUsers((prevSelectedUsers) =>
            prevSelectedUsers.includes(userId)
                ? prevSelectedUsers.filter((id) => id !== userId)
                : [...prevSelectedUsers, userId]
        );
    };

    const handleViewMoreUsers = () => {
        setVisibleUsersCount(registeredUsers.length);
        setShowSocialIcons(false); // Hide social icons
    };

    const handleViewLessUsers = () => {
        setVisibleUsersCount(5); // Show fewer users
        setShowSocialIcons(true); // Show social icons again
    };

    const shareOnSocialMedia = (platform) => {
        const url = window.location.href;
        const message = `Check out this project:`;
        let shareUrl = "";

        switch (platform) {
            case "facebook":
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case "twitter":
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(message)}`;
                break;
            case "linkedin":
                shareUrl = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(url)}&title=${encodeURIComponent(project.title)}`;
                break;
            case "whatsapp":
                shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}%20${encodeURIComponent(url)}`;
                break;
            case "email":
                shareUrl = `mailto:?subject=${encodeURIComponent(project.title)}&body=${encodeURIComponent(message + ' ' + url)}`;
                break;
            default:
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, "_blank");
        }
    };

    return (
        <div>
            <button className="share-button" onClick={() => setShareModalIsOpen(true)}>
                Share
            </button>

            <Modal isOpen={shareModalIsOpen} onRequestClose={() => setShareModalIsOpen(false)} className="share-modal" overlayClassName="overlay">
                <h2 className="modal-title">Share Project</h2>
                <h3 className="registered-users-title">Registered Users</h3>
                <div className="registered-users-list">
                    {registeredUsers.slice(0, visibleUsersCount).map((user) => (
                        <label key={user._id} className="user-checkbox">
                            <input
                                type="checkbox"
                                checked={selectedUsers.includes(user._id)}
                                onChange={() => handleChangeUsers(user._id)}
                            />
                            {user.name}
                        </label>
                    ))}
                </div>
                {visibleUsersCount < registeredUsers.length && (
                    <button className="view-more-button" onClick={handleViewMoreUsers}>
                        View More
                    </button>
                )}
                {visibleUsersCount > 5 && (
                    <button className="view-less-button" onClick={handleViewLessUsers}>
                        View Less
                    </button>
                )}
                <button className="share-selected-button" onClick={handleSendToUsers}>
                    Share with Selected Users
                </button>

                {showSocialIcons && (
                    <>
                        <h3 className="social-share-title">Share on Social Media</h3>
                        <div className="social-share-icons">
                            <FontAwesomeIcon icon={faFacebook} onClick={() => shareOnSocialMedia('facebook')} className="social-icon facebook" />
                            <FontAwesomeIcon icon={faTwitter} onClick={() => shareOnSocialMedia('twitter')} className="social-icon twitter" />
                            <FontAwesomeIcon icon={faLinkedin} onClick={() => shareOnSocialMedia('linkedin')} className="social-icon linkedin" />
                            <FontAwesomeIcon icon={faWhatsapp} onClick={() => shareOnSocialMedia('whatsapp')} className="social-icon whatsapp" />
                            <FontAwesomeIcon icon={faEnvelope} onClick={() => shareOnSocialMedia('email')} className="social-icon email" />
                        </div>
                    </>
                )}

                <button className="cancel-button" onClick={() => setShareModalIsOpen(false)}>
                    Cancel
                </button>
            </Modal>
        </div>
    );
};

export default ShareButton;
