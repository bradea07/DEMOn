import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; // ✅ Ensure Navbar is imported
import "../SearchPage.css";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search-results?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="search-page-container">
      <Navbar /> {/* ✅ Navbar is now included */}
      <h1 className="ecoswap-title">EcoSwap</h1>
      <h2 className="search-title">Search for Products</h2>
      <div className="search-box">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Enter product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            required
          />
          <button type="submit" className="search-button">🔍 Search</button>
        </form>
      </div>
    </div>
  );
};

export default SearchPage;
