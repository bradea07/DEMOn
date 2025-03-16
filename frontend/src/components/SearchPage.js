import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div>
      <h2>Search for Products</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter product name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          required
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default SearchPage;
