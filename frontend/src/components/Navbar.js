import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"; // Import CSS file

const Navbar = ({ onLogout, toggleChatbot }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [dropdownTimer, setDropdownTimer] = useState(null);
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const userId = loggedInUser?.id;
  const navigate = useNavigate();

  // Check for unread messages and notifications
  useEffect(() => {
    if (userId) {
      // Fetch unread message count
      const checkUnread = async () => {
        try {
          const response = await fetch(`http://localhost:8080/messages/unread/${userId}`);
          if (response.ok) {
            const count = await response.json();
            setUnreadMessages(count);
          }
        } catch (err) {
          console.error("Error checking unread messages:", err);
        }
      };

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

      // Initial checks
      checkUnread();
      checkUnreadNotifications();
      
      // Set interval to check periodically
      const interval = setInterval(() => {
        checkUnread();
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
    };
  }, [dropdownTimer]);

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

          <Link to="/notifications" className="nav-item">
            <i className="fas fa-bell"></i>
            {unreadNotifications > 0 && (
              <span className="notification-badge">{unreadNotifications}</span>
            )}
          </Link>

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
