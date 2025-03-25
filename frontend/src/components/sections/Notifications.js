import React, { useState } from 'react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New item match: Table", read: false },
    { id: 2, text: "John sent a friend request", read: true },
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <div>
      <h3>Notifications</h3>
      <ul>
        {notifications.map(n => (
          <li key={n.id} style={{ fontWeight: n.read ? 'normal' : 'bold' }}>
            {n.text}
            {!n.read && <button onClick={() => markAsRead(n.id)}>Mark as read</button>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
