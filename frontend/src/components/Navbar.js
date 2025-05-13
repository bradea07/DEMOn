import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Import CSS file

const Navbar = ({ onLogout, toggleChatbot }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const userId = loggedInUser?.id;

  // Check for unread messages
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

      // Initial check
      checkUnread();
      
      // Set interval to check periodically
      const interval = setInterval(checkUnread, 30000); // Check every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [userId]);

  return (
    <nav className="navbar">
      <div className="left-section">
        <div className="navbar-brand">
          <h1 className="ecoswap-title">EcoSwap</h1>
        </div>
      </div>
      <div className="center-section">
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li><Link to="/" className="nav-item">Home</Link></li>
          <li><Link to="/add-product" className="nav-item">Add Product</Link></li>
          <li><Link to="/my-profile" className="nav-item">My Profile</Link></li>
          <li>
            <Link to="/chats" className="nav-item">
              Chats
              {unreadMessages > 0 && (
                <span className="message-badge">{unreadMessages}</span>
              )}
            </Link>
          </li>
        </ul>
      </div>
      <div className="right-section">
        <div 
          className="nav-chat-icon" 
          onClick={toggleChatbot}
          title="Chat with EcoBot"
        >
          <i className="fas fa-robot"></i>
          <span>Help</span>
        </div>
        <button 
          className="logout-btn" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Console log for debugging
            console.log("Logout button clicked");
            // Call the logout function
            onLogout();
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
