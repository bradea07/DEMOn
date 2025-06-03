import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/MyProfile.css";

// 👉 Section components
import AccountInfo from "./sections/AccountInfo";
import MyListings from "./sections/MyListings";
import Favorites from "./sections/Favorites";
import SecurityPrivacy from "./sections/SecurityPrivacy";
import MyStore from "./sections/MyStore"; // Import the MyStore component

const MyProfile = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const userId = loggedInUser?.id;


  const [user, setUser] = useState({
    username: "",
    email: "",
    name: "",
    phone: "",
    city: "",
    profilePic: "",
  });

  const [editing, setEditing] = useState(false);
  const [activeSection, setActiveSection] = useState("AccountInfo");

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/profile/${userId}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Failed to load user", err));
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/profile/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setUser((prev) => ({ ...prev, profilePic: res.data }));
    } catch (err) {
      console.error("Image upload failed", err);
      alert("Failed to upload profile picture.");
    }
  };

  const handleSave = () => {
    axios
      .put(`http://localhost:8080/api/profile/${userId}`, user)
      .then(() => {
        setEditing(false);
        alert("Profile updated successfully!");
      })
      .catch((err) => {
        console.error("Update failed", err);
        alert("Failed to update profile.");
      });
  };

  const renderSection = () => {
    switch (activeSection) {
      case "AccountInfo":
        return (
          <div className="account-info-section">
            <div className="profile-header">
              {user.profilePic && (
                <img
                  src={user.profilePic}
                  alt="Profile"
                  className="profile-img"
                />
              )}
              {!user.profilePic && (
                <div className="profile-placeholder">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
              )}
              <h3>{user.name || "User Profile"}</h3>
            </div>

            <div className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Username:</label>
                  <input value={user.username} disabled />
                </div>

                <div className="form-group">
                  <label>Email:</label>
                  <input value={user.email} disabled />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Full Name:</label>
                  <input
                    name="name"
                    value={user.name || ""}
                    onChange={handleChange}
                    disabled={!editing}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number:</label>
                  <input
                    name="phone"
                    value={user.phone || ""}
                    onChange={handleChange}
                    disabled={!editing}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>City:</label>
                <input
                  name="city"
                  value={user.city || ""}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="Enter your city"
                />
              </div>

              {editing && (
                <div className="form-group file-upload">
                  <label>Profile Picture:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <p className="input-help">Upload an image (JPG, PNG, etc)</p>
                </div>
              )}

              <div className="profile-actions">
                {!editing ? (
                  <button className="edit-button" onClick={() => setEditing(true)}>
                    Edit Profile
                  </button>
                ) : (
                  <div className="edit-actions">
                    <button className="cancel-button" onClick={() => setEditing(false)}>
                      Cancel
                    </button>
                    <button className="save-button" onClick={handleSave}>
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
        case "MyStore":
          return <MyStore userId={userId} />;
        case "MyListings":
          return <MyListings userId={userId} />;        
      case "Favorites":
        return <Favorites />;
      case "SecurityPrivacy":
        return <SecurityPrivacy />;
      default:
        return <p>Section not found.</p>;
    }
  };

  return (
    <div className="profile-container">
      {/* Navigation buttons now outside and above the profile box */}
      <div className="profile-navigation">
        <button 
          className={`nav-button ${activeSection === "AccountInfo" ? "active" : ""}`} 
          onClick={() => setActiveSection("AccountInfo")}
          data-section="AccountInfo"
        >
          Account Info
        </button>
        <button 
          className={`nav-button ${activeSection === "MyStore" ? "active" : ""}`} 
          onClick={() => setActiveSection("MyStore")}
          data-section="MyStore"
        >
          My Store
        </button>
        <button 
          className={`nav-button ${activeSection === "MyListings" ? "active" : ""}`} 
          onClick={() => setActiveSection("MyListings")}
          data-section="MyListings"
        >
          My Listings
        </button>
        <button 
          className={`nav-button ${activeSection === "Favorites" ? "active" : ""}`} 
          onClick={() => setActiveSection("Favorites")}
          data-section="Favorites"
        >
          Favorites
        </button>
        <button 
          className={`nav-button ${activeSection === "SecurityPrivacy" ? "active" : ""}`} 
          onClick={() => setActiveSection("SecurityPrivacy")}
          data-section="SecurityPrivacy"
        >
          Security & Privacy
        </button>
      </div>

      <div className="profile-box">
        <h2>My Profile</h2>
        <div className="section-content">{renderSection()}</div>
      </div>
    </div>
  );
};

export default MyProfile;
