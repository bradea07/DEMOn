import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUnreadMessages } from "../contexts/UnreadMessagesContext";
import "./Navbar.css"; // Import CSS file

const Navbar = ({ onLogout, toggleChatbot }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false);
  const { unreadCount: unreadMessages } = useUnreadMessages();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [dropdownTimer, setDropdownTimer] = useState(null);
  const [notificationsTimer, setNotificationsTimer] = useState(null);
  const notificationTriggerRef = useRef(null);
  const notificationDropdownRef = useRef(null);
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const userId = loggedInUser?.id;
  const navigate = useNavigate();

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      console.log('Fetching notifications for user:', userId);
      const response = await fetch(`http://localhost:8080/api/notifications/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched notifications:', data);
        // Sort notifications by creation date, newest first
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setNotifications(sortedData);
        setUnreadNotifications(sortedData.filter(n => !n.read).length);
      } else {
        console.error('Failed to fetch notifications:', response.status);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  // Check for unread notifications
  useEffect(() => {
    if (userId) {
      // Fetch unread notification count
      const checkUnreadNotifications = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/notifications/user/${userId}/unread-count`);
          if (response.ok) {
            const count = await response.json();
            setUnreadNotifications(count);
          }
        } catch (err) {
          console.error("Error checking unread notifications:", err);
        }
      };

      // Initial check
      checkUnreadNotifications();
      
      // Set interval to check periodically
      const interval = setInterval(() => {
        checkUnreadNotifications();
      }, 30000); // Check every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [userId]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimer) {
        clearTimeout(dropdownTimer);
      }
      if (notificationsTimer) {
        clearTimeout(notificationsTimer);
      }
    };
  }, [dropdownTimer, notificationsTimer]);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsDropdownOpen && 
          notificationTriggerRef.current && 
          notificationDropdownRef.current &&
          !notificationTriggerRef.current.contains(event.target) &&
          !notificationDropdownRef.current.contains(event.target)) {
        setNotificationsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [notificationsDropdownOpen]);

  // Handle account dropdown navigation
  const handleAccountNavigation = (section) => {
    navigate('/my-profile');
    setAccountDropdownOpen(false);
    // Small delay to ensure navigation happens first
    setTimeout(() => {
      const button = document.querySelector(`button[data-section="${section}"]`);
      if (button) {
        button.click();
      }
    }, 100);
  };

  // Handle dropdown hover with delay
  const handleDropdownEnter = () => {
    if (dropdownTimer) {
      clearTimeout(dropdownTimer);
      setDropdownTimer(null);
    }
    setAccountDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    const timer = setTimeout(() => {
      setAccountDropdownOpen(false);
    }, 300); // 300ms delay before closing
    setDropdownTimer(timer);
  };

  // Handle notifications dropdown
  const handleNotificationsClick = () => {
    setNotificationsDropdownOpen(!notificationsDropdownOpen);
    if (!notificationsDropdownOpen) {
      fetchNotifications();
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      console.log('Marking notification as read:', notificationId);
      
      // Make the API call first
      const response = await fetch(`http://localhost:8080/api/notifications/${notificationId}/mark-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ id: notificationId })
      });

      console.log('Mark as read response status:', response.status);
      
      if (response.ok) {
        console.log('Successfully marked as read on server, updating UI');
        // Only update UI after successful server update
        setNotifications(prevNotifications => {
          const updated = prevNotifications.map(n =>
            n.id === notificationId ? { ...n, read: true } : n
          );
          const unreadCount = updated.filter(n => !n.read).length;
          setUnreadNotifications(unreadCount);
          return updated;
        });
      } else {
        const errorText = await response.text();
        console.error("Failed to mark notification as read:", response.status, errorText);
        // Refresh notifications to ensure UI matches server state
        await fetchNotifications();
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
      // Refetch to get current state from server
      await fetchNotifications();
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!userId) return;
    try {
      console.log('Marking all notifications as read for user:', userId);
      
      // Make the API call first
      const response = await fetch(`http://localhost:8080/api/notifications/user/${userId}/mark-all-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId })
      });

      console.log('Mark all as read response status:', response.status);

      if (response.ok) {
        console.log('Successfully marked all as read on server, updating UI');
        // Only update UI after successful server update
        setNotifications(prevNotifications => {
          console.log('Previous notifications before update:', prevNotifications.map(n => ({ id: n.id, read: n.read })));
          const updated = prevNotifications.map(n => ({ ...n, read: true }));
          console.log('Updated notifications after mapping:', updated.map(n => ({ id: n.id, read: n.read })));
          console.log('Setting unread count to 0');
          return updated;
        });
        setUnreadNotifications(0);
      } else {
        const errorText = await response.text();
        console.error("Failed to mark all notifications as read:", response.status, errorText);
        // Refresh notifications to ensure UI matches server state
        await fetchNotifications();
      }
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      // Refetch to get current state from server
      await fetchNotifications();
    }
  };

  const handleDeleteAllNotifications = async () => {
    if (!userId) return;
    try {
      console.log('Deleting all notifications for user:', userId);
      
      // Make the API call first
      const response = await fetch(`http://localhost:8080/api/notifications/user/${userId}/delete-all`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('Delete all notifications response status:', response.status);

      if (response.ok) {
        console.log('Successfully deleted all notifications on server, updating UI');
        // Clear all notifications from UI
        setNotifications([]);
        setUnreadNotifications(0);
      } else {
        const errorText = await response.text();
        console.error("Failed to delete all notifications:", response.status, errorText);
        // Refresh notifications to ensure UI matches server state
        await fetchNotifications();
      }
    } catch (err) {
      console.error("Error deleting all notifications:", err);
      // Refetch to get current state from server
      await fetchNotifications();
    }
  };

  const formatNotificationMessage = (notification) => {
    const triggerUsername = notification.triggerUser?.username || 'Someone';
    switch (notification.type) {
      case 'PRODUCT_FAVORITED':
        return `${triggerUsername} added "${notification.product?.title || 'your product'}" to favorites`;
      case 'NEW_MESSAGE':
        return `${triggerUsername} sent you a message`;
      case 'RATING_RECEIVED':
        return `You received a ${notification.ratingScore}-star rating`;
      default:
        return notification.message || 'You have a new notification';
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

  return (
    <nav className="navbar">
      {/* Left Section - Brand Logo */}
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          <h1 className="ecoswap-logo">EcoSwap</h1>
        </Link>
      </div>

      {/* Right Section - Navigation Items */}
      <div className="navbar-right">
        {/* Desktop Navigation */}
        <div className="navbar-nav-desktop">
          <Link to="/chats" className="nav-item">
            <i className="fas fa-comments"></i>
            <span>Chat</span>
            {unreadMessages > 0 && (
              <span className="notification-badge">{unreadMessages}</span>
            )}
          </Link>

          <Link to="/my-profile" className="nav-item" onClick={() => handleAccountNavigation('Favorites')}>
            <i className="fas fa-heart"></i>
          </Link>

          <div className="notifications-trigger" ref={notificationTriggerRef}>
            <button 
              className="nav-item"
              onClick={(e) => {
                e.preventDefault();
                handleNotificationsClick();
              }}
            >
              <i className="fas fa-bell"></i>
              {unreadNotifications > 0 && (
                <span className="notification-badge">{unreadNotifications}</span>
              )}
            </button>

            {notificationsDropdownOpen && (
              <div className="notifications-dropdown" ref={notificationDropdownRef}>
                <div className="notifications-dropdown-header">
                  <h3>Notifications</h3>
                  <div className="notifications-header-buttons">
                    {unreadNotifications > 0 && (
                      <button 
                        onClick={handleMarkAllAsRead}
                        className="mark-all-read-btn"
                        style={{ fontSize: '12px', padding: '4px 8px', marginRight: '8px' }}
                      >
                        Mark all as read
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button 
                        onClick={handleDeleteAllNotifications}
                        className="delete-all-btn"
                        style={{ 
                          fontSize: '12px', 
                          padding: '4px 8px', 
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Delete all
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="notifications-dropdown-list">
                  {notifications.length === 0 ? (
                    <div className="notifications-dropdown-empty">
                      <i className="fas fa-bell-slash" style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }}></i>
                      <h4 style={{ margin: '0 0 8px 0', color: '#666' }}>No notifications!</h4>
                      <p style={{ margin: '0 0 8px 0', color: '#888' }}>You're all caught up!</p>
                      <small style={{ color: '#aaa' }}>You'll see updates here when someone favorites your items, sends you messages, or rates your profile.</small>
                    </div>
                  ) : (
                    notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`notifications-dropdown-item ${!notification.read ? 'unread' : ''}`}
                      >
                        <div className="notification-icon">
                          <i className={`fas fa-${
                            notification.type === 'PRODUCT_FAVORITED' ? 'heart' :
                            notification.type === 'NEW_MESSAGE' ? 'comment' :
                            notification.type === 'RATING_RECEIVED' ? 'star' :
                            'bell'
                          }`}></i>
                        </div>
                        <div className="notification-content">
                          <p className="notification-message">
                            {formatNotificationMessage(notification)}
                          </p>
                          <span className="notification-time">
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                        </div>
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                            className="notification-mark-read"
                            title="Mark as read"
                          >
                            <i className="fas fa-check"></i>
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <Link to="/map" className="nav-item">
            <i className="fas fa-map-marker-alt"></i>
            <span>Map</span>
          </Link>

          {/* Delivery */}
          <Link to="/delivery" className="nav-item">
            <i className="fas fa-truck"></i>
            <span>Delivery</span>
          </Link>

          {/* My Account Dropdown */}
          <div 
            className="account-dropdown-container"
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleDropdownLeave}
          >
            <button className="nav-item account-trigger">
              <i className="fas fa-user"></i>
              <span>My Account</span>
              <i className="fas fa-chevron-down dropdown-arrow"></i>
            </button>
            
            {accountDropdownOpen && (
              <div className="account-dropdown">
                <button onClick={() => handleAccountNavigation('AccountInfo')} className="dropdown-item">
                  <i className="fas fa-user-circle"></i>
                  Account Info
                </button>
                <button onClick={() => handleAccountNavigation('MyStore')} className="dropdown-item">
                  <i className="fas fa-store"></i>
                  My Store
                </button>
                <button onClick={() => handleAccountNavigation('MyListings')} className="dropdown-item">
                  <i className="fas fa-list"></i>
                  My Listings
                </button>
                <button onClick={() => handleAccountNavigation('Favorites')} className="dropdown-item">
                  <i className="fas fa-heart"></i>
                  Favorites
                </button>
                <button onClick={() => handleAccountNavigation('SecurityPrivacy')} className="dropdown-item">
                  <i className="fas fa-shield-alt"></i>
                  Security & Privacy
                </button>
                <div className="dropdown-divider"></div>
                <button onClick={onLogout} className="dropdown-item logout-item">
                  <i className="fas fa-sign-out-alt"></i>
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Add New Listing Button */}
          <Link to="/add-product" className="add-listing-btn">
            <i className="fas fa-plus"></i>
            Add New Listing
          </Link>

          {/* Help Chatbot Button */}
          <button className="help-chatbot-btn nav-item" onClick={toggleChatbot}>
            <i className="fas fa-robot"></i>
            <span>Help</span>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-menu">
          <Link to="/" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
            <i className="fas fa-home"></i>
            Home
          </Link>
          <Link to="/chats" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
            <i className="fas fa-comments"></i>
            Chat
            {unreadMessages > 0 && (
              <span className="notification-badge">{unreadMessages}</span>
            )}
          </Link>
          <Link to="/notifications" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
            <i className="fas fa-bell"></i>
            Notifications
            {unreadNotifications > 0 && (
              <span className="notification-badge">{unreadNotifications}</span>
            )}
          </Link>
          <Link to="/map" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
            <i className="fas fa-map-marker-alt"></i>
            Map
          </Link>
          <Link to="/delivery" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
            <i className="fas fa-truck"></i>
            Delivery
          </Link>
          <Link to="/my-profile" className="mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
            <i className="fas fa-user"></i>
            My Account
          </Link>
          <Link to="/add-product" className="mobile-nav-item highlight" onClick={() => setMobileMenuOpen(false)}>
            <i className="fas fa-plus"></i>
            Add New Listing
          </Link>
          <button onClick={() => { toggleChatbot(); setMobileMenuOpen(false); }} className="mobile-nav-item help-mobile">
            <i className="fas fa-robot"></i>
            Help
          </button>
          <button onClick={onLogout} className="mobile-nav-item logout">
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
