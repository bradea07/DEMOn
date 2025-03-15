import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Import CSS file

const Navbar = ({ onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>
      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        <li><Link to="/" className="nav-item">Home</Link></li>
        <li><Link to="/add-product" className="nav-item">Add Product</Link></li>
        <li><Link to="/my-profile" className="nav-item">My Profile</Link></li>
        <li><Link to="/settings" className="nav-item">Settings</Link></li>
      </ul>
      <button className="logout-btn" onClick={onLogout}>Logout</button>
    </nav>
  );
};

export default Navbar;
