import React, { useState } from 'react';

const Settings = () => {
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [privacy, setPrivacy] = useState("Public");
  const [onlineStatus, setOnlineStatus] = useState(true);

  return (
    <div>
      <h3>Settings</h3>
      <label>
        Notifications:
        <input
          type="checkbox"
          checked={notificationsOn}
          onChange={() => setNotificationsOn(!notificationsOn)}
        />
      </label>
      <br />
      <label>
        Profile Visibility:
        <select value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
          <option>Public</option>
          <option>Friends</option>
          <option>Private</option>
        </select>
      </label>
      <br />
      <label>
        Show Online Status:
        <input
          type="checkbox"
          checked={onlineStatus}
          onChange={() => setOnlineStatus(!onlineStatus)}
        />
      </label>
    </div>
  );
};

export default Settings;
