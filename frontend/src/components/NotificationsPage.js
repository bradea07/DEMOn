import React from 'react';
import Notifications from './sections/Notifications';

const NotificationsPage = () => {
  return (
    <div style={{ 
      padding: '20px', 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5' 
    }}>
      <Notifications />
    </div>
  );
};

export default NotificationsPage;
