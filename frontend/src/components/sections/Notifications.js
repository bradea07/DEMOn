import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../contexts/AuthContext';
import '../../Styles/Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    fetchNotifications();
  }, [currentUser]);

  const fetchNotifications = async () => {
    if (!currentUser || !currentUser.id) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8080/api/notifications/user/${currentUser.id}`);
      setNotifications(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.post(`http://localhost:8080/api/notifications/${notificationId}/mark-read`);
      
      // Update local state
      setNotifications(notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    if (!currentUser || !currentUser.id) return;

    try {
      await axios.post(`http://localhost:8080/api/notifications/user/${currentUser.id}/mark-all-read`);
      
      // Update local state
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const formatNotificationMessage = (notification) => {
    const { type, triggerUser, product, ratingScore } = notification;
    const triggerUsername = triggerUser?.username || 'Someone';

    switch (type) {
      case 'PRODUCT_FAVORITED':
        return `${triggerUsername} added your product "${product?.title || 'a product'}" to their favorites`;
      case 'NEW_MESSAGE':
        return `${triggerUsername} sent you a message`;
      case 'RATING_RECEIVED':
        return `${triggerUsername} gave you a ${ratingScore}-star rating`;
      default:
        return notification.message || 'You have a new notification';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'PRODUCT_FAVORITED':
        return '❤️';
      case 'NEW_MESSAGE':
        return '💬';
      case 'RATING_RECEIVED':
        return '⭐';
      default:
        return '🔔';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return notificationTime.toLocaleDateString();
  };

  if (!currentUser) {
    return (
      <div className="notifications-container">
        <h3>Notifications</h3>
        <p>Please log in to view notifications.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="notifications-container">
        <h3>Notifications</h3>
        <div className="loading">Loading notifications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notifications-container">
        <h3>Notifications</h3>
        <div className="error">{error}</div>
        <button onClick={fetchNotifications} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h3>Notifications</h3>
        {unreadCount > 0 && (
          <div className="notifications-actions">
            <span className="unread-count">{unreadCount} unread</span>
            <button onClick={markAllAsRead} className="mark-all-read-btn">
              Mark all as read
            </button>
          </div>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="no-notifications">
          <div className="no-notifications-icon">🔔</div>
          <p>No notifications yet.</p>
          <small>You'll see notifications here when someone favorites your products, sends you messages, or rates your profile.</small>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
            >
              <div className="notification-icon">
                {getNotificationIcon(notification.type)}
              </div>
              
              <div className="notification-content">
                <div className="notification-message">
                  {formatNotificationMessage(notification)}
                </div>
                <div className="notification-time">
                  {formatTimeAgo(notification.createdAt)}
                </div>
              </div>

              {!notification.read && (
                <button 
                  onClick={() => markAsRead(notification.id)}
                  className="mark-read-btn"
                  title="Mark as read"
                >
                  ✓
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="notifications-footer">
        <button onClick={fetchNotifications} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>
    </div>
  );
};

export default Notifications;
