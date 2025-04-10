import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/MyProfile.css";

// 👉 Section components
import AccountInfo from "./sections/AccountInfo";
import MyListings from "./sections/MyListings";
import Notifications from "./sections/Notifications";
import Favorites from "./sections/Favorites";
import TransactionHistory from "./sections/TransactionHistory";
import ActivityInsights from "./sections/ActivityInsights";
import Settings from "./sections/Settings";
import SecurityPrivacy from "./sections/SecurityPrivacy";

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
          <div>
            <label>Username:</label>
            <input value={user.username} disabled />

            <label>Email:</label>
            <input value={user.email} disabled />

            <label>Name:</label>
            <input
              name="name"
              value={user.name}
              onChange={handleChange}
              disabled={!editing}
            />

            <label>Phone:</label>
            <input
              name="phone"
              value={user.phone || ""}
              onChange={handleChange}
              disabled={!editing}
            />

            <label>City:</label>
            <input
              name="city"
              value={user.city || ""}
              onChange={handleChange}
              disabled={!editing}
            />

            <label>Upload Profile Picture:</label>
            <input
              type="file"
              accept="image/*"
              disabled={!editing}
              onChange={handleImageUpload}
            />

            {user.profilePic && (
              <img
                src={user.profilePic}
                alt="Profile"
                className="profile-img"
              />
            )}

            {!editing ? (
              <button onClick={() => setEditing(true)}>Edit Profile</button>
            ) : (
              <button onClick={handleSave}>Save Changes</button>
            )}
          </div>
        );
      case "MyListings":
        return <MyListings />;
      case "Notifications":
        return <Notifications />;
      case "Favorites":
        return <Favorites />;
      case "TransactionHistory":
        return <TransactionHistory />;
      case "ActivityInsights":
        return <ActivityInsights />;
      case "Settings":
        return <Settings />;
      case "SecurityPrivacy":
        return <SecurityPrivacy />;
      default:
        return <p>Section not found.</p>;
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-box">
        <h2>My Profile</h2>

        <div className="section-buttons">
          <button onClick={() => setActiveSection("AccountInfo")}>
            👤 Account Info
          </button>
          <button onClick={() => setActiveSection("MyListings")}>
            🛍 My Listings
          </button>
          <button onClick={() => setActiveSection("Notifications")}>
            🔔 Notifications
          </button>
          <button onClick={() => setActiveSection("Favorites")}>
            💚 Favorites
          </button>
          <button onClick={() => setActiveSection("TransactionHistory")}>
            🔁 Transaction History
          </button>
          <button onClick={() => setActiveSection("ActivityInsights")}>
            📊 Activity Insights
          </button>
          <button onClick={() => setActiveSection("Settings")}>
            ⚙️ Settings
          </button>
          <button onClick={() => setActiveSection("SecurityPrivacy")}>
            🛡️ Security & Privacy
          </button>
        </div>

        <div className="section-content">{renderSection()}</div>
      </div>
    </div>
  );
};

export default MyProfile;
