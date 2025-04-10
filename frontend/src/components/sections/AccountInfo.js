import React, { useState, useEffect } from "react";

const AccountInfo = () => {
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState({
    username: "",
    email: "",
    phone: "",
    city: "",
    profilePic: "",
  });

  // Acest useEffect se va executa de fiecare dată când user-ul se schimbă
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser((prevUser) => ({
        ...prevUser,
        username: storedUser.username || "",
        email: storedUser.email || "",
        phone: storedUser.phone || "",
        city: storedUser.city || "",
        profilePic: storedUser.profilePic || "",
      }));
    }
  }, [localStorage.getItem("user")]); // <- Problema ta era că [] rulează doar o dată

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser((prevUser) => ({ ...prevUser, profilePic: imageUrl }));
    }
  };

  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(user));
    setEditing(false);
  };

  return (
    <div className="account-info">
      <h3>Account Information</h3>
      <img
        src={user.profilePic || "/default-avatar.png"}
        alt="Profile"
        className="profile-pic"
        style={{ borderRadius: "50%", width: 100, height: 100 }}
      />

      {editing ? (
        <div>
          <input type="file" onChange={handleImageChange} />
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            placeholder="Username"
          />
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <input
            type="text"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            placeholder="Phone"
          />
          <input
            type="text"
            name="city"
            value={user.city}
            onChange={handleChange}
            placeholder="City"
          />
          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>City:</strong> {user.city}</p>
          <button onClick={() => setEditing(true)}>Edit Info</button>
        </div>
      )}
    </div>
  );
};

export default AccountInfo;
