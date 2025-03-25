import React from 'react';

const SecurityPrivacy = () => {
  return (
    <div>
      <h3>Security & Privacy</h3>
      <p>Two-Factor Authentication: <button>Enable</button></p>
      <p>Device Activity: <button>View</button></p>
      <p>Privacy Controls: <button>Manage</button></p>
      <p>Delete Account: <button style={{ color: 'red' }}>Delete</button></p>
    </div>
  );
};

export default SecurityPrivacy;
