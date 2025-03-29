import React, { useState } from "react";  // ✅ Import useState here

const AccountInfo = () => {
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState({
    username: 'EcoUser123',
    email: 'eco123@example.com',
    phone: '0751234567',
    city: 'Timișoara',
    profilePic: 'https://i.pravatar.cc/100?img=13',
  });

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
    setEditing(false);
  };

  return (
    <div className="account-info">
      <h3>Account Information</h3>
      <img
        src={user.profilePic}
        alt="Profile"
        className="profile-pic"
        style={{ borderRadius: '50%', width: 100, height: 100 }}
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
